import { Generation, AbilityName, StatID, Terrain, TypeName } from "../data/interface";
import { toID } from "../util";
import {
  getBerryResistType,
  getFlingPower,
  getItemBoostType,
  getMultiAttack,
  getNaturalGift,
  getTechnoBlast,
  SEED_BOOSTED_STAT,
} from "../items";
import { RawDesc } from "../desc";
import { Field } from "../field";
import { Move } from "../move";
import { Pokemon } from "../pokemon";
import { Result } from "../result";
import {
  chainMods,
  checkAirLock,
  checkDauntlessShield,
  checkDownload,
  checkForecast,
  checkInfiltrator,
  checkIntimidate,
  checkIntrepidSword,
  checkItem,
  checkMultihitBoost,
  checkSeedBoost,
  checkWonderRoom,
  computeFinalStats,
  countBoosts,
  getBaseDamage,
  getStatDescriptionText,
  getFinalDamage,
  getModifiedStat,
  getMostProficientStat,
  getMoveEffectiveness,
  getShellSideArmCategory,
  getWeightFactor,
  handleFixedDamageMoves,
  isGrounded,
  OF16,
  OF32,
  pokeRound,
} from "./util";

export function calculateSMSSSV(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field
) {
  // #region Initial

  checkAirLock(attacker, field);
  checkAirLock(defender, field);
  checkForecast(attacker, field.weather);
  checkForecast(defender, field.weather);
  checkItem(attacker, field.isMagicRoom);
  checkItem(defender, field.isMagicRoom);
  checkWonderRoom(attacker, field.isWonderRoom);
  checkWonderRoom(defender, field.isWonderRoom);
  checkSeedBoost(attacker, field);
  checkSeedBoost(defender, field);
  checkDauntlessShield(attacker, gen);
  checkDauntlessShield(defender, gen);

  computeFinalStats(gen, attacker, defender, field, "def", "spd", "spe");

  checkIntimidate(gen, attacker, defender);
  checkIntimidate(gen, defender, attacker);
  checkDownload(attacker, defender, field.isWonderRoom);
  checkDownload(defender, attacker, field.isWonderRoom);
  checkIntrepidSword(attacker, gen);
  checkIntrepidSword(defender, gen);

  computeFinalStats(gen, attacker, defender, field, "atk", "spa");

  checkInfiltrator(attacker, field.defenderSide);
  checkInfiltrator(defender, field.attackerSide);

  const desc: RawDesc = {
    attackerName: attacker.name,
    attackerTera: attacker.teraType,
    moveName: move.name,
    defenderName: defender.name,
    defenderTera: defender.teraType,
    isDefenderDynamaxed: defender.isDynamaxed,
    isWonderRoom: field.isWonderRoom,
  };

  const result = new Result(gen, attacker, defender, move, field, 0, desc);

  if (move.category === "Status" && !move.named("Nature Power")) {
    return result;
  }

  const breaksProtect =
    move.breaksProtect ||
    move.isZ ||
    attacker.isDynamaxed ||
    (attacker.hasAbility("Unseen Fist") && move.flags.contact);

  if (field.defenderSide.isProtected && !breaksProtect) {
    desc.isProtected = true;
    return result;
  }

  const defenderIgnoresAbility = defender.hasAbility(
    "Full Metal Body",
    "Neutralizing Gas",
    "Prism Armor",
    "Shadow Shield",
    "Energy Shield",
    "Resilient",
    "Birds' Eye View"
  );

  const attackerIgnoresAbility = attacker.hasAbility(
    "Mold Breaker",
    "Teravolt",
    "Turboblaze"
  );
  const moveIgnoresAbility = move.named(
    "G-Max Drum Solo",
    "G-Max Fire Ball",
    "G-Max Hydrosnipe",
    "Light That Burns the Sky",
    "Menacing Moonraze Maelstrom",
    "Moongeist Beam",
    "Searing Sunraze Smash",
    "Sunsteel Strike"
  ) || !!(move.remix && move.remix.ignoresAbilities);
  if (
    !defenderIgnoresAbility &&
    !defender.hasAbility("Poison Heal") &&
    (attackerIgnoresAbility || moveIgnoresAbility)
  ) {
    if (attackerIgnoresAbility) desc.attackerAbility = attacker.ability;
    if (defender.hasItem("Ability Shield")) {
      desc.defenderItem = defender.item;
    } else {
      defender.ability = "" as AbilityName;
    }
  }

  // Merciless does not ignore Shell Armor, damage dealt to a poisoned Pokemon with Shell Armor
  // will not be a critical hit (UltiMario)
  // Remix (gen 7): Oblivious / Scribble / Schooling / Zen form can't be crit; Merciless = any status
  const remixCritImmune = gen.num === 7 && (
    defender.hasAbility("Oblivious", "Scribble", "Schooling", "Good Fortune") ||
    defender.remixItemFx().critImmune ||
    defender.named("Darmanitan-Zen"));
  const isCritical =
    !defender.hasAbility("Battle Armor", "Shell Armor") &&
    !remixCritImmune &&
    !field.defenderSide.isLuckyChant && // Remix: Lucky Chant blocks crits on that side
    (move.isCrit || attacker.remixItemFx().alwaysCrit ||
      (attacker.hasAbility("Merciless") &&
        (gen.num === 7 ? !!defender.status : defender.hasStatus("psn", "tox")))) &&
    move.timesUsed === 1;

  let type = move.type;
  if (move.named("Weather Ball")) {
    const holdingUmbrella = attacker.hasItem("Utility Umbrella");
    type =
      field.hasWeather("Sun", "Harsh Sunshine") && !holdingUmbrella
        ? "Fire"
        : field.hasWeather("Rain", "Heavy Rain") && !holdingUmbrella
        ? "Water"
        : field.hasWeather("Sand")
        ? "Rock"
        : field.hasWeather("Hail", "Snow")
        ? "Ice"
        : "Normal";
    desc.weather = field.weather;
    desc.moveType = type;
  } else if (
    move.named("Ancient Force") &&
    attacker.item &&
    attacker.item.includes("Plate")
  ) {
    type = getItemBoostType(attacker.item)!;
  } else if (
    move.named("Techno Blast") &&
    attacker.item &&
    attacker.item.includes("Drive")
  ) {
    type = getTechnoBlast(attacker.item)!;
  } else if (
    move.named("Multi-Attack") &&
    attacker.item &&
    attacker.item.includes("Memory")
  ) {
    type = getMultiAttack(attacker.item)!;
  } else if (
    move.named("Natural Gift") &&
    attacker.item &&
    attacker.item.includes("Berry")
  ) {
    const gift = getNaturalGift(gen, attacker.item)!;
    type = gift.t;
    desc.moveType = type;
    desc.attackerItem = attacker.item;
  } else if (
    move.named("Nature Power") ||
    (move.named("Terrain Pulse") && isGrounded(attacker, field))
  ) {
    type = field.hasTerrain("Electric")
      ? "Electric"
      : field.hasTerrain("Grassy")
      ? "Grass"
      : field.hasTerrain("Misty")
      ? "Fairy"
      : field.hasTerrain("Psychic")
      ? "Psychic"
      : "Normal";
    desc.terrain = field.terrain;
    desc.moveType = type;
  } else if (move.named("Revelation Dance") || (move.remix && move.remix.matchUserType)) {
    type = attacker.types[0];
  } else if (move.named("Aura Wheel")) {
    if (attacker.named("Morpeko")) {
      type = "Electric";
    } else if (attacker.named("Morpeko-Hangry")) {
      type = "Dark";
    }
  } else if (move.named("Raging Bull")) {
    if (attacker.named("Tauros-Paldea-Combat")) {
      type = "Fighting";
    } else if (attacker.named("Tauros-Paldea-Blaze")) {
      type = "Fire";
    } else if (attacker.named("Tauros-Paldea-Aqua")) {
      type = "Water";
    }
  }

  let hasAteAbilityTypeChange = false;
  let isAerilate = false;
  let isPixilate = false;
  let isRefrigerate = false;
  let isGalvanize = false;
  let isLiquidVoice = false;
  let isNormalize = false;
  let isRemixAte = false;
  const noTypeChange =
    move.named(
      "Revelation Dance",
      "Ancient Force",
      "Nature Power",
      "Techno Blast",
      "Multi Attack",
      "Natural Gift",
      "Weather Ball",
      "Terrain Pulse"
    ) ||
    (move.named("Tera Blast") && attacker.teraType) ||
    (move.remix && move.remix.matchUserType);

  if (!move.isZ && !noTypeChange) {
    const normal = move.hasType("Normal");
    if ((isAerilate = attacker.hasAbility("Aerilate") && normal)) {
      type = "Flying";
    } else if ((isGalvanize = attacker.hasAbility("Galvanize") && normal)) {
      type = "Electric";
    } else if (
      (isLiquidVoice =
        attacker.hasAbility("Liquid Voice") && !!move.flags.sound)
    ) {
      type = "Water";
    } else if ((isPixilate = attacker.hasAbility("Pixilate") && normal)) {
      type = "Fairy";
    } else if ((isRefrigerate = attacker.hasAbility("Refrigerate") && normal)) {
      type = "Ice";
    } else if ((isRemixAte = gen.num === 7 && attacker.hasAbility("Incinerate") && normal)) {
      type = "Fire"; // Remix: Incinerate = Normal -> Fire, 1.2x
    } else if ((isRemixAte = gen.num === 7 && attacker.hasAbility("RKS System") && normal)) {
      type = attacker.types[0]; // Remix: Normal moves match its Memory type, 1.2x
    } else if (gen.num === 7 && normal && attacker.hasAbility("Star Power") &&
      !attacker.named("Minior-Meteor") && attacker.types[1]) {
      type = attacker.types[1]; // Remix: core Minior's Normal moves match its core type
      desc.attackerAbility = attacker.ability;
    } else if (gen.num === 7 && normal && attacker.hasAbility("Amplifier") && !!move.flags.sound) {
      type = attacker.types[0]; // Remix: Normal sound moves match its type
      desc.attackerAbility = attacker.ability;
    } else if ((isRemixAte = gen.num === 7 && normal && !!attacker.remixItemFx().ate)) {
      type = attacker.remixItemFx().ate as TypeName; // Remix item: Normal moves change type, 1.2x
      desc.attackerItem = attacker.item;
    } else if ((isNormalize = attacker.hasAbility("Normalize"))) {
      // Boosts any type
      type = "Normal";
    }
    if (
      isGalvanize ||
      isPixilate ||
      isRefrigerate ||
      isAerilate ||
      isNormalize ||
      isRemixAte
    ) {
      desc.attackerAbility = attacker.ability;
      hasAteAbilityTypeChange = true;
    } else if (isLiquidVoice) {
      desc.attackerAbility = attacker.ability;
    }
  }

  if (move.named("Tera Blast") && attacker.teraType) {
    type = attacker.teraType;
  }

  move.type = type;

  // FIXME: this is incorrect, should be move.flags.heal, not move.drain
  if (
    (attacker.hasAbility("Triage") && move.drain) ||
    (attacker.hasAbility("Gale Wings") &&
      move.hasType("Flying") &&
      attacker.curHP() === attacker.maxHP())
  ) {
    move.priority = 1;
    desc.attackerAbility = attacker.ability;
  }

  // Remix (gen 7): Corrosion Poison moves hit Steel/Rock/Ground super-effectively, Neurotoxin hits Psychic
  if (gen.num === 7 && move.hasType("Poison")) {
    const extraSE = [
      ...(attacker.hasAbility("Corrosion") ? ["Steel", "Rock", "Ground"] : []),
      ...(attacker.hasAbility("Neurotoxin") ? ["Psychic"] : []),
    ];
    if (extraSE.length) {
      const remix: any = {...(move.remix || {})};
      remix.superEffectiveVs = [...(remix.superEffectiveVs || []), ...extraSE];
      (move as any).remix = remix;
    }
  }

  const isGhostRevealed =
    attacker.hasAbility("Scrappy") || field.defenderSide.isForesight;
  const isRingTarget =
    defender.hasItem("Ring Target") && !defender.hasAbility("Klutz");
  const type1Effectiveness = getMoveEffectiveness(
    gen,
    move,
    defender.types[0],
    isGhostRevealed,
    field.isGravity,
    isRingTarget
  );
  const type2Effectiveness = defender.types[1]
    ? getMoveEffectiveness(
        gen,
        move,
        defender.types[1],
        isGhostRevealed,
        field.isGravity,
        isRingTarget
      )
    : 1;
  let typeEffectiveness = type1Effectiveness * type2Effectiveness;

  if (defender.teraType) {
    typeEffectiveness = getMoveEffectiveness(
      gen,
      move,
      defender.teraType,
      isGhostRevealed,
      field.isGravity,
      isRingTarget
    );
  }

  // Remix: a type added by an item (Rusty Anchor) counts as a third type
  const remixAddType = defender.remixItemFx().addType as TypeName;
  if (remixAddType && !defender.teraType && !defender.types.includes(remixAddType)) {
    typeEffectiveness *= getMoveEffectiveness(
      gen, move, remixAddType, isGhostRevealed, field.isGravity, isRingTarget);
    desc.defenderItem = defender.item;
  }

  if (
    typeEffectiveness === 0 &&
    move.hasType("Ground") &&
    defender.hasItem("Iron Ball") &&
    !defender.hasAbility("Klutz")
  ) {
    typeEffectiveness = 1;
  }

  if (typeEffectiveness === 0 && (move.named("Thousand Arrows") || (move.remix && move.remix.groundsTarget))) {
    typeEffectiveness = 1;
  }

  if (typeEffectiveness === 0) {
    return result;
  }

  if (
    (move.named("Sky Drop") &&
      (defender.hasType("Flying") ||
        defender.weightkg >= 200 ||
        field.isGravity)) ||
    (move.named("Synchronoise") &&
      !defender.hasType(attacker.types[0]) &&
      (!attacker.types[1] || !defender.hasType(attacker.types[1]))) ||
    (move.named("Dream Eater") &&
      !(defender.hasStatus("slp") || defender.hasAbility("Comatose"))) ||
    (move.named("Steel Roller") && !field.terrain) ||
    (move.named("Poltergeist") && !defender.item)
  ) {
    return result;
  }

  if (
    (field.hasWeather("Harsh Sunshine") && move.hasType("Water")) ||
    (field.hasWeather("Heavy Rain") && move.hasType("Fire"))
  ) {
    desc.weather = field.weather;
    return result;
  }

  if (
    field.hasWeather("Strong Winds") &&
    defender.hasType("Flying") &&
    gen.types.get(toID(move.type))!.effectiveness["Flying"]! > 1
  ) {
    typeEffectiveness /= 2;
    desc.weather = field.weather;
  }

  if (
    (defender.hasAbility("Wonder Guard") && typeEffectiveness <= 1) ||
    (move.hasType("Grass") && defender.hasAbility("Sap Sipper")) ||
    (move.hasType("Fire") &&
      defender.hasAbility("Flash Fire", "Well-Baked Body")) ||
    (move.hasType("Water") &&
      defender.hasAbility("Dry Skin", "Storm Drain", "Water Absorb")) ||
    (move.hasType("Electric") &&
      !(move.remix && move.remix.ignoresAbsorb) &&
      defender.hasAbility("Lightning Rod", "Motor Drive", "Volt Absorb")) ||
    (move.hasType("Ground") &&
      !field.isGravity &&
      !(move.named("Thousand Arrows") || (move.remix && move.remix.groundsTarget)) &&
      !defender.hasItem("Iron Ball") &&
      defender.hasAbility("Levitate")) ||
    (move.flags.bullet && defender.hasAbility("Bulletproof")) ||
    (move.flags.sound &&
      !move.named("Clangorous Soul") &&
      defender.hasAbility("Soundproof")) ||
    (move.priority > 0 &&
      defender.hasAbility("Queenly Majesty", "Dazzling", "Armor Tail")) ||
    (move.hasType("Ground") && defender.hasAbility("Earth Eater")) ||
    (move.flags.wind && defender.hasAbility("Wind Rider")) ||
    (move.hasType("Fairy") && !isPixilate && defender.hasAbility("Sinister")) ||
    (gen.num === 7 && (
      (move.hasType("Dark") && defender.hasAbility("Ethereal")) ||
      (move.hasType("Fire") && defender.hasAbility("Unmeltable")) ||
      (move.hasType("Water") && defender.hasAbility("Hydration")) ||
      (move.priority > 0 && defender.hasAbility("Swiftness", "Elegance"))))
  ) {
    desc.defenderAbility = defender.ability;
    return result;
  }

  if (
    move.hasType("Ground") &&
    !(move.named("Thousand Arrows") || (move.remix && move.remix.groundsTarget)) &&
    !field.isGravity &&
    defender.hasItem("Air Balloon")
  ) {
    desc.defenderItem = defender.item;
    return result;
  }

  if (
    move.priority > 0 &&
    field.hasTerrain("Psychic") &&
    isGrounded(defender, field)
  ) {
    desc.terrain = field.terrain;
    return result;
  }

  const weightBasedMove = move.named(
    "Heat Crash",
    "Heavy Slam",
    "Low Kick",
    "Grass Knot"
  );
  if (defender.isDynamaxed && weightBasedMove) {
    return result;
  }

  desc.HPEVs = `${defender.evs.hp} HP`;

  const fixedDamage = handleFixedDamageMoves(attacker, move);
  if (fixedDamage) {
    if (
      attacker.hasAbility("Parental Bond") ||
      attacker.hasAbility("Beatdown")
    ) {
      result.damage = [fixedDamage, fixedDamage];
      desc.attackerAbility = attacker.ability;
    } else {
      result.damage = fixedDamage;
    }
    return result;
  }

  if (move.named("Final Gambit")) {
    result.damage = attacker.curHP();
    return result;
  }

  if (move.named("Guardian of Alola")) {
    let zLostHP = Math.floor((defender.curHP() * 3) / 4);
    if (
      field.defenderSide.isProtected &&
      attacker.item &&
      attacker.item.includes(" Z")
    ) {
      zLostHP = Math.ceil(zLostHP / 4 - 0.5);
    }
    result.damage = zLostHP;
    return result;
  }

  if (move.named("Cosmic Chaos")) {
    const lostHP = field.defenderSide.isProtected
      ? 0
      : Math.floor(defender.curHP() / 2);
    result.damage = lostHP;
    return result;
  }

  if (move.named("Spectral Thief")) {
    let stat: StatID;
    for (stat in defender.boosts) {
      if (defender.boosts[stat]) {
        attacker.boosts[stat] += attacker.hasAbility("Contrary")
          ? -defender.boosts[stat]!
          : defender.boosts[stat]!;
        if (attacker.boosts[stat] > 6) attacker.boosts[stat] = 6;
        if (attacker.boosts[stat] < -6) attacker.boosts[stat] = -6;
        attacker.stats[stat] = getModifiedStat(
          attacker.rawStats[stat]!,
          attacker.boosts[stat]!
        );
      }
    }
  }

  if (move.hits > 1) {
    desc.hits = move.hits;
  }

  const turnOrder = attacker.stats.spe > defender.stats.spe ? "first" : "last";

  // #endregion
  // #region Base Power

  const basePower = calculateBasePowerSMSSSV(
    gen,
    attacker,
    defender,
    move,
    field,
    hasAteAbilityTypeChange,
    desc
  );
  if (basePower === 0) {
    return result;
  }

  // #endregion
  // #region (Special) Attack
  const attack = calculateAttackSMSSSV(
    gen,
    attacker,
    defender,
    move,
    field,
    desc,
    isCritical
  );
  const attackSource = move.named("Foul Play") ? defender : attacker;
  if (
    move.named("Twilight Cannon", "Light That Burns The Sky") ||
    (move.named("Tera Blast") && attackSource.teraType)
  ) {
    move.category =
      attackSource.stats.atk > attackSource.stats.spa ? "Physical" : "Special";
  }
  const attackStat =
    move.named("Shell Side Arm") &&
    getShellSideArmCategory(attacker, defender) === "Physical"
      ? "atk"
      : move.named("Body Press")
      ? "def"
      : move.category === "Special"
      ? "spa"
      : "atk";
  // #endregion
  // #region (Special) Defense

  const defense = calculateDefenseSMSSSV(
    gen,
    attacker,
    defender,
    move,
    field,
    desc,
    isCritical
  );
  const hitsPhysical =
    move.overrideDefensiveStat === "def" ||
    move.category === "Physical" ||
    (move.named("Shell Side Arm") &&
      getShellSideArmCategory(attacker, defender) === "Physical");
  const defenseStat = hitsPhysical ? "def" : "spd";

  // #endregion
  // #region Damage

  let baseDamage = getBaseDamage(attacker.level, basePower, attack, defense);

  const isSpread =
    field.gameType !== "Singles" &&
    ["allAdjacent", "allAdjacentFoes"].includes(move.target);
  if (isSpread) {
    baseDamage = pokeRound(OF32(baseDamage * 3072) / 4096);
  }

  if (
    attacker.hasAbility("Parental Bond (Child)") ||
    attacker.hasAbility("Beatdown (Second Hit)")
  ) {
    baseDamage = pokeRound(OF32(baseDamage * 1024) / 4096);
  }

  if (
    field.hasWeather("Sun") &&
    move.named("Hydro Steam") &&
    !attacker.hasItem("Utility Umbrella")
  ) {
    baseDamage = pokeRound(OF32(baseDamage * 6144) / 4096);
    desc.weather = field.weather;
  } else if (!defender.hasItem("Utility Umbrella")) {
    if (
      (field.hasWeather("Sun", "Harsh Sunshine") && move.hasType("Fire")) ||
      (field.hasWeather("Rain", "Heavy Rain") && move.hasType("Water"))
    ) {
      baseDamage = pokeRound(OF32(baseDamage * 6144) / 4096);
      desc.weather = field.weather;
    } else if (
      (field.hasWeather("Sun") && move.hasType("Water")) ||
      (field.hasWeather("Rain") && move.hasType("Fire"))
    ) {
      baseDamage = pokeRound(OF32(baseDamage * 2048) / 4096);
      desc.weather = field.weather;
    }
  }

  if (
    hasTerrainSeed(defender) &&
    field.hasTerrain(
      defender.item!.substring(0, defender.item!.indexOf(" ")) as Terrain
    ) &&
    SEED_BOOSTED_STAT[defender.item!] === defenseStat
  ) {
    // Last condition applies so the calc doesn't show a seed where it wouldn't affect the outcome
    // (like Grassy Seed when being hit by a special move)
    desc.defenderItem = defender.item;
  }

  if (isCritical) {
    baseDamage = Math.floor(OF32(baseDamage * 1.5));
    desc.isCritical = isCritical;
  }

  // the random factor is applied between the crit mod and the stab mod, so don't apply anything
  // below this until we're inside the loop
  let stabMod = 4096;
  const remixItemStab = attacker.remixItemFx().stab.includes(move.type) ||
    attacker.remixItemFx().addType === move.type;
  if (attacker.hasOriginalType(move.type) || remixItemStab) {
    stabMod += 2048;
  } else if (
    attacker.hasAbility("Protean", "Libero", "Versatility") &&
    !attacker.teraType
  ) {
    stabMod += 2048;
    desc.attackerAbility = attacker.ability;
  }
  const teraType = attacker.teraType;
  if (teraType === move.type) {
    stabMod += 2048;
    desc.attackerTera = teraType;
  }
  if (attacker.hasAbility("Adaptability", "Titan's Core") && attacker.hasType(move.type)) {
    stabMod += teraType && attacker.hasOriginalType(teraType) ? 1024 : 2048;
    desc.attackerAbility = attacker.ability;
  }

  const applyBurn =
    attacker.hasStatus("brn") &&
    move.category === "Physical" &&
    !attacker.hasAbility("Guts") &&
    !(gen.num === 7 && attacker.hasAbility("Marvel Scale", "Quick Feet", "Flare Heal")) &&
    !move.named("Facade");
  desc.isBurned = applyBurn;
  const finalMods = calculateFinalModsSMSSSV(
    gen,
    attacker,
    defender,
    move,
    field,
    desc,
    isCritical,
    typeEffectiveness
  );

  let protect = false;
  if (
    field.defenderSide.isProtected &&
    (attacker.isDynamaxed ||
      (move.isZ && attacker.item && attacker.item.includes(" Z")))
  ) {
    protect = true;
    desc.isProtected = true;
  }

  const finalMod = chainMods(finalMods, 41, 131072);

  let childDamage: number[] | undefined;
  // Remix: Parental Bond adds no 2nd hit to 2-turn charge moves (Beatdown still does).
  const remixFx: any = (move as any).remix || {};
  const parentalBondHits = !(gen.num === 7 && remixFx.chargeTurn);
  if (attacker.hasAbility("Parental Bond") && move.hits === 1 && !isSpread && parentalBondHits &&
    !(move as any).remixLaterHit) {
    const child = attacker.clone();
    child.ability = "Parental Bond (Child)" as AbilityName;
    const childDefender = gen.num === 7 ? defender.clone() : defender;
    checkMultihitBoost(gen, child, childDefender, move, field, desc);
    if (gen.num === 7) remixAfterFirstHit(gen, child, childDefender, move, field);
    childDamage = calculateSMSSSV(gen, child, childDefender, move, field)
      .damage as number[];
    desc.attackerAbility = attacker.ability;
  }

  // (remixLaterHit = one hit of a real multi-hit move: no extra 2nd hit there)
  if (attacker.hasAbility("Beatdown") && move.hits === 1 && !isSpread && !(move as any).remixLaterHit) {
    const child = attacker.clone();
    child.ability = "Beatdown (Second Hit)" as AbilityName;
    const childDefender = defender.clone();
    checkMultihitBoost(gen, child, childDefender, move, field, desc);
    remixAfterFirstHit(gen, child, childDefender, move, field);
    childDamage = calculateSMSSSV(gen, child, childDefender, move, field)
      .damage as number[];
    desc.attackerAbility = attacker.ability;
  }

  let damage: number[] = [];
  for (let i = 0; i < 16; i++) {
    damage[i] = getFinalDamage(
      baseDamage,
      i,
      typeEffectiveness,
      applyBurn,
      stabMod,
      finalMod,
      protect
    );
  }

  if (move.dropsStats && move.timesUsed! > 1) {
    const simpleMultiplier = attacker.hasAbility("Simple") ? 2 : 1;

    desc.moveTurns = `over ${move.timesUsed} turns`;
    const hasWhiteHerb = attacker.hasItem("White Herb");
    let usedWhiteHerb = false;
    let dropCount = attacker.boosts[attackStat];
    for (let times = 0; times < move.timesUsed!; times++) {
      const newAttack = getModifiedStat(attack, dropCount);
      let damageMultiplier = 0;
      damage = damage.map((affectedAmount) => {
        if (times) {
          const newBaseDamage = getBaseDamage(
            attacker.level,
            basePower,
            newAttack,
            defense
          );
          const newFinalDamage = getFinalDamage(
            newBaseDamage,
            damageMultiplier,
            typeEffectiveness,
            applyBurn,
            stabMod,
            finalMod,
            protect
          );
          damageMultiplier++;
          return affectedAmount + newFinalDamage;
        }
        return affectedAmount;
      });

      if (attacker.hasAbility("Contrary")) {
        dropCount = Math.min(6, dropCount + move.dropsStats);
        desc.attackerAbility = attacker.ability;
      } else {
        dropCount = Math.max(
          -6,
          dropCount - move.dropsStats * simpleMultiplier
        );
        if (attacker.hasAbility("Simple")) {
          desc.attackerAbility = attacker.ability;
        }
      }

      // the Pokémon hits THEN the stat rises / lowers
      if (hasWhiteHerb && attacker.boosts[attackStat] < 0 && !usedWhiteHerb) {
        dropCount += move.dropsStats * simpleMultiplier;
        usedWhiteHerb = true;
        desc.attackerItem = attacker.item;
      }
    }
  }

  desc.attackBoost = move.named("Foul Play")
    ? defender.boosts[attackStat]
    : attacker.boosts[attackStat];

  // Remix: per-hit damage. Later hits of a multi-hit move skip Multiscale / Energy Shield and see
  // Defense drops (Vine Lashes etc.) and Stamina / Weak Armor from earlier hits.
  if (gen.num === 7 && childDamage) {
    desc.remixHits = [[damage[0], damage[15]], [childDamage[0], childDamage[15]]];
  } else if (gen.num === 7 && move.hits > 1 && !(move as any).remixLaterHit) {
    const hitDamages: number[][] = [damage];
    const hitAttacker = attacker.clone();
    const hitDefender = defender.clone();
    for (let h = 1; h < move.hits; h++) {
      checkMultihitBoost(gen, hitAttacker, hitDefender, move, field, desc);
      if (remixFx.perHitDrop && remixCanLowerStats(hitAttacker, hitDefender, remixFx.perHitDrop, field)) {
        remixApplyBoosts(gen, hitDefender, remixFx.perHitDrop);
      }
      const laterHit = move.clone();
      laterHit.hits = 1;
      (laterHit as any).remixLaterHit = true;
      hitDamages.push(calculateSMSSSV(
        gen, hitAttacker.clone(), hitDefender.clone(), laterHit, field).damage as number[]);
    }
    desc.remixHits = hitDamages.map(d => [d[0], d[d.length - 1]]);
    const allSame = hitDamages.every(d => d.every((v, i) => v === damage[i]));
    if (!allSame) {
      // Hits differ: report the combined total as one "hit" so it isn't multiplied again.
      damage = remixCombineHits(hitDamages);
      desc.remixHitsCombined = move.hits;
      move.hits = 1;
    }
  }

  result.damage = childDamage ? [damage, childDamage] : damage;

  // #endregion

  return result;
}

// ---- Remix helpers for hits after the first ----

// Can the move's added effect lower the defender's stats? (items like Covert Cloak: not yet)
// Does an item/weather rule apply right now? (Remix item_effects "stats" entries)
function remixStatCondition(st: {weather?: string[]; terrain?: string[]}, field: Field) {
  if (!st.weather && !st.terrain) return true;
  return !!((st.weather && field.weather && st.weather.includes(field.weather)) ||
    (st.terrain && field.terrain && st.terrain.includes(field.terrain)));
}

function remixCanLowerStats(
  attacker: Pokemon, defender: Pokemon, boosts: {[stat: string]: number}, field?: Field
) {
  if (attacker.hasAbility("Sheer Force")) return false;
  if (defender.hasItem("Covert Cloak", "Clear Amulet")) return false;
  if (field && defender.remixItemFx().weatherItems.some(w =>
    field.weather && w.weather.includes(field.weather) && w.items.includes("Clear Amulet"))) return false;
  if (defender.hasAbility("Clear Body", "Full Metal Body", "Titanic", "Flower Veil", "Shield Dust")) return false;
  if (boosts.def && defender.hasAbility("Big Pecks")) return false;
  return true;
}

function remixApplyBoosts(gen: Generation, pokemon: Pokemon, boosts: {[stat: string]: number}) {
  for (const stat in boosts) {
    const s = stat as StatID;
    let n = boosts[stat];
    if (pokemon.hasAbility("Simple")) n *= 2;
    if (pokemon.hasAbility("Contrary")) n = -n;
    pokemon.boosts[s] = Math.max(-6, Math.min(6, pokemon.boosts[s] + n));
    pokemon.stats[s] = getModifiedStat(pokemon.rawStats[s], pokemon.boosts[s], gen);
  }
}

// Parental Bond / Beatdown: the 2nd hit sees the 1st hit's guaranteed drops and the user's boosts.
function remixAfterFirstHit(
  gen: Generation, attacker: Pokemon, defender: Pokemon, move: Move, field?: Field
) {
  const fx: any = (move as any).remix || {};
  if (fx.targetDrop && remixCanLowerStats(attacker, defender, fx.targetDrop, field)) {
    remixApplyBoosts(gen, defender, fx.targetDrop);
  }
  if (fx.selfBoost && !attacker.hasAbility("Sheer Force")) {
    remixApplyBoosts(gen, attacker, fx.selfBoost);
  }
}

// Exact damage distribution of several different hits, cut down to 16 rolls (lowest and highest exact).
function remixCombineHits(hits: number[][]) {
  let dist = new Map<number, number>([[0, 1]]);
  for (const h of hits) {
    const next = new Map<number, number>();
    dist.forEach((count, total) => {
      for (const d of h) next.set(total + d, (next.get(total + d) || 0) + count);
    });
    dist = next;
  }
  const values = Array.from(dist.keys()).sort((a, b) => a - b);
  const totalCount = Array.from(dist.values()).reduce((a, b) => a + b, 0);
  const out: number[] = [];
  for (let i = 0; i < 16; i++) {
    const target = i === 0 ? 0 : i === 15 ? totalCount - 1 : ((i + 0.5) / 16) * totalCount;
    let seen = 0;
    for (const v of values) {
      seen += dist.get(v)!;
      if (seen > target) { out.push(v); break; }
    }
  }
  return out;
}

export function calculateBasePowerSMSSSV(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field,
  hasAteAbilityTypeChange: boolean,
  desc: RawDesc
) {
  const turnOrder = attacker.stats.spe > defender.stats.spe ? "first" : "last";

  let basePower: number;

  // Remix: noVanilla moves skip the vanilla per-move base power rules below
  switch (move.remix && move.remix.noVanilla ? "" : move.name) {
    case "Payback":
      basePower = move.bp * (turnOrder === "last" ? 2 : 1);
      desc.moveBP = basePower;
      break;
    case "Bolt Beak":
    case "Fishious Rend":
      basePower = move.bp * (turnOrder !== "last" ? 2 : 1);
      desc.moveBP = basePower;
      break;
    case "Pursuit":
      const switching = field.defenderSide.isSwitching === "out";
      basePower = move.bp * (switching ? 2 : 1);
      if (switching) desc.isSwitching = "out";
      desc.moveBP = basePower;
      break;
    case "Electro Ball":
      const r = Math.floor(attacker.stats.spe / defender.stats.spe);
      basePower = r >= 4 ? 150 : r >= 3 ? 120 : r >= 2 ? 80 : r >= 1 ? 60 : 40;
      if (defender.stats.spe === 0) basePower = 40;
      desc.moveBP = basePower;
      break;
    case "Gyro Ball":
      basePower = Math.min(
        150,
        Math.floor((25 * defender.stats.spe) / attacker.stats.spe) + 1
      );
      if (attacker.stats.spe === 0) basePower = 1;
      desc.moveBP = basePower;
      break;
    case "Punishment":
      basePower = Math.min(200, 60 + 20 * countBoosts(gen, defender.boosts));
      desc.moveBP = basePower;
      break;
    case "Low Kick":
    case "Grass Knot":
      const w = defender.weightkg * getWeightFactor(defender);
      basePower =
        w >= 200
          ? 120
          : w >= 100
          ? 100
          : w >= 50
          ? 80
          : w >= 25
          ? 60
          : w >= 10
          ? 40
          : 20;
      desc.moveBP = basePower;
      break;
    case "Hex":
      // Hex deals double damage to Pokemon with Comatose (ih8ih8sn0w)
      basePower =
        move.bp * (defender.status || defender.hasAbility("Comatose") ? 2 : 1);
      desc.moveBP = basePower;
      break;
    case "Barb Barrage (GameFreak)":
      basePower = move.bp * (defender.hasStatus("psn", "tox") ? 2 : 1);
      desc.moveBP = basePower;
      break;
    case "Heavy Slam":
    case "Heat Crash":
      const wr =
        (attacker.weightkg * getWeightFactor(attacker)) /
        (defender.weightkg * getWeightFactor(defender));
      basePower =
        wr >= 5 ? 120 : wr >= 4 ? 100 : wr >= 3 ? 80 : wr >= 2 ? 60 : 40;
      desc.moveBP = basePower;
      break;
    case "Stored Power":
    case "Power Trip":
      basePower = 20 + 20 * countBoosts(gen, attacker.boosts);
      desc.moveBP = basePower;
      break;
    case "Acrobatics":
      basePower =
        move.bp * (attacker.hasItem("Flying Gem") || !attacker.item ? 2 : 1);
      desc.moveBP = basePower;
      break;
    case "Assurance":
      basePower =
        move.bp *
        (defender.hasAbility("Parental Bond (Child)") ||
        defender.hasAbility("Beatdown (Second Hit)")
          ? 2
          : 1);
      // NOTE: desc.attackerAbility = 'Parental Bond' will already reflect this boost
      break;
    case "Wake-Up Slap":
      // Wake-Up Slap deals double damage to Pokemon with Comatose (ih8ih8sn0w)
      basePower =
        move.bp *
        (defender.hasStatus("slp") || defender.hasAbility("Comatose") ? 2 : 1);
      desc.moveBP = basePower;
      break;
    case "Smelling Salts":
      basePower = move.bp * (defender.hasStatus("par") ? 2 : 1);
      desc.moveBP = basePower;
      break;
    case "Weather Ball":
      basePower =
        move.bp * (field.weather && !field.hasWeather("Strong Winds") ? 2 : 1);
      if (
        field.hasWeather("Sun", "Harsh Sunshine", "Rain", "Heavy Rain") &&
        attacker.hasItem("Utility Umbrella")
      )
        basePower = move.bp;
      desc.moveBP = basePower;
      break;
    case "Terrain Pulse":
      basePower =
        move.bp * (isGrounded(attacker, field) && field.terrain ? 2 : 1);
      desc.moveBP = basePower;
      break;
    case "Rising Voltage":
      basePower =
        move.bp *
        (isGrounded(defender, field) && field.hasTerrain("Electric") ? 2 : 1);
      desc.moveBP = basePower;
      break;
    case "Psyblade":
      basePower = move.bp * (field.hasTerrain("Electric") ? 1.5 : 1);
      if (field.hasTerrain("Electric")) {
        desc.moveBP = basePower;
        desc.terrain = field.terrain;
      }
      break;
    case "Fling":
      // Remix: custom Fling powers per item (remix-data/move_effects.json -> remix.flingPower)
      basePower = (move.remix && move.remix.flingPower && attacker.item && move.remix.flingPower[attacker.item]) ||
        getFlingPower(attacker.item);
      desc.moveBP = basePower;
      desc.attackerItem = attacker.item;
      break;
    case "Dragon Energy":
    case "Eruption":
    case "Water Spout":
      basePower = Math.max(
        1,
        Math.floor((150 * attacker.curHP()) / attacker.maxHP())
      );
      desc.moveBP = basePower;
      break;
    case "Flail":
    case "Reversal":
      const p = Math.floor((48 * attacker.curHP()) / attacker.maxHP());
      basePower =
        p <= 1
          ? 200
          : p <= 4
          ? 150
          : p <= 9
          ? 100
          : p <= 16
          ? 80
          : p <= 32
          ? 40
          : 20;
      desc.moveBP = basePower;
      break;
    case "Natural Gift":
      if (attacker.item?.includes("Berry")) {
        const gift = getNaturalGift(gen, attacker.item)!;
        basePower = gift.p;
        desc.attackerItem = attacker.item;
        desc.moveBP = move.bp;
      } else {
        basePower = move.bp;
      }
      break;
    case "Nature Power":
      move.category = "Special";
      move.secondaries = true;
      switch (field.terrain) {
        case "Electric":
          basePower = 90;
          desc.moveName = "Thunderbolt";
          break;
        case "Grassy":
          basePower = 95;
          desc.moveName = "Energy Ball";
          break;
        case "Misty":
          basePower = 100;
          desc.moveName = "Moonblast";
          break;
        case "Psychic":
          basePower = 90;
          desc.moveName = "Psychic";
          break;
        default:
          basePower = 35;
          desc.hits = 3;
          desc.moveName = "Tri Attack";
      }
      break;
    case "Water Shuriken":
      basePower =
        attacker.named("Greninja-Ash") && attacker.hasAbility("Battle Bond")
          ? 20
          : 15;
      desc.moveBP = basePower;
      break;
    // Triple Axel's damage doubles after each consecutive hit (20, 40, 60), this is a hack
    case "Triple Axel":
      basePower = move.hits === 2 ? 30 : move.hits === 3 ? 40 : 20;
      desc.moveBP = basePower;
      break;
    // Triple Kick's damage doubles after each consecutive hit (10, 20, 30), this is a hack
    case "Triple Kick":
      basePower = move.hits === 2 ? 15 : move.hits === 3 ? 20 : 10;
      desc.moveBP = basePower;
      break;
    case "Crush Grip":
    case "Chromosome Crush":
      basePower =
        100 * Math.floor((defender.curHP() * 4096) / defender.maxHP());
      basePower =
        Math.floor(Math.floor((120 * basePower + 2048 - 1) / 4096) / 100) || 1;
      desc.moveBP = basePower;
      break;
    default:
      basePower = move.bp;
  }
  if (basePower === 0) {
    return 0;
  }
  if (
    move.named(
      "Breakneck Blitz",
      "Bloom Doom",
      "Inferno Overdrive",
      "Hydro Vortex",
      "Gigavolt Havoc",
      "Subzero Slammer",
      "Supersonic Skystrike",
      "Savage Spin-Out",
      "Acid Downpour",
      "Tectonic Rage",
      "Continental Crush",
      "All-Out Pummeling",
      "Shattered Psyche",
      "Never-Ending Nightmare",
      "Devastating Drake",
      "Black Hole Eclipse",
      "Corkscrew Crash",
      "Twinkle Tackle"
    )
  ) {
    // show z-move power in description
    desc.moveBP = move.bp;
  }
  const bpMods = calculateBPModsSMSSSV(
    gen,
    attacker,
    defender,
    move,
    field,
    desc,
    basePower,
    hasAteAbilityTypeChange,
    turnOrder
  );
  basePower = OF16(
    Math.max(1, pokeRound((basePower * chainMods(bpMods, 41, 2097152)) / 4096))
  );
  if (
    attacker.teraType &&
    move.type === attacker.teraType &&
    attacker.hasType(attacker.teraType) &&
    move.hits === 1 &&
    move.priority <= 0 &&
    move.bp > 0 &&
    !move.named("Dragon Energy", "Eruption", "Water Spout") &&
    basePower < 60 &&
    gen.num >= 9
  ) {
    basePower = 60;
    desc.moveBP = 60;
  }
  return basePower;
}

export function calculateBPModsSMSSSV(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field,
  desc: RawDesc,
  basePower: number,
  hasAteAbilityTypeChange: boolean,
  turnOrder: string
) {
  const bpMods = [];

  // Move effects

  let resistedKnockOffDamage =
    !defender.item ||
    (defender.named("Dialga-Origin") && defender.hasItem("Adamant Crystal")) ||
    (defender.named("Palkia-Origin") && defender.hasItem("Lustrous Globe")) ||
    // Griseous Core for gen 9, Griseous Orb otherwise
    (defender.name.includes("Giratina-Origin") &&
      defender.item.includes("Griseous")) ||
    (defender.name.includes("Arceus") && defender.item.includes("Plate")) ||
    (defender.name.includes("Genesect") && defender.item.includes("Drive")) ||
    (defender.named("Groudon", "Groudon-Primal") &&
      defender.hasItem("Red Orb")) ||
    (defender.named("Kyogre", "Kyogre-Primal") &&
      defender.hasItem("Blue Orb")) ||
    (defender.name.includes("Silvally") && defender.item.includes("Memory")) ||
    defender.item.includes(" Z") ||
    (defender.named("Zacian") && defender.hasItem("Rusted Sword")) ||
    (defender.named("Zamazenta") && defender.hasItem("Rusted Shield")) ||
    (defender.named("Venomicon-Epilogue") && defender.hasItem("Vile Vial"));

  // The last case only applies when the Pokemon has the Mega Stone that matches its species
  // (or when it's already a Mega-Evolution)
  if (!resistedKnockOffDamage && defender.item) {
    const item = gen.items.get(toID(defender.item))!;
    resistedKnockOffDamage =
      !!item.megaEvolves && defender.name.includes(item.megaEvolves);
  }

  if (
    (move.named("Facade") && attacker.hasStatus("brn", "par", "psn", "tox")) ||
    (move.named("Brine") && defender.curHP() <= defender.maxHP() / 2) ||
    (move.named("Venoshock") && defender.hasStatus("psn", "tox")) ||
    (move.named("Lash Out") && countBoosts(gen, attacker.boosts) < 0)
  ) {
    bpMods.push(8192);
    desc.moveBP = basePower * 2;
  } else if (
    move.named("Expanding Force") &&
    isGrounded(attacker, field) &&
    field.hasTerrain("Psychic")
  ) {
    move.target = "allAdjacentFoes";
    bpMods.push(6144);
    desc.moveBP = basePower * 1.5;
  } else if (
    (move.named("Knock Off") && !resistedKnockOffDamage) ||
    (move.named("Misty Explosion") &&
      isGrounded(attacker, field) &&
      field.hasTerrain("Misty")) ||
    (move.named("Grav Apple") && field.isGravity)
  ) {
    bpMods.push(6144);
    desc.moveBP = basePower * 1.5;
  } else if (
    move.named("Solar Beam", "Solar Blade") &&
    field.hasWeather("Rain", "Heavy Rain", "Sand", "Hail", "Snow")
  ) {
    bpMods.push(2048);
    desc.moveBP = basePower / 2;
    desc.weather = field.weather;
  } else if (move.named("Collision Course", "Electro Drift")) {
    const isGhostRevealed =
      attacker.hasAbility("Scrappy") || field.defenderSide.isForesight;
    const isRingTarget =
      defender.hasItem("Ring Target") && !defender.hasAbility("Klutz");
    const types = defender.teraType ? [defender.teraType] : defender.types;
    const type1Effectiveness = getMoveEffectiveness(
      gen,
      move,
      types[0],
      isGhostRevealed,
      field.isGravity,
      isRingTarget
    );
    const type2Effectiveness = types[1]
      ? getMoveEffectiveness(
          gen,
          move,
          types[1],
          isGhostRevealed,
          field.isGravity,
          isRingTarget
        )
      : 1;
    if (type1Effectiveness * type2Effectiveness >= 2) {
      bpMods.push(5461);
      desc.moveBP = basePower * (5461 / 4096);
    }
  }

  // Remix: Lunar Aura (user's side) boosts Psychic, Fairy, Ghost and Dark moves by 50%
  if (gen.num === 7 && field.attackerSide.isLunarAura && move.hasType("Psychic", "Fairy", "Ghost", "Dark")) {
    bpMods.push(6144);
    desc.moveBP = basePower * 1.5;
  }
  // Remix: Mudslide field cuts Electric moves to 1/3 power
  if (gen.num === 7 && field.isMudslide && move.hasType("Electric")) {
    bpMods.push(1365);
    desc.moveBP = basePower / 3;
  }
  // Sweltering Sun Remix: data-driven power boosts (remix-data/move_effects.json -> move.remix)
  const rx = move.remix;
  if (rx) {
    let mult = 1;
    const weather = field.weather === "Harsh Sunshine" ? "Sun" : field.weather === "Heavy Rain" ? "Rain" : field.weather;
    if (rx.statusBoost && defender.status) {
      mult *= rx.statusBoost[defender.status === "tox" ? "psn" : defender.status] || rx.statusBoost.any || 1;
    }
    if (rx.weatherBoost && weather && rx.weatherBoost[weather]) mult *= rx.weatherBoost[weather];
    if (rx.terrainBoost && field.terrain) mult *= rx.terrainBoost[field.terrain] || rx.terrainBoost.any || 1;
    if (rx.gravityBoost && field.isGravity) mult *= rx.gravityBoost;
    if (rx.lunarAuraBoost && field.attackerSide.isLunarAura) mult *= rx.lunarAuraBoost;
    if (rx.mudslideBoost && field.isMudslide) mult *= rx.mudslideBoost;
    if (rx.stealBoost && defender.item && !attacker.item) mult *= 1.5;
    if (rx.berryBoost && defender.item && defender.item.endsWith("Berry")) mult *= 1.5;
    if (mult !== 1) {
      bpMods.push(Math.round(4096 * mult));
      desc.moveBP = basePower * mult;
    }
  }

  if (field.attackerSide.isHelpingHand) {
    bpMods.push(6144);
    desc.isHelpingHand = true;
  }

  // Field effects

  const terrainMultiplier = gen.num > 7 ? 5325 : 6144;
  if (isGrounded(attacker, field)) {
    if (
      (field.hasTerrain("Electric") && move.hasType("Electric")) ||
      (field.hasTerrain("Grassy") && move.hasType("Grass")) ||
      (field.hasTerrain("Psychic") && move.hasType("Psychic")) ||
      (gen.num === 7 && field.hasTerrain("Misty") && move.hasType("Fairy")) // Remix: Misty boosts Fairy
    ) {
      bpMods.push(terrainMultiplier);
      desc.terrain = field.terrain;
    }
  }
  if (isGrounded(defender, field)) {
    if (
      (gen.num !== 7 && field.hasTerrain("Misty") && move.hasType("Dragon")) || // Remix: no Dragon cut
      (field.hasTerrain("Grassy") && move.named("Bulldoze", "Earthquake"))
    ) {
      bpMods.push(2048);
      desc.terrain = field.terrain;
    }
  }

  // Abilities

  // Use BasePower after moves with custom BP to determine if Technician should boost
  if (
    (attacker.hasAbility("Technician") && basePower <= 60) ||
    (gen.num !== 7 && attacker.hasAbility("Flare Boost") &&
      attacker.hasStatus("brn") &&
      move.category === "Special") ||
    (gen.num !== 7 && attacker.hasAbility("Toxic Boost") &&
      attacker.hasStatus("psn", "tox") &&
      move.category === "Physical") ||
    // Remix (gen 7) 1.5x power boosts
    (gen.num === 7 && (
      (attacker.hasAbility("Toxic Boost") && move.hasType("Poison")) ||
      (attacker.hasAbility("Titanic") && move.hasType("Ice", "Rock", "Steel")) ||
      (attacker.hasAbility("Levitate") && move.hasType("Flying")) ||
      (attacker.hasAbility("Sand Force") && field.hasWeather("Sand")) ||
      (attacker.hasAbility("Seasonal Spirit") && move.hasType(
        ({Summer: "Grass", Autumn: "Fighting", Winter: "Ice"} as any)[attacker.name.split("-")[1]] || "Fairy")))) ||
    (attacker.hasAbility("Mega Launcher") && move.flags.pulse) ||
    (attacker.hasAbility("Strong Jaw") && move.flags.bite) ||
    (attacker.hasAbility("Steely Spirit") && move.hasType("Steel")) ||
    (attacker.hasAbility("Sharpness") && move.flags.slicing)
  ) {
    bpMods.push(6144);
    desc.attackerAbility = attacker.ability;
  }

  const aura = `${move.type} Aura`;
  const isAttackerAura = attacker.hasAbility(aura);
  const isDefenderAura = defender.hasAbility(aura);
  const isUserAuraBreak =
    attacker.hasAbility("Aura Break") ||
    defender.hasAbility("Aura Break") ||
    attacker.hasAbility("Distortion") ||
    defender.hasAbility("Distortion");
  const isFieldAuraBreak = field.isAuraBreak;
  const isFieldFairyAura = field.isFairyAura && move.type === "Fairy";
  const isFieldDarkAura = field.isDarkAura && move.type === "Dark";
  const auraActive =
    isAttackerAura || isDefenderAura || isFieldFairyAura || isFieldDarkAura;
  const auraBreak = isFieldAuraBreak || isUserAuraBreak;
  if (auraActive) {
    if (auraBreak) {
      bpMods.push(3072);
      desc.attackerAbility = attacker.ability;
      desc.defenderAbility = defender.ability;
    } else {
      bpMods.push(5448);
      if (isAttackerAura) desc.attackerAbility = attacker.ability;
      if (isDefenderAura) desc.defenderAbility = defender.ability;
    }
  }

  // Sheer Force does not power up max moves or remove the effects (SadisticMystic)
  if (
    (attacker.hasAbility("Sheer Force") &&
      (move.secondaries || move.named("Jet Punch", "Order Up")) &&
      !move.isMax) ||
    (gen.num !== 7 && attacker.hasAbility("Sand Force") &&
      field.hasWeather("Sand") &&
      move.hasType("Rock", "Ground", "Steel")) ||
    (attacker.hasAbility("Analytic") &&
      (turnOrder !== "first" || field.defenderSide.isSwitching === "out")) ||
    (attacker.hasAbility("Tough Claws") && move.flags.contact) ||
    (attacker.hasAbility("Punk Rock") && move.flags.sound)
  ) {
    bpMods.push(5325);
    desc.attackerAbility = attacker.ability;
  }

  if (field.attackerSide.isBattery && move.category === "Special") {
    bpMods.push(5325);
    desc.isBattery = true;
  }

  if (field.attackerSide.isPowerSpot) {
    bpMods.push(5325);
    desc.isPowerSpot = true;
  }

  if (
    attacker.hasAbility("Rivalry") &&
    ![attacker.gender, defender.gender].includes("N")
  ) {
    if (attacker.gender === defender.gender) {
      bpMods.push(5120);
      desc.rivalry = "buffed";
    } else {
      bpMods.push(3072);
      desc.rivalry = "nerfed";
    }
    desc.attackerAbility = attacker.ability;
  }

  // The -ate abilities already changed move typing earlier, so most checks are done and desc is set
  // However, Max Moves also don't boost -ate Abilities
  if (!move.isMax && hasAteAbilityTypeChange) {
    bpMods.push(4915);
  }

  if (
    (attacker.hasAbility("Reckless") && (move.recoil || move.hasCrashDamage)) ||
    (attacker.hasAbility("Iron Fist") && move.flags.punch) ||
    (gen.num !== 7 && attacker.hasAbility("Amplifier") && move.flags.sound)
  ) {
    bpMods.push(4915);
    desc.attackerAbility = attacker.ability;
  }

  // Remix (gen 7) 1.3x: Corrosion Poison moves, Amplifier sound moves
  if (gen.num === 7 && (
    (attacker.hasAbility("Corrosion") && move.hasType("Poison")) ||
    (attacker.hasAbility("Amplifier") && move.flags.sound))) {
    bpMods.push(5325);
    desc.attackerAbility = attacker.ability;
  }

  // Remix item power boosts (type boosts, move boosts)
  {
    const fx = attacker.remixItemFx();
    const pow = (fx.boost[move.type] || 1) * (fx.moveBoost[move.name] || 1);
    if (pow !== 1) {
      bpMods.push(Math.round(4096 * pow));
      desc.attackerItem = attacker.item;
    }
  }

  if (attacker.hasItem("Punching Glove") && move.flags.punch) {
    bpMods.push(4506);
    desc.attackerItem = attacker.item;
  }

  if (defender.hasAbility("Heatproof") && move.hasType("Fire")) {
    bpMods.push(2048);
    desc.defenderAbility = defender.ability;
  } else if (defender.hasAbility("Dry Skin") && move.hasType("Fire")) {
    bpMods.push(5120);
    desc.defenderAbility = defender.ability;
  }

  if (attacker.hasAbility("Supreme Overlord") && attacker.alliesFainted) {
    const powMod = [4096, 4506, 4915, 5325, 5734, 6144];
    bpMods.push(powMod[Math.min(5, attacker.alliesFainted)]);
    desc.attackerAbility = attacker.ability;
    desc.alliesFainted = attacker.alliesFainted;
  }

  // Items

  if (gen.num === 7 && attacker.hasItem("Normal Gem") && move.hasType("Normal")) {
    bpMods.push(6144); // Remix: Normal Gem 1.5x (the other gems are signature items now)
    desc.attackerItem = attacker.item;
  } else if (gen.num !== 7 && attacker.hasItem(`${move.type} Gem`)) {
    bpMods.push(5325);
    desc.attackerItem = attacker.item;
  } else if (attacker.hasItem("Dragon Fang") && move.hasType("Dragon")) {
    bpMods.push(gen.num === 7 ? 4915 : 5325); // Remix: Dragon Fang 20% like the other type items
    desc.attackerItem = attacker.item;
  } else if (
    (attacker.hasItem("Adamant Orb") &&
      attacker.named("Dialga") &&
      move.hasType("Steel", "Dragon")) ||
    (attacker.hasItem("Lustrous Orb") &&
      attacker.named("Palkia") &&
      move.hasType("Water", "Dragon"))
  ) {
    bpMods.push(6144);
    desc.attackerItem = attacker.item;
  } else if (
    (attacker.hasItem("Adamant Crystal") && attacker.named("Dialga-Origin")) ||
    (attacker.hasItem("Adamant Orb") &&
      attacker.named("Dialga") &&
      move.hasType("Steel", "Dragon")) ||
    (attacker.hasItem("Lustrous Orb") && attacker.named("Palkia")) ||
    (attacker.hasItem("Lustrous Globe") &&
      attacker.named("Palkia-Origin") &&
      move.hasType("Water", "Dragon")) ||
    ((attacker.hasItem("Griseous Orb") || attacker.hasItem("Griseous Core")) &&
      (attacker.named("Giratina-Origin") || attacker.named("Giratina")) &&
      move.hasType("Ghost", "Dragon")) ||
    (attacker.hasItem("Vile Vial") &&
      attacker.named("Venomicon-Epilogue") &&
      move.hasType("Poison", "Flying")) ||
    (attacker.hasItem("Soul Dew") &&
      attacker.named("Latios", "Latias", "Latios-Mega", "Latias-Mega") &&
      move.hasType("Psychic", "Dragon")) ||
    (attacker.item && move.hasType(getItemBoostType(attacker.item)))
  ) {
    bpMods.push(4915);
    desc.attackerItem = attacker.item;
  } else if (
    (attacker.hasItem("Muscle Band") && move.category === "Physical") ||
    (attacker.hasItem("Wise Glasses") && move.category === "Special")
  ) {
    bpMods.push(4505);
    desc.attackerItem = attacker.item;
  }
  return bpMods;
}

export function calculateAttackSMSSSV(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field,
  desc: RawDesc,
  isCritical = false
) {
  let attack: number;
  const attackSource = move.named("Foul Play") ? defender : attacker;
  if (
    move.named(
      "Photon Geyser",
      "Light That Burns The Sky",
      "Twilight Cannon"
    ) ||
    (move.named("Tera Blast") && attackSource.teraType) ||
    (move.remix && move.remix.useHigherStat)
  ) {
    move.category =
      attackSource.stats.atk > attackSource.stats.spa ? "Physical" : "Special";
  }
  const attackStat =
    move.named("Shell Side Arm") &&
    getShellSideArmCategory(attacker, defender) === "Physical"
      ? "atk"
      : move.named("Body Press")
      ? "def"
      : move.category === "Special"
      ? "spa"
      : "atk";
  desc.attackEVs = move.named("Foul Play")
    ? getStatDescriptionText(gen, defender, attackStat, defender.nature)
    : getStatDescriptionText(gen, attacker, attackStat, attacker.nature);

  if (
    attackSource.boosts[attackStat] === 0 ||
    (isCritical && attackSource.boosts[attackStat] < 0)
  ) {
    attack = attackSource.rawStats[attackStat];
  } else if (defender.hasAbility("Unaware")) {
    attack = attackSource.rawStats[attackStat];
    desc.defenderAbility = defender.ability;
  } else {
    attack = attackSource.stats[attackStat];
    desc.attackBoost = attackSource.boosts[attackStat];
  }

  // unlike all other attack modifiers, Hustle gets applied directly
  if (attacker.hasAbility("Hustle") && move.category === "Physical") {
    attack = pokeRound((attack * 3) / 2);
    desc.attackerAbility = attacker.ability;
  }
  const atMods = calculateAtModsSMSSSV(
    gen,
    attacker,
    defender,
    move,
    field,
    desc
  );
  attack = OF16(
    Math.max(1, pokeRound((attack * chainMods(atMods, 410, 131072)) / 4096))
  );
  return attack;
}

export function calculateAtModsSMSSSV(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field,
  desc: RawDesc
) {
  const atMods = [];

  // Remix (gen 7) attack changes (the matching vanilla lines below are switched off for gen 7)
  if (gen.num === 7 && move.category !== "Status") {
    const phys = move.category === "Physical";
    if (
      (attacker.hasAbility("Guts") && attacker.status) ||
      (attacker.hasAbility("Flare Boost") && attacker.hasStatus("brn")) ||
      (attacker.hasAbility("Solar Power") && field.hasWeather("Sun", "Harsh Sunshine")) ||
      (phys && attacker.hasAbility("Toxic Boost") && attacker.hasStatus("psn", "tox")) ||
      (!phys && attacker.named("Cherrim") && attacker.hasAbility("Flower Gift") &&
        field.hasWeather("Sun", "Harsh Sunshine"))
    ) {
      atMods.push(6144);
      desc.attackerAbility = attacker.ability;
    } else if (!phys && field.attackerSide.isFlowerGift && field.hasWeather("Sun", "Harsh Sunshine")) {
      atMods.push(6144);
      desc.isFlowerGiftAttacker = true;
    }
    for (const st of attacker.remixItemFx().stats) {
      if (st.stat === (phys ? "at" : "sa") && remixStatCondition(st, field)) {
        atMods.push(Math.round(4096 * st.mult));
        desc.attackerItem = attacker.item;
      }
    }
    if (attacker.hasAbility("Steelworker") && move.hasType("Fire")) {
      atMods.push(6144);
      desc.attackerAbility = attacker.ability;
    }
    if (attacker.hasAbility("Infected") && attacker.curHP() <= attacker.maxHP() / 2) {
      atMods.push(2048);
      desc.attackerAbility = attacker.ability;
    }
    if ((defender.hasAbility("Titanic") && move.hasType("Ice")) ||
      (defender.hasAbility("Hydration") && move.hasType("Fire"))) {
      atMods.push(2048);
      desc.defenderAbility = defender.ability;
    }
  }

  // Slow Start also halves damage with special Z-moves
  if (
    (attacker.hasAbility("Slow Start") &&
      attacker.abilityOn &&
      (move.category === "Physical" ||
        (move.category === "Special" && move.isZ))) ||
    (attacker.hasAbility("Defeatist") &&
      attacker.curHP() <= attacker.maxHP() / 2)
  ) {
    atMods.push(2048);
    desc.attackerAbility = attacker.ability;
  } else if (
    (gen.num !== 7 && attacker.hasAbility("Solar Power") &&
      field.hasWeather("Sun", "Harsh Sunshine") &&
      move.category === "Special") ||
    (gen.num !== 7 && attacker.named("Cherrim") &&
      attacker.hasAbility("Flower Gift") &&
      field.hasWeather("Sun", "Harsh Sunshine") &&
      move.category === "Physical") ||
    // Gorilla Tactics has no effect during Dynamax (Anubis)
    (attacker.hasAbility("Gorilla Tactics") &&
      move.category === "Physical" &&
      !attacker.isDynamaxed)
  ) {
    atMods.push(6144);
    desc.attackerAbility = attacker.ability;
    desc.weather = field.weather;
  } else if (
    gen.num !== 7 &&
    field.attackerSide.isFlowerGift &&
    field.hasWeather("Sun", "Harsh Sunshine") &&
    move.category === "Physical"
  ) {
    atMods.push(6144);
    desc.weather = field.weather;
    desc.isFlowerGiftAttacker = true;
  } else if (
    (gen.num !== 7 && attacker.hasAbility("Guts") &&
      attacker.status &&
      move.category === "Physical") ||
    (attacker.curHP() <= attacker.maxHP() / 3 &&
      ((attacker.hasAbility("Overgrow") && move.hasType("Grass")) ||
        (attacker.hasAbility("Blaze") && move.hasType("Fire")) ||
        (attacker.hasAbility("Torrent") && move.hasType("Water")) ||
        (attacker.hasAbility("Swarm") && move.hasType("Bug")))) ||
    (move.category === "Special" &&
      attacker.abilityOn &&
      attacker.hasAbility("Plus", "Minus", "Interstellar", "Evoboost"))
  ) {
    atMods.push(6144);
    desc.attackerAbility = attacker.ability;
  } else if (
    attacker.hasAbility("Flash Fire") &&
    attacker.abilityOn &&
    move.hasType("Fire")
  ) {
    atMods.push(6144);
    desc.attackerAbility = "Flash Fire";
  } else if (
    (attacker.hasAbility("Steelworker") && move.hasType("Steel")) ||
    (attacker.hasAbility("Dragon's Maw") && move.hasType("Dragon")) ||
    (attacker.hasAbility("Transistor") && move.hasType("Electric")) ||
    (attacker.hasAbility("Rocky Payload") && move.hasType("Rock"))
  ) {
    atMods.push(6144);
    desc.attackerAbility = attacker.ability;
  } else if (attacker.hasAbility("Stakeout") && attacker.abilityOn) {
    atMods.push(8192);
    desc.attackerAbility = attacker.ability;
  } else if (
    (attacker.hasAbility("Water Bubble", "Liquid Veil") &&
      move.hasType("Water")) ||
    (attacker.hasAbility("Huge Power", "Pure Power") &&
      move.category === "Physical")
  ) {
    atMods.push(8192);
    desc.attackerAbility = attacker.ability;
  }

  if (
    (defender.hasAbility("Thick Fat") && move.hasType("Fire", "Ice")) ||
    (defender.hasAbility("Water Bubble", "Liquid Veil") &&
      move.hasType("Fire")) ||
    (defender.hasAbility("Purifying Salt") && move.hasType("Ghost"))
  ) {
    atMods.push(2048);
    desc.defenderAbility = defender.ability;
  }

  const isTabletsOfRuinActive =
    defender.hasAbility("Tablets of Ruin") || field.isTabletsOfRuin;
  const isVesselOfRuinActive =
    defender.hasAbility("Vessel of Ruin") || field.isVesselOfRuin;
  if (
    (isTabletsOfRuinActive && move.category === "Physical") ||
    (isVesselOfRuinActive && move.category === "Special")
  ) {
    if (
      defender.hasAbility("Tablets of Ruin") ||
      defender.hasAbility("Vessel of Ruin")
    ) {
      desc.defenderAbility = defender.ability;
    } else {
      desc[move.category === "Special" ? "isVesselOfRuin" : "isTabletsOfRuin"] =
        true;
    }
    atMods.push(3072);
  }

  if (
    (attacker.hasAbility("Protosynthesis") &&
      (field.hasWeather("Sun") || attacker.hasItem("Booster Energy"))) ||
    (attacker.hasAbility("Quark Drive") &&
      (field.hasTerrain("Electric") || attacker.hasItem("Booster Energy")))
  ) {
    if (
      (move.category === "Physical" &&
        getMostProficientStat(attacker) === "atk") ||
      (move.category === "Special" && getMostProficientStat(attacker) === "spa")
    ) {
      atMods.push(5325);
      desc.attackerAbility = attacker.ability;
    }
  }

  if (
    (attacker.hasAbility("Hadron Engine") &&
      move.category === "Special" &&
      field.hasTerrain("Electric") &&
      isGrounded(attacker, field)) ||
    (attacker.hasAbility("Orichalcum Pulse") &&
      move.category === "Physical" &&
      field.hasWeather("Sun", "Harsh Sunshine") &&
      !attacker.hasItem("Utility Umbrella"))
  ) {
    atMods.push(5461);
    desc.attackerAbility = attacker.ability;
  }

  if (
    (attacker.hasItem("Thick Club") &&
      attacker.named(
        "Cubone",
        "Marowak",
        "Marowak-Alola",
        "Marowak-Alola-Totem"
      ) &&
      move.category === "Physical") ||
    (attacker.hasItem("Deep Sea Tooth") &&
      attacker.named("Clamperl") &&
      move.category === "Special") ||
    (gen.num !== 7 && attacker.hasItem("Light Ball") &&
      attacker.name.includes("Pikachu") &&
      !move.isZ)
  ) {
    atMods.push(8192);
    desc.attackerItem = attacker.item;
    // Choice Band/Scarf/Specs move lock and stat boosts are ignored during Dynamax (Anubis)
  } else if (
    !move.isZ &&
    !move.isMax &&
    ((attacker.hasItem("Choice Band") && move.category === "Physical") ||
      (attacker.hasItem("Choice Specs") && move.category === "Special"))
  ) {
    atMods.push(6144);
    desc.attackerItem = attacker.item;
  }
  return atMods;
}

export function calculateDefenseSMSSSV(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field,
  desc: RawDesc,
  isCritical = false
) {
  let defense: number;
  const hitsPhysical =
    move.overrideDefensiveStat === "def" ||
    move.category === "Physical" ||
    (move.named("Shell Side Arm") &&
      getShellSideArmCategory(attacker, defender) === "Physical");
  const defenseStat = hitsPhysical ? "def" : "spd";
  desc.defenseEVs = getStatDescriptionText(
    gen,
    defender,
    defenseStat,
    defender.nature
  );
  if (
    defender.boosts[defenseStat] === 0 ||
    (isCritical && defender.boosts[defenseStat] > 0) ||
    move.ignoreDefensive
  ) {
    defense = defender.rawStats[defenseStat];
  } else if (attacker.hasAbility("Unaware")) {
    defense = defender.rawStats[defenseStat];
    desc.attackerAbility = attacker.ability;
  } else {
    defense = defender.stats[defenseStat];
    desc.defenseBoost = defender.boosts[defenseStat];
  }

  // unlike all other defense modifiers, Sandstorm SpD boost gets applied directly
  if (field.hasWeather("Sand") && defender.hasType("Rock") && !hitsPhysical) {
    defense = pokeRound((defense * 3) / 2);
    desc.weather = field.weather;
  }
  // Remix (gen 7): Snow (Hail) gives Ice types 1.5x Defense
  if ((field.hasWeather("Snow") || (gen.num === 7 && field.hasWeather("Hail"))) &&
    defender.hasType("Ice") && hitsPhysical) {
    defense = pokeRound((defense * 3) / 2);
    desc.weather = field.weather;
  }

  const dfMods = calculateDfModsSMSSSV(
    gen,
    attacker,
    defender,
    move,
    field,
    desc,
    isCritical,
    hitsPhysical
  );

  return OF16(
    Math.max(1, pokeRound((defense * chainMods(dfMods, 410, 131072)) / 4096))
  );
}

export function calculateDfModsSMSSSV(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field,
  desc: RawDesc,
  isCritical = false,
  hitsPhysical = false
) {
  const dfMods = [];
  // Remix (gen 7) defense changes
  if (gen.num === 7) {
    for (const st of defender.remixItemFx().stats) {
      if (st.stat === (hitsPhysical ? "df" : "sd") && remixStatCondition(st, field)) {
        dfMods.push(Math.round(4096 * st.mult));
        desc.defenderItem = defender.item;
      }
    }
    const cloak = defender.hasAbility("Climate Cloak") && /^(Burmy|Wormadam)/.test(defender.name)
      ? (/-Sandy$/.test(defender.name) ? "Sand" : /-(Trash|Snow)$/.test(defender.name) ? "Hail" : "Grassy")
      : "";
    if (
      (hitsPhysical && defender.hasAbility("Marvel Scale") && defender.status) ||
      (hitsPhysical && defender.hasAbility("Sandy Shield") && field.hasWeather("Sand")) ||
      (!hitsPhysical && defender.hasAbility("Radiant Fur", "Permafrost"))
    ) {
      dfMods.push(8192);
      desc.defenderAbility = defender.ability;
    } else if (
      (!hitsPhysical && defender.hasAbility("Rain Dish") && field.hasWeather("Rain", "Heavy Rain")) ||
      (cloak === "Grassy" && field.hasTerrain("Grassy")) ||
      (cloak && cloak !== "Grassy" && field.hasWeather(cloak as any))
    ) {
      dfMods.push(6144);
      desc.defenderAbility = defender.ability;
    }
  }
  if (gen.num !== 7 && defender.hasAbility("Marvel Scale") && defender.status && hitsPhysical) {
    dfMods.push(6144);
    desc.defenderAbility = defender.ability;
  } else if (
    defender.named("Cherrim") &&
    defender.hasAbility("Flower Gift") &&
    field.hasWeather("Sun", "Harsh Sunshine") &&
    !hitsPhysical
  ) {
    dfMods.push(6144);
    desc.defenderAbility = defender.ability;
    desc.weather = field.weather;
  } else if (
    field.defenderSide.isFlowerGift &&
    field.hasWeather("Sun", "Harsh Sunshine") &&
    !hitsPhysical
  ) {
    dfMods.push(6144);
    desc.weather = field.weather;
    desc.isFlowerGiftDefender = true;
  } else if (
    defender.hasAbility("Grass Pelt", "Grassy Guard") &&
    field.hasTerrain("Grassy") &&
    hitsPhysical
  ) {
    dfMods.push(6144);
    desc.defenderAbility = defender.ability;
  } else if (defender.hasAbility("Fur Coat") && hitsPhysical) {
    dfMods.push(8192);
    desc.defenderAbility = defender.ability;
  }

  const isSwordOfRuinActive =
    attacker.hasAbility("Sword of Ruin") || field.isSwordOfRuin;
  const isBeadsOfRuinActive =
    attacker.hasAbility("Beads of Ruin") || field.isBeadsOfRuin;
  if (
    (isSwordOfRuinActive && hitsPhysical) ||
    (isBeadsOfRuinActive && !hitsPhysical)
  ) {
    if (
      attacker.hasAbility("Sword of Ruin") ||
      attacker.hasAbility("Beads of Ruin")
    ) {
      desc.attackerAbility = attacker.ability;
    } else {
      desc[hitsPhysical ? "isSwordOfRuin" : "isBeadsOfRuin"] = true;
    }
    dfMods.push(3072);
  }

  if (
    (defender.hasAbility("Protosynthesis") &&
      (field.hasWeather("Sun") || attacker.hasItem("Booster Energy"))) ||
    (defender.hasAbility("Quark Drive") &&
      (field.hasTerrain("Electric") || attacker.hasItem("Booster Energy")))
  ) {
    if (
      (hitsPhysical && getMostProficientStat(defender) === "def") ||
      (!hitsPhysical && getMostProficientStat(defender) === "spd")
    ) {
      desc.defenderAbility = defender.ability;
      dfMods.push(5324);
    }
  }

  if (
    (defender.hasItem("Eviolite") &&
      gen.species.get(toID(defender.name))?.nfe) ||
    (!hitsPhysical && defender.hasItem("Assault Vest"))
  ) {
    dfMods.push(6144);
    desc.defenderItem = defender.item;
  } else if (
    (defender.hasItem("Metal Powder") &&
      defender.named("Ditto") &&
      hitsPhysical) ||
    (defender.hasItem("Deep Sea Scale") &&
      defender.named("Clamperl") &&
      !hitsPhysical)
  ) {
    dfMods.push(8192);
    desc.defenderItem = defender.item;
  }
  return dfMods;
}

export function calculateFinalModsSMSSSV(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field,
  desc: RawDesc,
  isCritical = false,
  typeEffectiveness: number
) {
  const finalMods = [];

  if (
    field.defenderSide.isReflect &&
    move.category === "Physical" &&
    (gen.num === 7 || !isCritical) && // Remix: crits no longer ignore screens
    !field.defenderSide.isAuroraVeil
  ) {
    // doesn't stack with Aurora Veil
    finalMods.push(field.gameType !== "Singles" ? 2732 : 2048);
    desc.isReflect = true;
  } else if (
    field.defenderSide.isLightScreen &&
    move.category === "Special" &&
    (gen.num === 7 || !isCritical) &&
    !field.defenderSide.isAuroraVeil
  ) {
    // doesn't stack with Aurora Veil
    finalMods.push(field.gameType !== "Singles" ? 2732 : 2048);
    desc.isLightScreen = true;
  }
  if (field.defenderSide.isAuroraVeil && (gen.num === 7 || !isCritical)) {
    finalMods.push(field.gameType !== "Singles" ? 2732 : 2048);
    desc.isAuroraVeil = true;
  }

  if (attacker.hasAbility("Neuroforce") && typeEffectiveness > 1) {
    finalMods.push(5120);
    desc.attackerAbility = attacker.ability;
  } else if (
    (attacker.hasAbility("Sniper") || attacker.hasAbility("Ruthless")) &&
    isCritical
  ) {
    finalMods.push(6144);
    desc.attackerAbility = attacker.ability;
  } else if (attacker.hasAbility("Tinted Lens") && typeEffectiveness < 1) {
    finalMods.push(8192);
    desc.attackerAbility = attacker.ability;
  }

  if (
    defender.isDynamaxed &&
    move.named("Dynamax Cannon", "Behemoth Blade", "Behemoth Bash")
  ) {
    finalMods.push(8192);
  }

  if (
    defender.hasAbility("Multiscale", "Shadow Shield", "Energy Shield") &&
    defender.curHP() === defender.maxHP() &&
    ((!field.defenderSide.isSR &&
      (!field.defenderSide.spikes || defender.hasType("Flying"))) ||
      defender.hasItem("Heavy-Duty Boots")) &&
    !attacker.hasAbility("Parental Bond (Child)") &&
    !attacker.hasAbility("Beatdown (Second Hit)") &&
    !(move as any).remixLaterHit
  ) {
    finalMods.push(2048);
    desc.defenderAbility = defender.ability;
  }

  // Remix items: damage taken by type, and "x4 vs Steel" moves
  if (gen.num === 7) {
    const dfx = defender.remixItemFx();
    if (dfx.resist[move.type]) {
      finalMods.push(Math.round(4096 * dfx.resist[move.type]));
      desc.defenderItem = defender.item;
    }
    const vs = attacker.remixItemFx().vsSteel[move.type];
    if (vs && defender.hasType("Steel")) {
      finalMods.push(Math.round(4096 * vs));
      desc.attackerItem = attacker.item;
    }
  }

  // Remix (gen 7): 1/4 damage from listed types
  if (gen.num === 7 && (
    (defender.hasAbility("Rock-Solid") && move.hasType("Rock", "Ground", "Steel", "Fighting")) ||
    (defender.hasAbility("Permafrost") && move.hasType("Ice") && !defender.hasType("Ice")) ||
    (defender.hasAbility("Neurotoxin") && move.hasType("Psychic")))) {
    finalMods.push(1024);
    desc.defenderAbility = defender.ability;
  }
  if (gen.num === 7 && defender.hasAbility("Amplifier") && move.flags.sound) {
    finalMods.push(2048);
    desc.defenderAbility = defender.ability;
  }

  if (
    defender.hasAbility("Fluffy", "Steel Wool") &&
    move.flags.contact &&
    !attacker.hasAbility("Long Reach")
  ) {
    finalMods.push(2048);
    desc.defenderAbility = defender.ability;
  } else if (
    (defender.hasAbility("Punk Rock") && move.flags.sound) ||
    (defender.hasAbility("Ice Scales") && move.category === "Special")
  ) {
    finalMods.push(2048);
    desc.defenderAbility = defender.ability;
  }

  if (
    defender.hasAbility("Solid Rock", "Filter", "Prism Armor", "Resilient") &&
    typeEffectiveness > 1
  ) {
    finalMods.push(3072);
    desc.defenderAbility = defender.ability;
  }

  if (field.defenderSide.isFriendGuard) {
    finalMods.push(3072);
    desc.isFriendGuard = true;
  }

  if (defender.hasAbility("Fluffy", "Steel Wool") && move.hasType("Fire")) {
    finalMods.push(8192);
    desc.defenderAbility = defender.ability;
  }

  if (attacker.hasItem("Expert Belt") && typeEffectiveness > 1 && !move.isZ) {
    finalMods.push(5120);
    desc.attackerItem = attacker.item;
  } else if (attacker.hasItem("Life Orb")) {
    finalMods.push(5324);
    desc.attackerItem = attacker.item;
  } else if (
    attacker.hasItem("Metronome") &&
    move.timesUsedWithMetronome! >= 1 &&
    (gen.num !== 7 || attacker.remixItemFx().metronomeStep > 0)
  ) {
    const timesUsedWithMetronome = Math.floor(move.timesUsedWithMetronome!);
    // Remix: step per use comes from the item (Chatot/Kricketune +35%, Stoutland's Snowball +20%), max 2x
    const step = gen.num === 7 ? Math.round(4096 * attacker.remixItemFx().metronomeStep) : 819;
    finalMods.push(Math.min(8192, 4096 + timesUsedWithMetronome * step));
    desc.attackerItem = attacker.item;
  }

  if (
    move.hasType(getBerryResistType(defender.item)) &&
    (typeEffectiveness > 1 || move.hasType("Normal")) &&
    !attacker.hasAbility("Unnerve", "As One (Glastrier)", "As One (Spectrier)")
  ) {
    if (defender.hasAbility("Ripen")) {
      finalMods.push(1024);
    } else {
      finalMods.push(2048);
    }
    desc.defenderItem = defender.item;
  }

  return finalMods;
}

function hasTerrainSeed(pokemon: Pokemon) {
  return pokemon.hasItem(
    "Electric Seed",
    "Misty Seed",
    "Grassy Seed",
    "Psychic Seed"
  );
}
