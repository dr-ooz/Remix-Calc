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
		exportL.addClass("export-btn").html("Export<br>Mon 1").attr("title", "Export Pokemon 1's set");
		exportR.addClass("export-btn").html("Export<br>Mon 2").attr("title", "Export Pokemon 2's set");
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
