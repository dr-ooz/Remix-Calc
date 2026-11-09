/* Doubles AI targeting predictor (TENTATIVE, for UI testing).
 * Mirrors the in-game singles AI estimate as closely as the calc allows:
 *   - max damage roll, 2-5 hit moves = 3 hits, always-crit moves as crits (calc handles willCrit)
 *   - "strongest move" per target = highest % of the target's CURRENT HP (uncapped, overkill counts)
 *   - KO = max roll >= current HP
 * Two rules are shown side by side:
 *   OPTIMAL: try both splits (L->A,R->B) and (L->B,R->A); never double-target;
 *            pick most KOs, then most total % (uncapped), then L->A.
 *   SIMPLE:  each AI mon takes a KO if it has one, else hits the foe it hurts most;
 *            if both want the same foe, the bigger hitter keeps it (tie: left slot), the other takes the other foe.
 * Both: a mon walled (<20%, no KO) vs its assigned foe uses a useful status if it has one; otherwise hits the
 * other foe if that does >=20% (the only allowed double-target); otherwise it switches.
 * Spread moves are scored against both foes and don't claim a target. One foe left -> both hit it.
 */
(function () {
	var GEN = 7, gen;
	var SLOTS = [
		{id: 'L', side: 'ai', label: 'AI Left'},
		{id: 'R', side: 'ai', label: 'AI Right'},
		{id: 'A', side: 'foe', label: 'Your Left (A)'},
		{id: 'B', side: 'foe', label: 'Your Right (B)'}
	];
	var DEFAULTS = {
		L: {species: 'Garchomp', level: 50, ability: 'Rough Skin', item: '', hp: 100, moves: ['Earthquake', 'Dragon Claw', 'Rock Slide', 'Fire Fang']},
		R: {species: 'Gardevoir', level: 50, ability: 'Trace', item: '', hp: 100, moves: ['Moonblast', 'Psychic', 'Dazzling Gleam', 'Thunderbolt']},
		A: {species: 'Incineroar', level: 50, ability: 'Blaze', item: '', hp: 100, moves: []},
		B: {species: 'Rotom-Wash', level: 50, ability: 'Levitate', item: '', hp: 100, moves: []}
	};
	var SPREAD = {allAdjacentFoes: 1, allAdjacent: 1};

	function el(tag, attrs, kids) {
		var e = document.createElement(tag);
		for (var k in attrs || {}) {
			if (k === 'text') e.textContent = attrs[k];
			else if (k === 'html') e.innerHTML = attrs[k];
			else e.setAttribute(k, attrs[k]);
		}
		(kids || []).forEach(function (c) { if (c) e.appendChild(c); });
		return e;
	}
	function datalist(id, names) {
		var dl = el('datalist', {id: id});
		names.forEach(function (n) { dl.appendChild(el('option', {value: n})); });
		document.body.appendChild(dl);
	}
	function input(cls, list, val, type) {
		var i = el('input', {class: cls, value: val == null ? '' : val});
		if (list) i.setAttribute('list', list);
		if (type) i.type = type;
		return i;
	}

	function buildCards() {
		var wrap = document.getElementById('dai-cards');
		SLOTS.forEach(function (s) {
			var d = DEFAULTS[s.id];
			var card = el('div', {class: 'dai-card dai-' + s.side, 'data-slot': s.id});
			card.appendChild(el('div', {class: 'dai-card-title', text: s.label}));
			var row = function (lbl, node) { return el('label', {class: 'dai-row'}, [el('span', {text: lbl}), node]); };
			card.appendChild(row('Pokémon', input('dai-species', 'dai-species-list', d.species)));
			card.appendChild(row('Level', input('dai-level', null, d.level, 'number')));
			card.appendChild(row('Ability', input('dai-ability', 'dai-ability-list', d.ability)));
			card.appendChild(row('Item', input('dai-item', 'dai-item-list', d.item)));
			card.appendChild(row('HP %', input('dai-hp', null, d.hp, 'number')));
			if (s.side === 'ai') {
				for (var m = 0; m < 4; m++) card.appendChild(row('Move ' + (m + 1), input('dai-move', 'dai-move-list', d.moves[m] || '')));
				var sel = el('select', {class: 'dai-status'});
				[['auto', 'Auto-detect'], ['yes', 'Yes'], ['no', 'No']].forEach(function (o) { sel.appendChild(el('option', {value: o[0], text: o[1]})); });
				card.appendChild(row('Useful status', sel));
			} else {
				var st = el('select', {class: 'dai-foestatus'});
				[['', 'None'], ['par', 'Paralyzed'], ['slp', 'Asleep'], ['brn', 'Burned'], ['psn', 'Poisoned'], ['frz', 'Frozen']].forEach(function (o) { st.appendChild(el('option', {value: o[0], text: o[1]})); });
				card.appendChild(row('Status', st));
				var gone = el('input', {type: 'checkbox', class: 'dai-gone'});
				card.appendChild(el('label', {class: 'dai-check'}, [gone, el('span', {text: ' Fainted / not on field'})]));
			}
			wrap.appendChild(card);
		});
	}

	function readSlot(id) {
		var c = document.querySelector('.dai-card[data-slot="' + id + '"]');
		var q = function (s) { return c.querySelector(s); };
		return {
			id: id,
			species: q('.dai-species').value.trim(),
			level: parseInt(q('.dai-level').value, 10) || 50,
			ability: q('.dai-ability').value.trim(),
			item: q('.dai-item').value.trim(),
			hp: Math.max(1, Math.min(100, parseFloat(q('.dai-hp').value) || 100)),
			moves: Array.prototype.map.call(c.querySelectorAll('.dai-move'), function (i) { return i.value.trim(); }).filter(Boolean),
			useful: q('.dai-status') ? q('.dai-status').value : 'auto',
			status: q('.dai-foestatus') ? q('.dai-foestatus').value : '',
			allMoves: Array.prototype.map.call(c.querySelectorAll('.dai-move'), function (i) { return i.value.trim(); }).filter(Boolean),
			gone: !!(q('.dai-gone') && q('.dai-gone').checked)
		};
	}

	function mkPoke(s, boosts) {
		var opts = {level: s.level};
		if (boosts) opts.boosts = boosts;
		if (s.ability) opts.ability = s.ability;
		if (s.item) opts.item = s.item;
		var p = new calc.Pokemon(gen, s.species, opts);
		var cur = Math.max(1, Math.floor(p.maxHP() * s.hp / 100));
		return new calc.Pokemon(gen, s.species, Object.assign(opts, {curHP: cur}));
	}

	function estimate(atk, def, moveName, field) {
		var md = calc.MOVES[GEN][moveName];
		var opts = {};
		if (md && md.multihit && md.multihit[0] === 2 && md.multihit[1] === 5) opts.hits = 3;
		var mv = new calc.Move(gen, moveName, opts);
		if (mv.category === 'Status') return null;
		var r = calc.calculate(gen, atk, def, mv, field);
		var rng = r.range();
		var max = Array.isArray(rng) ? rng[1] : rng;
		var cur = def.curHP();
		return {move: moveName, dmg: max, pct: cur ? 100 * max / cur : 0, ko: max >= cur, spread: !!SPREAD[mv.target]};
	}

	// best non-spread move vs one foe: KO moves first, then highest %
	function bestVs(list) {
		var b = null;
		list.forEach(function (e) {
			if (!e || e.spread) return;
			if (!b || (e.ko && !b.ko) || (e.ko === b.ko && e.pct > b.pct)) b = e;
		});
		return b;
	}

	function run() {
		var out = document.getElementById('dai-out');
		out.innerHTML = '';
		try {
			gen = calc.Generations.get(GEN);
			var S = {}; SLOTS.forEach(function (s) { S[s.id] = readSlot(s.id); });
			var P = {};
			SLOTS.forEach(function (s) { if (!S[s.id].gone && S[s.id].species) P[s.id] = mkPoke(S[s.id]); });
			var foes = ['A', 'B'].filter(function (f) { return P[f]; });
			var ais = ['L', 'R'].filter(function (a) { return P[a]; });
			if (!foes.length || !ais.length) throw new Error('Need at least one AI mon and one foe.');
			var field = new calc.Field({gameType: 'Doubles'});
			CTX = {S: S, P: P, field: field};

			// damage matrix
			var M = {}; // M[ai][foe] = [estimates]
			ais.forEach(function (a) {
				M[a] = {};
				foes.forEach(function (f) {
					M[a][f] = S[a].moves.map(function (mn) {
						try { return estimate(P[a], P[f], mn, field); } catch (e) { return {move: mn, err: e.message}; }
					});
				});
			});
			out.appendChild(matrix(ais, foes, S, M));

			var best = {}; // best[a][f]
			ais.forEach(function (a) { best[a] = {}; foes.forEach(function (f) { best[a][f] = bestVs(M[a][f]); }); });
			var spreadBest = {};
			ais.forEach(function (a) {
				var sb = null;
				S[a].moves.forEach(function (mn, i) {
					var hits = foes.map(function (f) { return M[a][f][i]; });
					if (!hits[0] || !hits[0].spread) return;
					var tot = 0, kos = 0;
					hits.forEach(function (h) { if (h && !h.err) { tot += h.pct; if (h.ko) kos++; } });
					if (!sb || kos > sb.kos || (kos === sb.kos && tot > sb.pct)) sb = {move: mn, pct: tot, kos: kos, spread: true};
				});
				spreadBest[a] = sb;
			});

			out.appendChild(section('OPTIMAL plan (joint totals)', optimal(ais, foes, best, spreadBest, S)));
			out.appendChild(section('SIMPLE rule (per mon)', simple(ais, foes, best, spreadBest, S)));
		} catch (e) {
			out.appendChild(el('div', {class: 'dai-err', text: 'Error: ' + e.message}));
		}
	}

	var CTX = null;
	// In-game rule ("useful status" when walled): a non-healing status move that would actually do something now.
	// Setup counts only if the boost pushes the best matching attack to >=20% (or a KO). Foe-targeting status moves
	// are useless into a type/Prankster/already-statused block. Anything else (screens, hazards, Taunt...) the calc
	// can't judge without field state, so it's assumed useful.
	function usefulVs(a, f) {
		var S = CTX.S, P = CTX.P, s = S[a];
		if (s.useful === 'yes') return {ok: true, why: 'set to Yes'};
		if (s.useful === 'no') return {ok: false, why: 'set to No'};
		var D = window.REMIX_DAI || {setup: {}, heal: [], foeStatus: {}};
		var foe = P[f], fs = S[f], types = foe.types || [], why = [];
		var has = function (t) { return types.indexOf(t) !== -1; };
		for (var i = 0; i < s.allMoves.length; i++) {
			var mn = s.allMoves[i], md = calc.MOVES[GEN][mn];
			if (!md || md.category !== 'Status') continue;
			if (D.heal.indexOf(mn) !== -1) { why.push(mn + ': healing (never counts)'); continue; }
			var su = D.setup[mn];
			if (su) {
				var cur = (P[a].boosts || {});
				var b = {atk: Math.min(6, (cur.atk || 0) + su[0]), spa: Math.min(6, (cur.spa || 0) + su[1])};
				var boosted = mkPoke(s, b), ok = false;
				s.moves.forEach(function (m2) {
					var m2d = calc.MOVES[GEN][m2];
					if (!m2d || m2d.category === 'Status') return;
					if ((m2d.category === 'Physical' && !su[0]) || (m2d.category === 'Special' && !su[1])) return;
					try { var e = estimate(boosted, foe, m2, CTX.field); if (e && !e.spread && (e.ko || e.pct >= 20)) ok = true; } catch (x) {}
				});
				if (ok) return {ok: true, why: mn + ': boost pushes an attack over 20%'};
				why.push(mn + ': boost still under 20%'); continue;
			}
			var fsd = D.foeStatus[mn];
			if (fsd) {
				var ab = (P[a].ability || '');
				var blocked =
					(fsd.powder && has('Grass')) ? 'powder vs Grass' :
					(ab === 'Prankster' && has('Dark')) ? 'Prankster vs Dark' :
					(fsd.ail === 1 && has('Electric')) ? 'paralysis vs Electric' :
					(fsd.ail === 1 && fsd.type === 'Electric' && has('Ground')) ? 'Electric move vs Ground' :
					(fsd.ail === 4 && has('Fire')) ? 'burn vs Fire' :
					(fsd.ail === 5 && ab !== 'Corrosion' && (has('Poison') || has('Steel'))) ? 'poison vs Poison/Steel' :
					(fsd.ail === 18 && has('Grass')) ? 'Leech Seed vs Grass' :
					(fsd.trap && has('Ghost')) ? 'trapping vs Ghost' :
					((fsd.ail >= 1 && fsd.ail <= 5) || fsd.ail === 14) && fs.status ? 'target already statused' : '';
				if (blocked) { why.push(mn + ': ' + blocked); continue; }
				return {ok: true, why: mn + ' would work'};
			}
			return {ok: true, why: mn + ' (assumed useful: calc cannot see field state)'};
		}
		return {ok: false, why: why.length ? why.join('; ') : 'no status moves'};
	}

	function fmt(e) {
		if (!e) return '—';
		if (e.err) return 'error';
		return e.move + ' ' + e.pct.toFixed(1) + '%' + (e.ko ? ' KO' : '') + (e.spread ? ' (spread)' : '');
	}

	function matrix(ais, foes, S, M) {
		var t = el('table', {class: 'dai-table'});
		var head = el('tr', {}, [el('th', {text: 'Max-roll % of current HP'})]);
		foes.forEach(function (f) { head.appendChild(el('th', {text: S[f].species + ' (' + f + ')'})); });
		t.appendChild(head);
		ais.forEach(function (a) {
			S[a].moves.forEach(function (mn, i) {
				var tr = el('tr', {}, [el('td', {text: S[a].species + ' (' + a + '): ' + mn})]);
				foes.forEach(function (f) {
					var e = M[a][f][i];
					var txt = !e ? 'status' : e.err ? 'error: ' + e.err : e.pct.toFixed(1) + '%' + (e.ko ? ' KO' : '');
					tr.appendChild(el('td', {class: e && e.ko ? 'dai-ko' : '', text: txt}));
				});
				t.appendChild(tr);
			});
		});
		return section('Damage the AI sees', t);
	}

	function section(title, body) {
		return el('div', {class: 'dai-section'}, [el('h3', {text: title}), body]);
	}

	// walled handling for a single assignment {a, f, e}
	function finalize(asg, foes, best, S) {
		return asg.map(function (x) {
			if (x.e && x.e.spread) return {a: x.a, text: 'uses ' + x.e.move + ' (spread, hits both)'};
			var e = x.e;
			if (e && (e.ko || e.pct >= 20)) return {a: x.a, text: 'uses ' + e.move + ' on ' + x.f + ' (' + e.pct.toFixed(1) + '%' + (e.ko ? ', KO' : '') + ')'};
			var u = usefulVs(x.a, x.f);
			if (u.ok) return {a: x.a, text: 'walled vs ' + x.f + ' → uses a useful status move (' + u.why + ')'};
			var other = foes.filter(function (f) { return f !== x.f; })[0];
			var oe = other && best[x.a][other];
			if (oe && (oe.ko || oe.pct >= 20)) return {a: x.a, text: 'walled vs ' + x.f + ' → hits ' + other + ' instead with ' + oe.move + ' (' + oe.pct.toFixed(1) + '%) [double-target allowed]'};
			return {a: x.a, text: 'walled vs every foe → SWITCHES (attacks once first if it has not acted yet). Status: ' + u.why};
		});
	}

	function scoreAssign(asg) {
		var kos = 0, tot = 0;
		asg.forEach(function (x) {
			if (!x.e) return;
			kos += x.e.spread ? x.e.kos : (x.e.ko ? 1 : 0);
			tot += x.e.pct;
		});
		return {kos: kos, tot: tot};
	}

	function optimal(ais, foes, best, spreadBest, S) {
		var cands = [];
		if (foes.length === 1) {
			cands.push({name: 'Only one foe → both hit ' + foes[0], asg: ais.map(function (a) { return {a: a, f: foes[0], e: best[a][foes[0]]}; })});
		} else if (ais.length === 1) {
			var a = ais[0];
			foes.forEach(function (f) { cands.push({name: a + '→' + f, asg: [{a: a, f: f, e: best[a][f]}]}); });
			if (spreadBest[a]) cands.push({name: a + '→spread', asg: [{a: a, f: null, e: spreadBest[a]}]});
		} else {
			// each AI mon: target A, target B, or its best spread move; no two single-target actions on the same foe
			var opts = function (a) {
				var o = foes.map(function (f) { return {a: a, f: f, e: best[a][f]}; });
				if (spreadBest[a]) o.push({a: a, f: null, e: spreadBest[a]});
				return o;
			};
			opts('L').forEach(function (x) {
				opts('R').forEach(function (y) {
					if (x.f && y.f && x.f === y.f) return;
					cands.push({name: 'L→' + (x.f || 'spread') + ', R→' + (y.f || 'spread'), asg: [x, y]});
				});
			});
		}
		cands.forEach(function (c, i) { var s = scoreAssign(c.asg); c.kos = s.kos; c.tot = s.tot; c.order = i; });
		cands.sort(function (p, q) { return q.kos - p.kos || q.tot - p.tot || p.order - q.order; });
		var box = el('div');
		var t = el('table', {class: 'dai-table'}, [el('tr', {}, [el('th', {text: 'Candidate'}), el('th', {text: 'Moves'}), el('th', {text: 'KOs'}), el('th', {text: 'Total %'})])]);
		cands.forEach(function (c, i) {
			t.appendChild(el('tr', {class: i === 0 ? 'dai-pick' : ''}, [
				el('td', {text: (i === 0 ? '★ ' : '') + c.name}),
				el('td', {text: c.asg.map(function (x) { return x.a + ': ' + fmt(x.e); }).join(' | ')}),
				el('td', {text: String(c.kos)}),
				el('td', {text: c.tot.toFixed(1) + '%'})
			]));
		});
		box.appendChild(t);
		box.appendChild(actions(finalize(cands[0].asg, foes, best, S)));
		return box;
	}

	function simple(ais, foes, best, spreadBest, S) {
		var want = ais.map(function (a) {
			var pick = null;
			foes.forEach(function (f) {
				var e = best[a][f];
				if (!e) return;
				if (!pick || (e.ko && !pick.e.ko) || (e.ko === pick.e.ko && e.pct > pick.e.pct)) pick = {a: a, f: f, e: e};
			});
			var sb = spreadBest[a];
			if (sb && (!pick || sb.kos > (pick.e.ko ? 1 : 0) || (sb.kos === (pick.e.ko ? 1 : 0) && sb.pct > pick.e.pct))) pick = {a: a, f: null, e: sb};
			return pick || {a: a, f: foes[0], e: null};
		});
		var note = '';
		if (want.length === 2 && foes.length === 2 && want[0].f && want[0].f === want[1].f) {
			var keep = want[1].e && (!want[0].e || want[1].e.pct > want[0].e.pct) ? 1 : 0;
			var move = 1 - keep;
			var other = foes.filter(function (f) { return f !== want[keep].f; })[0];
			var tie = want[0].e && want[1].e && want[0].e.pct === want[1].e.pct;
			note = 'Both wanted ' + want[keep].f + ': ' + want[keep].a + ' keeps it (' + (tie ? 'tie → left slot' : 'bigger hit') + '), ' + want[move].a + ' takes ' + other + '.';
			want[move] = {a: want[move].a, f: other, e: best[want[move].a][other]};
		}
		var box = el('div');
		if (note) box.appendChild(el('p', {class: 'dai-note', text: note}));
		var s = scoreAssign(want);
		box.appendChild(el('p', {text: 'KOs: ' + s.kos + ' · Total: ' + s.tot.toFixed(1) + '%'}));
		box.appendChild(actions(finalize(want, foes, best, S)));
		return box;
	}

	function actions(list) {
		var ul = el('ul', {class: 'dai-actions'});
		list.forEach(function (x) { ul.appendChild(el('li', {text: x.a + ' ' + x.text})); });
		return ul;
	}

	window.addEventListener('DOMContentLoaded', function () {
		datalist('dai-species-list', Object.keys(calc.SPECIES[GEN]).sort());
		datalist('dai-move-list', Object.keys(calc.MOVES[GEN]).filter(function (m) { return m !== '(No Move)'; }).sort());
		datalist('dai-item-list', calc.ITEMS[GEN].slice().sort());
		datalist('dai-ability-list', calc.ABILITIES[GEN].slice().sort());
		buildCards();
		document.getElementById('dai-run').addEventListener('click', run);
		run();
	});
})();
