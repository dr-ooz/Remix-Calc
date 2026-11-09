import * as I from './data/interface';
import { State } from './state';
export interface RemixItemFx {
    abilities: string[];
    items: string[];
    boost: {
        [t: string]: number;
    };
    resist: {
        [t: string]: number;
    };
    stab: string[];
    ate: string;
    addType: string;
    vsSteel: {
        [t: string]: number;
    };
    moveBoost: {
        [m: string]: number;
    };
    stats: Array<{
        stat: string;
        mult: number;
        weather?: string[];
        terrain?: string[];
    }>;
    critImmune: boolean;
    alwaysCrit: boolean;
    weatherHeal: {
        [w: string]: number;
    };
    metronomeStep: number;
    weatherItems: Array<{
        weather: string[];
        items: string[];
    }>;
    drainPct: number;
    drainIfAsleep: boolean;
    selfDamagePct: number;
    drainType: string;
    healPct: number;
    appetiteDoubles: boolean;
}
export declare class Pokemon implements State.Pokemon {
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
    remixRawStats?: Partial<I.StatsTable>;
    stats: I.StatsTable;
    originalCurHP: number;
    status: I.StatusName | '';
    toxicCounter: number;
    moves: I.MoveName[];
    constructor(gen: I.Generation, name: string, options?: Partial<State.Pokemon> & {
        curHP?: number;
        ivs?: Partial<I.StatsTable> & {
            spc?: number;
        };
        evs?: Partial<I.StatsTable> & {
            spc?: number;
        };
        boosts?: Partial<I.StatsTable> & {
            spc?: number;
        };
    });
    maxHP(original?: boolean): number;
    curHP(original?: boolean): number;
    hasAbility(...abilities: string[]): boolean;
    remixItemFx(): RemixItemFx;
    remixGrantedAbilities(): string[];
    hasItem(...items: string[]): boolean;
    hasStatus(...statuses: I.StatusName[]): boolean;
    hasType(...types: I.TypeName[]): boolean;
    hasOriginalType(...types: I.TypeName[]): boolean;
    named(...names: string[]): boolean;
    clone(): Pokemon;
    private calcStat;
    static getForme(gen: I.Generation, speciesName: string, item?: I.ItemName, moveName?: I.MoveName): string;
    private static withDefault;
}
