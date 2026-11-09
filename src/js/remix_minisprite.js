// Shows the minisprite of the Pokemon (and forme) currently selected on each side.
// Uses the same file naming as the team list in showdown_hooks.js.
// Renamed Remix species keep using their old sprite file (remix-data/species_renames.json).
var REMIX_OLD_NAME = {};
if (typeof REMIX_SPECIES_RENAMES !== "undefined") {
	for (var remixOld in REMIX_SPECIES_RENAMES.rename) REMIX_OLD_NAME[REMIX_SPECIES_RENAMES.rename[remixOld]] = remixOld;
}
// Sprite fixes on top of the renames (name -> calc name whose sprite file to use)
var REMIX_SPRITE_SWAP = {}; // e.g. { "Name": "Old Calc Name" }
function remixSpriteFile(name) {
	name = REMIX_SPRITE_SWAP[name] || REMIX_OLD_NAME[name] || name;
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
		.off("load.fit").on("load.fit", function () { remixFitMini(pokeObj); })
		.attr("src", "./img/pokesprite/" + remixSpriteFile(species) + ".png?v=" + (typeof REMIX_SPRITE_VERSION === "undefined" ? "0" : REMIX_SPRITE_VERSION));
	if (img[0].complete) remixFitMini(pokeObj);
}

// Visible (non-transparent) part of a sprite: {x, y, w, h} in sprite pixels.
var remixMiniBoxCache = {};
function remixMiniBox(img) {
	var key = img.src;
	if (remixMiniBoxCache[key]) return remixMiniBoxCache[key];
	var w = img.naturalWidth, h = img.naturalHeight, box = { x: 0, y: 0, w: w, h: h };
	try {
		var c = document.createElement("canvas"); c.width = w; c.height = h;
		var ctx = c.getContext("2d"); ctx.drawImage(img, 0, 0);
		var d = ctx.getImageData(0, 0, w, h).data, x0 = w, y0 = h, x1 = -1, y1 = -1;
		for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
			if (d[(y * w + x) * 4 + 3] > 20) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
		}
		if (x1 >= 0) box = { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
	} catch (e) {}
	remixMiniBoxCache[key] = box;
	return box;
}

// Main sprite: same size (3x) for every Pokemon, feet on one baseline, centred in a fixed area.
// The area (right of the Type / Nature / Level boxes, left of the type chart, Type row down to the
// stat table) is measured once and again only when the window is resized, so switching Pokemon
// never re-measures or shifts anything. A sprite only shrinks (2.5x, 2x) if its visible pixels
// wouldn't fit that area; the see-through edges may overlap other things (it ignores clicks).
var REMIX_MINI_SCALES = [3, 2.5, 2];
function remixMiniArea(pokeObj) {
	var area = pokeObj.data("remixMiniArea");
	if (area) return area;
	var head = pokeObj.find(".info-group.top").first();
	var nature = pokeObj.find(".nature").first(), level = pokeObj.find(".level").first();
	var chart = pokeObj.find(".type-chart .tc-grid");
	var stats = pokeObj.find("table").filter(":visible").first();
	if (!head.length || !nature.is(":visible") || !stats.length) return null;
	var pad = 5; // room for the glow
	var left = Math.max(nature.offset().left + nature.outerWidth(), level.offset().left + level.outerWidth());
	// types: use where Type 2 normally ends (with three types they're squeezed into the same space)
	var t2 = pokeObj.find(".type2").first();
	var typeEnd = pokeObj.data("typeEnd") || (t2.is(":visible") ? t2.offset().left + t2.outerWidth() : 0);
	left = Math.max(left, typeEnd) + pad;
	var right = (chart.is(":visible") ? chart.offset().left : head.offset().left + head.outerWidth()) - pad;
	area = { L: left, R: right, T: head.offset().top + 2, B: stats.offset().top - 2 };
	pokeObj.data("remixMiniArea", area);
	return area;
}
function remixFitMini(pokeObj) {
	var img = pokeObj.find(".remix-mini"), el = img[0];
	if (!el || !el.naturalWidth || img.css("visibility") === "hidden") return;
	var A = remixMiniArea(pokeObj);
	if (!A) return;
	var box = remixMiniBox(el), nw = el.naturalWidth, nh = el.naturalHeight;
	var scale = REMIX_MINI_SCALES[REMIX_MINI_SCALES.length - 1];
	REMIX_MINI_SCALES.some(function (s) {
		if (box.w * s <= A.R - A.L && box.h * s <= A.B - A.T) { scale = s; return true; }
		return false;
	});
	var flip = pokeObj.attr("id") === "p1"; // mirrored on the player's side
	var bx = flip ? nw - box.x - box.w : box.x;
	var wantL = (A.L + A.R) / 2 - (bx + box.w / 2) * scale; // centred
	var wantT = A.B - (box.y + box.h) * scale; // feet on the bottom line
	var po = img.offsetParent().offset();
	img.css({ width: nw * scale + "px", height: nh * scale + "px", left: Math.round(wantL - po.left) + "px", top: Math.round(wantT - po.top) + "px" });
	var at = img.offset(); // correct for the panel's padding/border (measured)
	img.css({ left: Math.round(parseFloat(img.css("left")) + wantL - at.left) + "px", top: Math.round(parseFloat(img.css("top")) + wantT - at.top) + "px" });
}
var remixMiniResizeTimer = null;
$(window).on("resize", function () {
	clearTimeout(remixMiniResizeTimer);
	remixMiniResizeTimer = setTimeout(function () {
		$(".poke-info").each(function () { $(this).removeData("remixMiniArea"); remixFitMini($(this)); });
	}, 150);
});
// Measure once the page (and the type chart) has settled.
$(function () {
	setTimeout(function () { $(".poke-info").each(function () { $(this).removeData("remixMiniArea"); remixFitMini($(this)); }); }, 600);
});

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

// Item icons from the game files (tools/export_item_icons.py).
function remixItemIcon(name) {
	if (!name || typeof REMIX_ITEM_ICON_IDS === "undefined") return "";
	var key = name.normalize("NFD").toLowerCase().replace(/[^a-z0-9]/g, "");
	var id = REMIX_ITEM_ICON_IDS[key];
	return id ? "./img/items/bitem_" + id + ".png" : "";
}

// Big held-item icon to the right of the Ability / Item boxes.
function remixUpdateItemBig(pokeObj) {
	var img = pokeObj.find(".remix-item-big");
	var sel = pokeObj.find("select.item");
	var src = remixItemIcon(sel.val());
	if (!src) { img.css("visibility", "hidden").removeAttr("src"); return; }
	// 80px (2.5x), centred between the Item box and the type chart. If the gap is too
	// narrow, first trim the Ability/Item boxes a little (up to 24px), then step down.
	var boxes = pokeObj.find("select.item, select.ability");
	boxes.css("width", "");
	var chart = pokeObj.find(".type-chart:visible");
	var selRight = sel.offset().left + sel.outerWidth();
	var gapEnd = chart.length ? chart.offset().left : selRight + 96;
	var trim = Math.min(24, Math.max(0, 80 + 8 - (gapEnd - selRight)));
	if (trim) {
		boxes.each(function () { $(this).css("width", ($(this).outerWidth() - trim) + "px"); });
		selRight = sel.offset().left + sel.outerWidth();
	}
	var base = pokeObj.find(".info-selectors").offset().left;
	var gap = Math.round(gapEnd - selRight) - 6; // steps that keep pixels crisp
	var size = gap >= 80 ? 80 : gap >= 64 ? 64 : gap >= 48 ? 48 : 32;
	var left = (selRight + gapEnd) / 2 - size / 2 - base;
	img.css({ visibility: "visible", left: left + "px", width: size + "px", height: size + "px", marginTop: -size / 2 + "px" })
		.attr({ src: src, alt: sel.val(), title: sel.val() })
		.toggleClass("off", !pokeObj.find(".remix-item-on").is(":checked"));
}
$(document).on("change", ".poke-info select.item, .poke-info .remix-item-on, .poke-info .set-selector", function () {
	var pokeObj = $(this).closest(".poke-info");
	setTimeout(function () { remixUpdateItemBig(pokeObj); }, 0);
});
$(function () {
	setTimeout(function () { $(".poke-info").each(function () { remixUpdateItemBig($(this)); }); }, 0);
	$(window).on("resize", function () { $(".poke-info").each(function () { remixUpdateItemBig($(this)); }); });
});

// Header toggle, cycles: all shown -> item sprites hidden -> Pokemon + item sprites hidden -> all shown.
// Only the big sprites in the panels (team sprites always stay). Remembered in this browser.
var REMIX_SPRITE_STATES = ["shown", "items", "hidden"];
var REMIX_SPRITE_LABELS = { shown: "Shown", items: "Items hidden", hidden: "Hidden" };
var remixSpriteState = "shown";
try {
	var savedSprites = localStorage.getItem("remixMainSprites");
	if (REMIX_SPRITE_STATES.indexOf(savedSprites) !== -1) remixSpriteState = savedSprites;
} catch (e) {}
function remixShowMainSpritesState() {
	$("body").toggleClass("item-sprites-hidden", remixSpriteState !== "shown")
		.toggleClass("main-sprites-hidden", remixSpriteState === "hidden");
	$("#sprites-toggle").html("&#128444;&#65039; Sprites: " + REMIX_SPRITE_LABELS[remixSpriteState]);
}
function remixToggleMainSprites() {
	remixSpriteState = REMIX_SPRITE_STATES[(REMIX_SPRITE_STATES.indexOf(remixSpriteState) + 1) % 3];
	try { localStorage.setItem("remixMainSprites", remixSpriteState); } catch (e) {}
	remixShowMainSpritesState();
}
$(remixShowMainSpritesState);
