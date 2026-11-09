// Per-Pokemon type defense chart, worked out by the calc's own damage engine, so every type,
// Remix type change, ability and item effect the engine knows about is included.
// For each attacking type: damage to this Pokemon / damage to a typeless copy with no ability
// or item (same stats, same attacker, same field, so everything else cancels out).
// Entries changed by the ability or item are shown in italics with a small mark.
var REMIX_TC_TYPES = [
	["Normal", "NOR", "#afaf9f"], ["Fire", "FIR", "#f56a00"], ["Water", "WAT", "#2480da"],
	["Electric", "ELE", "#f4cf2c"], ["Grass", "GRA", "#65b12f"], ["Ice", "ICE", "#80d9f2"],
	["Fighting", "FIG", "#b93401"], ["Poison", "POI", "#9a2b6c"], ["Ground", "GRO", "#df981c"],
	["Flying", "FLY", "#758be3"], ["Psychic", "PSY", "#e8649c"], ["Bug", "BUG", "#afbb47"],
	["Rock", "ROC", "#cfbb81"], ["Ghost", "GHO", "#605cb6"], ["Dragon", "DRA", "#4b4dca"],
	["Dark", "DAR", "#67493c"], ["Steel", "STE", "#9190a3"], ["Fairy", "FAI", "#e79be7"]
];

var remixTCHidden = false;
try { remixTCHidden = localStorage.getItem("remixTypeChart") === "hidden"; } catch (e) {}

$(function () {
	$("#p1, #p2").each(function () {
		var chart = $('<div class="type-chart"><div class="tc-title">Type defenses</div><div class="tc-grid"></div>' +
			'<button type="button" class="tc-toggle"></button></div>');
		REMIX_TC_TYPES.forEach(function (t) {
			chart.find(".tc-grid").append('<div class="tc-cell" data-type="' + t[0] + '"><span class="tc-tile" style="background:' +
				t[2] + '">' + t[1] + '</span><span class="tc-val">&ndash;</span></div>');
		});
		$(this).append(chart);
	});
	$(document).on("click", ".tc-toggle", function () {
		remixTCHidden = !remixTCHidden;
		try { localStorage.setItem("remixTypeChart", remixTCHidden ? "hidden" : "shown"); } catch (e) {}
		remixShowTCState();
		if (!remixTCHidden && typeof performCalculations === "function") performCalculations(); // values skipped while hidden
		if (typeof remixMatchSoon === "function") remixMatchSoon();
	});
	remixShowTCState();
});

// Fit the chart (title to Hide button) between the Type row and the Health bar, centred:
// it fills that space, with the rows spread evenly.
function remixLayoutTypeChart(info) {
	var chart = info.find(".type-chart"), grid = chart.find(".tc-grid");
	var typeRow = info.find(".type1").first(), health = info.find(".health-label").first();
	if (!grid.length || !typeRow.is(":visible") || !health.length || remixTCHidden) return;
	var top = typeRow.offset().top, bottom = health.offset().top - 6;
	// Put the chart's top edge at page position y (measured, so panel padding/borders don't matter).
	var moveTo = function (y) {
		var cur = parseFloat(chart.css("top")) || 0;
		chart.css("top", Math.round(cur + y - chart.offset().top) + "px");
	};
	var cells = grid.children(".tc-cell");
	var rows = Math.ceil(cells.length / 2), cellH = cells.first().outerHeight();
	var other = chart.outerHeight() - grid.outerHeight(); // title + Hide button
	var gap = Math.floor((bottom - top - other - rows * cellH) / (rows - 1));
	grid.css("row-gap", Math.max(2, gap) + "px");
	// centred in the space (any rounding leftover split above and below)
	moveTo(top + Math.max(0, (bottom - top) - chart.outerHeight()) / 2);
}
$(window).on("resize", function () { $("#p1, #p2").each(function () { remixLayoutTypeChart($(this)); }); });

function remixShowTCState() {
	$("body").toggleClass("tc-hidden", remixTCHidden);
	$(".tc-toggle").text(remixTCHidden ? "Show type chart" : "Hide type chart");
}

// ---- values ----
var remixTCAttacker = null;
function remixTCGetAttacker() {
	if (!remixTCAttacker) {
		remixTCAttacker = new calc.Pokemon(gen, "Mew", {
			level: 100, nature: "Serious", evs: {atk: 252},
			overrides: {types: ["???"]} // no STAB on anything
		});
	}
	return remixTCAttacker;
}

function remixTCDamage(attacker, defender, type, field) {
	// Physical, non-contact, no special flags, so only the type matters.
	var move = new calc.Move(gen, "Rock Tomb", {overrides: {type: type, basePower: 200}});
	try {
		var r = calc.calculate(gen, attacker, defender, move, field);
		return r.range()[1];
	} catch (e) { return NaN; }
}

function remixTCVariant(defender, opts) {
	var d = defender.clone();
	// not undefined: the engine refills a blank ability with the species default (e.g. Thick Fat)
	if (opts.noAbility) d.ability = "(No Ability)";
	if (opts.noItem) d.item = undefined;
	if (opts.typeless) {
		// The engine clones the Pokemon and takes the types from .species, so change them there too.
		// Two entries: the engine merges type lists by position, so ["???"] would keep a 2nd type.
		d.species = $.extend({}, d.species, {types: ["???", "???"]});
		d.types = ["???", "???"]; d.teraType = undefined;
	}
	d.originalCurHP = d.maxHP(); // full HP (Multiscale etc. count as at full)
	return d;
}

// 2, 0.5, 0.25 ... snapped; odd values (Filter's 1.5) kept as they are.
function remixTCSnap(x) {
	if (!(x > 0)) return x === 0 ? 0 : NaN;
	var l = Math.log2(x), r = Math.round(l);
	return Math.abs(l - r) < 0.06 ? Math.pow(2, r) : Math.round(x * 100) / 100;
}

function remixTCText(x) {
	if (x === 1) return "–";
	return x + "x"; // 0x, 0.25x, 0.5x, 1.5x, 2x, 4x ...
}

function remixTCClass(x) {
	if (x === 0) return "tc-immune";
	if (x >= 8) return "tc-w3";
	if (x >= 4) return "tc-w2";
	if (x > 1) return "tc-w1";
	if (x === 1) return "";
	if (x <= 0.0625) return "tc-r4";
	if (x <= 0.125) return "tc-r3";
	if (x <= 0.25) return "tc-r2";
	return "tc-r1";
}

function remixUpdateTypeChart(info, defender, field) {
	var chart = info.find(".type-chart");
	if (!chart.length || remixTCHidden || !defender) return;
	var atk = remixTCGetAttacker();
	var ref = remixTCVariant(defender, {noAbility: true, noItem: true, typeless: true});
	var full = remixTCVariant(defender, {});
	var plain = remixTCVariant(defender, {noAbility: true, noItem: true});
	var noItem = defender.item ? remixTCVariant(defender, {noItem: true}) : null;
	var noAbility = defender.ability ? remixTCVariant(defender, {noAbility: true}) : null;
	// Across-the-board damage changes (Fur Coat, Energy Shield, Multiscale...) aren't type matchups: they
	// belong in the stats. Each variant's "generic" factor = the factor most types share on a typeless copy
	// with the same ability/item; it's divided out. Type-specific ones (Thick Fat, Levitate, resist items) stay.
	var bases = REMIX_TC_TYPES.map(function (t) { return remixTCDamage(atk, ref, t[0], field); });
	var generic = function (d) {
		if (!d || (!d.ability && !d.item)) return 1;
		var tl = remixTCVariant(d, {typeless: true}), count = {}, bestK = "1", bestN = 0;
		REMIX_TC_TYPES.forEach(function (t, i) {
			if (!(bases[i] > 0)) return;
			var k = (remixTCDamage(atk, tl, t[0], field) / bases[i]).toFixed(3);
			count[k] = (count[k] || 0) + 1;
			if (count[k] > bestN) { bestN = count[k]; bestK = k; }
		});
		var g = parseFloat(bestK);
		return g > 0 ? g : 1; // e.g. Wonder Guard on a typeless copy blocks everything: nothing to divide out
	};
	var G = new Map();
	[full, noItem, noAbility].forEach(function (d) { if (d) G.set(d, generic(d)); });
	var order = [];
	REMIX_TC_TYPES.forEach(function (t, i) {
		var base = bases[i];
		var val = function (d) { return d ? remixTCSnap(remixTCDamage(atk, d, t[0], field) / base / (G.get(d) || 1)) : null; };
		var x = val(full), p = val(plain);
		var cell = chart.find('.tc-cell[data-type="' + t[0] + '"]');
		var v = cell.find(".tc-val");
		// The field stops this type hitting anything (Heavy Rain: Fire, Harsh Sun: Water): immune.
		if (base === 0) {
			var why = (field && field.weather) || "the field";
			order.push({cell: cell, x: 0, i: i});
			v.text("0x").attr("class", "tc-val tc-immune tc-from");
			cell.attr("title", t[0] + ": 0x (blocked by " + why + ")");
			return;
		}
		order.push({cell: cell, x: isNaN(x) ? 1 : x, i: i});
		if (isNaN(x)) { v.text("–").attr("class", "tc-val"); cell.removeAttr("title"); return; }
		var from = [];
		if (x !== p) {
			if (noItem && val(noItem) !== x) from.push(defender.item);
			if (noAbility && val(noAbility) !== x) from.push(defender.ability);
			if (!from.length) from.push(defender.item || defender.ability); // only both together change it
		}
		v.text(remixTCText(x)).attr("class", "tc-val " + remixTCClass(x) + (from.length ? " tc-from" : ""));
		cell.attr("title", t[0] + ": " + (x === 1 ? "neutral" : remixTCText(x)) +
			(from.length ? " (types alone: " + (p === 1 ? "neutral" : remixTCText(p)) + "; changed by " + from.join(" + ") + ")" : ""));
	});
	// Sort: biggest weakness first, then neutral, then resists (mild to strong), immunities last.
	// Ties keep the normal type order. 0 sorts below every resist on its own (0 < 0.0625).
	order.sort(function (a, b) { return b.x - a.x || a.i - b.i; });
	var grid = chart.find(".tc-grid");
	order.forEach(function (o) { grid.append(o.cell); });
}

// Called after every calculation (index_randoms_controls.js); p2field is the field p1 is hit in.
var remixTCTimer = null;
function remixUpdateTypeCharts(p1, p2, p1field, p2field) {
	clearTimeout(remixTCTimer);
	remixTCTimer = setTimeout(function () {
		remixUpdateTypeChart($("#p1"), p1, p2field);
		remixUpdateTypeChart($("#p2"), p2, p1field);
		remixLayoutTypeChart($("#p1"));
		remixLayoutTypeChart($("#p2"));
	}, 30);
	remixShowAddedType($("#p1"), p1);
	remixShowAddedType($("#p2"), p2);
}

// Rusty Anchor-style items that add a type: show it as a third type pill after Type 2.
function remixShowAddedType(info, poke) {
	var add = poke && poke.remixItemFx ? poke.remixItemFx().addType : "";
	if (add && poke.types && poke.types.indexOf(add) !== -1) add = "";
	var pill = info.find(".remix-type3");
	var t1 = info.find(".type1").first(), t2 = info.find(".type2").first();
	var label = t1.siblings("label").first();
	if (!info.hasClass("has-type3")) info.data("typeEnd", t2.offset().left + t2.outerWidth());
	info.toggleClass("has-type3", !!add);
	if (!add) { t1.add(t2).css("width", ""); label.css({ width: "", "margin-right": "" }); pill.hide(); return; }
	if (!pill.length) {
		pill = $('<select class="remix-type3 type-pill" disabled tabindex="-1" aria-label="Type 3 (from item)"></select>')
			.insertAfter(info.find(".type2").first());
	}
	pill.attr("class", "remix-type3 type-pill type-" + add).attr("title", add + " type from " + poke.item)
		.html("<option>" + add + "</option>").show();
	// Three pills: start right after the word "Type" and end where Type 2 normally ends.
	label.css({ width: "auto", "margin-right": "4px" });
	var start = t1.offset().left, end = info.data("typeEnd") || (t2.offset().left + t2.outerWidth());
	var gap = t2.offset().left - (t1.offset().left + t1.outerWidth());
	var w = Math.floor((end - start - 2 * gap) / 3);
	t1.add(t2).add(pill).css("width", w + "px");
}
