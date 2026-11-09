// Edits to an imported set (item, ability, nature, level, EVs, IVs, moves) save back
// to that set, so they stick when you switch Pokemon or reload the page.
// Only imported/custom sets are touched; built-in sets are never changed.
var REMIX_SAVE_STATS = ["hp", "at", "df", "sa", "sd", "sp"];

function remixSaveSetRef(pokeObj) {
	var id = pokeObj.find("input.set-selector").val() || "";
	var open = id.indexOf(" (");
	if (open < 0) return null;
	return { species: id.substring(0, open), setName: id.substring(open + 2, id.lastIndexOf(")")) };
}

function remixSaveSet(pokeObj) {
	var ref = pokeObj.data("remixSaveRef");
	var now = remixSaveSetRef(pokeObj);
	// The panel changed to another set before the save ran: drop it.
	if (!ref || !now || ref.species !== now.species || ref.setName !== now.setName) return;
	var set = typeof setdex !== "undefined" && setdex[ref.species] && setdex[ref.species][ref.setName];
	if (!set || !set.isCustomSet) return;

	var saved = $.extend(true, {}, set);
	saved.level = ~~pokeObj.find(".level").val() || saved.level;
	saved.nature = pokeObj.find(".nature").val() || saved.nature;
	var ability = pokeObj.find("select.ability").val();
	if (ability !== undefined) saved.ability = ability;
	saved.item = pokeObj.find("select.item").val() || "";
	var tera = pokeObj.find(".teraType");
	if (tera.length && tera.is(":visible") && tera.val()) saved.teraType = tera.val();
	saved.evs = {}; saved.ivs = {};
	REMIX_SAVE_STATS.forEach(function (s) {
		var row = pokeObj.find("." + s);
		if (row.find(".evs").length) saved.evs[s] = ~~row.find(".evs").val();
		if (row.find(".ivs").length) saved.ivs[s] = ~~row.find(".ivs").val();
	});
	saved.moves = [];
	for (var i = 1; i <= 4; i++) {
		var m = pokeObj.find(".move" + i + " select.move-selector").val();
		if (m && m !== "(No Move)") saved.moves.push(m);
	}

	var customsets = {};
	try { customsets = JSON.parse(localStorage.customsets || "{}"); } catch (e) {}
	if (!customsets[ref.species]) customsets[ref.species] = {};
	customsets[ref.species][ref.setName] = saved;
	if (typeof updateDex === "function") updateDex(customsets);
	else localStorage.customsets = JSON.stringify(customsets);
	if (typeof remixMarkTeamHP === "function") remixMarkTeamHP();
	if (typeof remixUpdateDoublesAI === "function") remixUpdateDoublesAI(); // saved set changed
}

function remixIdKey(pokeObj) {
	var id = remixSaveSetRef(pokeObj);
	return id ? id.species + "|" + id.setName : "";
}

// Field changes right after the shown set changed are the calc loading it, not edits.
function remixStartLoading(pokeObj) {
	clearTimeout(pokeObj.data("remixSaveTimer"));
	pokeObj.data({ remixLoading: true, remixLastSet: remixIdKey(pokeObj) });
	clearTimeout(pokeObj.data("remixLoadTimer"));
	pokeObj.data("remixLoadTimer", setTimeout(function () {
		pokeObj.data({ remixLoading: false, remixLastSet: remixIdKey(pokeObj) });
	}, 600));
}

function remixQueueSave(pokeObj) {
	if (pokeObj.data("remixLastSet") !== remixIdKey(pokeObj)) { remixStartLoading(pokeObj); return; }
	if (pokeObj.data("remixLoading")) return;
	pokeObj.data("remixSaveRef", remixSaveSetRef(pokeObj));
	clearTimeout(pokeObj.data("remixSaveTimer"));
	pokeObj.data("remixSaveTimer", setTimeout(function () { remixSaveSet(pokeObj); }, 400));
}

$(function () {
	$(".poke-info").each(function () { $(this).data("remixLastSet", remixIdKey($(this))); });
	$(".poke-info").on("change", "input.set-selector", function () {
		remixStartLoading($(this).closest(".poke-info"));
	});
	$(".poke-info").on("change keyup",
		".level, .nature, select.ability, select.item, .evs, .ivs, select.move-selector, .teraType",
		function () { remixQueueSave($(this).closest(".poke-info")); });
});
