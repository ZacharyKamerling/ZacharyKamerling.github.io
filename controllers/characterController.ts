import { Character } from '../models/character.js';
import { db } from '../data/db.js';
import { DiceRoller } from '../utils/diceRollers.js';
import { CardDrawer } from '../utils/cardDrawers.js';
import { CharacterView } from '../views/characterView.js';
import { showEditNameModal, numberPrompt } from '../utils/ui.js';
import { editPopover } from '../utils/editPopover.js';

export class CharacterController {
    private character: Character;
    private view: CharacterView;
    private diceRoller: DiceRoller;
    private cardDrawer: CardDrawer;

    constructor(character: Character, view: CharacterView) {
        this.character = character;
        this.view = view;

        // Render view first to create DOM elements
        this.view.render(this.character);

        // Initialize components after DOM exists
        this.diceRoller = new DiceRoller(character, document.getElementById('dice-results')!);
        this.cardDrawer = new CardDrawer(character, document.getElementById('card-result-box')!);

        // Attach all listeners
        document.getElementById('token-section')?.addEventListener('contextmenu', (e) => e.preventDefault());
        document.getElementById('stat-section')?.addEventListener('contextmenu', (e) => e.preventDefault());
        this.attachNameEditListener();
        this.attachStatMaxSetListeners();
        this.attachTokenListeners();
        this.attachCustomRollListeners();
        this.attachItemAbilityListeners();
        this.attachNewItemListener();
        this.attachNewAbilityListener();
        this.attachCardDrawingListeners();
        this.attachItemCheckboxListeners();
        this.attachNotesListener();
    }

    private saveAndRender() {
        db.saveCharacter(this.character.toJSON());
        this.view.render(this.character);

        // Re-initialize diceRoller and cardDrawer after DOM is ready
        const diceResultBox = document.getElementById('dice-results');
        if (diceResultBox) {
            this.diceRoller.resultBox = diceResultBox;
            this.diceRoller.redisplay();
        }
        const cardResultBox = document.getElementById('card-result-box');
        if (cardResultBox) {
            this.cardDrawer = new CardDrawer(this.character, cardResultBox);
        }

        // Re-attach all listeners immediately (DOM is already rendered)
        this.attachStatMaxSetListeners();
        this.attachTokenListeners();
        this.attachCustomRollListeners();
        this.attachItemAbilityListeners();
        this.attachNewItemListener();
        this.attachNewAbilityListener();
        this.attachCardDrawingListeners();
        this.attachItemCheckboxListeners();
        this.attachNotesListener();
    }

    private attachTokenListeners() {
        document.querySelectorAll('.token-btn').forEach(btn => {
            const button = btn as HTMLButtonElement;
            let holdTimer: ReturnType<typeof setTimeout> | undefined;
            let held = false;

            const startHold = () => {
                held = false;
                holdTimer = setTimeout(() => {
                    held = true;
                    const type = button.dataset.type as 'blood' | 'stamina';
                    const label = type === 'blood' ? 'Blood' : 'Stamina';
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
                }, 600);
            };

            const endHold = (doClick: boolean) => {
                clearTimeout(holdTimer);
                if (doClick && !held) {
                    const type = button.dataset.type as 'blood' | 'stamina';
                    const idx = parseInt(button.dataset.idx!);
                    if (type === 'blood') {
                        this.character.bloodTokens = this.character.bloodTokens === idx + 1 ? idx : idx + 1;
                    } else {
                        this.character.staminaTokens = this.character.staminaTokens === idx + 1 ? idx : idx + 1;
                    }
                    this.saveAndRender();
                }
            };

            button.addEventListener('mousedown', (e: MouseEvent) => { if (e.button === 0) startHold(); });
            button.addEventListener('mouseup', (e: MouseEvent) => { if (e.button === 0) endHold(true); });
            button.addEventListener('mouseleave', () => clearTimeout(holdTimer));
            button.addEventListener('touchstart', () => startHold());
            button.addEventListener('touchend', (e: TouchEvent) => { e.preventDefault(); endHold(true); });
            button.addEventListener('touchcancel', () => clearTimeout(holdTimer));
            button.addEventListener('contextmenu', (e) => e.preventDefault());
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
                el.onmousedown = (e: MouseEvent) => {
                    if (e.button === 2) return; // ignore right click
                    held = false;
                    holdTimer = setTimeout(() => {
                        held = true;
                        numberPrompt(`Set ${label} (0-100):`, this.character[prop] || 0, 0, 100).then(val => {
                            if (val !== null && !isNaN(val)) {
                                this.character[prop] = val;
                                this.character.invalidateEffectiveStatsCache();
                                this.saveAndRender();
                            }
                        });
                    }, 600);
                };
                el.onmouseup = (e: MouseEvent) => {
                    clearTimeout(holdTimer);
                    if (!held && e.button === 0) {
                        if (prop === 'stress') {
                            this.diceRoller.rollStress();
                        } else {
                            this.diceRoller.rollPMAR(prop, label);
                        }
                    }
                };
                el.onmouseleave = () => clearTimeout(holdTimer);
                el.ontouchstart = () => {
                    held = false;
                    holdTimer = setTimeout(() => {
                        held = true;
                        numberPrompt(`Set ${label} (0-100):`, this.character[prop] || 0, 0, 100).then(val => {
                            if (val !== null && !isNaN(val)) {
                                this.character[prop] = val;
                                this.character.invalidateEffectiveStatsCache();
                                this.saveAndRender();
                            }
                        });
                    }, 600);
                };
                el.ontouchend = () => {
                    clearTimeout(holdTimer);
                    if (!held) {
                        if (prop === 'stress') {
                            this.diceRoller.rollStress();
                        } else {
                            this.diceRoller.rollPMAR(prop, label);
                        }
                    }
                };
                el.ontouchcancel = () => clearTimeout(holdTimer);
                el.oncontextmenu = (e) => {
                    e.preventDefault();
                    return false;
                };
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
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;

        const container = document.createElement('div');
        container.style.cssText = `
            background: #2a2a2a;
            border: 2px solid #666;
            border-radius: 0.5em;
            padding: 1.5em;
            z-index: 1001;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
            max-width: 300px;
        `;

        const title = document.createElement('h3');
        title.textContent = `${type === 'item' ? 'Item' : 'Ability'} Options`;
        title.style.cssText = 'margin-top: 0; margin-bottom: 1em; font-size: 1.1em;';
        container.appendChild(title);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; flex-direction: column; gap: 0.5em;';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.style.cssText = 'padding: 0.7em; background: #4a9eff; color: #fff; border: none; border-radius: 0.3em; cursor: pointer; font-weight: 600;';
        editBtn.onclick = () => {
            modal.remove();
            this.editItemOrAbility(id, type);
        };
        buttonContainer.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.cssText = 'padding: 0.7em; background: #ff6b6b; color: #fff; border: none; border-radius: 0.3em; cursor: pointer; font-weight: 600;';
        deleteBtn.onclick = () => {
            modal.remove();
            this.deleteItemOrAbility(id, type);
        };
        buttonContainer.appendChild(deleteBtn);

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = 'padding: 0.7em; background: #666; color: #fff; border: none; border-radius: 0.3em; cursor: pointer;';
        cancelBtn.onclick = () => modal.remove();
        buttonContainer.appendChild(cancelBtn);

        container.appendChild(buttonContainer);
        modal.appendChild(container);
        document.body.appendChild(modal);

        // Close on Escape
        const escapeHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    private editItemOrAbility(id: string, type: 'item' | 'ability') {
        if (type === 'item') {
            const item = this.character.items.find(i => i.id === id);
            if (!item) return;

            editPopover.show('item', item, (updatedData: any) => {
                item.name = updatedData.name;
                item.location = updatedData.location;
                item.description = updatedData.description;
                this.saveAndRender();
            });
        } else {
            const ability = this.character.abilities.find(a => a.id === id);
            if (!ability) return;

            editPopover.show('ability', ability, (updatedData: any) => {
                ability.name = updatedData.name;
                ability.description = updatedData.description;
                this.saveAndRender();
            });
        }
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
        const templateSelect = document.getElementById('item-template-select') as HTMLSelectElement;
        const template = templateSelect?.value || '';
        const templateDescriptions: { [key: string]: string } = {
            melee_power:  '$$melee_power:1',
            ranged_power: '$$ranged_power:1',
            might:        '$$might:1',
            awareness:    '$$awareness:1',
            resolve:      '$$resolve:1',
            stress:       '$$stress:1',
            blood_max:    '$$blood_max:1',
            stamina_max:  '$$stamina_max:1',
        };

        const defaultDesc = template ? templateDescriptions[template] || '' : '';

        editPopover.show('item', {
            id: Date.now().toString(),
            name: '',
            location: '',
            description: defaultDesc,
            equipped: false
        }, (data: any) => {
            if (data.name.trim()) {
                this.character.items.push({
                    id: Date.now().toString(),
                    name: data.name.trim(),
                    location: data.location.trim(),
                    description: data.description.trim(),
                    equipped: false
                });
                this.saveAndRender();
            }
        });
    }

    private createNewAbility() {
        editPopover.show('ability', {
            id: Date.now().toString(),
            name: '',
            description: ''
        }, (data: any) => {
            if (data.name.trim()) {
                this.character.abilities.push({
                    id: Date.now().toString(),
                    name: data.name.trim(),
                    description: data.description.trim()
                });
                this.saveAndRender();
            }
        });
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
