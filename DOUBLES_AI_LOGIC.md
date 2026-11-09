# Doubles AI targeting logic (tentative)

Spec for the calc's doubles AI predictor. The working prototype is `src/doubles_ai.html` +
`src/js/remix_doubles_ai.js` (+ generated `src/js/remix_doubles_ai_data.js`). Preview: `/doubles_ai.html`.
**In game (2026-11-09): OPTIMAL** is built into Battle.cro (`AI_scripts_a084/build_doubles_plan.py`). In-game
differences: walled useful-status uses the game's own status-usefulness check; the partner's own status/switch
choice isn't predicted; immunity abilities stay hidden until revealed (the calc doesn't do this yet).

## 1. Damage the AI sees (same as the in-game singles AI)

- Max damage roll.
- 2-5 hit moves count as 3 hits; fixed multi-hit moves use their hit count.
- Always-crit moves count as real crits (ignore the attacker's Atk/SpA drops and the target's Def/SpD boosts).
  Lucky Chant on the target's side cancels this.
- Damage is shown as % of the target's **current** HP. Overkill counts (a 300% hit is worth 300).
- KO = max roll >= target's current HP.
- Immunity abilities (Levitate, Volt Absorb, Sap Sipper, ...) are ignored until revealed. Calc panel: an
  "<ability> revealed" tick box under each of your Pokemon, shown only when its ability gives an immunity or
  blocks status (2026-11-09).
- Resist berries are never read.

## 2. Best move vs one foe

For each AI mon and each foe: a KO move if any (the strongest KO), otherwise the strongest move by %.
Spread moves are scored against both foes (sum of %, KOs counted per foe) and don't claim a target.

## 3. Targeting rules

### OPTIMAL (joint plan)
Candidates when both AI mons and both foes are on the field:
- Each AI mon picks one action: hit A, hit B, or its best spread move.
- Two single-target actions may NOT target the same foe (no double-targeting, not even for a combined KO).
Pick the candidate with (user 2026-11-09: total damage beats KOs in doubles):
1. most total % (uncapped, overkill counts), then
2. most KOs, then
3. the earlier candidate (L->A before L->B).

(SIMPLE per-mon rule dropped 2026-11-09: OPTIMAL is the rule.)

### Shared rules
- Only one foe left: both AI mons hit it.
- Walled = the mon's chosen hit on its assigned foe does under 20% and doesn't KO. Then, in order:
  1. it has a **useful status move** -> uses it;
  2. else it hits the **other** foe if that does >= 20% (the only allowed double-target);
  3. else it's walled vs both -> it switches (attacks once first if it hasn't acted since coming in).
  In game, the hard-swap check in doubles only fires when the mon is walled vs EVERY foe still standing.

## 4. Useful status (auto-detected, overridable per AI mon: Auto / Yes / No)

A status move counts as useful vs the assigned foe if it would do something now:
- **Healing moves never count.** List generated from the game (29 moves, incl. Remix Sharpen/Meditate/Mist/
  Minimize/Heal Bell/Refresh/Magnetic Flux/Gear Up; not Aromatherapy/Aromatic Mist).
- **Setup moves** count if the boost pushes the best matching attack (Atk -> physical, SpA -> special) to
  >= 20% or a KO vs EITHER foe (user 2026-11-09: walled by one foe while the partner hits the other, setting up
  beats double-targeting). Setup table generated from the game's move data (16 moves).
- **Foe-targeting status moves** are useless if blocked by:
  powder vs Grass, Prankster vs Dark, paralysis vs Electric, Electric-type paralysis move vs Ground,
  burn vs Fire, poison vs Poison/Steel (unless the attacker has Corrosion), Leech Seed vs Grass,
  trapping vs Ghost, a major status / Yawn into an already-statused foe.
- Everything else (screens, hazards, Taunt, weather, ...) is assumed useful. The game also checks field state
  (no 2nd Reflect, etc.) that the calc can't see yet.

Also checked (calc panel, 2026-11-09): terrain blocks (Misty: major status/confusion, Electric: sleep/Yawn,
grounded only); status-blocking abilities once revealed (Magic Bounce, Vital Spirit, Flower Veil, Star Power,
Aroma Veil (+ mental moves), Leaf Guard in sun, Scribble (mental), Insomnia/Sweet Veil/Bad Dreams (sleep),
Own Tempo (confusion), Magma Armor/Permafrost/Thick Fat (freeze), Thick Fat/Liquid Veil/Water Bubble (burn));
Remix status items (always seen): Shell Bell Lapras / Smooth Rock Crustle line / Prickly Pear Cacturne line +
Maractus in sand, Heat Rock Gigalith line (burn), Banana Bunch Tropius / Whipped Dream Slurpuff line (cure).

## 5. Data

`src/js/remix_doubles_ai_data.js` is generated from the game files by
`AI_scripts_a084/gen_doubles_ai_data.py` (setup boosts, heal list, per-move status ailment/type/powder/trap).
Re-run it after changing move data.

## 6. Open UI work (for the calc chat)

- Read the 4 mons from the main calc instead of separate cards (sets, EVs/IVs, natures, boosts, field).
- "Ability revealed" toggle per foe; field state (terrain, screens) for the useful-status check.
- Partner damage from spread moves isn't counted (user 2026-11-09: ignore for now).
- OPTIMAL chosen (2026-11-09): port it to the game.
