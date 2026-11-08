"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;

var stats_1 = require("./stats");
var util_1 = require("./util");
var remix_items_1 = require("./data/remix_items");
var REMIX_FX_CACHE = new Map();
var STATS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
var SPC = new Set(['spc']);
var Pokemon = (function () {
    function Pokemon(gen, name, options) {
        var e_1, _a;
        if (options === void 0) { options = {}; }
        var _b;
        this.species = (0, util_1.extend)(true, {}, gen.species.get((0, util_1.toID)(name)), options.overrides);
        this.gen = gen;
        this.name = options.name || name;
        this.types = this.species.types;
        this.weightkg = this.species.weightkg;
        this.level = options.level || 100;
        this.gender = options.gender || this.species.gender || 'M';
        this.ability = options.ability || ((_b = this.species.abilities) === null || _b === void 0 ? void 0 : _b[0]) || undefined;
        this.abilityOn = !!options.abilityOn;
        this.isDynamaxed = !!options.isDynamaxed;
        this.dynamaxLevel = this.isDynamaxed
            ? (options.dynamaxLevel === undefined ? 10 : options.dynamaxLevel) : undefined;
        this.isSaltCure = !!options.isSaltCure;
        this.alliesFainted = options.alliesFainted;
        this.teraType = options.teraType;
        this.item = options.item;
        this.nature = options.nature || 'Serious';
        this.ivs = Pokemon.withDefault(gen, options.ivs, 31);
        this.evs = Pokemon.withDefault(gen, options.evs, gen.num >= 3 ? 0 : 252);
        this.boosts = Pokemon.withDefault(gen, options.boosts, 0, false);
        if (this.weightkg === 0 && !this.isDynamaxed && this.species.baseSpecies) {
            this.weightkg = gen.species.get((0, util_1.toID)(this.species.baseSpecies)).weightkg;
        }
        if (gen.num < 3) {
            this.ivs.hp = stats_1.Stats.DVToIV(stats_1.Stats.getHPDV({
                atk: this.ivs.atk,
                def: this.ivs.def,
                spe: this.ivs.spe,
                spc: this.ivs.spa
            }));
        }
        this.rawStats = {};
        this.stats = {};
        try {
            for (var STATS_1 = __values(STATS), STATS_1_1 = STATS_1.next(); !STATS_1_1.done; STATS_1_1 = STATS_1.next()) {
                var stat = STATS_1_1.value;
                var val = this.calcStat(gen, stat);
                this.rawStats[stat] = val;
                this.stats[stat] = val;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (STATS_1_1 && !STATS_1_1.done && (_a = STATS_1["return"])) _a.call(STATS_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var curHP = options.curHP || options.originalCurHP;
        this.originalCurHP = curHP && curHP <= this.rawStats.hp ? curHP : this.rawStats.hp;
        this.status = options.status || '';
        this.toxicCounter = options.toxicCounter || 0;
        this.moves = options.moves || [];
    }
    Pokemon.prototype.maxHP = function (original) {
        if (original === void 0) { original = false; }
        if (!original && this.isDynamaxed && this.species.baseStats.hp !== 1) {
            return Math.floor((this.rawStats.hp * (150 + 5 * this.dynamaxLevel)) / 100);
        }
        return this.rawStats.hp;
    };
    Pokemon.prototype.curHP = function (original) {
        if (original === void 0) { original = false; }
        if (!original && this.isDynamaxed && this.species.baseStats.hp !== 1) {
            return Math.ceil((this.originalCurHP * (150 + 5 * this.dynamaxLevel)) / 100);
        }
        return this.originalCurHP;
    };
    Pokemon.prototype.hasAbility = function () {
        var abilities = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            abilities[_i] = arguments[_i];
        }
        if (this.ability && abilities.includes(this.ability))
            return true;
        if (this.remixGrantedAbilities().some(function (a) { return abilities.includes(a); }))
            return true;
        return this.remixItemFx().abilities.some(function (a) { return abilities.includes(a); });
    };
    Pokemon.prototype.remixItemFx = function () {
        var e_2, _a, _b, _c, _d, _e;
        var _this = this;
        var key = this.gen.num + '|' + this.name + '|' + (this.item || '') + '|' + (this.ability || '');
        var cached = REMIX_FX_CACHE.get(key);
        if (cached)
            return cached;
        var fx = {
            abilities: [], items: [], boost: {}, resist: {}, stab: [], ate: '', addType: '', vsSteel: {},
            moveBoost: {}, stats: [], critImmune: false, alwaysCrit: false, weatherHeal: {}, metronomeStep: 0,
            weatherItems: []
        };
        var rules = this.gen.num === 7 && this.item && !['Klutz', 'Disgusted'].includes(this.ability)
            ? remix_items_1.REMIX_ITEM_EFFECTS[this.item] : undefined;
        try {
            for (var _f = __values(rules || []), _g = _f.next(); !_g.done; _g = _f.next()) {
                var r = _g.value;
                if (r.species && !r.species.some(function (sp) { return sp.endsWith('*')
                    ? _this.name.startsWith(sp.slice(0, -1)) : sp === _this.name; }))
                    continue;
                if (r.weatherOnly) {
                    fx.weatherItems.push({ weather: r.weatherOnly, items: r.items || [] });
                    continue;
                }
                (_b = fx.abilities).push.apply(_b, __spreadArray([], __read((r.abilities || [])), false));
                (_c = fx.items).push.apply(_c, __spreadArray([], __read((r.items || [])), false));
                (_d = fx.stab).push.apply(_d, __spreadArray([], __read((r.stab || [])), false));
                (_e = fx.stats).push.apply(_e, __spreadArray([], __read((r.stats || [])), false));
                Object.assign(fx.boost, r.boost || {});
                Object.assign(fx.resist, r.resist || {});
                Object.assign(fx.vsSteel, r.vsSteel || {});
                Object.assign(fx.moveBoost, r.moveBoost || {});
                Object.assign(fx.weatherHeal, r.weatherHeal || {});
                if (r.ate)
                    fx.ate = r.ate;
                if (r.addType)
                    fx.addType = r.addType;
                if (r.critImmune)
                    fx.critImmune = true;
                if (r.alwaysCrit)
                    fx.alwaysCrit = true;
                if (r.metronomeStep)
                    fx.metronomeStep = r.metronomeStep;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_a = _f["return"])) _a.call(_f);
            }
            finally { if (e_2) throw e_2.error; }
        }
        REMIX_FX_CACHE.set(key, fx);
        return fx;
    };
    Pokemon.prototype.remixGrantedAbilities = function () {
        if (this.gen.num !== 7 || !this.ability)
            return [];
        var form = this.name.split('-').slice(1).join('-');
        switch (this.ability) {
            case 'Neurotoxin': return ['Merciless', 'Poisonous'];
            case 'Masterpiece': return ['Versatility', 'Technician', 'Skill Link'];
            case 'Hibernation': return ['Soporific', 'Permafrost', 'Snow Warning'];
            case 'Scribble': return ['Prankster'];
            case 'Appetite': return ['Ripen'];
            case 'Disgusted': return ['Klutz'];
            case 'Climate Cloak': return ['Shield Dust'];
            case 'Star Power':
                return form === 'Meteor' || !form ? ['Levitate'] : ['Levitate', 'Dazzling'];
            case 'Zen Mode': return this.name === 'Darmanitan-Zen' ? ['Unaware'] : [];
            case 'Seasonal Spirit':
                if (form === 'Summer')
                    return ['Solar Rush', 'Sap Sipper'];
                if (form === 'Autumn')
                    return ['Moxie', 'Reckless'];
                if (form === 'Winter')
                    return ['Permafrost', 'Snow Warning'];
                return ['Grassy Surge', 'Flower Veil'];
            default: return [];
        }
    };
    Pokemon.prototype.hasItem = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        if (this.item && items.includes(this.item))
            return true;
        return this.remixItemFx().items.some(function (i) { return items.includes(i); });
    };
    Pokemon.prototype.hasStatus = function () {
        var statuses = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            statuses[_i] = arguments[_i];
        }
        return !!(this.status && statuses.includes(this.status));
    };
    Pokemon.prototype.hasType = function () {
        var e_3, _a;
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        try {
            for (var types_1 = __values(types), types_1_1 = types_1.next(); !types_1_1.done; types_1_1 = types_1.next()) {
                var type = types_1_1.value;
                if (this.teraType ? this.teraType === type : this.types.includes(type))
                    return true;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (types_1_1 && !types_1_1.done && (_a = types_1["return"])) _a.call(types_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return false;
    };
    Pokemon.prototype.hasOriginalType = function () {
        var e_4, _a;
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        try {
            for (var types_2 = __values(types), types_2_1 = types_2.next(); !types_2_1.done; types_2_1 = types_2.next()) {
                var type = types_2_1.value;
                if (this.types.includes(type))
                    return true;
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (types_2_1 && !types_2_1.done && (_a = types_2["return"])) _a.call(types_2);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return false;
    };
    Pokemon.prototype.named = function () {
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        return names.includes(this.name);
    };
    Pokemon.prototype.clone = function () {
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
            ivs: (0, util_1.extend)(true, {}, this.ivs),
            evs: (0, util_1.extend)(true, {}, this.evs),
            boosts: (0, util_1.extend)(true, {}, this.boosts),
            originalCurHP: this.originalCurHP,
            status: this.status,
            teraType: this.teraType,
            toxicCounter: this.toxicCounter,
            moves: this.moves.slice(),
            overrides: this.species
        });
    };
    Pokemon.prototype.calcStat = function (gen, stat) {
        return stats_1.Stats.calcStat(gen, stat, this.species.baseStats[stat], this.ivs[stat], this.evs[stat], this.level, this.nature);
    };
    Pokemon.getForme = function (gen, speciesName, item, moveName) {
        var species = gen.species.get((0, util_1.toID)(speciesName));
        if (!(species === null || species === void 0 ? void 0 : species.otherFormes)) {
            return speciesName;
        }
        var i = 0;
        if ((item &&
            ((item.includes('ite') && !item.includes('ite Y')) ||
                (speciesName === 'Groudon' && item === 'Red Orb') ||
                (speciesName === 'Kyogre' && item === 'Blue Orb'))) ||
            (moveName && speciesName === 'Meloetta' && moveName === 'Relic Song') ||
            (speciesName === 'Rayquaza' && moveName === 'Dragon Ascent')) {
            i = 1;
        }
        else if (item === null || item === void 0 ? void 0 : item.includes('ite Y')) {
            i = 2;
        }
        return i ? species.otherFormes[i - 1] : species.name;
    };
    Pokemon.withDefault = function (gen, current, val, match) {
        if (match === void 0) { match = true; }
        var cur = {};
        if (current) {
            (0, util_1.assignWithout)(cur, current, SPC);
            if (current.spc) {
                cur.spa = current.spc;
                cur.spd = current.spc;
            }
            if (match && gen.num <= 2 && current.spa !== current.spd) {
                throw new Error('Special Attack and Special Defense must match before Gen 3');
            }
        }
        return __assign({ hp: val, atk: val, def: val, spa: val, spd: val, spe: val }, cur);
    };
    return Pokemon;
}());
exports.Pokemon = Pokemon;
//# sourceMappingURL=pokemon.js.map