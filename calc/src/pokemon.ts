import * as I from './data/interface';
import {Stats} from './stats';
import {toID, extend, assignWithout} from './util';
import {State} from './state';
import {REMIX_ITEM_EFFECTS} from './data/remix_items';

// Remix: merged effects of a held Remix item (see remix-data/item_effects.json)
export interface RemixItemFx {
  abilities: string[]; items: string[]; boost: {[t: string]: number}; resist: {[t: string]: number};
  stab: string[]; ate: string; addType: string; vsSteel: {[t: string]: number}; moveBoost: {[m: string]: number};
  stats: Array<{stat: string; mult: number; weather?: string[]; terrain?: string[]}>;
  critImmune: boolean; alwaysCrit: boolean; weatherHeal: {[w: string]: number}; metronomeStep: number;
  weatherItems: Array<{weather: string[]; items: string[]}>;
  drainPct: number; drainIfAsleep: boolean; selfDamagePct: number;
}
const REMIX_FX_CACHE = new Map<string, RemixItemFx>();

const STATS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as I.StatID[];
const SPC = new Set(['spc']);


export class Pokemon implements State.Pokemon {
  gen: I.Generation;
  name: I.SpeciesName;
  species: I.Specie;

  types: [I.TypeName] | [I.TypeName, I.TypeName];
  weightkg: number;

  level: number;
  gender?: I.GenderName;
  ability?: I.AbilityName;
  abilityOn?: boolean;
  isDynamaxed?: boolean;
  dynamaxLevel?: number;
  isSaltCure?: boolean;
  alliesFainted?: number;
  item?: I.ItemName;
  teraType?: I.TypeName;

  nature: I.NatureName;
  ivs: I.StatsTable;
  evs: I.StatsTable;
  boosts: I.StatsTable;
  rawStats: I.StatsTable;
  // Remix: fixed stat values that replace the computed ones (Imposter/Transform), kept through clone()
  remixRawStats?: Partial<I.StatsTable>;
  stats: I.StatsTable;

  originalCurHP: number;
  status: I.StatusName | '';
  toxicCounter: number;

  moves: I.MoveName[];

  constructor(
    gen: I.Generation,
    name: string,
    options: Partial<State.Pokemon> & {
      curHP?: number;
      ivs?: Partial<I.StatsTable> & {spc?: number};
      evs?: Partial<I.StatsTable> & {spc?: number};
      boosts?: Partial<I.StatsTable> & {spc?: number};
    } = {}
  ) {
    this.species = extend(true, {}, gen.species.get(toID(name)), options.overrides);

    this.gen = gen;
    this.name = options.name || name as I.SpeciesName;
    this.types = this.species.types;
    this.weightkg = this.species.weightkg;

    this.level = options.level || 100;
    this.gender = options.gender || this.species.gender || 'M';
    this.ability = options.ability || this.species.abilities?.[0] || undefined;
    this.abilityOn = !!options.abilityOn;

    this.isDynamaxed = !!options.isDynamaxed;
    this.dynamaxLevel = this.isDynamaxed
      ? (options.dynamaxLevel === undefined ? 10 : options.dynamaxLevel) : undefined;
    this.isSaltCure = !!options.isSaltCure;
    this.alliesFainted = options.alliesFainted;
    this.teraType = options.teraType;
    this.item = options.item;
    this.nature = options.nature || ('Serious' as I.NatureName);
    this.ivs = Pokemon.withDefault(gen, options.ivs, 31);
    this.evs = Pokemon.withDefault(gen, options.evs, gen.num >= 3 ? 0 : 252);
    this.boosts = Pokemon.withDefault(gen, options.boosts, 0, false);

    // Gigantamax 'forms' inherit weight from their base species when not dynamaxed
    // TODO: clean this up with proper Gigantamax support
    if (this.weightkg === 0 && !this.isDynamaxed && this.species.baseSpecies) {
      this.weightkg = gen.species.get(toID(this.species.baseSpecies))!.weightkg;
    }

    if (gen.num < 3) {
      this.ivs.hp = Stats.DVToIV(
        Stats.getHPDV({
          atk: this.ivs.atk,
          def: this.ivs.def,
          spe: this.ivs.spe,
          spc: this.ivs.spa,
        })
      );
    }

    this.rawStats = {} as I.StatsTable;
    this.stats = {} as I.StatsTable;
    for (const stat of STATS) {
      const val = this.calcStat(gen, stat);
      this.rawStats[stat] = val;
      this.stats[stat] = val;
    }
    const fixed = (options as any).remixRawStats as Partial<I.StatsTable> | undefined;
    if (fixed) {
      this.remixRawStats = fixed;
      for (const stat of STATS) {
        if (fixed[stat] !== undefined) this.rawStats[stat] = this.stats[stat] = fixed[stat]!;
      }
    }

    const curHP = options.curHP || options.originalCurHP;
    this.originalCurHP = curHP && curHP <= this.rawStats.hp ? curHP : this.rawStats.hp;
    this.status = options.status || '';
    this.toxicCounter = options.toxicCounter || 0;
    this.moves = options.moves || [];
  }

  maxHP(original = false) {
    // Shedinja still has 1 max HP during the effect even if its Dynamax Level is maxed (DaWoblefet)
    if (!original && this.isDynamaxed && this.species.baseStats.hp !== 1) {
      return Math.floor((this.rawStats.hp * (150 + 5 * this.dynamaxLevel!)) / 100);
    }

    return this.rawStats.hp;
  }

  curHP(original = false) {
    // Shedinja still has 1 max HP during the effect even if its Dynamax Level is maxed (DaWoblefet)
    if (!original && this.isDynamaxed && this.species.baseStats.hp !== 1) {
      return Math.ceil((this.originalCurHP * (150 + 5 * this.dynamaxLevel!)) / 100);
    }

    return this.originalCurHP;
  }

  hasAbility(...abilities: string[]) {
    if (this.ability && abilities.includes(this.ability)) return true;
    if (this.remixGrantedAbilities().some(a => abilities.includes(a))) return true;
    // abilities from a Remix item (Mold Breaker never ignores these: they're item effects)
    return this.remixItemFx().abilities.some(a => abilities.includes(a));
  }

  // Remix (gen 7): everything the held item does for this species, merged from its rules.
  remixItemFx(): RemixItemFx {
    const key = this.gen.num + '|' + this.name + '|' + (this.item || '') + '|' + (this.ability || '');
    const cached = REMIX_FX_CACHE.get(key);
    if (cached) return cached;
    const fx: RemixItemFx = {
      abilities: [], items: [], boost: {}, resist: {}, stab: [], ate: '', addType: '', vsSteel: {},
      moveBoost: {}, stats: [], critImmune: false, alwaysCrit: false, weatherHeal: {}, metronomeStep: 0,
      weatherItems: [], drainPct: 0, drainIfAsleep: false, selfDamagePct: 0,
    };
    const rules = this.gen.num === 7 && this.item && !['Klutz', 'Disgusted'].includes(this.ability as string)
      ? REMIX_ITEM_EFFECTS[this.item] : undefined;
    for (const r of rules || []) {
      if (r.species && !r.species.some((sp: string) => sp.endsWith('*')
        ? this.name.startsWith(sp.slice(0, -1)) : sp === this.name)) continue;
      if (r.weatherOnly) { fx.weatherItems.push({weather: r.weatherOnly, items: r.items || []}); continue; }
      fx.abilities.push(...(r.abilities || []));
      fx.items.push(...(r.items || []));
      fx.stab.push(...(r.stab || []));
      fx.stats.push(...(r.stats || []));
      Object.assign(fx.boost, r.boost || {});
      Object.assign(fx.resist, r.resist || {});
      Object.assign(fx.vsSteel, r.vsSteel || {});
      Object.assign(fx.moveBoost, r.moveBoost || {});
      Object.assign(fx.weatherHeal, r.weatherHeal || {});
      if (r.ate) fx.ate = r.ate;
      if (r.addType) fx.addType = r.addType;
      if (r.critImmune) fx.critImmune = true;
      if (r.alwaysCrit) fx.alwaysCrit = true;
      if (r.metronomeStep) fx.metronomeStep = r.metronomeStep;
      if (r.drainPct) { fx.drainPct = r.drainPct; fx.drainIfAsleep = !!r.drainIfAsleep; }
      if (r.selfDamagePct) fx.selfDamagePct = r.selfDamagePct;
    }
    REMIX_FX_CACHE.set(key, fx);
    return fx;
  }

  // Remix (gen 7): abilities that also give the effects of other abilities.
  remixGrantedAbilities(): string[] {
    if (this.gen.num !== 7 || !this.ability) return [];
    const form = this.name.split('-').slice(1).join('-');
    switch (this.ability as string) {
    case 'Neurotoxin': return ['Merciless', 'Poisonous'];
    case 'Masterpiece': return ['Versatility', 'Technician', 'Skill Link'];
    case 'Hibernation': return ['Soporific', 'Permafrost', 'Snow Warning'];
    case 'Scribble': return ['Prankster'];
    case 'Appetite': return ['Ripen'];
    case 'Disgusted': return ['Klutz'];
    case 'Climate Cloak': return ['Shield Dust'];
    case 'Star Power':
      // Shell (Meteor) form floats; core forms also get Dazzling
      return form === 'Meteor' || !form ? ['Levitate'] : ['Levitate', 'Dazzling'];
    case 'Zen Mode': return this.name === 'Darmanitan-Zen' ? ['Unaware'] : [];
    case 'Seasonal Spirit':
      if (form === 'Summer') return ['Solar Rush', 'Sap Sipper'];
      if (form === 'Autumn') return ['Moxie', 'Reckless'];
      if (form === 'Winter') return ['Permafrost', 'Snow Warning'];
      return ['Grassy Surge', 'Flower Veil']; // Spring = base form
    default: return [];
    }
  }

  hasItem(...items: string[]) {
    if (this.item && items.includes(this.item)) return true;
    // Remix: items whose effects a Remix item includes (e.g. Comet Shard = Life Orb for Minior)
    return this.remixItemFx().items.some(i => items.includes(i));
  }

  hasStatus(...statuses: I.StatusName[]) {
    return !!(this.status && statuses.includes(this.status));
  }

  hasType(...types: I.TypeName[]) {
    for (const type of types) {
      if (this.teraType ? this.teraType === type : this.types.includes(type)) return true;
    }
    return false;
  }

  /** Ignores Tera type */
  hasOriginalType(...types: I.TypeName[]) {
    for (const type of types) {
      if (this.types.includes(type)) return true;
    }
    return false;
  }

  named(...names: string[]) {
    return names.includes(this.name);
  }

  clone() {
    return new Pokemon(this.gen, this.name, {
      level: this.level,
      ability: this.ability,
      abilityOn: this.abilityOn,
      isDynamaxed: this.isDynamaxed,
      dynamaxLevel: this.dynamaxLevel,
      isSaltCure: this.isSaltCure,
      alliesFainted: this.alliesFainted,
      item: this.item,
      gender: this.gender,
      nature: this.nature,
      ivs: extend(true, {}, this.ivs),
      evs: extend(true, {}, this.evs),
      boosts: extend(true, {}, this.boosts),
      originalCurHP: this.originalCurHP,
      status: this.status,
      teraType: this.teraType,
      toxicCounter: this.toxicCounter,
      moves: this.moves.slice(),
      overrides: this.species,
      remixRawStats: this.remixRawStats,
    } as any);
  }

  private calcStat(gen: I.Generation, stat: I.StatID) {
    return Stats.calcStat(
      gen,
      stat,
      this.species.baseStats[stat],
      this.ivs[stat]!,
      this.evs[stat]!,
      this.level,
      this.nature
    );
  }

  static getForme(
    gen: I.Generation,
    speciesName: string,
    item?: I.ItemName,
    moveName?: I.MoveName
  ) {
    const species = gen.species.get(toID(speciesName));
    if (!species?.otherFormes) {
      return speciesName;
    }

    let i = 0;
    if (
      (item &&
        ((item.includes('ite') && !item.includes('ite Y')) ||
          (speciesName === 'Groudon' && item === 'Red Orb') ||
          (speciesName === 'Kyogre' && item === 'Blue Orb'))) ||
      (moveName && speciesName === 'Meloetta' && moveName === 'Relic Song') ||
      (speciesName === 'Rayquaza' && moveName === 'Dragon Ascent')
    ) {
      i = 1;
    } else if (item?.includes('ite Y')) {
      i = 2;
    }

    return i ? species.otherFormes[i - 1] : species.name;
  }

  private static withDefault(
    gen: I.Generation,
    current: Partial<I.StatsTable> & {spc?: number} | undefined,
    val: number,
    match = true,
  ) {
    const cur: Partial<I.StatsTable> = {};
    if (current) {
      assignWithout(cur, current, SPC);
      if (current.spc) {
        cur.spa = current.spc;
        cur.spd = current.spc;
      }
      if (match && gen.num <= 2 && current.spa !== current.spd) {
        throw new Error('Special Attack and Special Defense must match before Gen 3');
      }
    }
    return {hp: val, atk: val, def: val, spa: val, spd: val, spe: val, ...cur};
  }
}
