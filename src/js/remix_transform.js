// Remix: Imposter / Transform. Ticking "Transformed" (shown when the ability is Imposter) makes the calc
// treat this Pokemon as a copy of the opponent: species, types, stats (except HP), ability, stat stages and
// moves - while keeping its own HP, level, item and status. Ultra Space Dust: +25% to every stat when transformed.
function remixTransform(self, target) {
	var boost = self.item === "Ultra Space Dust" ? 1.25 : 1;
	var t = target.clone();
	t.level = self.level;
	t.item = self.item;
	t.status = self.status;
	t.toxicCounter = self.toxicCounter;
	// copied stats (own HP), fixed so they survive the calc's internal copies
	var fixed = { hp: self.rawStats.hp };
	["atk", "def", "spa", "spd", "spe"].forEach(function (s) { fixed[s] = Math.floor(target.rawStats[s] * boost); });
	t.remixRawStats = fixed;
	for (var st in fixed) { t.rawStats[st] = fixed[st]; t.stats[st] = fixed[st]; }
	t.originalCurHP = Math.min(self.originalCurHP, fixed.hp);
	t.moves = target.moves.map(function (m) { return m.clone(); });
	return t;
}

$(function () {
	$(".poke-info").each(function () {
		var info = $(this);
		var box = $("<label class='remix-transform' title='Imposter: calc as a copy of the opponent (own HP, level, item and status)'>" +
			"<input type='checkbox' class='remix-transformed' /> Transformed</label>")
			.insertAfter(info.find(".level").first()).hide();
		box.find("input").on("change", function () { setTimeout(performCalculations, 0); });
		var update = function () {
			var on = info.find(".ability").val() === "Imposter";
			box.toggle(on);
			if (!on && box.find("input").is(":checked")) box.find("input").prop("checked", false);
		};
		info.find(".ability").on("change", update);
		update();
	});
});
