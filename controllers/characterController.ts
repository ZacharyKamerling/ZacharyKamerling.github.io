import { Character } from '../models/character.js';
import { db } from '../data/db.js';
import { DiceRoller } from '../utils/diceRollers.js';
import { CardDrawer } from '../utils/cardDrawers.js';
import { CharacterView } from '../views/characterView.js';
import { showEditNameModal, numberPrompt } from '../utils/ui.js';

export class CharacterController {
    private character: Character;
    private view: CharacterView;
    private diceRoller: DiceRoller;
    private cardDrawer: CardDrawer;

    constructor(character: Character, view: CharacterView) {
        this.character = character;
        this.view = view;
        this.diceRoller = new DiceRoller(character, document.getElementById('dice-results')!);
        document.getElementById('token-section')?.addEventListener('contextmenu', (e) => e.preventDefault());
        document.getElementById('stat-section')?.addEventListener('contextmenu', (e) => e.preventDefault());
        this.view.render(this.character);
        // Initialize cardDrawer after render so DOM elements exist
        this.cardDrawer = new CardDrawer(character, document.getElementById('card-result-box')!);
        this.attachNameEditListener();
        this.attachStatRollListeners();
        this.attachStatMaxSetListeners();
        this.attachTokenListeners();
        this.attachTokenMaxSetListeners();
        this.attachCustomRollListeners();
        this.attachItemAbilityListeners();
        this.attachNewItemListener();
        this.attachNewAbilityListener();
        this.attachCardDrawingListeners();
        this.attachItemCheckboxListeners();
        this.attachNotesListener();
    }

    private saveAndRender() {
        db.saveCharacter(this.character);
        this.view.render(this.character);

        // Initialize cardDrawer after DOM is ready
        const cardResultBox = document.getElementById('card-result-box');
        if (cardResultBox) {
            this.cardDrawer = new CardDrawer(this.character, cardResultBox);
        }

        // Re-attach all listeners
        this.attachStatRollListeners();
        this.attachStatMaxSetListeners();
        this.attachTokenListeners();
        this.attachTokenMaxSetListeners();
        this.attachCustomRollListeners();
        this.attachItemAbilityListeners();
        this.attachNewItemListener();
        this.attachNewAbilityListener();
        this.attachCardDrawingListeners();
        this.attachItemCheckboxListeners();
        this.attachNotesListener();
    }

    private attachTokenMaxSetListeners() {
        document.querySelectorAll('.token-btn').forEach(btn => {
            const button = btn as HTMLButtonElement;
            let holdTimer: ReturnType<typeof setTimeout> | undefined;
            const timeoutFunction = (btn: HTMLButtonElement) => {
                return () => {
                    const type = btn.dataset.type as 'blood' | 'stamina';
                    let label = type === 'blood' ? 'Blood' : 'Stamina';
                    if (type === 'blood') {
                        numberPrompt(`Set max ${label} (1-20):`, this.character.bloodMax || 5, 1, 20).then(val => {
                            if (val !== null && !isNaN(val)) {
                                this.character.bloodMax = val;
                                if (this.character.bloodTokens > val) this.character.bloodTokens = val;
                                this.saveAndRender();
                            }
                        });
                    } else {
                        numberPrompt(`Set max ${label} (1-20):`, this.character.staminaMax || 5, 1, 20).then(val => {
                            if (val !== null && !isNaN(val)) {
                                this.character.staminaMax = val;
                                if (this.character.staminaTokens > val) this.character.staminaTokens = val;
                                this.saveAndRender();
                            }
                        });
                    }
                }
            };

            button.addEventListener('mousedown', (e: MouseEvent) => {
                holdTimer = setTimeout(timeoutFunction(button), 600);
            });
            button.addEventListener('mouseup', () => clearTimeout(holdTimer));
            button.addEventListener('mouseleave', () => clearTimeout(holdTimer));
            button.addEventListener('touchstart', (e: TouchEvent) => {
                holdTimer = setTimeout(timeoutFunction(button), 600);
            });
            button.addEventListener('touchend', () => {
                clearTimeout(holdTimer);
            });
            button.addEventListener('touchcancel', () => clearTimeout(holdTimer));
            button.addEventListener('contextmenu', (e) => e.preventDefault());
        });
    }

    private attachTokenListeners() {
        document.querySelectorAll('.token-btn').forEach(btn => {
            const button = btn as HTMLButtonElement;
            button.onclick = (e: MouseEvent) => {
                const type = button.dataset.type as 'blood' | 'stamina';
                const idx = parseInt(button.dataset.idx!);
                if (type === 'blood') {
                    if (this.character.bloodTokens === (idx + 1)) {
                        this.character.bloodTokens -= 1;
                    } else {
                        this.character.bloodTokens = idx + 1;
                    }
                }
                if (type === 'stamina') {
                    if (this.character.staminaTokens === (idx + 1)) {
                        this.character.staminaTokens -= 1;
                    } else {
                        this.character.staminaTokens = idx + 1;
                    }
                }
                this.saveAndRender();
            };
        });
    }

    private attachStatRollListeners() {
        [
            ['melee-power-label', 'meleePower', 'Melee Power'],
            ['ranged-power-label', 'rangedPower', 'Ranged Power'],
            ['might-label', 'might', 'Might'],
            ['awareness-label', 'awareness', 'Awareness'],
            ['resolve-label', 'resolve', 'Resolve'],
            ['stress-label', 'stress', 'Stress'],
        ].forEach(([id, stat, label]) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', (e) => {
                    if (e.detail === 1) {
                        if (stat === 'stress') {
                            this.diceRoller.rollStress();
                        } else {
                            this.diceRoller.rollPMAR(stat, label);
                        }
                    }
                });
            }
        });
    }

    private attachNameEditListener() {
        const nameDiv = document.getElementById('character-name');
        if (nameDiv) {
            nameDiv.textContent = this.character.name;
            let holdTimer: ReturnType<typeof setTimeout> | undefined;
            nameDiv.style.cursor = 'pointer';
            nameDiv.title = 'Hold to edit name';
            nameDiv.addEventListener('mousedown', (e: MouseEvent) => {
                if (e.button === 2) return;
                holdTimer = setTimeout(() => {
                    showEditNameModal(this.character, nameDiv);
                }, 600);
            });
            nameDiv.addEventListener('mouseup', () => clearTimeout(holdTimer));
            nameDiv.addEventListener('mouseleave', () => clearTimeout(holdTimer));
            nameDiv.addEventListener('touchstart', (e: TouchEvent) => {
                holdTimer = setTimeout(() => {
                    showEditNameModal(this.character, nameDiv);
                }, 600);
            });
            nameDiv.addEventListener('touchend', () => { clearTimeout(holdTimer); });
            nameDiv.addEventListener('touchcancel', () => clearTimeout(holdTimer));
            nameDiv.addEventListener('contextmenu', (e) => e.preventDefault());
        }
    }

    private attachStatMaxSetListeners() {
        type StatProp = 'meleePower' | 'rangedPower' | 'might' | 'awareness' | 'resolve' | 'stress';
        const statDefs: [string, string, StatProp][] = [
            ['melee-power-label', 'Melee Power', 'meleePower'],
            ['ranged-power-label', 'Ranged Power', 'rangedPower'],
            ['might-label', 'Might', 'might'],
            ['awareness-label', 'Awareness', 'awareness'],
            ['resolve-label', 'Resolve', 'resolve'],
            ['stress-label', 'Stress', 'stress'],
        ];
        statDefs.forEach(([id, label, prop]) => {
            const el = document.getElementById(id);
            if (el) {
                el.style.cursor = 'pointer';
                el.title = `Hold to set ${label}`;
                let holdTimer: ReturnType<typeof setTimeout> | undefined;
                let held = false;
                el.addEventListener('mousedown', (e: MouseEvent) => {
                    if (e.button === 2) return; // ignore right click
                    held = false;
                    holdTimer = setTimeout(() => {
                        held = true;
                        numberPrompt(`Set ${label} (0-100):`, this.character[prop] || 0, 0, 100).then(val => {
                            if (val !== null && !isNaN(val)) {
                                this.character[prop] = val;
                                this.saveAndRender();
                            }
                        });
                    }, 600);
                });
                el.addEventListener('mouseup', (e: MouseEvent) => {
                    clearTimeout(holdTimer);
                    if (!held && e.button === 0) {
                        if (prop === 'stress') {
                            this.diceRoller.rollStress();
                        } else {
                            this.diceRoller.rollPMAR(prop, label);
                        }
                    }
                });
                el.addEventListener('mouseleave', () => clearTimeout(holdTimer));
                el.addEventListener('touchstart', () => {
                    held = false;
                    holdTimer = setTimeout(() => {
                        held = true;
                        numberPrompt(`Set ${label} (0-100):`, this.character[prop] || 0, 0, 100).then(val => {
                            if (val !== null && !isNaN(val)) {
                                this.character[prop] = val;
                                this.saveAndRender();
                            }
                        });
                    }, 600);
                });
                el.addEventListener('touchend', () => {
                    clearTimeout(holdTimer);
                    if (!held) {
                        if (prop === 'stress') {
                            this.diceRoller.rollStress();
                        } else {
                            this.diceRoller.rollPMAR(prop, label);
                        }
                    }
                });
                el.addEventListener('touchcancel', () => clearTimeout(holdTimer));
                el.addEventListener('contextmenu', (e) => e.preventDefault());
            }
        });
    }

    private attachCustomRollListeners() {
        const customRollInput = document.getElementById('custom-roll-input') as HTMLInputElement;
        const minusBtn = document.getElementById('custom-neg-btn') as HTMLButtonElement;
        const plusBtn = document.getElementById('custom-pos-btn') as HTMLButtonElement;
        const rollBtn = document.getElementById('custom-roll-btn') as HTMLButtonElement;

        // Update the input field with current value and save
        const updateInput = () => {
            customRollInput.value = this.character.customRoll.toString();
            db.saveCharacter(this.character.toJSON());
        };

        // Set initial value
        updateInput();

        // Handle -1 button
        minusBtn.addEventListener('click', () => {
            this.character.customRoll = Math.max(1, this.character.customRoll - 1);
            this.character.invalidateEffectiveStatsCache();
            updateInput();
        });

        // Handle +1 button
        plusBtn.addEventListener('click', () => {
            this.character.customRoll = Math.min(100, this.character.customRoll + 1);
            this.character.invalidateEffectiveStatsCache();
            updateInput();
        });

        // Handle direct input changes
        customRollInput.addEventListener('change', () => {
            const value = parseInt(customRollInput.value) || 1;
            this.character.customRoll = Math.max(1, Math.min(100, value));
            this.saveAndRender();
        });

        // Handle roll button
        rollBtn.addEventListener('click', () => {
            this.diceRoller.rollPMAR('customRoll', 'Custom');
        });

        // Handle Enter key to trigger roll
        customRollInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.diceRoller.rollPMAR('customRoll', 'Custom');
            }
        });
    }

    private attachItemAbilityListeners() {
        document.querySelectorAll('.item-ability-entry').forEach(entry => {
            const element = entry as HTMLElement;
            const id = element.dataset.id!;
            const type = element.dataset.type as 'item' | 'ability';
            const description = element.querySelector('.item-ability-description') as HTMLElement;
            let holdTimer: ReturnType<typeof setTimeout> | undefined;

            // Tap to toggle description
            element.addEventListener('click', () => {
                if (description.style.display === 'none') {
                    description.style.display = 'block';
                } else {
                    description.style.display = 'none';
                }
            });

            // Long press to edit/delete
            element.addEventListener('mousedown', (e: MouseEvent) => {
                holdTimer = setTimeout(() => {
                    this.showItemAbilityMenu(id, type);
                }, 600);
            });
            element.addEventListener('mouseup', () => clearTimeout(holdTimer));
            element.addEventListener('mouseleave', () => clearTimeout(holdTimer));

            element.addEventListener('touchstart', (e: TouchEvent) => {
                holdTimer = setTimeout(() => {
                    this.showItemAbilityMenu(id, type);
                }, 600);
            });
            element.addEventListener('touchend', () => clearTimeout(holdTimer));
            element.addEventListener('touchcancel', () => clearTimeout(holdTimer));
            element.addEventListener('contextmenu', (e) => e.preventDefault());
        });
    }

    private showItemAbilityMenu(id: string, type: 'item' | 'ability') {
        const options = ['Edit', 'Delete', 'Cancel'];
        const choice = prompt(`${type === 'item' ? 'Item' : 'Ability'} options:\n${options.map((o, i) => `${i + 1}. ${o}`).join('\n')}\n\nEnter number or cancel`);

        if (choice === '1' || choice?.toLowerCase() === 'edit') {
            this.editItemOrAbility(id, type);
        } else if (choice === '2' || choice?.toLowerCase() === 'delete') {
            this.deleteItemOrAbility(id, type);
        }
    }

    private editItemOrAbility(id: string, type: 'item' | 'ability') {
        if (type === 'item') {
            const item = this.character.items.find(i => i.id === id);
            if (!item) return;

            const name = prompt('Item name:', item.name);
            if (name === null) return;

            const location = prompt('Location (e.g., melee weapon, ranged weapon, armor, storage, or custom):', item.location);
            if (location === null) return;

            const description = prompt('Description:', item.description);
            if (description === null) return;

            item.name = name;
            item.location = location;
            item.description = description;
        } else {
            const ability = this.character.abilities.find(a => a.id === id);
            if (!ability) return;

            const name = prompt('Ability name:', ability.name);
            if (name === null) return;

            const description = prompt('Description:', ability.description);
            if (description === null) return;

            ability.name = name;
            ability.description = description;
        }

        this.saveAndRender();
    }

    private deleteItemOrAbility(id: string, type: 'item' | 'ability') {
        const confirm = window.confirm(`Delete this ${type}?`);
        if (!confirm) return;

        if (type === 'item') {
            this.character.items = this.character.items.filter(i => i.id !== id);
        } else {
            this.character.abilities = this.character.abilities.filter(a => a.id !== id);
        }

        this.saveAndRender();
    }

    private attachNewItemListener() {
        const newItemBtn = document.querySelector('.new-item-btn') as HTMLButtonElement;
        if (newItemBtn) {
            newItemBtn.addEventListener('click', () => {
                this.createNewItem();
            });
        }
    }

    private attachNewAbilityListener() {
        const newAbilityBtn = document.querySelector('.new-ability-btn') as HTMLButtonElement;
        if (newAbilityBtn) {
            newAbilityBtn.addEventListener('click', () => {
                this.createNewAbility();
            });
        }
    }

    private createNewItem() {
        const name = prompt('Item name:');
        if (!name) return;

        const location = prompt('Location (e.g., melee weapon, ranged weapon, armor, storage, or custom):');
        if (location === null) return;

        const description = prompt('Description:');
        if (description === null) return;

        this.character.items.push({
            id: Date.now().toString(),
            name,
            location,
            description,
            equipped: false
        });

        this.saveAndRender();
    }

    private createNewAbility() {
        const name = prompt('Ability name:');
        if (!name) return;

        const description = prompt('Description:');
        if (description === null) return;

        this.character.abilities.push({
            id: Date.now().toString(),
            name,
            description
        });

        this.saveAndRender();
    }

    private attachCardDrawingListeners() {
        const drawBtn = document.getElementById('draw-cards-btn') as HTMLButtonElement;
        const unarmoredToggle = document.getElementById('unarmored-toggle') as HTMLInputElement;

        if (drawBtn) {
            drawBtn.addEventListener('click', () => {
                this.cardDrawer.drawCards();
            });
        }

        if (unarmoredToggle) {
            unarmoredToggle.addEventListener('change', () => {
                this.character.unarmored = unarmoredToggle.checked;
                this.saveAndRender();
            });
        }
    }

    private attachItemCheckboxListeners() {
        document.querySelectorAll('.item-checkbox').forEach(checkbox => {
            const input = checkbox as HTMLInputElement;
            input.addEventListener('change', () => {
                const itemId = input.dataset.id;
                const item = this.character.items.find(i => i.id === itemId);
                if (item) {
                    item.equipped = input.checked;
                    this.character.invalidateEffectiveStatsCache();
                    db.saveCharacter(this.character);
                }
            });
        });
    }

    private attachNotesListener() {
        const notesInput = document.getElementById('notes-input') as HTMLTextAreaElement;
        const saveNotesBtn = document.getElementById('save-notes-btn') as HTMLButtonElement;

        if (notesInput) {
            notesInput.addEventListener('input', () => {
                this.character.notes = notesInput.value;
            });
        }

        if (saveNotesBtn) {
            saveNotesBtn.addEventListener('click', () => {
                db.saveCharacter(this.character);
                saveNotesBtn.textContent = 'Saved!';
                setTimeout(() => {
                    saveNotesBtn.textContent = 'Save Notes';
                }, 1500);
            });
        }
    }
}
