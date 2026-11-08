// Toggle for the KO chance text at the end of the main result ("-- guaranteed 2HKO").
// It can be misleading because of calc quirks, so viewers can hide it.
// Hidden by default; shown only if this viewer turned it on.
var remixKOHidden = true;
try { remixKOHidden = localStorage.getItem("remixKOText") !== "shown"; } catch (e) {}

function remixKOTextHidden() { return remixKOHidden; }

function remixUpdateKOButton() {
	$("#ko-text-toggle").html("&#127919; KO text: " + (remixKOHidden ? "Hidden" : "Shown"));
}

function remixToggleKOText() {
	remixKOHidden = !remixKOHidden;
	try { localStorage.setItem("remixKOText", remixKOHidden ? "hidden" : "shown"); } catch (e) {}
	remixUpdateKOButton();
	$(".result-move:checked").change(); // redraw the result line
}

$(remixUpdateKOButton);
