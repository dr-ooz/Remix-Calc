// Remix: the calc remembers each Pokemon's state while you switch between sets mid-fight.
// - HP, status and "item knocked off" are saved per set and restored when you come back to it.
// - Team-box sprites get a small HP bar when hurt, a status emoji, and a held-item badge.
// - The % box is tinted from dark red (0%) to bright green (100%); the status box gets an emoji + tint.
// Saved for this browser tab only (cleared when the tab is closed).
// "Dynamic HP" toggle (header): off = legacy behavior, every Pokemon you switch to starts fresh.
var remixHPMemoryOn = true;
try { remixHPMemoryOn = localStorage.getItem("remixHPMemory") !== "off"; } catch (e) {}

function remixUpdateHPMemoryButton() {
	$("#hp-memory-toggle").html("&#10084;&#65039; Dynamic HP: " + (remixHPMemoryOn ? "On" : "Off"));
}

function remixToggleHPMemory() {
	remixHPMemoryOn = !remixHPMemoryOn;
	try { localStorage.setItem("remixHPMemory", remixHPMemoryOn ? "on" : "off"); } catch (e) {}
	remixUpdateHPMemoryButton();
	remixMarkTeamHP();
}

// saved per set id: {cur, max, status, itemOff}
var remixSavedHP = {};
try { remixSavedHP = JSON.parse(sessionStorage.getItem("remixSavedHP") || "{}"); } catch (e) {}

var REMIX_STATUS_LOOK = {
	"Poisoned": { emoji: "☠️", color: "157, 78, 221" },
	"Badly Poisoned": { emoji: "☣️", color: "110, 40, 170" },
	"Burned": { emoji: "🔥", color: "235, 90, 40" },
	"Paralyzed": { emoji: "⚡", color: "235, 200, 30" },
	"Asleep": { emoji: "💤", color: "120, 140, 170" },
	"Frozen": { emoji: "🧊", color: "80, 190, 230" }
};

function remixSetId(pokeInfo) { return pokeInfo.find("input.set-selector").val() || ""; }

function remixHpColor(fraction) {
	var f = Math.max(0, Math.min(1, fraction));
	// hue 0 (red) -> 120 (green); darker at the low end
	return "hsl(" + Math.round(120 * f) + ", " + Math.round(65 + 15 * f) + "%, " + Math.round(28 + 14 * f) + "%)";
}

function remixTintHP(pokeInfo) {
	var box = pokeInfo.find(".hp-group").first();
	var max = Number(box.find(".max-hp").text()) || 1;
	var cur = Number(box.find(".current-hp").val());
	// subtle see-through tint (the health bar below already shows the strong color)
	box.find(".percent-hp").css({ background: remixHpColor(cur / max).replace("hsl(", "hsla(").replace(")", ", 0.2)") });
}

// Status box: emoji in front + faint tint so a forgotten status is easy to spot.
function remixShowStatus(pokeInfo) {
	var sel = pokeInfo.find(".status").first();
	var look = REMIX_STATUS_LOOK[sel.val()];
	pokeInfo.find(".remix-status-emoji").first().text(look ? look.emoji : "");
	sel.css("background-color", look ? "rgba(" + look.color + ", 0.22)" : "");
	remixShowItemStatusToggle(pokeInfo);
}

// Status the held item gives its holder (Flame/Toxic Orb, Charcoal Ursaring...), or "" if none.
function remixItemAutoStatus(pokeInfo) {
	if (!pokeInfo.find(".remix-item-on").is(":checked")) return "";
	var item = pokeInfo.find(".item").first().val();
	if (item === "Flame Orb") return "Burned";
	if (item === "Toxic Orb") return "Badly Poisoned";
	return typeof remixItemSelfStatus === "function" ? remixItemSelfStatus("#" + pokeInfo.attr("id"), item) : "";
}

// Small toggle next to Status, shown only when the item statuses its holder:
// calc the turn before the orb triggers (off) or after (on).
function remixShowItemStatusToggle(pokeInfo) {
	// The old "Item" tick box is gone: unticking the held item already turns its auto-status off.
	pokeInfo.find(".remix-item-status").remove();
	setTimeout(function () { remixLayoutStatusRow(pokeInfo); }, 0);
}

// Status row ends exactly where the Reset HP button ends: the status box (and the toxic
// 1/16 counter when shown) share the space; the rest of the line is kept for the type chart.
function remixLayoutStatusRow(pokeInfo) {
	var sel = pokeInfo.find(".status").first();
	var reset = pokeInfo.find(".remix-heal").first();
	if (!sel.length || !reset.length || !reset.is(":visible")) return;
	var right = reset.offset().left + reset.outerWidth();
	var tox = sel.siblings(".toxic-counter");
	var toxOn = tox.length && tox.css("display") !== "none" && !tox.hasClass("hide-forced");
	sel.css("width", "");
	var toxW = 56; // wide enough for "1/16" etc.
	if (toxOn) tox.css({ width: toxW + "px", "margin-left": "0" });
	var w = right - sel.offset().left - (toxOn ? toxW + 5 : 0); // +5: the space between the boxes
	if (w > 60) sel.css("width", Math.floor(w) + "px");
}

// Reset a whole team box (0 = your team, 1 = enemy): full HP, Healthy, items back on, nothing fainted.
function remixResetTeam(side) {
	var info = $(side === 0 ? "#p1" : "#p2");
	var box = side === 0 ? $(".player-poks").first() : $(".trainer-poks").last();
	box.find("img.trainer-pok").each(function () { delete remixSavedHP[this.getAttribute("data-id")]; });
	delete remixSavedHP[remixSetId(info)];
	try { sessionStorage.setItem("remixSavedHP", JSON.stringify(remixSavedHP)); } catch (e) {}
	info.find(".remix-item-on").prop("checked", true).change();
	info.find(".remix-ability-on").prop("checked", true).change();
	if (info.find(".status").val() !== "Healthy") info.find(".status").val("Healthy").change();
	var hp = info.find(".hp-group").first();
	hp.find(".current-hp").val(hp.find(".max-hp").text()).keyup();
	if (side === 1 && typeof remixClearFainted === "function") remixClearFainted();
	if (typeof remixResetPP === "function") remixResetPP(side, box);
	remixMarkTeamHP();
}

// Item / ability boxes: greyed out while their "active" tick is off.
function remixShowItemOn(pokeInfo) {
	pokeInfo.find(".item").first().toggleClass("remix-item-off", !pokeInfo.find(".remix-item-on").is(":checked"));
	pokeInfo.find(".ability").first().toggleClass("remix-item-off", !pokeInfo.find(".remix-ability-on").is(":checked"));
}

function remixSaveHP(pokeInfo) {
	var id = remixSetId(pokeInfo);
	if (!id || !remixHPMemoryOn) return;
	// Only save for the set that has finished loading (loading a set fires change events itself).
	if (pokeInfo.data("remixActiveId") !== id) return;
	var box = pokeInfo.find(".hp-group").first();
	var max = Number(box.find(".max-hp").text());
	var cur = Number(box.find(".current-hp").val());
	if (!(max > 0)) return;
	var status = pokeInfo.find(".status").first().val() || "Healthy";
	var itemOff = !pokeInfo.find(".remix-item-on").is(":checked");
	if (cur >= max && status === "Healthy" && !itemOff) delete remixSavedHP[id];
	else remixSavedHP[id] = { cur: Math.min(cur, max), max: max, status: status, itemOff: itemOff };
	try { sessionStorage.setItem("remixSavedHP", JSON.stringify(remixSavedHP)); } catch (e) {}
	remixMarkTeamHP();
}

function remixRestoreHP(pokeInfo) {
	var saved = remixHPMemoryOn ? remixSavedHP[remixSetId(pokeInfo)] : null;
	var box = pokeInfo.find(".hp-group").first();
	var max = Number(box.find(".max-hp").text());
	// Nothing saved = full HP (the calc would otherwise carry the previous Pokemon's % over).
	var cur = !saved ? max : saved.max === max ? saved.cur : Math.round(saved.cur / saved.max * max);
	var itemBox = pokeInfo.find(".remix-item-on");
	var wantItemOn = !(saved && saved.itemOff);
	if (itemBox.is(":checked") !== wantItemOn) itemBox.prop("checked", wantItemOn).change();
	// A suppressed ability (Gastro Acid, Worry Seed...) never lingers: switching Pokemon turns it back on.
	var abilityBox = pokeInfo.find(".remix-ability-on");
	if (!abilityBox.is(":checked")) abilityBox.prop("checked", true).change();
	if (saved && saved.status && pokeInfo.find(".status").val() !== saved.status) {
		pokeInfo.find(".status").val(saved.status).change();
	}
	if (Number(box.find(".current-hp").val()) !== cur) box.find(".current-hp").val(cur).keyup();
	pokeInfo.data("remixActiveId", remixSetId(pokeInfo));
	remixTintHP(pokeInfo);
	remixShowStatus(pokeInfo);
	remixShowItemOn(pokeInfo);
}

// Held item of a set in a team box (from the set data).
function remixSetItem(dataId) {
	var species = dataId.split(" (")[0];
	var setName = dataId.substring(dataId.indexOf("(") + 1, dataId.lastIndexOf(")"));
	var set = typeof setdex !== "undefined" && setdex[species] && setdex[species][setName];
	return set && set.item ? set.item : "";
}

// Team-box sprite markers: HP bar when hurt, status emoji, held-item badge.
function remixMarkTeamHP() {
	$("img.trainer-pok").each(function () {
		var slot = $(this).parent(".team-slot, .enemy-slot");
		if (!slot.length) return;
		var id = this.getAttribute("data-id");
		var saved = remixHPMemoryOn ? remixSavedHP[id] : null;
		// HP bar
		var bar = slot.children(".remix-mini-hp");
		if (!saved || saved.cur >= saved.max) { if (bar.length) bar.remove(); } else {
			if (!bar.length) bar = $("<span class='remix-mini-hp'><i></i></span>").appendTo(slot);
			var f = saved.cur / saved.max;
			bar.attr("title", saved.cur + "/" + saved.max + " HP").children("i")
				.css({ width: Math.round(100 * f) + "%", background: remixHpColor(f) });
		}
		// status emoji
		var look = saved && REMIX_STATUS_LOOK[saved.status];
		var st = slot.children(".remix-mini-status");
		if (!look) { if (st.length) st.remove(); } else {
			if (!st.length) st = $("<span class='remix-mini-status'></span>").appendTo(slot);
			if (st.text() !== look.emoji) st.text(look.emoji);
			st.attr("title", saved.status);
		}
		// held-item badge: the item's own icon at its real size
		var item = remixSetItem(id);
		var off = saved && saved.itemOff;
		var icon = typeof remixItemIcon === "function" ? remixItemIcon(item) : "";
		var badge = slot.children(".remix-mini-item");
		if (!item || !icon) { if (badge.length) badge.remove(); } else {
			if (!badge.length) badge = $("<img class='remix-mini-item' alt='' />").appendTo(slot);
			if (badge.attr("src") !== icon) badge.attr("src", icon);
			badge.toggleClass("off", !!off).attr({ alt: item, title: item + (off ? " (knocked off / used)" : "") });
		}
	});
}

$(function () {
	// Re-tint whenever the calc redraws a health bar.
	if (typeof drawHealthBar === "function") {
		var originalDraw = drawHealthBar;
		drawHealthBar = function (poke, max, current) {
			originalDraw(poke, max, current);
			var info = $(poke).closest(".poke-info");
			if (info.length) remixTintHP(info);
		};
	}
	// Save what the user changes.
	$(".poke-info").on("keyup change", ".current-hp, .percent-hp", function () {
		remixSaveHP($(this).closest(".poke-info"));
	});
	$(".poke-info").on("change", ".status", function () {
		var info = $(this).closest(".poke-info");
		remixShowStatus(info);
		remixSaveHP(info);
	});
	$(".poke-info").on("change", ".remix-item-on, .remix-ability-on", function () {
		var info = $(this).closest(".poke-info");
		remixShowItemOn(info);
		remixSaveHP(info);
	});
	// Picking a new item / ability means it's active again.
	$(".poke-info").on("change", ".item", function () {
		var info = $(this).closest(".poke-info");
		var box = info.find(".remix-item-on");
		if (!box.is(":checked")) box.prop("checked", true).change();
		setTimeout(function () { remixShowItemStatusToggle(info); }, 0);
	});
	$(".poke-info").on("change", ".ability", function () {
		var box = $(this).closest(".poke-info").find(".remix-ability-on");
		if (!box.is(":checked")) box.prop("checked", true).change();
	});
	// Loading a set resets HP/status: put the remembered state back right after.
	$(".poke-info").on("change", "input.set-selector", function () {
		var info = $(this).closest(".poke-info");
		setTimeout(function () { remixRestoreHP(info); }, 0);
	});
	// Keep the sprite markers on team boxes that get redrawn.
	$(".trainer-poks").each(function () {
		new MutationObserver(function () { remixMarkTeamHP(); }).observe(this, { childList: true, subtree: true });
	});
	remixUpdateHPMemoryButton();
	// "Reset team" under each team box (yours bottom-left, the enemy's bottom-right)
	setTimeout(function () {
		[[0, $(".player-poks").first().closest(".trainer-poks")], [1, $(".trainer-poks").last()]].forEach(function (pair) {
			if (!pair[1].length) return;
			$("<div class='remix-reset-row " + (pair[0] === 0 ? "left" : "right") + "'>" +
				"<button type='button' class='remix-reset-team' title='Full HP, no status and items back on for every Pok\u00e9mon in this box'>" +
				"\u21BA Reset team</button></div>")
				.insertAfter(pair[1])
				.on("click", "button", function (e) { e.preventDefault(); remixResetTeam(pair[0]); });
		});
	}, 0);
	setTimeout(function () {
		$(".poke-info").each(function () {
			$(this).data("remixActiveId", remixSetId($(this)));
			remixTintHP($(this)); remixShowStatus($(this)); remixShowItemOn($(this));
		});
		remixMarkTeamHP();
	}, 0);
});

// ---- Remix: effective stat next to every stat (boosts, burn, paralysis...) ----
// Bold + faint green when higher than the plain stat, bold + faint red when lower.
var REMIX_STAT_ROWS = { at: "atk", df: "def", sa: "spa", sd: "spd", sp: "spe" };
function remixShowEffectiveStats(pokeInfo, pokemon) {
	if (!pokemon || !pokemon.stats) return;
	for (var row in REMIX_STAT_ROWS) {
		var stat = REMIX_STAT_ROWS[row];
		var tr = pokeInfo.find("." + row).first();
		if (!tr.length) continue;
		var cell = tr.find(".totalMod");
		if (!cell.length) cell = $("<span class='totalMod'></span>").appendTo($("<td></td>").appendTo(tr));
		var value = pokemon.stats[stat];
		// burn halves physical damage (shown on Attack), unless the ability ignores it
		if (stat === "atk" && pokemon.status === "brn" &&
			!pokemon.hasAbility("Guts", "Marvel Scale", "Quick Feet", "Flare Heal")) value = Math.floor(value / 2);
		// Remix item stat boosts (Ultra Space Dust Ditto, Light Ball Pikachu, weather/terrain items...)
		if (stat !== "spe" && pokemon.remixItemFx) {
			var weather = $("input:radio[name='weather']:checked").val() || "";
			var terrain = $("input:checkbox[name='terrain']:checked").val() || "";
			pokemon.remixItemFx().stats.forEach(function (st) {
				if (REMIX_STAT_ROWS[st.stat] !== stat) return;
				var ok = (!st.weather && !st.terrain) ||
					(st.weather && st.weather.indexOf(weather) !== -1) || (st.terrain && st.terrain.indexOf(terrain) !== -1);
				if (ok) value = Math.floor(value * st.mult);
			});
		}
		var base = Number(tr.find(".total").text()) || pokemon.rawStats[stat];
		// Only shown when something (stage, item, status, field, ability...) changes the stat;
		// hidden otherwise, keeping its space so the rows don't shift.
		cell.text(value)
			.toggleClass("remix-stat-up", value > base)
			.toggleClass("remix-stat-down", value < base)
			.css("visibility", value === base ? "hidden" : "visible");
	}
}
