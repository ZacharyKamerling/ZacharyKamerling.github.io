/**
 * Global constants for the character sheet app
 */
// Timing
export var HOLD_PRESS_DURATION_MS = 600;
// Stat bounds - use tuple types
export var TOKEN_MIN = 1;
export var TOKEN_MAX = 20;
export var STAT_MIN = 0;
export var STAT_MAX = 100;
export var CUSTOM_ROLL_MIN = 1;
export var CUSTOM_ROLL_MAX = 100;
// Stat name mapping (for buff syntax $$stat_name:value)
export var STAT_NAMES = {
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
export var ITEM_SLOTS = function (might) { return might + 5; };
// UI
export var POPOVER_ANIMATION_MS = 150;
