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
			var moveName = move.find(".select2-chosen").first().text() || move.find(".move-selector").val() || "";
			if (!moveName || moveName === "(No Move)") type = null;
			label.removeClass(function (k, c) { return (c.match(/\b(result-typed|type-\w+)\b/g) || []).join(" "); });
			if (remixResultColors && REMIX_TYPES.indexOf(type) !== -1) label.addClass("result-typed type-" + type);
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
