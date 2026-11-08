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
	var abilityOff = !pokeInfo.find(".remix-ability-on").is(":checked");
	if (cur >= max && status === "Healthy" && !itemOff && !abilityOff) delete remixSavedHP[id];
	else remixSavedHP[id] = { cur: Math.min(cur, max), max: max, status: status, itemOff: itemOff, abilityOff: abilityOff };
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
	var abilityBox = pokeInfo.find(".remix-ability-on");
	var wantAbilityOn = !(saved && saved.abilityOff);
	if (abilityBox.is(":checked") !== wantAbilityOn) abilityBox.prop("checked", wantAbilityOn).change();
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
		// held-item badge (placeholder icon until real item sprites are in)
		var item = remixSetItem(id);
		var off = saved && saved.itemOff;
		var badge = slot.children(".remix-mini-item");
		if (!item) { if (badge.length) badge.remove(); } else {
			if (!badge.length) badge = $("<span class='remix-mini-item'></span>").appendTo(slot);
			badge.toggleClass("off", !!off).attr("title", item + (off ? " (knocked off / used)" : ""));
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
		var box = $(this).closest(".poke-info").find(".remix-item-on");
		if (!box.is(":checked")) box.prop("checked", true).change();
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
		var base = Number(tr.find(".total").text()) || pokemon.rawStats[stat];
		cell.text(value)
			.toggleClass("remix-stat-up", value > base)
			.toggleClass("remix-stat-down", value < base);
	}
}
