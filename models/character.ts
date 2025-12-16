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
    abilities: AbilityData[];
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
    abilities: AbilityData[];
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
            abilities: this.abilities || []
        };
    }
}
