// Per-Pokemon type defense chart (PLACEHOLDER: layout only, values not calculated yet).
var REMIX_TC_TYPES = [
	["Normal", "NOR", "#afaf9f"], ["Fire", "FIR", "#f56a00"], ["Water", "WAT", "#2480da"],
	["Electric", "ELE", "#f4cf2c"], ["Grass", "GRA", "#65b12f"], ["Ice", "ICE", "#80d9f2"],
	["Fighting", "FIG", "#b93401"], ["Poison", "POI", "#9a2b6c"], ["Ground", "GRO", "#df981c"],
	["Flying", "FLY", "#758be3"], ["Psychic", "PSY", "#e8649c"], ["Bug", "BUG", "#afbb47"],
	["Rock", "ROC", "#cfbb81"], ["Ghost", "GHO", "#605cb6"], ["Dragon", "DRA", "#4b4dca"],
	["Dark", "DAR", "#67493c"], ["Steel", "STE", "#9190a3"], ["Fairy", "FAI", "#e79be7"]
];
$(function () {
	$("#p1, #p2").each(function () {
		var chart = $('<div class="type-chart" title="Type defenses (coming soon)"><div class="tc-title">Type defenses</div><div class="tc-grid"></div></div>');
		REMIX_TC_TYPES.forEach(function (t) {
			chart.find(".tc-grid").append('<div class="tc-cell" data-type="' + t[0] + '"><span class="tc-tile" style="background:' + t[2] + '">' + t[1] + '</span><span class="tc-val">&ndash;</span></div>');
		});
		$(this).append(chart);
	});
});
