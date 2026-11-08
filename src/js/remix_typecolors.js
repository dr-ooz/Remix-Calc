// Show type dropdowns as colored pills; they stay normal, editable dropdowns.
var REMIX_TYPES = ["Bug", "Dark", "Dragon", "Electric", "Fairy", "Fighting", "Fire", "Flying", "Ghost",
	"Grass", "Ground", "Ice", "Normal", "Poison", "Psychic", "Rock", "Steel", "Water"];
function remixColorTypes(scope) {
	$(scope || document).find("select.type1, select.type2, select.teraType, select.move-type").each(function () {
		var sel = $(this), t = sel.val();
		sel.removeClass(function (i, c) { return (c.match(/\btype-(pill|\w+)\b/g) || []).join(" "); });
		if (REMIX_TYPES.indexOf(t) !== -1) sel.addClass("type-pill type-" + t);
	});
}
// The calc often sets types without firing events, so recolor after any change in a panel.
$(document).on("change keyup", ".poke-info", function () {
	var panel = this;
	setTimeout(function () { remixColorTypes(panel); }, 0);
});
$(function () { setTimeout(function () { remixColorTypes(); }, 50); });

// Top move-result buttons take their move's type color (toggle: "Move colors").
var remixResultColors = true;
try { remixResultColors = localStorage.getItem("remixMoveColors") !== "off"; } catch (e) {}

function remixColorResults() {
	[["p1", "L"], ["p2", "R"]].forEach(function (side) {
		for (var i = 1; i <= 4; i++) {
			var label = $("label[for=resultMove" + side[1] + i + "]");
			var move = $("#" + side[0] + " .move" + i);
			var type = move.find(".move-type").val();
			var moveName = move.find(".select2-chosen").first().text() || move.find("select.move-selector").val() || "";
			// Remix: use the type the calc actually used (Galvanize Fake Out = Electric); italic when it changed
			var res = typeof damageResults !== "undefined" && damageResults && damageResults[side[0] === "p1" ? 0 : 1][i - 1];
			var changed = false;
			if (res && res.move && res.move.type && res.move.category !== "Status" && res.move.type !== type) {
				type = res.move.type;
				changed = true;
			}
			if (!moveName || moveName === "(No Move)") { type = null; changed = false; }
			label.removeClass(function (k, c) { return (c.match(/\b(result-typed|result-changed|type-\w+)\b/g) || []).join(" "); });
			if (remixResultColors && REMIX_TYPES.indexOf(type) !== -1) label.addClass("result-typed type-" + type);
			if (changed) label.addClass("result-changed");
		}
	});
}

function remixToggleResultColors() {
	remixResultColors = !remixResultColors;
	try { localStorage.setItem("remixMoveColors", remixResultColors ? "on" : "off"); } catch (e) {}
	$("#move-colors-toggle").html("&#127912; Move colors: " + (remixResultColors ? "On" : "Off"));
	remixColorResults();
}

$(document).on("change keyup", ".poke-info", function () { setTimeout(remixColorResults, 0); });
$(function () {
	$("#move-colors-toggle").html("&#127912; Move colors: " + (remixResultColors ? "On" : "Off"));
	setTimeout(remixColorResults, 60);
});

// Flag a Type box that doesn't match the Pokemon's own data (e.g. changed to pure Water for Soak).
function remixFlagChangedTypes(scope) {
	$(scope || document).find(".poke-info").addBack(".poke-info").each(function () {
		var pokeObj = $(this);
		var species = typeof remixCurrentSpecies === "function" ? remixCurrentSpecies(pokeObj) : "";
		var data = species && typeof pokedex !== "undefined" ? pokedex[species] : null;
		var real = data ? [data.types[0], data.types[1] || ""] : null;
		pokeObj.find("select.type1, select.type2").each(function (i) {
			var changed = !!real && ($(this).val() || "") !== real[i];
			$(this).toggleClass("type-changed", changed)
				.attr("title", changed ? "Changed from this Pokemon's normal type (" + (real[i] || "none") + ")" : "");
		});
	});
}
$(document).on("change keyup", ".poke-info", function () {
	var panel = this;
	setTimeout(function () { remixFlagChangedTypes(panel); }, 0);
});
$(function () { setTimeout(function () { remixFlagChangedTypes(); }, 80); });
