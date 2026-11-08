// Remix: mark the enemy trainer's Pokemon as fainted in the team preview.
// Hover a sprite -> x greys it out ("fainted"); click again to bring it back.
// Remembered while you click around the same trainer's sets; cleared when the trainer changes.
var remixFainted = {};
var remixFaintTrainer = null;
var remixClearFainted = null; // set once the enemy box exists

function remixCurrentTrainer() {
	try { return typeof get_current_trainer === "function" ? get_current_trainer() : ""; } catch (e) { return ""; }
}

$(function () {
	setTimeout(function () {
		var box = $(".trainer-poks").last();
		if (!box.length) return;

		function refresh() {
			var trainer = remixCurrentTrainer();
			if (trainer !== remixFaintTrainer) {
				// New boss fight: your team starts fresh (only on a real switch, not the first load)
				if (remixFaintTrainer !== null && trainer && typeof remixResetTeam === "function") {
					setTimeout(function () { remixResetTeam(0); }, 0);
				}
				remixFaintTrainer = trainer;
				remixFainted = {};
			}
			box.find("img.trainer-pok.right-side").each(function () {
				var img = $(this);
				if (!img.parent().hasClass("enemy-slot")) {
					var slot = $('<span class="enemy-slot"></span>');
					img.before(slot);
					slot.append(img).append('<button type="button" class="enemy-faint" title="Mark as fainted">&times;</button>');
				}
				var slot2 = img.parent();
				var fainted = !!remixFainted[img.attr("data-id")];
				slot2.toggleClass("fainted", fainted);
				slot2.find(".enemy-faint").html(fainted ? "&#8634;" : "&times;")
					.attr("title", fainted ? "Bring back (not fainted)" : "Mark as fainted");
			});
			// same auto-zoom as the player's box (remix_teamzoom.js)
			var count = box.find("img.trainer-pok.right-side").length;
			if (typeof remixPerRow === "function" && count) {
				box[0].style.setProperty("--per-row", remixPerRow(count, box.width() || 400));
			}
		}
		new MutationObserver(function (records) {
			// only react to sprites being added/replaced, not to our own wrapping
			if (records.some(function (r) { return r.target === box[0]; })) refresh();
		}).observe(box[0], { childList: true });
		refresh();

		remixClearFainted = function () { remixFainted = {}; refresh(); };

		box.on("click", ".enemy-faint", function (e) {
			e.preventDefault();
			e.stopPropagation();
			var id = $(this).siblings("img").attr("data-id");
			if (remixFainted[id]) delete remixFainted[id];
			else remixFainted[id] = true;
			refresh();
		});
	}, 0);
});
