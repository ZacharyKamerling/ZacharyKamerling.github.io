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

// UI - Colors
export const COLORS = {
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
export const SPACING = {
    xs: '0.3em',
    sm: '0.5em',
    md: '0.7em',
    lg: '1em',
    xl: '1.5em',
    xxl: '2em',
};

// UI - Border Radius
export const RADIUS = {
    sm: '0.3em',
    md: '0.4em',
    lg: '0.5em',
    xl: '1em',
};

// UI - Z-Index
export const Z_INDEX = {
    modal: 1000,
    modalOverlay: 1000,
    modalHigh: 1001,
    topmost: 9999,
};

// UI - Dimensions
export const MODAL = {
    maxWidth: '400px',
    menuMaxWidth: '300px',
    overlayOpacity: 0.5,
};

export const POPOVER_ANIMATION_MS = 150;

