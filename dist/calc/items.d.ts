import { Generation, TypeName, StatID } from './data/interface';
export declare const SEED_BOOSTED_STAT: {
    [item: string]: StatID;
};
export declare function getItemBoostType(item: string | undefined): "Grass" | "Poison" | "Fire" | "Flying" | "Dragon" | "Water" | "Steel" | "Ice" | "Psychic" | "Bug" | "Fairy" | "Normal" | "Dark" | "Ghost" | "Electric" | "Ground" | "Fighting" | "Rock" | undefined;
export declare function getBerryResistType(berry: string | undefined): "Grass" | "Poison" | "Fire" | "Flying" | "Dragon" | "Water" | "Steel" | "Ice" | "Psychic" | "Bug" | "Fairy" | "Normal" | "Dark" | "Ghost" | "Electric" | "Ground" | "Fighting" | "Rock" | undefined;
export declare function getFlingPower(item?: string): 60 | 80 | 100 | 50 | 85 | 30 | 20 | 90 | 70 | 40 | 150 | 95 | 110 | 10 | 0;
export declare function getNaturalGift(gen: Generation, item: string): {
    t: TypeName;
    p: number;
};
export declare function getTechnoBlast(item: string): "Fire" | "Water" | "Ice" | "Electric" | undefined;
export declare function getMultiAttack(item: string): TypeName | undefined;
