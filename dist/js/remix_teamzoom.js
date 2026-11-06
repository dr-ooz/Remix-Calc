// Imported-team box ("My Box"):
// - sprites shrink automatically as the team grows (6 or fewer = 3 per row);
// - hovering a Pokemon shows an x that removes that imported set.
// Both team boxes have this fixed height (two rows of 3 = 6 Pokemon).
var REMIX_TEAM_BOX_HEIGHT = 206;

// Fewest sprites per row that still fits the whole team in the box without scrolling.
function remixPerRow(count, width) {
	var options = [3, 4, 5, 6, 7, 8, 10, 12];
	for (var k = 0; k < options.length; k++) {
		var n = options[k];
		var rowHeight = (width / n - 10) * 0.75 + 10; // sprites are 4:3, 5px margin around each
		if (Math.ceil(count / n) * rowHeight <= REMIX_TEAM_BOX_HEIGHT) return n;
	}
	return options[options.length - 1];
}

// Saved slot order for the imported team (per viewer). New imports go to the end.
function remixSaveTeamOrder(box) {
	var order = box.find("img.trainer-pok").map(function () { return this.getAttribute("data-id"); }).get();
	try { localStorage.setItem("remixTeamOrder", JSON.stringify(order)); } catch (e) {}
}

function remixApplyTeamOrder(box) {
	var order = [];
	try { order = JSON.parse(localStorage.getItem("remixTeamOrder") || "[]"); } catch (e) {}
	if (!order.length) return;
	var slots = box.children(".team-slot").toArray();
	var rank = function (slot) {
		var i = order.indexOf($(slot).find("img").attr("data-id"));
		return i === -1 ? order.length + slots.indexOf(slot) : i;
	};
	var sorted = slots.slice().sort(function (a, b) { return rank(a) - rank(b); });
	// Only touch the DOM when the order actually changes (avoids re-triggering the observer).
	if (sorted.some(function (s, i) { return s !== slots[i]; })) box.append(sorted);
}

function remixRemoveImportedSet(dataId) {
	var species = dataId.split(" (")[0];
	var setName = dataId.substring(dataId.indexOf("(") + 1, dataId.lastIndexOf(")"));
	var names = species === "Aegislash" ? [species, "Aegislash-Shield"] : [species];
	var customsets = {};
	try { customsets = JSON.parse(localStorage.customsets || "{}"); } catch (e) {}
	names.forEach(function (name) {
		if (customsets[name]) {
			delete customsets[name][setName];
			if ($.isEmptyObject(customsets[name])) delete customsets[name];
		}
		["SETDEX_SV", "SETDEX_SS", "SETDEX_SM", "SETDEX_XY", "SETDEX_BW", "SETDEX_DPP",
			"SETDEX_ADV", "SETDEX_GSC", "SETDEX_RBY"].forEach(function (dex) {
			if (window[dex] && window[dex][name]) delete window[dex][name][setName];
		});
	});
	try { localStorage.customsets = JSON.stringify(customsets); } catch (e) {}
	if (typeof get_box === "function") get_box();
}

$(function () {
	setTimeout(function () {
		var box = $(".player-poks").first();
		if (!box.length) return;
		var lastCount = -1;
		// Wrap each sprite so it can carry a remove button; re-pick the zoom when the team size changes.
		function refresh() {
			box.children("img.trainer-pok").each(function () {
				var img = $(this).attr("draggable", "false");
				var slot = $('<span class="team-slot" draggable="true" title="Drag to reorder"></span>');
				img.before(slot);
				slot.append(img).append('<button type="button" class="team-remove" title="Remove from imported sets">&times;</button>');
			});
			remixApplyTeamOrder(box);
			var count = box.find("img.trainer-pok").length;
			if (count !== lastCount) {
				lastCount = count;
				box[0].style.setProperty("--per-row", remixPerRow(count, box.width() || 400));
			}
		}
		new MutationObserver(refresh).observe(box[0], { childList: true });
		box.on("click", ".team-remove", function (e) {
			e.stopPropagation();
			remixRemoveImportedSet($(this).siblings("img").attr("data-id"));
		});

		// Drag a Pokemon onto another slot to move it there.
		var dragged = null;
		box.on("dragstart", ".team-slot", function (e) {
			dragged = this;
			$(this).addClass("dragging");
			e.originalEvent.dataTransfer.effectAllowed = "move";
			e.originalEvent.dataTransfer.setData("text/plain", "");
		});
		box.on("dragend", ".team-slot", function () {
			$(this).removeClass("dragging");
			box.find(".drop-target").removeClass("drop-target");
			dragged = null;
		});
		box.on("dragover", ".team-slot", function (e) {
			if (!dragged || dragged === this) return;
			e.preventDefault();
			box.find(".drop-target").not(this).removeClass("drop-target");
			$(this).addClass("drop-target");
		});
		box.on("drop", ".team-slot", function (e) {
			e.preventDefault();
			if (!dragged || dragged === this) return;
			var slots = box.children(".team-slot").toArray();
			// Moving forward lands after the target, moving back lands before it.
			if (slots.indexOf(dragged) < slots.indexOf(this)) $(this).after(dragged); else $(this).before(dragged);
			$(this).removeClass("drop-target");
			remixSaveTeamOrder(box);
		});
		refresh();
	}, 0);
});
