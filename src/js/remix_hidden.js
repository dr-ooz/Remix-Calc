// Pokemon/forms hidden from the calc's pickers (data stays intact).
// Add exact names here to hide more later.
var REMIX_HIDDEN_SPECIES = [
	"Arceus-Bug", "Arceus-Dark", "Arceus-Dragon", "Arceus-Electric", "Arceus-Fairy",
	"Arceus-Fighting", "Arceus-Fire", "Arceus-Flying", "Arceus-Ghost", "Arceus-Grass",
	"Arceus-Ground", "Arceus-Ice", "Arceus-Poison", "Arceus-Psychic", "Arceus-Rock",
	"Arceus-Steel", "Arceus-Water"
];
function remixIsHidden(name) {
	return REMIX_HIDDEN_SPECIES.indexOf(name) !== -1;
}
