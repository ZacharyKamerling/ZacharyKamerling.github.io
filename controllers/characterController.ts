import { Character } from '../models/character.js';
import { db } from '../data/db.js';
import { DiceRoller } from '../utils/diceRollers.js';
import { CharacterView } from '../views/characterView.js';
import { showEditNameModal, numberPrompt } from '../utils/ui.js';
import { attachHoldPress, toggleDescription } from '../utils/eventHelpers.js';
import { editPopover } from '../utils/editPopover.js';
import { HOLD_PRESS_DURATION_MS, TOKEN_MIN, TOKEN_MAX, STAT_MIN, STAT_MAX, CUSTOM_ROLL_MIN, CUSTOM_ROLL_MAX } from '../utils/constants.js';

export class CharacterController {
    private character: Character;
    private view: CharacterView;
    private diceRoller: DiceRoller;
    private itemAbilityListenersAttached = false;
    private newButtonListenersAttached = false;

    constructor(character: Character, view: CharacterView) {
        this.character = character;
        this.view = view;
        this.diceRoller = new DiceRoller(character, document.getElementById('dice-results')!);

        // Prevent context menu on main sections
        this.safeQuery('#token-section')?.addEventListener('contextmenu', (e) => e.preventDefault());
        this.safeQuery('#stat-section')?.addEventListener('contextmenu', (e) => e.preventDefault());

        this.view.render(this.character);
        this.initializeListeners();
    }

    /**
     * Initialize all event listeners (only called once)
     */
    private initializeListeners(): void {
        this.attachNameEditListener();
        this.attachStatRollListeners();
        this.attachStatMaxSetListeners();
        this.attachTokenListeners();
        this.attachTokenMaxSetListeners();
        this.attachCustomRollListeners();
        this.attachItemAbilityListeners();
        this.attachNewItemAbilityListeners();
    }

    /**
     * Save character to DB and re-render only what changed
     */
    private saveAndRender(): void {
        try {
            db.saveCharacter(this.character);
            this.view.render(this.character);
            // Re-attach listeners that depend on DOM (item/ability entries)
            this.attachItemAbilityListeners();
            this.attachNewItemAbilityListeners();
        } catch (error) {
            console.error('Error saving character:', error);
        }
    }

    /**
     * Safe DOM query with optional chaining
     */
    private safeQuery(selector: string): HTMLElement | null {
        try {
            return document.querySelector(selector);
        } catch {
            console.warn(`Failed to query selector: ${selector}`);
            return null;
        }
    }

    // ==================== TOKEN LISTENERS ====================

    private attachTokenListeners(): void {
        document.querySelectorAll('.token-btn').forEach(btn => {
            const button = btn as HTMLButtonElement;
            button.onclick = () => {
                const type = button.dataset.type as 'blood' | 'stamina';
                const idx = parseInt(button.dataset.idx ?? '0');
                this.toggleToken(type, idx);
            };
        });
    }

    private attachTokenMaxSetListeners(): void {
        document.querySelectorAll('.token-btn').forEach(btn => {
            const button = btn as HTMLButtonElement;
            const type = button.dataset.type as 'blood' | 'stamina';
            attachHoldPress(button, () => this.setTokenMax(type));
        });
    }

    private toggleToken(type: 'blood' | 'stamina', idx: number): void {
        const field = type === 'blood' ? 'bloodTokens' : 'staminaTokens';
        const newValue = this.character[field] === idx + 1 ? idx : idx + 1;
        this.character[field] = newValue;
        this.saveAndRender();
    }

    private setTokenMax(type: 'blood' | 'stamina'): void {
        const label = type === 'blood' ? 'Blood' : 'Stamina';
        const maxField = type === 'blood' ? 'bloodMax' : 'staminaMax';
        const currentField = type === 'blood' ? 'bloodTokens' : 'staminaTokens';
        const currentMax = this.character[maxField] as number;

        numberPrompt(`Set max ${label} (${TOKEN_MIN}-${TOKEN_MAX}):`, currentMax || 5, TOKEN_MIN, TOKEN_MAX).then(val => {
            if (val !== null && !isNaN(val)) {
                this.character[maxField] = val;
                if ((this.character[currentField] as number) > val) {
                    this.character[currentField] = val;
                }
                this.saveAndRender();
            }
        });
    }

    // ==================== STAT LISTENERS ====================

    private attachStatRollListeners(): void {
        const statConfigs = [
            { id: 'melee-power-label', prop: 'meleePower', label: 'Melee Power' },
            { id: 'ranged-power-label', prop: 'rangedPower', label: 'Ranged Power' },
            { id: 'might-label', prop: 'might', label: 'Might' },
            { id: 'awareness-label', prop: 'awareness', label: 'Awareness' },
            { id: 'resolve-label', prop: 'resolve', label: 'Resolve' },
            { id: 'stress-label', prop: 'stress', label: 'Stress' },
        ];

        statConfigs.forEach(({ id, prop, label }) => {
            const el = this.safeQuery(`#${id}`);
            if (el) {
                el.addEventListener('click', (e) => {
                    if (e.detail === 1) {
                        if (prop === 'stress') {
                            this.diceRoller.rollStress();
                        } else {
                            this.diceRoller.rollPMAR(prop as any, label);
                        }
                    }
                });
            }
        });
    }

    private attachStatMaxSetListeners(): void {
        const statConfigs = [
            { id: 'melee-power-label', prop: 'meleePower', label: 'Melee Power' },
            { id: 'ranged-power-label', prop: 'rangedPower', label: 'Ranged Power' },
            { id: 'might-label', prop: 'might', label: 'Might' },
            { id: 'awareness-label', prop: 'awareness', label: 'Awareness' },
            { id: 'resolve-label', prop: 'resolve', label: 'Resolve' },
            { id: 'stress-label', prop: 'stress', label: 'Stress' },
        ];

        statConfigs.forEach(({ id, prop, label }) => {
            const el = this.safeQuery(`#${id}`) as HTMLElement;
            if (el) {
                el.style.cursor = 'pointer';
                el.title = `Click to roll, hold to set`;
                let held = false;

                attachHoldPress(el, () => {
                    held = true;
                    const currentValue = (this.character as any)[prop] as number;
                    numberPrompt(`Set ${label} (${STAT_MIN}-${STAT_MAX}):`, currentValue || 0, STAT_MIN, STAT_MAX).then(val => {
                        if (val !== null && !isNaN(val)) {
                            (this.character as any)[prop] = val;
                            this.saveAndRender();
                        }
                    });
                });

                // Also allow clicking to roll
                el.addEventListener('click', () => {
                    if (!held) {
                        if (prop === 'stress') {
                            this.diceRoller.rollStress();
                        } else {
                            this.diceRoller.rollPMAR(prop as any, label);
                        }
                    }
                    held = false;
                });
            }
        });
    }

    // ==================== CUSTOM ROLL LISTENERS ====================

    private attachCustomRollListeners(): void {
        const input = this.safeQuery('#custom-roll-input') as HTMLInputElement;
        const minusBtn = this.safeQuery('#custom-neg-btn') as HTMLButtonElement;
        const plusBtn = this.safeQuery('#custom-pos-btn') as HTMLButtonElement;
        const rollBtn = this.safeQuery('#custom-roll-btn') as HTMLButtonElement;

        if (!input || !minusBtn || !plusBtn || !rollBtn) return;

        const updateInput = () => {
            input.value = this.character.customRoll.toString();
            db.saveCharacter(this.character);
        };

        updateInput();

        minusBtn.addEventListener('click', () => {
            this.character.customRoll = Math.max(CUSTOM_ROLL_MIN, this.character.customRoll - 1);
            updateInput();
        });

        plusBtn.addEventListener('click', () => {
            this.character.customRoll = Math.min(CUSTOM_ROLL_MAX, this.character.customRoll + 1);
            updateInput();
        });

        input.addEventListener('change', () => {
            const value = parseInt(input.value) || 1;
            this.character.customRoll = Math.max(CUSTOM_ROLL_MIN, Math.min(CUSTOM_ROLL_MAX, value));
            this.saveAndRender();
        });

        rollBtn.addEventListener('click', () => {
            this.diceRoller.rollPMAR('customRoll', 'Custom');
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.diceRoller.rollPMAR('customRoll', 'Custom');
            }
        });
    }

    // ==================== NAME LISTENERS ====================

    private attachNameEditListener(): void {
        const nameDiv = this.safeQuery('#character-name');
        if (nameDiv) {
            nameDiv.textContent = this.character.name;
            nameDiv.style.cursor = 'pointer';
            nameDiv.title = 'Hold to edit name';
            attachHoldPress(nameDiv, () => {
                showEditNameModal(this.character, nameDiv);
            });
        }
    }

    // ==================== ITEM & ABILITY LISTENERS ====================

    private attachItemAbilityListeners(): void {
        document.querySelectorAll('.item-ability-entry').forEach(entry => {
            const element = entry as HTMLElement;
            const id = element.dataset.id;
            const type = element.dataset.type as 'item' | 'ability';

            if (!id || !type) return;

            const checkbox = element.querySelector('.item-checkbox') as HTMLInputElement;

            // Checkbox toggle for items
            if (checkbox && type === 'item') {
                checkbox.addEventListener('change', (e) => {
                    e.stopPropagation();
                    const item = this.character.items.find(i => i.id === id);
                    if (item) {
                        item.equipped = checkbox.checked;
                        this.character.invalidateEffectiveStatsCache();
                        this.saveAndRender();
                    }
                });
            }

            // Click to toggle description
            element.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    toggleDescription(element);
                }
            });

            // Long press to edit/delete
            attachHoldPress(element, () => {
                this.showItemAbilityMenu(id, type);
            });
        });

        this.itemAbilityListenersAttached = true;
    }

    private attachNewItemAbilityListeners(): void {
        const newItemBtn = this.safeQuery('.new-item-btn') as HTMLButtonElement;
        const newAbilityBtn = this.safeQuery('.new-ability-btn') as HTMLButtonElement;

        if (newItemBtn && !this.newButtonListenersAttached) {
            newItemBtn.addEventListener('click', () => this.createNewItem());
        }

        if (newAbilityBtn && !this.newButtonListenersAttached) {
            newAbilityBtn.addEventListener('click', () => this.createNewAbility());
        }

        this.newButtonListenersAttached = true;
    }

    private showItemAbilityMenu(id: string, type: 'item' | 'ability'): void {
        const options = ['Edit', 'Delete', 'Cancel'];
        const choice = prompt(`${type === 'item' ? 'Item' : 'Ability'} options:\n${options.map((o, i) => `${i + 1}. ${o}`).join('\n')}\n\nEnter number or cancel`);

        if (choice === '1' || choice?.toLowerCase() === 'edit') {
            this.editItemOrAbility(id, type);
        } else if (choice === '2' || choice?.toLowerCase() === 'delete') {
            this.deleteItemOrAbility(id, type);
        }
    }

    private editItemOrAbility(id: string, type: 'item' | 'ability'): void {
        if (type === 'item') {
            const item = this.character.items.find(i => i.id === id);
            if (!item) return;

            editPopover.show(type, item, (data) => {
                item.name = data.name;
                item.location = data.location;
                item.description = data.description;
                this.character.invalidateEffectiveStatsCache();
                this.saveAndRender();
            });
        } else {
            const ability = this.character.abilities.find(a => a.id === id);
            if (!ability) return;

            editPopover.show(type, ability, (data) => {
                ability.name = data.name;
                ability.description = data.description;
                this.saveAndRender();
            });
        }
    }

    private deleteItemOrAbility(id: string, type: 'item' | 'ability'): void {
        if (window.confirm(`Delete this ${type}?`)) {
            if (type === 'item') {
                this.character.items = this.character.items.filter(i => i.id !== id);
                this.character.invalidateEffectiveStatsCache();
            } else {
                this.character.abilities = this.character.abilities.filter(a => a.id !== id);
            }
            this.saveAndRender();
        }
    }

    private createNewItem(): void {
        editPopover.show(
            'item',
            { name: '', location: 'melee weapon', description: '' },
            (data) => {
                if (!data.name) return;
                this.character.items.push({
                    id: Date.now().toString(),
                    name: data.name,
                    location: data.location || 'melee weapon',
                    description: data.description,
                    equipped: false,
                });
                this.character.invalidateEffectiveStatsCache();
                this.saveAndRender();
            }
        );
    }

    private createNewAbility(): void {
        editPopover.show(
            'ability',
            { name: '', description: '' },
            (data) => {
                if (!data.name) return;
                this.character.abilities.push({
                    id: Date.now().toString(),
                    name: data.name,
                    description: data.description,
                });
                this.saveAndRender();
            }
        );
    }
}
