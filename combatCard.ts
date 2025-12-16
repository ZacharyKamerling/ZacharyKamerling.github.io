export type CardType = 'Positive' | 'Negative';

/**
 * Defines the effect text for a card.
 */
export interface CardEffect {
    id: string; 
    name: string;
    description: string; // The text shown to the user (e.g., "**Lose a Blood Token**")
    meta?: string;      // Extra info (e.g., "(Roll on Wound table)")
}

/**
 * Defines a complete Combat Card.
 */
export interface CombatCard {
    id: string;
    type: CardType;
    // Negative cards have two effects (Effect 1 and Effect 2).
    // Positive cards can have one or more effects.
    effects: CardEffect[]; 
}


/**
 * Returns a specified number of random cards from the deck without replacement.
 */
export function getRandomCards(count: number): CombatCard[] {
    const deck = [...COMBAT_CARDS];
    const shuffled: CombatCard[] = [];
    while (deck.length > 0 && shuffled.length < count) {
        const randomIndex = Math.floor(Math.random() * deck.length);
        shuffled.push(deck.splice(randomIndex, 1)[0]);
    }
    return shuffled;
}

// --- The Combat Deck ---
// You can expand this list as needed.

export const COMBAT_CARDS: CombatCard[] = [
    // --- NEGATIVE CARDS (Effect 1 & 2 for Armor choice) ---
    {
        id: 'neg_lose_token_stun',
        type: 'Negative',
        effects: [
            { id: 'neg_1_eff1', name: 'Lose a Blood Token', description: 'Lose a **Blood Token**' },
            { id: 'neg_1_eff2', name: 'You are Stunned', description: 'You are **Stunned** (Can\'t use abilities next round)' }
        ]
    },
    {
        id: 'neg_stamina_stress',
        type: 'Negative',
        effects: [
            { id: 'neg_2_eff1', name: 'Lose Stamina', description: 'Lose 2 **Stamina Tokens**' },
            { id: 'neg_2_eff2', name: 'Gain Stress', description: 'Gain 1 **Stress**' }
        ]
    },
    {
        id: 'neg_wound_dismember',
        type: 'Negative',
        effects: [
            { id: 'neg_3_eff1', name: 'You are Wounded', description: 'You are **Wounded** (Roll on Wound table)' },
            { id: 'neg_3_eff2', name: 'You Panic', description: 'You **Panic!** You gain 1 **Stress**' }
        ]
    },
    // --- POSITIVE CARDS ---
    {
        id: 'pos_gain_stamina',
        type: 'Positive',
        effects: [
            { id: 'pos_1_eff1', name: 'Gain Stamina', description: 'Gain 2 **Stamina Tokens**' }
        ]
    },
    {
        id: 'pos_wound_bleed',
        type: 'Positive',
        effects: [
            { id: 'pos_2_eff1', name: 'Wound an Enemy', description: 'You wound an enemy' },
            { id: 'pos_2_eff2', name: 'Bleed an Enemy', description: 'You bleed an enemy' }
        ]
    },
    {
        id: 'pos_reduce_stress',
        type: 'Positive',
        effects: [
            { id: 'pos_3_eff1', name: 'Reduce Stress', description: 'Reduce your **Stress** by 1' }
        ]
    },
];
