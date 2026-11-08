// Shows the minisprite of the Pokemon (and forme) currently selected on each side.
// Uses the same file naming as the team list in showdown_hooks.js.
// Renamed Remix species keep using their old sprite file (remix-data/species_renames.json).
var REMIX_OLD_NAME = {};
if (typeof REMIX_SPECIES_RENAMES !== "undefined") {
	for (var remixOld in REMIX_SPECIES_RENAMES.rename) REMIX_OLD_NAME[REMIX_SPECIES_RENAMES.rename[remixOld]] = remixOld;
}
function remixSpriteFile(name) {
	name = REMIX_OLD_NAME[name] || name;
	return name
		.toLowerCase()
		.replace(/[ _]+/g, "-")
		.replace(/[.’':%]/g, "")
		.replace("minior-pink", "minior-red")
		.replace("dusk-mane", "dusk")
		.replace("dawn-wings", "dawn")
		.replace("-totem", "")
		.normalize("NFD").replace(/[̀-ͯ]/g, "")
		.replace(/^aegislash-shield$/, "aegislash")
		.replace(/^vivillon-pokeball$/, "vivillon-poke-ball")
		.replace(/^minior-meteor$/, "minior")
		.replace(/^starvia$/, "staravia");
}

// Faint glow in the Pokemon's own main color (white if it's mostly grey).
function remixGlowFilter(file) {
	var color = (typeof REMIX_SPRITE_COLORS !== "undefined" && REMIX_SPRITE_COLORS[file]) || "#ffffff";
	return "drop-shadow(0 0 1.5px " + color + "b0) drop-shadow(0 0 4px " + color + "60)";
}

function remixCurrentSpecies(pokeObj) {
	var forme = pokeObj.find(".forme");
	if (forme.length && forme.parent().is(":visible") && forme.val()) return forme.val();
	// The visible picker text is the real selection; the hidden value can be stale.
	var setName = pokeObj.find(".select2-chosen").first().text() || pokeObj.find(".set-selector").val() || "";
	return setName.indexOf(" (") > -1 ? setName.substring(0, setName.indexOf(" (")) : setName;
}

function remixUpdateMini(pokeObj) {
	var img = pokeObj.find(".remix-mini");
	var species = remixCurrentSpecies(pokeObj);
	if (!species) { img.css("visibility", "hidden"); return; }
	img.css("filter", remixGlowFilter(remixSpriteFile(species)));
	img.css("visibility", "visible").attr("alt", species)
		.attr("src", "./img/pokesprite/" + remixSpriteFile(species) + ".png?v=" + (typeof REMIX_SPRITE_VERSION === "undefined" ? "0" : REMIX_SPRITE_VERSION));
}

$(document).on("change", ".set-selector, .forme", function () {
	var pokeObj = $(this).closest(".poke-info");
	// Run after the calc's own handlers have updated the forme list.
	setTimeout(function () { remixUpdateMini(pokeObj); }, 0);
});
$(function () {
	setTimeout(function () { $(".poke-info").each(function () { remixUpdateMini($(this)); }); }, 0);
});

// Team lists (imported box + trainer preview) build their own sprite links:
// add the version tag so browsers don't show stale cached sprites.
function remixTagTeamSprites(root) {
	$(root).find("img.trainer-pok").each(function () {
		var src = this.getAttribute("src") || "";
		if (src.indexOf("?v=") === -1 && typeof REMIX_SPRITE_VERSION !== "undefined") {
			this.setAttribute("src", src + "?v=" + REMIX_SPRITE_VERSION);
		}
		var m = /pokesprite\/([^.?]+)\.png/.exec(this.getAttribute("src") || "");
		if (m) this.style.filter = remixGlowFilter(m[1]);
	});
}
$(function () {
	new MutationObserver(function (mutations) {
		mutations.forEach(function (m) { if (m.addedNodes.length) remixTagTeamSprites(m.target); });
	}).observe(document.body, { childList: true, subtree: true });
	remixTagTeamSprites(document);
});
