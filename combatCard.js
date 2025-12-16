var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/**
 * Returns a specified number of random cards from the deck without replacement.
 */
export function getRandomCards(count) {
    var deck = __spreadArray([], COMBAT_CARDS, true);
    var shuffled = [];
    while (deck.length > 0 && shuffled.length < count) {
        var randomIndex = Math.floor(Math.random() * deck.length);
        shuffled.push(deck.splice(randomIndex, 1)[0]);
    }
    return shuffled;
}
// --- The Combat Deck ---
// You can expand this list as needed.
export var COMBAT_CARDS = [
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
