export interface CharacterData {
    id: string;
    name: string;
    meleePower: number;
    rangedPower: number;
    might: number;
    awareness: number;
    resolve: number;
    stress: number;
    bloodMax: number;
    bloodTokens: number;
    staminaMax: number;
    staminaTokens: number;
    customRoll: number;
    equipment: EquipmentData[];
    items: ItemData[];
    abilities: AbilityData[];
}

export interface ItemData {
    id: string;
    name: string;
    description: string;
    location: string;
    equipped: boolean;
}

export interface EquipmentData {
    id: string;
    name: string;
    description: string;
}

export interface AbilityData {
    id: string;
    name: string;
    description: string;
}

export class Character {
    id: string;
    name: string;
    meleePower: number;
    rangedPower: number;
    might: number;
    awareness: number;
    resolve: number;
    stress: number;
    bloodMax: number;
    bloodTokens: number;
    staminaMax: number;
    staminaTokens: number;
    customRoll: number;
    equipment: EquipmentData[];
    items: ItemData[];
    abilities: AbilityData[];
    private cachedEffectiveStats: { [key: string]: number } | null = null;
    [key: string]: any;

    constructor(data: CharacterData) {
        this.id = data.id;
        this.name = data.name || 'Unnamed Character';
        this.meleePower = data.meleePower ?? 0;
        this.rangedPower = data.rangedPower ?? 0;
        this.might = data.might ?? 0;
        this.awareness = data.awareness ?? 0;
        this.resolve = data.resolve ?? 0;
        this.stress = data.stress ?? 0;
        this.bloodMax = data.bloodMax ?? 1;
        this.bloodTokens = data.bloodTokens ?? 0;
        this.staminaMax = data.staminaMax ?? 1;
        this.staminaTokens = data.staminaTokens ?? 0;
        this.customRoll = data.customRoll ?? 1;
        this.equipment = data.equipment || [];
        this.items = data.items || [];
        this.abilities = data.abilities || [];
    }

    static default(): CharacterData {
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
            items: [],
            abilities: []
        };
    }

    static fromRaw(raw: CharacterData): Character {
        return new Character(raw);
    }

    toJSON(): CharacterData {
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
            items: this.items || [],
            abilities: this.abilities || []
        };
    }

    getEffectiveStats(): { [key: string]: number } {
        // Return cached result if available
        if (this.cachedEffectiveStats) {
            return this.cachedEffectiveStats;
        }

        // Parse all equipped items for stat buffs
        const buffs: { [key: string]: number } = {};

        this.items
            .filter(item => item.equipped)
            .forEach(item => {
                // Parse $$stat_name:value patterns
                const buffPattern = /\$\$(\w+):([-+]?\d+)/g;
                let match;
                while ((match = buffPattern.exec(item.description)) !== null) {
                    const statName = match[1];
                    const value = parseInt(match[2], 10);
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
    }

    invalidateEffectiveStatsCache(): void {
        this.cachedEffectiveStats = null;
    }
}
