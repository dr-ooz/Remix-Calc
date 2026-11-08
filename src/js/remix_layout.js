// Keep the Pokemon 1 and Pokemon 2 columns the same height while staying compact:
// each matched block gets the larger of its two natural heights.
var REMIX_MATCHED_BLOCKS = [".info-group.top", ".team-box"];

function remixMatchColumns() {
	$("#p1 .trainer-poks, #p2 .trainer-poks").addClass("team-box");
	REMIX_MATCHED_BLOCKS.forEach(function (sel) {
		var a = $("#p1 " + sel).first(), b = $("#p2 " + sel).first();
		if (!a.length || !b.length) return;
		a.css("min-height", ""); b.css("min-height", "");
		var h = Math.max(a.outerHeight(), b.outerHeight());
		a.css("min-height", h + "px"); b.css("min-height", h + "px");
	});
}

var remixMatchTimer = null;
function remixMatchSoon() {
	clearTimeout(remixMatchTimer);
	remixMatchTimer = setTimeout(remixMatchColumns, 30);
}
$(document).on("change keyup", ".poke-info", remixMatchSoon);
$(window).on("resize", remixMatchSoon);
$(function () {
	// Rows appearing/disappearing (Forme, Gender) and team sprites changing.
	// Ignore our own min-height edits so this doesn't loop.
	new MutationObserver(function (mutations) {
		for (var i = 0; i < mutations.length; i++) {
			var t = mutations[i].target;
			if (mutations[i].type === "attributes" && t.classList &&
				(t.classList.contains("team-box") || t.classList.contains("info-group"))) continue;
			remixMatchSoon();
			return;
		}
	}).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });
	setTimeout(remixMatchColumns, 100);
});

// Import/Export: one row under the import box -> [Export Mon 1] [Import Sets From PkHex] [Export Mon 2].
// The buttons keep their original click handlers; they're only moved and relabeled.
$(function () {
	setTimeout(function () {
		var exportL = $("#exportL"), exportR = $("#exportR"), importBtn = $("#import");
		if (!exportL.length || !importBtn.length) return;
		var oldRow = exportL.closest("tr");
		var row = $('<div class="import-export-row"></div>');
		exportL.addClass("export-btn").html("Export<br>Player").attr("title", "Export the Player's Pokemon set");
		exportR.addClass("export-btn").html("Export<br>Enemy").attr("title", "Export the Enemy Pokemon set");
		importBtn.addClass("import-btn").html("Import Sets<br>From PkHex");
		row.append(exportL, importBtn, exportR);
		$("#import-1_wrapper").append(row);
		oldRow.remove();
		remixMatchSoon();
	}, 0);
});

// Weather: click the active weather again to turn it off (like terrains); the "None" button is hidden.
$(document).on("mousedown", "label[for]", function () {
	var input = document.getElementById($(this).attr("for"));
	if (input && input.name === "weather") $(this).data("wasChecked", input.checked);
});
$(document).on("click", "label[for]", function (e) {
	var input = document.getElementById($(this).attr("for"));
	if (input && input.name === "weather" && $(this).data("wasChecked") && input.id !== "clear") {
		e.preventDefault();
		$(this).data("wasChecked", false);
		$("#clear").prop("checked", true).change();
	}
});

// Remix: Spikes start empty (no lit "0" button). Click 1/2/3 to set layers; click the lit one again to clear.
$(document).on("click", "label[for^='spikesL'], label[for^='spikesR']", function (e) {
	var input = $("#" + this.htmlFor);
	if (input.val() !== "0" && input.prop("checked")) {
		e.preventDefault();
		$("#" + this.htmlFor.replace(/\d$/, "0")).prop("checked", true).change();
	}
});

// Remix: nature labels. Options read "Adamant +Atk/-SpA"; the closed box shows the name at normal size
// with the stat changes in a smaller font (an overlay; the real dropdown underneath still opens on click).
$(function () {
	$(".poke-info select.nature").each(function () {
		var sel = $(this);
		sel.find("option").each(function () {
			this.text = this.text.replace(/\s*\(\+(\w+), -(\w+)\)/, " +$1/-$2");
		});
		sel.parent().css("position", "relative");
		var label = $("<span class='remix-nature-label' aria-hidden='true'></span>").insertAfter(sel);
		var draw = function () {
			var m = /^(\S+)(?: (\+\S+))?$/.exec(sel.find("option:selected").text() || "") || [];
			label.empty().append($("<span class='n-name'></span>").text(m[1] || ""))
				.append(m[2] ? $("<span class='n-stats'></span>").text(" " + m[2]) : "");
			var p = sel.position();
			label.css({ left: p.left, top: p.top, width: sel.outerWidth(), height: sel.outerHeight() });
		};
		sel.addClass("remix-nature-select").on("change", draw);
		draw();
		setTimeout(draw, 200);
	});
	$(window).on("resize", function () { $(".poke-info select.nature").trigger("change"); });
});
