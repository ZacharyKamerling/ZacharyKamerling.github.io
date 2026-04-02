/**
 * Global constants for the character sheet app
 */

// Timing
export const HOLD_PRESS_DURATION_MS = 600;

// Stat bounds - use tuple types
export const TOKEN_MIN = 1;
export const TOKEN_MAX = 20;
export const STAT_MIN = 0;
export const STAT_MAX = 100;
export const CUSTOM_ROLL_MIN = 1;
export const CUSTOM_ROLL_MAX = 100;

// Stat name mapping (for buff syntax $$stat_name:value)
export const STAT_NAMES = {
    meleePower: 'melee_power',
    rangedPower: 'ranged_power',
    might: 'might',
    awareness: 'awareness',
    resolve: 'resolve',
    stress: 'stress',
    bloodMax: 'blood_max',
    staminaMax: 'stamina_max',
    customRoll: 'custom_roll',
};

// Item slot calculation
export const ITEM_SLOTS = (might: number) => might + 5;

// UI
export const POPOVER_ANIMATION_MS = 150;

