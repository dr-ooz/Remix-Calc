// Remix: move rows.
// 1) When an ability/item/field changes a move's type, power or category (Galvanize, Petrify, Technician,
//    Photon Geyser-style "higher stat" moves...), the row shows the effective value in italics on top of
//    the box. The real box underneath still holds what you typed, and clicking still opens it.
// 2) PP counter after Crit/Z: "- 15/15 +". Click the number to refill. Remembered per set (this tab only),
//    refilled by Reset team / a new trainer, and Apply damage uses 1 PP of that move.

function remixOverlay(row, box, cls, make) {
	var el = row.children("." + cls);
	if (!el.length) el = make().addClass("remix-eff " + cls).attr({ tabindex: -1, "aria-hidden": "true" }).appendTo(row);
	var p = box.position();
	el.css({ left: p.left, top: p.top, width: box.outerWidth(), height: box.outerHeight() });
	return el;
}

function remixUpdateMoveRow(row, result) {
	var move = result && result.move;
	var damaging = move && move.category !== "Status" && move.name !== "(No Move)";
	// type
	var typeBox = row.children(".move-type");
	var typeOn = damaging && move.type && move.type !== typeBox.val();
	if (typeOn) {
		var t = remixOverlay(row, typeBox, "remix-eff-type", function () { return $("<select></select>"); });
		t.attr("class", "remix-eff remix-eff-type type-pill type-" + move.type).html("<option>" + move.type + "</option>").show();
	} else row.children(".remix-eff-type").hide();
	// power
	var bpBox = row.children(".move-bp");
	var finalBP = result && result.rawDesc && result.rawDesc.remixFinalBP;
	var bpOn = damaging && finalBP && Number(finalBP) !== Number(bpBox.val()) && !move.isZ;
	if (bpOn) remixOverlay(row, bpBox, "remix-eff-bp", function () { return $("<input readonly />"); }).val(finalBP).show();
	else row.children(".remix-eff-bp").hide();
	// category (Photon Geyser-style moves follow the higher attacking stat)
	var catBox = row.children(".move-cat");
	var catOn = damaging && move.category !== catBox.val();
	if (catOn) {
		remixOverlay(row, catBox, "remix-eff-cat", function () { return $("<select></select>"); })
			.html("<option>" + (move.category === "Physical" ? "Phys" : "Spec") + "</option>").show();
	} else row.children(".remix-eff-cat").hide();
}

function remixUpdateMoveRows(results) {
	if (!results) return;
	["#p1", "#p2"].forEach(function (p, side) {
		for (var i = 0; i < 4; i++) remixUpdateMoveRow($(p + " .move" + (i + 1)), results[side][i]);
	});
	remixRefreshPP();
	if (typeof remixColorResults === "function") remixColorResults(); // top buttons follow the calc's type
}

// ---- PP ----
var remixSavedPP = {};
try { remixSavedPP = JSON.parse(sessionStorage.getItem("remixSavedPP") || "{}"); } catch (e) {}
function remixSavePPStore() { try { sessionStorage.setItem("remixSavedPP", JSON.stringify(remixSavedPP)); } catch (e) {} }

function remixMaxPP(moveName) {
	if (!moveName || moveName === "(No Move)" || typeof GENERATION === "undefined") return 0;
	var m = GENERATION.moves.get(moveName.toLowerCase().replace(/[^a-z0-9]/g, ""));
	return (m && m.pp) || 0;
}

function remixPPKey(info, slot) {
	var setId = info.find("input.set-selector").val() || "";
	var move = info.find(".move" + (slot + 1) + " select.move-selector").val() || "";
	return setId + "|" + slot + "|" + move;
}

function remixRefreshPP() {
	["#p1", "#p2"].forEach(function (p) {
		var info = $(p);
		for (var i = 0; i < 4; i++) {
			var row = info.find(".move" + (i + 1));
			var max = remixMaxPP(row.find("select.move-selector").val());
			var box = row.children(".remix-pp");
			if (!box.length) {
				box = $("<span class='remix-pp' title='PP left. Click the number to refill.'>" +
					"<button type='button' class='pp-minus' aria-label='Use 1 PP'>−</button>" +
					"<span class='pp-val'></span>" +
					"<button type='button' class='pp-plus' aria-label='Give back 1 PP'>+</button></span>");
				var after = row.children("label.z-btn").first();
				box.insertAfter(after.length ? after : row.children("label.crit-btn").first());
			}
			// no move: keep the slot (invisible) so all four rows line up
			if (!max) { box.css("visibility", "hidden").data("key", ""); continue; }
			var key = remixPPKey(info, i);
			var cur = remixSavedPP[key] !== undefined ? remixSavedPP[key] : max;
			box.css("visibility", "visible").data("key", key).data("max", max)
				.toggleClass("used", cur < max && cur > 0).toggleClass("empty", cur <= 0);
			box.find(".pp-val").text(cur + "/" + max);
		}
	});
}

function remixChangePP(box, delta) {
	var key = box.data("key"), max = box.data("max");
	if (!key) return;
	var cur = remixSavedPP[key] !== undefined ? remixSavedPP[key] : max;
	cur = delta === "refill" ? max : Math.max(0, Math.min(max, cur + delta));
	if (cur >= max) delete remixSavedPP[key]; else remixSavedPP[key] = cur;
	remixSavePPStore();
	remixRefreshPP();
}

// Apply damage -> that move used 1 PP
function remixUsePP(side, moveIndex) {
	var box = $(side === 0 ? "#p1" : "#p2").find(".move" + (moveIndex + 1) + " .remix-pp");
	remixChangePP(box, -1);
}

// Reset team -> PP back to full for every set in that box (and the loaded Pokemon)
function remixResetPP(side, teamBox) {
	var ids = {};
	ids[$(side === 0 ? "#p1" : "#p2").find("input.set-selector").val() || ""] = true;
	if (teamBox) teamBox.find("img.trainer-pok").each(function () { ids[this.getAttribute("data-id")] = true; });
	Object.keys(remixSavedPP).forEach(function (k) { if (ids[k.split("|")[0]]) delete remixSavedPP[k]; });
	remixSavePPStore();
	remixRefreshPP();
}

$(function () {
	$(".poke-info").on("click", ".remix-pp .pp-minus", function (e) { e.preventDefault(); remixChangePP($(this).closest(".remix-pp"), -1); });
	$(".poke-info").on("click", ".remix-pp .pp-plus", function (e) { e.preventDefault(); remixChangePP($(this).closest(".remix-pp"), 1); });
	$(".poke-info").on("click", ".remix-pp .pp-val", function () { remixChangePP($(this).closest(".remix-pp"), "refill"); });
	$(window).on("resize", function () { if (typeof damageResults !== "undefined") remixUpdateMoveRows(damageResults); });
});
