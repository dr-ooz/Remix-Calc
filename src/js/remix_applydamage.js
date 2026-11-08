// Remix: "apply damage" buttons next to each move result, and a "heal to full" button by each HP box.
// Clicking a move's button opens a small picker (min / max / any roll / custom amount) and takes that
// much HP off the target.

// All possible total damage values for one move result (sorted, duplicates removed).
function remixDamageRolls(result) {
	var d = result.damage;
	var totals;
	if (typeof d === "number") totals = [d];
	else if (Array.isArray(d[0])) totals = d[0].map(function (v, i) { return v + d[1][i]; }); // 2-hit (Parental Bond etc.)
	else {
		var hits = (result.move && result.move.hits) || 1;
		totals = d.map(function (v) { return v * hits; });
	}
	return totals.filter(function (v, i, a) { return a.indexOf(v) === i; }).sort(function (a, b) { return a - b; });
}

function remixHpBox(side) { return $(side === 0 ? "#p1" : "#p2").find(".hp-group").first(); }

function remixSetHP(side, hp, delta) {
	var box = remixHpBox(side);
	var max = Number(box.find(".max-hp").text());
	hp = Math.max(0, Math.min(max, Math.round(hp)));
	box.find(".current-hp").val(hp).keyup(); // updates %, health bar and recalculates
	if (delta) remixFloatText(box, delta);
}

// Little "-123" / "+45" that drifts up from the HP box.
function remixFloatText(box, delta) {
	var el = $("<span class='remix-hp-float'></span>")
		.text((delta > 0 ? "+" : "−") + Math.abs(delta))
		.addClass(delta > 0 ? "heal" : "hurt");
	box.css("position", "relative").append(el);
	setTimeout(function () { el.addClass("go"); }, 10);
	setTimeout(function () { el.remove(); }, 1100);
}

function remixClosePicker() {
	var p = $(".remix-dmg-picker");
	p.removeClass("open");
	setTimeout(function () { p.remove(); }, 150);
	$(".remix-apply.active").removeClass("active");
}

function remixOpenPicker(btn, side, moveIndex) {
	remixClosePicker();
	if (typeof damageResults === "undefined" || !damageResults) return;
	var result = damageResults[side][moveIndex];
	var rolls = remixDamageRolls(result);
	if (!rolls.length || rolls[rolls.length - 1] <= 0) return;

	var target = 1 - side;
	var box = remixHpBox(target);
	var max = Number(box.find(".max-hp").text());
	var cur = Number(box.find(".current-hp").val());
	var pct = function (v) { return Math.round(1000 * v / max) / 10 + "%"; };
	var targetName = result.defender ? result.defender.name : "target";

	var picker = $("<div class='remix-dmg-picker'></div>");
	picker.append($("<div class='rdp-title'></div>").text(result.move.name + " → " + targetName + " (" + cur + "/" + max + " HP)"));
	var quick = $("<div class='rdp-row'></div>");
	var min = rolls[0], maxRoll = rolls[rolls.length - 1];
	var mid = rolls[Math.floor((rolls.length - 1) / 2)];
	[["Min", min], ["Mid", mid], ["Max", maxRoll]].forEach(function (q) {
		quick.append($("<button type='button' class='rdp-btn rdp-main'></button>")
			.html(q[0] + "<small>" + q[1] + " · " + pct(q[1]) + "</small>").data("dmg", q[1]));
	});
	picker.append(quick);
	if (rolls.length > 3) {
		var all = $("<div class='rdp-row rdp-rolls'></div>");
		rolls.forEach(function (v) {
			all.append($("<button type='button' class='rdp-btn rdp-roll'></button>").text(v).attr("title", pct(v)).data("dmg", v));
		});
		picker.append($("<div class='rdp-label'>Every roll</div>")).append(all);
	}
	var custom = $("<div class='rdp-row rdp-custom'><input type='number' min='0' placeholder='Custom HP' /><button type='button' class='rdp-btn'>Apply</button></div>");
	picker.append(custom);

	picker.on("click", ".rdp-btn", function (e) {
		e.stopPropagation();
		var dmg = $(this).data("dmg");
		if (dmg === undefined) dmg = Number(custom.find("input").val());
		if (!(dmg >= 0)) return;
		remixSetHP(target, cur - dmg, -Math.min(dmg, cur));
		remixClosePicker();
	});
	custom.find("input").on("keydown", function (e) {
		if (e.key === "Enter") custom.find(".rdp-btn").click();
	});
	picker.on("click", function (e) { e.stopPropagation(); });

	$("body").append(picker);
	var off = $(btn).offset();
	var left = Math.min(off.left, $(window).width() - picker.outerWidth() - 12);
	picker.css({ top: off.top + $(btn).outerHeight() + 6, left: Math.max(8, left) });
	$(btn).addClass("active");
	setTimeout(function () { picker.addClass("open"); }, 10);
}

$(function () {
	// apply-damage button next to each move result
	["L", "R"].forEach(function (s, side) {
		for (var i = 1; i <= 4; i++) {
			(function (moveIndex) {
				var span = $("#resultDamage" + s + (moveIndex + 1));
				$("<button type='button' class='remix-apply' title='Apply this damage to the target'>Apply damage</button>")
					.insertAfter(span)
					.on("click", function (e) {
						e.preventDefault(); e.stopPropagation();
						if ($(this).hasClass("active")) remixClosePicker();
						else remixOpenPicker(this, side, moveIndex);
					});
			})(i - 1);
		}
	});
	// heal-to-full button next to each HP box
	[0, 1].forEach(function (side) {
		var box = remixHpBox(side);
		$("<button type='button' class='remix-heal' title='Put this Pokémon back to full HP'>Reset HP</button>")
			.insertAfter(box.find(".percent-hp").first()[0].nextSibling || box.find(".percent-hp").first())
			.on("click", function (e) {
				e.preventDefault();
				var max = Number(box.find(".max-hp").text());
				var cur = Number(box.find(".current-hp").val());
				if (cur < max) remixSetHP(side, max, max - cur);
			});
	});
	$(document).on("click", remixClosePicker);
	$(document).on("keydown", function (e) { if (e.key === "Escape") remixClosePicker(); });
	$(window).on("resize scroll", remixClosePicker);
});
