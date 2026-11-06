// Silvally: the held Memory decides its form (and type), like RKS System in-game.
// Picking a Memory switches the form; picking a form sets the matching Memory.
function remixSilvallyTarget(item) {
	var m = /^(\w+) Memory$/.exec(item || "");
	return m ? "Silvally-" + m[1] : "Silvally";
}

$(document).on("change", ".item", function () {
	var forme = $(this).closest(".poke-info").find(".forme");
	var current = forme.val() || "";
	if (current.indexOf("Silvally") !== 0) return;
	var target = remixSilvallyTarget($(this).val());
	if (target !== current && forme.find("option[value='" + target + "']").length) {
		forme.val(target).change();
	}
});

$(document).on("change", ".forme", function () {
	var forme = $(this).val() || "";
	if (forme.indexOf("Silvally-") !== 0) return;
	var item = $(this).closest(".poke-info").find(".item");
	var memory = forme.substring("Silvally-".length) + " Memory";
	if (item.val() !== memory && item.find("option[value='" + memory + "']").length) {
		item.val(memory).change();
	}
});
