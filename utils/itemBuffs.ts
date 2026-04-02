/**
 * Parse item stat buffs from description text
 * Format: $$stat_name:value (e.g., $$melee_power:2, $$stress:-1)
 * Multiple buffs: $$melee_power:2 $$resolve:1
 */
export function parseItemBuffs(description: string): { [key: string]: number } {
    const buffs: { [key: string]: number } = {};
    const buffPattern = /\$\$(\w+):([-+]?\d+)/g;

    let match;
    while ((match = buffPattern.exec(description)) !== null) {
        const statName = match[1];
        const value = parseInt(match[2], 10);

        // Accumulate if stat appears multiple times
        buffs[statName] = (buffs[statName] || 0) + value;
    }

    return buffs;
}
