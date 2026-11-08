// Remix: the calc remembers each Pokemon's HP while you switch between sets mid-fight.
// - HP you set (typing, Apply damage, Reset HP) is saved for that set and restored when you come back to it.
// - Team-box sprites that aren't at full HP get a small HP bar.
// - The % box is tinted from dark red (0%) to bright green (100%).
// Saved for this browser tab only (cleared when the tab is closed).
var remixSavedHP = {};
try { remixSavedHP = JSON.parse(sessionStorage.getItem("remixSavedHP") || "{}"); } catch (e) {}

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

function remixSaveHP(pokeInfo) {
	var id = remixSetId(pokeInfo);
	if (!id) return;
	var box = pokeInfo.find(".hp-group").first();
	var max = Number(box.find(".max-hp").text());
	var cur = Number(box.find(".current-hp").val());
	if (!(max > 0)) return;
	if (cur >= max) delete remixSavedHP[id];
	else remixSavedHP[id] = { cur: cur, max: max };
	try { sessionStorage.setItem("remixSavedHP", JSON.stringify(remixSavedHP)); } catch (e) {}
	remixMarkTeamHP();
}

function remixRestoreHP(pokeInfo) {
	var saved = remixSavedHP[remixSetId(pokeInfo)];
	var box = pokeInfo.find(".hp-group").first();
	var max = Number(box.find(".max-hp").text());
	// Nothing saved = full HP (the calc would otherwise carry the previous Pokemon's % over).
	var cur = !saved ? max : saved.max === max ? saved.cur : Math.round(saved.cur / saved.max * max);
	if (Number(box.find(".current-hp").val()) !== cur) box.find(".current-hp").val(cur).keyup();
	remixTintHP(pokeInfo);
}

// Small HP bar on team-box sprites that aren't at full HP.
function remixMarkTeamHP() {
	$("img.trainer-pok").each(function () {
		var slot = $(this).parent(".team-slot, .enemy-slot");
		if (!slot.length) return;
		var saved = remixSavedHP[this.getAttribute("data-id")];
		var bar = slot.children(".remix-mini-hp");
		if (!saved) { if (bar.length) bar.remove(); return; }
		if (!bar.length) bar = $("<span class='remix-mini-hp'><i></i></span>").appendTo(slot);
		var f = saved.cur / saved.max;
		bar.attr("title", saved.cur + "/" + saved.max + " HP").children("i")
			.css({ width: Math.round(100 * f) + "%", background: remixHpColor(f) });
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
	// Save HP the user changes.
	$(".poke-info").on("keyup change", ".current-hp, .percent-hp", function () {
		remixSaveHP($(this).closest(".poke-info"));
	});
	// Loading a set resets HP to full: put the remembered HP back right after.
	$(".poke-info").on("change", "input.set-selector", function () {
		var info = $(this).closest(".poke-info");
		setTimeout(function () { remixRestoreHP(info); }, 0);
	});
	// Keep the sprite HP bars on team boxes that get redrawn.
	$(".trainer-poks").each(function () {
		new MutationObserver(function () { remixMarkTeamHP(); }).observe(this, { childList: true, subtree: true });
	});
	setTimeout(function () {
		$(".poke-info").each(function () { remixTintHP($(this)); });
		remixMarkTeamHP();
	}, 0);
});
