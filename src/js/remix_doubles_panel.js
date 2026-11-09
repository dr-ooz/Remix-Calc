/* Doubles AI panel on the main calc page.
 * Pick 2 of your imported sets and 2 of the current trainer's Pokemon; the panel shows what the AI picks.
 * Uses the real sets (EVs, IVs, nature, item, ability, moves), the HP/status/item-off saved in the calc,
 * and the field from the main calc (as a doubles battle).
 * AI estimate (same as the in-game singles AI): max roll, 2-5 hit moves = 3 hits, % of the target's CURRENT
 * HP (uncapped), KO = max roll >= current HP. Targeting: the OPTIMAL rule in DOUBLES_AI_LOGIC.md (most total %).
 * Certainty: a KO is always taken; walled -> useful status first; otherwise the AI may still pick a useful
 * status move instead of attacking (odds not mapped), so those attacks are drawn dashed as "if it attacks".
 */
(function () {
	var SPREAD = {allAdjacentFoes: 1, allAdjacent: 1};

	function q(sel) { return document.querySelector(sel); }
	function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]; }); }
	function species(id) { return id.split(" (")[0]; }

	// ---- choices ----
	function mySets() {
		var out = [], seen = {};
		$("#p1 img.trainer-pok").each(function () { var id = this.getAttribute("data-id"); if (id && !seen[id]) { seen[id] = 1; out.push(id); } });
		try {
			var cs = JSON.parse(localStorage.customsets || "{}");
			for (var sp in cs) for (var sn in cs[sp]) { var id = sp + " (" + sn + ")"; if (!seen[id] && sp !== "Aegislash-Shield") { seen[id] = 1; out.push(id); } }
		} catch (e) {}
		return out;
	}
	function trainerSets() {
		var out = [];
		$("#p2 img.trainer-pok").each(function () { var id = this.getAttribute("data-id"); if (id && out.indexOf(id) === -1) out.push(id); });
		var cur = $("#p2 input.set-selector").val();
		if (!out.length && cur && cur.indexOf("Blank Set") === -1) out.push(cur);
		return out;
	}
	function fillSelect(sel, ids, want) {
		var keep = want && ids.indexOf(want) !== -1 ? want : "";
		sel.innerHTML = '<option value="">(none)</option>' + ids.map(function (id) {
			return '<option value="' + esc(id) + '">' + esc(id) + "</option>";
		}).join("");
		sel.value = keep;
	}
	function refreshChoices() {
		var mine = mySets(), theirs = trainerSets();
		var saved = {};
		try { saved = JSON.parse(localStorage.getItem("remixDaiPicks") || "{}"); } catch (e) {}
		var pick = function (slot, list, i) {
			var sel = q("#dai-sel-" + slot);
			var cur = sel.value || saved[slot];
			if (!cur || list.indexOf(cur) === -1) cur = list[i] || "";
			fillSelect(sel, list, cur);
		};
		pick("A", mine, 0); pick("B", mine, 1);
		pick("L", theirs, 0); pick("R", theirs, 1);
	}

	// ---- Pokemon + estimates ----
	function buildPoke(id) {
		if (!id || typeof createPokemon !== "function") return null;
		// The Pokemon open in the main calc: read it live from its panel (ability, item, EVs, HP, boosts...)
		var live = ["#p1", "#p2"].filter(function (p) { return $(p + " input.set-selector").val() === id; })[0];
		if (live) { try { return createPokemon($(live)); } catch (e) {} }
		var p;
		try { p = createPokemon(id); } catch (e) { return null; }
		var saved = typeof remixHPMemoryOn !== "undefined" && remixHPMemoryOn && typeof remixSavedHP !== "undefined" ? remixSavedHP[id] : null;
		if (saved) {
			p.originalCurHP = Math.max(1, Math.round(p.maxHP() * saved.cur / saved.max));
			if (saved.status && typeof CALC_STATUS !== "undefined") p.status = CALC_STATUS[saved.status] || "";
			if (saved.itemOff) p.item = undefined;
		}
		return p;
	}
	function estimate(atk, def, moveName, field) {
		var md = calc.MOVES[gen][moveName];
		if (!md || md.category === "Status" || moveName === "(No Move)") return null;
		var opts = {ability: atk.ability, item: atk.item};
		if (md.multihit && md.multihit[0] === 2 && md.multihit[1] === 5) opts.hits = 3;
		var mv = new calc.Move(gen, moveName, opts);
		if (mv.category === "Status") return null;
		var r = calc.calculate(gen, atk, def, mv, field);
		var rng = r.range(), max = Array.isArray(rng) ? rng[1] : rng, cur = def.curHP();
		return {move: moveName, dmg: max, pct: cur ? 100 * max / cur : 0, ko: max >= cur, spread: !!SPREAD[mv.target], full: mv.target === "allAdjacent"};
	}
	function bestVs(list) {
		var b = null;
		list.forEach(function (e) {
			if (!e || e.spread) return;
			if (!b || (e.ko && !b.ko) || (e.ko === b.ko && e.pct > b.pct)) b = e;
		});
		return b;
	}
	function moveNames(p) { return (p.moves || []).map(function (m) { return m.name; }).filter(function (n) { return n && n !== "(No Move)"; }); }

	// Useful status (in-game rule when walled): see DOUBLES_AI_LOGIC.md section 4.
	// otherFoe: setup counts if the boost helps against EITHER foe (walled by one, it sets up rather
	// than double-targeting the foe its partner is already hitting).
	function usefulVs(ai, foe, field, otherFoe) {
		var D = window.REMIX_DAI || {setup: {}, heal: [], foeStatus: {}};
		var types = foe.types || [], why = [];
		var has = function (t) { return types.indexOf(t) !== -1; };
		var names = moveNames(ai);
		for (var i = 0; i < names.length; i++) {
			var mn = names[i], md = calc.MOVES[gen][mn];
			if (!md || md.category !== "Status") continue;
			if (D.heal.indexOf(mn) !== -1) { why.push(mn + ": healing never counts"); continue; }
			var su = D.setup[mn];
			if (su) {
				var b = ai.clone();
				b.boosts.atk = Math.min(6, (b.boosts.atk || 0) + su[0]);
				b.boosts.spa = Math.min(6, (b.boosts.spa || 0) + su[1]);
				var ok = names.some(function (m2) {
					var m2d = calc.MOVES[gen][m2];
					if (!m2d || m2d.category === "Status") return false;
					if ((m2d.category === "Physical" && !su[0]) || (m2d.category === "Special" && !su[1])) return false;
					return [foe, otherFoe].some(function (tf) {
						if (!tf) return false;
						try { var e = estimate(b, tf, m2, field); return e && !e.spread && (e.ko || e.pct >= 20); } catch (x) { return false; }
					});
				});
				if (ok) return {ok: true, move: mn, why: mn + " (boost pushes an attack over 20% vs a foe)"};
				why.push(mn + ": boost still under 20%"); continue;
			}
			var fsd = D.foeStatus[mn];
			if (fsd) {
				var ab = ai.ability || "";
				var blocked =
					(fsd.powder && has("Grass")) ? "powder vs Grass" :
					(ab === "Prankster" && has("Dark")) ? "Prankster vs Dark" :
					(fsd.ail === 1 && has("Electric")) ? "paralysis vs Electric" :
					(fsd.ail === 1 && fsd.type === "Electric" && has("Ground")) ? "Electric move vs Ground" :
					(fsd.ail === 4 && has("Fire")) ? "burn vs Fire" :
					(fsd.ail === 5 && ab !== "Corrosion" && (has("Poison") || has("Steel"))) ? "poison vs Poison/Steel" :
					(fsd.ail === 18 && has("Grass")) ? "Leech Seed vs Grass" :
					(fsd.trap && has("Ghost")) ? "trapping vs Ghost" :
					(((fsd.ail >= 1 && fsd.ail <= 5) || fsd.ail === 14) && foe.status) ? "target already statused" : "";
				if (!blocked) blocked = statusBlock(fsd, mn, foe, field);
				if (blocked) { why.push(mn + ": " + blocked); continue; }
				return {ok: true, move: mn, why: mn + " would work"};
			}
			return {ok: true, move: mn, why: mn + " (assumed useful: the calc can't see field state)"};
		}
		return {ok: false, why: why.length ? why.join("; ") : "no status moves"};
	}

	// ---- status blocks the in-game AI checks: terrain, revealed abilities, Remix items ----
	// ail codes (game move data): 1 para, 2 sleep, 3 freeze, 4 burn, 5 poison, 6 confusion, 7 attract,
	// 11 taunt, 12 torment, 13 disable, 14 yawn, 15 heal block.
	var MAJOR = {1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 14: 1}, MENTAL = {7: 1, 11: 1, 12: 1, 13: 1, 15: 1};
	function statusBlock(fsd, mn, foe, field) {
		var ail = fsd.ail, major = !!MAJOR[ail], mental = !!MENTAL[ail] || mn === "Encore";
		var grounded = true;
		try { grounded = calc.isGrounded(foe, field); } catch (e) {}
		if (field.terrain === "Misty" && grounded && (major || ail === 6)) return "Misty Terrain";
		if (field.terrain === "Electric" && grounded && (ail === 2 || ail === 14)) return "Electric Terrain";
		// items (the AI sees held items)
		var sp = foe.name || "", it = foe.item || "", sand = field.weather === "Sand";
		if (major) {
			if (sand && ((it === "Shell Bell" && sp === "Lapras") || (it === "Smooth Rock" && /^(Dwebble|Crustle)/.test(sp)) ||
				(it === "Prickly Pear" && /^(Cacnea|Cacturne|Maractus)/.test(sp)))) return it + " (status immune in sand)";
			if (ail === 4 && it === "Heat Rock" && /^(Roggenrola|Boldore|Gigalith)/.test(sp)) return "Heat Rock (burn immune)";
			if ((it === "Banana Bunch" && sp === "Tropius") || (it === "Whipped Dream" && /^(Swirlix|Slurpuff)/.test(sp))) return it + " (cures status)";
		}
		// abilities: only once revealed
		if (!foe.daiRevealed) return "";
		var has = function () { return foe.hasAbility.apply(foe, arguments); };
		if (has("Magic Bounce")) return "Magic Bounce";
		if (major && has("Vital Spirit", "Flower Veil", "Star Power")) return foe.ability;
		if (major && has("Leaf Guard") && (field.weather === "Sun" || field.weather === "Harsh Sunshine")) return "Leaf Guard in sun";
		if ((major || mental) && has("Aroma Veil")) return "Aroma Veil";
		if (mental && has("Scribble")) return "Scribble";
		if ((ail === 2 || ail === 14) && has("Insomnia", "Sweet Veil", "Bad Dreams")) return foe.ability;
		if (ail === 6 && has("Own Tempo")) return "Own Tempo";
		if (ail === 3 && has("Magma Armor", "Permafrost", "Thick Fat")) return foe.ability;
		if (ail === 4 && has("Thick Fat", "Liquid Veil", "Water Bubble")) return foe.ability;
		return "";
	}
	var STATUS_ABILITIES = ["Magic Bounce", "Vital Spirit", "Flower Veil", "Star Power", "Leaf Guard", "Aroma Veil", "Scribble",
		"Insomnia", "Sweet Veil", "Bad Dreams", "Own Tempo", "Magma Armor", "Permafrost", "Thick Fat", "Liquid Veil", "Water Bubble"];

	// ---- unseen abilities: the AI doesn't know an immunity ability until it's revealed ----
	var revealed = {};
	try { revealed = JSON.parse(localStorage.getItem("remixDaiRevealed") || "{}"); } catch (e) {}
	function noAbility(p) { var c = p.clone(); c.ability = "(No Ability)"; return c; } // not undefined: that refills the default
	// Does this ability give an immunity (a type doing 0 only because of it) or block status?
	function revealable(p) {
		if (!p.ability || p.ability === "(No Ability)") return false;
		if (STATUS_ABILITIES.some(function (a) { return p.hasAbility(a); })) return true;
		if (typeof remixTCDamage !== "function") return false;
		var atk = remixTCGetAttacker(), f = new calc.Field({gameType: "Doubles"}), bare = noAbility(p);
		return REMIX_TC_TYPES.some(function (t) { return remixTCDamage(atk, p, t[0], f) === 0 && remixTCDamage(atk, bare, t[0], f) > 0; });
	}
	// Estimate as the AI sees it: an unrevealed immunity is ignored (it thinks Earthquake hits Levitate).
	function aiEstimate(atk, def, moveName, field) {
		var e = estimate(atk, def, moveName, field);
		if (e && e.dmg === 0 && !def.daiRevealed && def.daiCanReveal) {
			var e2 = estimate(atk, noAbility(def), moveName, field);
			if (e2 && e2.dmg > 0) { e2.unseen = def.ability; return e2; }
		}
		return e;
	}

	// ---- decision ----
	var lastCands = [];
	function scoreAssign(asg) {
		var kos = 0, tot = 0;
		asg.forEach(function (x) { if (!x.e) return; kos += x.e.spread ? x.e.kos : (x.e.ko ? 1 : 0); tot += x.e.pct; });
		return {kos: kos, tot: tot};
	}
	function planOptimal(ais, foes, best, spreadBest) {
		var cands = [];
		if (foes.length === 1) {
			cands.push(ais.map(function (a) { return {a: a, f: foes[0], e: best[a][foes[0]]}; }));
		} else {
			var opts = function (a) {
				var o = foes.map(function (f) { return {a: a, f: f, e: best[a][f]}; });
				if (spreadBest[a]) o.push({a: a, f: null, e: spreadBest[a]});
				return o;
			};
			if (ais.length === 1) opts(ais[0]).forEach(function (x) { cands.push([x]); });
			else opts(ais[0]).forEach(function (x) {
				opts(ais[1]).forEach(function (y) { if (!(x.f && y.f && x.f === y.f)) cands.push([x, y]); });
			});
		}
		cands = cands.map(function (c, i) { var s = scoreAssign(c); return {asg: c, kos: s.kos, tot: s.tot, order: i}; });
		// Doubles: most total damage first (user 2026-11-09), KOs only break ties, then order.
		cands.sort(function (p, r) { return r.tot - p.tot || r.kos - p.kos || p.order - r.order; });
		lastCands = cands;
		return cands[0].asg;
	}
	// Walled handling -> final action per AI mon: {a, kind: hit|spread|status|switch, f, move, pct, ko, note}
	function finalize(asg, foes, best, P, field) {
		return asg.map(function (x) {
			var e = x.e;
			if (e && e.spread) {
				var altS = e.kos > 0 ? null : usefulVs(P[x.a], P[foes[0]], field, P[foes[1]]);
				return {a: x.a, kind: "spread", full: !!e.full, targets: foes.slice(), move: e.move, pct: e.pct, ko: e.kos > 0, maybe: altS && altS.ok ? altS.move : ""};
			}
			if (e && (e.ko || e.pct >= 20)) {
				// Not a KO: the AI might still use a useful status move instead (odds not mapped).
				var alt = e.ko ? null : usefulVs(P[x.a], P[x.f], field, P[foes.filter(function (f) { return f !== x.f; })[0]]);
				return {a: x.a, kind: "hit", f: x.f, move: e.move, pct: e.pct, ko: e.ko, maybe: alt && alt.ok ? alt.move : ""};
			}
			var u = usefulVs(P[x.a], P[x.f], field, P[foes.filter(function (f) { return f !== x.f; })[0]]);
			var isSetup = u.ok && window.REMIX_DAI && REMIX_DAI.setup[u.move];
			if (u.ok) return {a: x.a, kind: isSetup ? "setup" : "status", f: x.f, move: u.move, note: "walled (" + (e ? e.pct.toFixed(1) + "%" : "no damage") + "), " + u.why};
			var other = foes.filter(function (f) { return f !== x.f; })[0];
			var oe = other && best[x.a][other];
			if (oe && (oe.ko || oe.pct >= 20)) return {a: x.a, kind: "hit", f: other, move: oe.move, pct: oe.pct, ko: oe.ko, note: "walled vs its target, hits the other foe instead"};
			return {a: x.a, kind: "switch", note: "walled vs every foe: switches (attacks once first if it hasn't acted yet)"};
		});
	}

	// ---- run + draw ----
	var timer = null;
	function schedule() { clearTimeout(timer); timer = setTimeout(run, 60); }

	function run() {
		var panel = q("#dai-panel");
		if (!panel || typeof calc === "undefined") return;
		var ids = {}, P = {};
		["A", "B", "L", "R"].forEach(function (s) { ids[s] = q("#dai-sel-" + s).value; P[s] = buildPoke(ids[s]); });
		// your side: "Ability revealed" toggle, only when the ability gives an immunity or blocks status
		["A", "B"].forEach(function (s) {
			var box = $("#dai-slot-" + s + " .dai-reveal");
			if (!P[s]) { box.hide(); return; }
			P[s].daiCanReveal = revealable(P[s]);
			P[s].daiRevealed = P[s].daiCanReveal && !!revealed[ids[s]];
			box.toggle(P[s].daiCanReveal).attr("title", "Has the AI seen " + P[s].ability + " yet? Until then it ignores the ability's immunity / status blocks.")
				.find("input").prop("checked", P[s].daiRevealed);
			box.find("span").text(P[s].ability + " revealed");
		});
		try { localStorage.setItem("remixDaiPicks", JSON.stringify(ids)); } catch (e) {}
		drawSprites(ids, P);
		var foes = ["A", "B"].filter(function (f) { return P[f] && P[f].curHP() > 0; });
		var ais = ["L", "R"].filter(function (a) { return P[a] && P[a].curHP() > 0; });
		var out = q("#dai-result"), table = q("#dai-table");
		if (!foes.length || !ais.length) {
			out.innerHTML = '<p class="dai-empty">Pick at least one of your Pokémon and one trainer Pokémon.</p>';
			table.innerHTML = ""; drawArrows([]); return;
		}
		var field;
		try { field = createField().clone().swap(); field.gameType = "Doubles"; } catch (e) { field = new calc.Field({gameType: "Doubles"}); }
		var M = {}, best = {}, spreadBest = {};
		ais.forEach(function (a) {
			M[a] = {}; best[a] = {};
			var names = moveNames(P[a]);
			foes.forEach(function (f) {
				M[a][f] = names.map(function (mn) { try { return aiEstimate(P[a], P[f], mn, field); } catch (e) { return null; } });
				best[a][f] = bestVs(M[a][f]);
			});
			var sb = null;
			names.forEach(function (mn, i) {
				var hits = foes.map(function (f) { return M[a][f][i]; });
				if (!hits[0] || !hits[0].spread) return;
				var tot = 0, kos = 0;
				hits.forEach(function (h) { if (h) { tot += h.pct; if (h.ko) kos++; } });
				if (!sb || kos > sb.kos || (kos === sb.kos && tot > sb.pct)) sb = {move: mn, pct: tot, kos: kos, spread: true, full: !!hits[0].full};
			});
			spreadBest[a] = sb;
		});
		var asg = planOptimal(ais, foes, best, spreadBest);
		var acts = finalize(asg, foes, best, P, field);
		var name = function (s) { return species(ids[s]); };
		out.innerHTML = acts.map(function (x) {
			var head = "<b>" + esc(name(x.a)) + "</b> ";
			var body =
				x.kind === "hit" ? (x.maybe ? "If it attacks: " : "uses ") + "<b>" + esc(x.move) + "</b> on " + esc(name(x.f)) + " (" + x.pct.toFixed(1) + "%" + (x.ko ? ", <span class='dai-ko'>KO</span>" : "") + ")" :
				x.kind === "spread" ? (x.maybe ? "If it attacks: " : "uses ") + "<b>" + esc(x.move) + "</b> on both (" + x.pct.toFixed(1) + "% total" + (x.ko ? ", <span class='dai-ko'>KO</span>" : "") + ")" :
				x.kind === "status" ? "uses <b>" + esc(x.move) + "</b> on " + esc(name(x.f)) + " <span class='dai-maybe'>(walled, so status first)</span>" :
				x.kind === "setup" ? "uses <b>" + esc(x.move) + "</b> <span class='dai-maybe'>(walled, sets up)</span>" :
				"<b>switches out</b>";
			if (x.maybe) body += "<div class='dai-unsure'>(Not Guaranteed) no KO, so it may use <b>" + esc(x.maybe) + "</b> instead (odds not known)</div>";
			else if (x.kind === "hit" || x.kind === "spread") body += "<div class='dai-sure'>(Guaranteed)</div>";
			return "<div class='dai-line'>" + head + body + (x.note ? "<div class='dai-note'>" + esc(x.note) + "</div>" : "") + "</div>";
		}).join("");
		// damage table
		var h = "<table class='dai-table'><tr><th>AI move</th>" + foes.map(function (f) { return "<th>vs " + esc(name(f)) + "</th>"; }).join("") + "</tr>";
		ais.forEach(function (a) {
			moveNames(P[a]).forEach(function (mn, i) {
				h += "<tr><td>" + esc(name(a)) + ": " + esc(mn) + "</td>" + foes.map(function (f) {
					var e = M[a][f][i];
					return "<td class='" + (e && e.ko ? "dai-ko" : "") + "'" + (e && e.unseen ? " title='Really 0%: the AI does not know " + esc(e.unseen) + " yet'" : "") + ">" +
						(!e ? "status" : e.pct.toFixed(1) + "%" + (e.ko ? " KO" : "") + (e.unseen ? " *" : "")) + "</td>";
				}).join("") + "</tr>";
			});
		});
		h += "</table>";
		// Plans the AI compared (no double-targeting): most KOs, then most total %, then order.
		var nm = function (x) { return x.f ? name(x.f) : "both (spread)"; };
		h += "<div class='dai-sub'>Plans it compared (most total damage, then most KOs)</div><table class='dai-table'><tr><th></th><th>Plan</th><th>KOs</th><th>Total</th></tr>";
		lastCands.forEach(function (c, i) {
			h += "<tr class='" + (i === 0 ? "dai-pick" : "") + "'><td>" + (i === 0 ? "★" : "") + "</td><td>" + c.asg.map(function (x) {
				return esc(name(x.a)) + " → " + esc(nm(x)) + (x.e ? ": " + esc(x.e.move) + " " + x.e.pct.toFixed(1) + "%" : ": nothing");
			}).join("<br>") + "</td><td>" + c.kos + "</td><td>" + c.tot.toFixed(1) + "%</td></tr>";
		});
		h += "</table><div class='dai-sub'>Then: a mon walled by its target (under 20%, no KO) uses a useful status / setup move first, otherwise hits the other foe if that does 20%+, otherwise switches. With no KO, it may also pick a useful status move instead of attacking.</div>";
		table.innerHTML = h;
		drawArrows(acts);
	}

	function drawSprites(ids, P) {
		["A", "B", "L", "R"].forEach(function (s) {
			var box = q("#dai-slot-" + s), img = box.querySelector("img"), hp = box.querySelector(".dai-hp");
			if (!ids[s] || !P[s]) { img.style.visibility = "hidden"; hp.textContent = ""; return; }
			var file = typeof remixSpriteFile === "function" ? remixSpriteFile(P[s].name) : P[s].name.toLowerCase();
			img.src = "./img/pokesprite/" + file + ".png" + (typeof REMIX_SPRITE_VERSION !== "undefined" ? "?v=" + REMIX_SPRITE_VERSION : "");
			img.style.visibility = "visible";
			if (typeof remixGlowFilter === "function") img.style.filter = remixGlowFilter(file);
			var pct = Math.round(100 * P[s].curHP() / P[s].maxHP());
			hp.textContent = pct + "% HP" + (P[s].status ? " · " + P[s].status : "");
		});
	}

	// Arrows from each AI Pokemon to its target(s), labelled with the move.
	function drawArrows(acts) {
		var arena = q("#dai-arena"), svg = q("#dai-arrows");
		if (!arena || !svg) return;
		var ar = arena.getBoundingClientRect();
		svg.setAttribute("width", ar.width); svg.setAttribute("height", ar.height);
		var pt = function (slot, side) {
			var r = q("#dai-slot-" + slot + " img").getBoundingClientRect();
			return {x: (side === "left" ? r.left + 6 : r.right - 6) - ar.left, y: r.top + r.height / 2 - ar.top};
		};
		var head = function (c) {
			return '<marker id="dai-head-' + c + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
				'<path d="M0,0 L10,5 L0,10 z" class="dai-head-' + c + '"/></marker>';
		};
		var parts = ["<defs>" + ["red", "orange", "yellow", "purple"].map(head).join("") + "</defs>"];
		acts.forEach(function (x, i) {
			if (x.kind === "switch") return;
			if (x.kind === "setup") { // targets itself: a label under its sprite, no arrow
				var me = pt(x.a, "left");
				parts.push('<text class="dai-label" x="' + (me.x - 10) + '" y="' + (me.y + 4) + '" text-anchor="end">' + esc(x.move) + " (setup)</text>");
				return;
			}
			var targets = x.kind === "spread" ? x.targets : [x.f];
			targets.forEach(function (f, k) {
				var a = pt(x.a, "left"), b = pt(f, "right");
				var bend = (x.a === "L" ? -1 : 1) * 18;
				var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 + bend;
				// red = single target, orange = spread on both foes, yellow = spread that also hits its ally,
				// purple = status; dotted = not guaranteed, solid = guaranteed
				var col = x.kind === "status" ? "purple" : x.kind === "spread" ? (x.full ? "yellow" : "orange") : "red";
				parts.push('<path class="dai-arrow dai-c-' + col + (x.maybe ? " dai-arrow-maybe" : "") + '" d="M' + a.x + "," + a.y + " Q" + mx + "," + my + " " + b.x + "," + b.y + '" marker-end="url(#dai-head-' + col + ')"/>');
				if (k === 0) {
					var label = (x.maybe ? "If attacking: " : "") + x.move + (x.kind === "status" ? " (status)" : " " + x.pct.toFixed(0) + "%" + (x.ko ? " KO" : ""));
					parts.push('<text class="dai-label" x="' + mx + '" y="' + (my + (x.a === "L" ? -6 : 14)) + '" text-anchor="middle">' + esc(label) + "</text>");
				}
			});
		});
		svg.innerHTML = parts.join("");
	}

	function buildPanel() {
		if (q("#dai-panel")) return;
		var slot = function (s, label) {
			return '<div class="dai-slot" id="dai-slot-' + s + '"><select id="dai-sel-' + s + '" aria-label="' + label + '"></select>' +
				'<img alt="" /><div class="dai-hp"></div>' +
				(s === "A" || s === "B" ? '<label class="dai-reveal" style="display:none"><input type="checkbox" /> <span></span></label>' : "") + "</div>";
		};
		var html =
			'<fieldset id="dai-panel" class="dai-panel"><legend align="center">Doubles AI (what the trainer will do)</legend>' +
			'<div class="dai-top"><span class="dai-hint">Your sets on the left, the current trainer\'s team on the right. Uses the HP / status you set in the calc and the field above.</span>' +
			"</div>" +
			'<div class="dai-arena" id="dai-arena"><div class="dai-col dai-you">' + slot("A", "Your left Pokémon") + slot("B", "Your right Pokémon") + "</div>" +
			'<svg id="dai-arrows" class="dai-arrows"></svg>' +
			'<div class="dai-col dai-ai">' + slot("L", "Trainer left Pokémon") + slot("R", "Trainer right Pokémon") + "</div></div>" +
			// results + "Show the AI's math" on the left, the legend in the free space on the right
			'<div class="dai-bottom"><div class="dai-left"><div id="dai-result" class="dai-result"></div>' +
			'<details class="dai-details"><summary><span class="dai-sum-title">Show the AI&#39;s math</span> <span class="dai-sum-hint">(click: every move&#39;s damage + the plans it compared)</span></summary></details></div>' +
			'<div class="dai-legend">' +
			[["red", "Red", "Single Target"], ["orange", "Orange", "Duo Spread"], ["yellow", "Yellow", "Full Spread"],
				["purple", "Purple", "Status"], ["solid", "Solid Line", "Guaranteed"], ["dotted", "Dotted Line", "Not Guaranteed"]]
				.map(function (x) {
					return '<div class="dai-lg"><span><b class="dai-t-' + x[0] + '">' + x[1] + "</b> = " + x[2] + '</span><i class="dai-ln dai-ln-' + x[0] + '"></i></div>';
				}).join("") +
			"</div></div>" +
			'<div id="dai-table" class="dai-table-wrap"></div>' +
			"</fieldset>";
		// under the three calc columns, centred with them
		var wrapper = document.querySelector(".wrapper");
		if (wrapper) wrapper.insertAdjacentHTML("beforeend", html); else document.body.insertAdjacentHTML("beforeend", html);
		$("#dai-panel").on("change", "select", run);
		var det = q("#dai-panel .dai-details");
		$("#dai-table").toggle(det.open);
		det.addEventListener("toggle", function () { $("#dai-table").toggle(det.open); });
		$("#dai-panel").on("change", ".dai-reveal input", function () {
			var slot = $(this).closest(".dai-slot").attr("id").slice(-1), id = q("#dai-sel-" + slot).value;
			if (this.checked) revealed[id] = 1; else delete revealed[id];
			try { localStorage.setItem("remixDaiRevealed", JSON.stringify(revealed)); } catch (e) {}
			run();
		});
		$(window).on("resize", function () { alignPanel(); schedule(); });
	}

	// Compact (up to 760px), centred under the three calc columns.
	function alignPanel() {
		var cols = $(".wrapper > .panel:visible"), panel = $("#dai-panel");
		if (!cols.length || !panel.length || !panel.is(":visible")) return;
		var left = Infinity, right = -Infinity;
		cols.each(function () { var o = $(this).offset().left; left = Math.min(left, o); right = Math.max(right, o + $(this).outerWidth()); });
		var w = Math.min(760, right - left);
		panel.css({ width: w + "px", "margin-left": "0px" });
		panel.css("margin-left", ((left + right) / 2 - w / 2 - panel.offset().left) + "px"); // measured, so padding doesn't matter
	}

	// "Doubles AI Calc" button above Singles / Doubles: show / hide the panel (remembered; hidden by default).
	var daiShown = false;
	try { daiShown = localStorage.getItem("remixDaiShown") === "shown"; } catch (e) {}
	function showDaiState() {
		$("#dai-panel").toggle(daiShown);
		$("#dai-open").html((daiShown ? "Hide" : "Show") + " Doubles AI Calc <span class='dai-open-hint'>(Scroll Down)</span>").toggleClass("on", daiShown);
		if (daiShown) { alignPanel(); refreshChoices(); schedule(); }
	}
	function buildToggle() {
		var fmt = $('div[aria-labelledby="selectBattleFormatInstruction"]').first();
		if (!fmt.length || $("#dai-open").length) return;
		$('<button type="button" id="dai-open" class="dai-open"></button>').insertBefore(fmt).on("click", function () {
			daiShown = !daiShown;
			try { localStorage.setItem("remixDaiShown", daiShown ? "shown" : "hidden"); } catch (e) {}
			showDaiState();
			if (daiShown) document.getElementById("dai-panel").scrollIntoView({behavior: "smooth", block: "nearest"});
		});
	}

	// Called after every main calculation (field / HP / trainer changes show up here).
	window.remixUpdateDoublesAI = function () {
		if (!q("#dai-panel") || !daiShown) return;
		refreshChoices();
		schedule();
	};

	$(function () {
		buildPanel();
		buildToggle();
		$("#dai-panel").hide();
		setTimeout(showDaiState, 800);
	});
})();
