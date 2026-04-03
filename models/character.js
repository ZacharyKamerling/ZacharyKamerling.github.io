var Character = /** @class */ (function () {
    function Character(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        this.cachedEffectiveStats = null;
        this.id = data.id;
        this.name = data.name || 'Unnamed Character';
        this.meleePower = (_a = data.meleePower) !== null && _a !== void 0 ? _a : 0;
        this.rangedPower = (_b = data.rangedPower) !== null && _b !== void 0 ? _b : 0;
        this.might = (_c = data.might) !== null && _c !== void 0 ? _c : 0;
        this.awareness = (_d = data.awareness) !== null && _d !== void 0 ? _d : 0;
        this.resolve = (_e = data.resolve) !== null && _e !== void 0 ? _e : 0;
        this.stress = (_f = data.stress) !== null && _f !== void 0 ? _f : 0;
        this.bloodMax = (_g = data.bloodMax) !== null && _g !== void 0 ? _g : 1;
        this.bloodTokens = (_h = data.bloodTokens) !== null && _h !== void 0 ? _h : 0;
        this.staminaMax = (_j = data.staminaMax) !== null && _j !== void 0 ? _j : 1;
        this.staminaTokens = (_k = data.staminaTokens) !== null && _k !== void 0 ? _k : 0;
        this.customRoll = (_l = data.customRoll) !== null && _l !== void 0 ? _l : 1;
        this.unarmored = (_m = data.unarmored) !== null && _m !== void 0 ? _m : false;
        this.notes = (_o = data.notes) !== null && _o !== void 0 ? _o : '';
        this.equipment = data.equipment || [];
        this.items = data.items || [];
        this.abilities = data.abilities || [];
    }
    Character.default = function () {
        return {
            id: Date.now().toString(),
            name: 'Unnamed Character',
            bloodTokens: 3,
            bloodMax: 3,
            staminaTokens: 5,
            staminaMax: 5,
            meleePower: 3,
            rangedPower: 3,
            might: 3,
            awareness: 3,
            resolve: 3,
            stress: 0,
            customRoll: 1,
            unarmored: false,
            notes: '',
            equipment: [],
            items: [],
            abilities: []
        };
    };
    Character.fromRaw = function (raw) {
        return new Character(raw);
    };
    Character.prototype.toJSON = function () {
        return {
            id: this.id,
            name: this.name,
            meleePower: this.meleePower,
            rangedPower: this.rangedPower,
            might: this.might,
            awareness: this.awareness,
            resolve: this.resolve,
            stress: this.stress,
            bloodMax: this.bloodMax,
            bloodTokens: this.bloodTokens,
            staminaMax: this.staminaMax,
            staminaTokens: this.staminaTokens,
            customRoll: this.customRoll,
            unarmored: this.unarmored,
            notes: this.notes,
            equipment: this.equipment || [],
            items: this.items || [],
            abilities: this.abilities || []
        };
    };
    Character.prototype.getEffectiveStats = function () {
        // Return cached result if available
        if (this.cachedEffectiveStats) {
            return this.cachedEffectiveStats;
        }
        // Parse all equipped items for stat buffs
        var buffs = {};
        this.items
            .filter(function (item) { return item.equipped; })
            .forEach(function (item) {
            // Parse $$stat_name:value patterns
            var buffPattern = /\$\$(\w+):([-+]?\d+)/g;
            var match;
            while ((match = buffPattern.exec(item.description)) !== null) {
                var statName = match[1];
                var value = parseInt(match[2], 10);
                buffs[statName] = (buffs[statName] || 0) + value;
            }
        });
        // Calculate and cache result
        this.cachedEffectiveStats = {
            meleePower: this.meleePower + (buffs['melee_power'] || 0),
            rangedPower: this.rangedPower + (buffs['ranged_power'] || 0),
            might: this.might + (buffs['might'] || 0),
            awareness: this.awareness + (buffs['awareness'] || 0),
            resolve: this.resolve + (buffs['resolve'] || 0),
            stress: this.stress + (buffs['stress'] || 0),
            bloodMax: this.bloodMax + (buffs['blood_max'] || 0),
            staminaMax: this.staminaMax + (buffs['stamina_max'] || 0),
            customRoll: this.customRoll + (buffs['custom_roll'] || 0),
        };
        return this.cachedEffectiveStats;
    };
    Character.prototype.invalidateEffectiveStatsCache = function () {
        this.cachedEffectiveStats = null;
    };
    return Character;
}());
export { Character };
