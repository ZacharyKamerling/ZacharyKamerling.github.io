var Character = /** @class */ (function () {
    function Character(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
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
        this.equipment = data.equipment || [];
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
            equipment: [],
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
            equipment: this.equipment || [],
            abilities: this.abilities || []
        };
    };
    return Character;
}());
export { Character };
