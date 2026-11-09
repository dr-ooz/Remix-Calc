// "Residual" row above Current HP: every end-of-turn heal / chip on this Pokemon right now
// (weather, terrain, items, Aqua Ring, Ingrain, Leech Seed, status, binding...), in the game's
// end-of-turn order, with the HP after each step and the net change per turn.
// Values come from the engine (getRemixResidual in calc/src/desc.ts).
function remixShowResidual(pokeInfo, pokemon, foe, field) {
	var row = pokeInfo.find(".remix-residual");
	if (!row.length) {
		var hpRow = pokeInfo.find(".current-hp").first().closest("div");
		row = $("<div class='remix-residual'></div>").insertBefore(hpRow);
	}
	var list = [];
	try {
		if (typeof getRemixResidual === "function" && pokemon && foe && field) {
			list = getRemixResidual(calc.Generations.get(gen), pokemon, foe, field);
		}
	} catch (e) { list = []; }
	if (!list.length) {
		// nothing applies: no box at all
		row.hide().empty().attr("title", "");
		return;
	}
	var max = pokemon.maxHP(), hp = pokemon.curHP(), net = 0, steps = [], faint = "";
	list.forEach(function (r) {
		net += r.hp;
		hp = Math.max(0, Math.min(max, hp + r.hp));
		var sign = r.hp > 0 ? "+" : "−";
		steps.push("<span class='rr-step " + (r.hp > 0 ? "rr-heal" : "rr-chip") + "' title='HP after this: " + hp + "/" + max + "'>" +
			r.name + " " + sign + Math.abs(r.hp) + "</span>");
		if (hp === 0 && !faint) faint = r.name;
	});
	var pct = Math.round(1000 * net / max) / 10;
	var total = "<b class='" + (net > 0 ? "rr-heal" : net < 0 ? "rr-chip" : "") + "'>" + (net > 0 ? "+" : net < 0 ? "−" : "±") +
		Math.abs(net) + " HP/turn (" + (net > 0 ? "+" : net < 0 ? "−" : "") + Math.abs(pct) + "%)</b>";
	var end = faint ? " <span class='rr-faint'>faints at " + faint + "</span>" : " <span class='rr-end'>→ " + hp + "/" + max + "</span>";
	row.html("<span class='rr-label'>End of turn:</span> " + total + " <span class='rr-steps'>" + steps.join(" › ") + "</span>" + end)
		.show();
	row.attr("title", row.text() + " | Order: weather, Grassy Terrain, held item, Aqua Ring, Ingrain, Leech Seed, poison, burn, binding, Salt Cure.");
	remixSizeResidual(pokeInfo, row);
}

// Same width as the Current HP row (ends where Reset HP ends); grows to as many lines as it needs.
function remixSizeResidual(pokeInfo, row) {
	var reset = pokeInfo.find(".remix-heal").first();
	if (reset.is(":visible")) row.css("width", Math.floor(reset.offset().left + reset.outerWidth() - row.offset().left) + "px");
}
