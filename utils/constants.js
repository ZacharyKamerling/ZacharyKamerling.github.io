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
// UI - Colors
export var COLORS = {
    darkest: '#1a1a1a',
    darker: '#222',
    dark: '#2a2a2a',
    medium: '#333',
    text: '#fff',
    textDark: '#000',
    borderLight: '#444',
    border: '#555',
    borderDark: '#666',
    borderDarker: '#888',
    primary: '#4a9eff',
    success: '#4ade80',
    danger: '#ff6b6b',
};
// UI - Spacing
export var SPACING = {
    xs: '0.3em',
    sm: '0.5em',
    md: '0.7em',
    lg: '1em',
    xl: '1.5em',
    xxl: '2em',
};
// UI - Border Radius
export var RADIUS = {
    sm: '0.3em',
    md: '0.4em',
    lg: '0.5em',
    xl: '1em',
};
// UI - Z-Index
export var Z_INDEX = {
    modal: 1000,
    modalOverlay: 1000,
    modalHigh: 1001,
    topmost: 9999,
};
// UI - Dimensions
export var MODAL = {
    maxWidth: '400px',
    menuMaxWidth: '300px',
    overlayOpacity: 0.5,
};
export var POPOVER_ANIMATION_MS = 150;
