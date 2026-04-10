import { Character } from '../models/character.js';
import { db } from '../data/db.js';
import { DiceRoller } from '../utils/diceRollers.js';
import { CardDrawer } from '../utils/cardDrawers.js';
import { CharacterView } from '../views/characterView.js';
import { showEditNameModal, numberPrompt } from '../utils/ui.js';
import { COLORS, SPACING, RADIUS, Z_INDEX, MODAL, HOLD_PRESS_DURATION_MS } from '../utils/constants.js';

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
                }, HOLD_PRESS_DURATION_MS);
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
                }, HOLD_PRESS_DURATION_MS);
            });
            nameDiv.addEventListener('mouseup', () => clearTimeout(holdTimer));
            nameDiv.addEventListener('mouseleave', () => clearTimeout(holdTimer));
            nameDiv.addEventListener('touchstart', (e: TouchEvent) => {
                holdTimer = setTimeout(() => {
                    showEditNameModal(this.character, nameDiv);
                }, HOLD_PRESS_DURATION_MS);
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
                    }, HOLD_PRESS_DURATION_MS);
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
                    }, HOLD_PRESS_DURATION_MS);
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
            const nameEl = element.querySelector('.item-ability-name') as HTMLElement;
            let holdTimer: ReturnType<typeof setTimeout> | undefined;

            // Click name to edit
            if (nameEl) {
                nameEl.addEventListener('click', (e: Event) => {
                    e.stopPropagation();
                    this.editItemOrAbility(id, type);
                });
            }

            // Click to toggle description (but not name, not checkbox)
            element.addEventListener('click', (e: Event) => {
                const target = e.target as HTMLElement;

                // Don't toggle if clicking the name (opens edit mode)
                if (target.classList.contains('item-ability-name')) {
                    return;
                }

                // Don't toggle if clicking the checkbox (handled separately)
                if (target.classList.contains('item-checkbox')) {
                    return;
                }

                // Toggle description visibility
                if (description.style.display === 'none') {
                    description.style.display = 'block';
                } else {
                    description.style.display = 'none';
                }
            });

            // Long press for delete menu
            element.addEventListener('mousedown', (e: MouseEvent) => {
                holdTimer = setTimeout(() => {
                    this.showItemAbilityMenu(id, type);
                }, HOLD_PRESS_DURATION_MS);
            });
            element.addEventListener('mouseup', () => clearTimeout(holdTimer));
            element.addEventListener('mouseleave', () => clearTimeout(holdTimer));

            element.addEventListener('touchstart', (e: TouchEvent) => {
                holdTimer = setTimeout(() => {
                    this.showItemAbilityMenu(id, type);
                }, HOLD_PRESS_DURATION_MS);
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
            background: rgba(0, 0, 0, ${MODAL.overlayOpacity});
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: ${Z_INDEX.modalOverlay};
        `;

        const container = document.createElement('div');
        container.style.cssText = `
            background: ${COLORS.dark};
            border: 2px solid ${COLORS.borderDark};
            border-radius: ${RADIUS.lg};
            padding: ${SPACING.xl};
            z-index: ${Z_INDEX.modalHigh};
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
            max-width: ${MODAL.menuMaxWidth};
        `;

        const title = document.createElement('h3');
        title.textContent = `${type === 'item' ? 'Item' : 'Ability'} Options`;
        title.style.cssText = `margin-top: 0; margin-bottom: ${SPACING.lg}; font-size: 1.1em;`;
        container.appendChild(title);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `display: flex; flex-direction: column; gap: ${SPACING.sm};`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.cssText = `padding: ${SPACING.md}; background: ${COLORS.danger}; color: ${COLORS.text}; border: none; border-radius: ${RADIUS.md}; cursor: pointer; font-weight: 600;`;
        deleteBtn.onclick = () => {
            modal.remove();
            this.deleteItemOrAbility(id, type);
        };
        buttonContainer.appendChild(deleteBtn);

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = `padding: ${SPACING.md}; background: ${COLORS.borderDark}; color: ${COLORS.text}; border: none; border-radius: ${RADIUS.md}; cursor: pointer;`;
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
        const entry = document.querySelector(`[data-id="${id}"][data-type="${type}"]`) as HTMLElement;
        if (!entry) return;

        const descEl = entry.querySelector('.item-ability-description') as HTMLElement;
        if (!descEl) return;

        const currentDescription = descEl.textContent || '';

        // Create edit container with textarea
        const editContainer = document.createElement('div');
        editContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: ${SPACING.sm};
            padding: ${SPACING.sm};
            background: ${COLORS.medium};
            border-radius: ${RADIUS.md};
            margin-top: ${SPACING.sm};
        `;

        const textarea = document.createElement('textarea');
        textarea.value = currentDescription;
        textarea.style.cssText = `
            min-height: 4em;
            padding: ${SPACING.sm};
            border-radius: ${RADIUS.md};
            background: ${COLORS.darker};
            border: 1px solid ${COLORS.border};
            color: ${COLORS.text};
            font-family: monospace;
            font-size: 0.9em;
            box-sizing: border-box;
            resize: vertical;
        `;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: ${SPACING.sm};
        `;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.style.cssText = `
            flex: 1;
            padding: ${SPACING.md};
            background: ${COLORS.success};
            color: ${COLORS.textDark};
            border: none;
            border-radius: ${RADIUS.md};
            font-weight: 600;
            cursor: pointer;
        `;

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = `
            flex: 1;
            padding: ${SPACING.md};
            background: ${COLORS.borderDark};
            color: ${COLORS.text};
            border: none;
            border-radius: ${RADIUS.md};
            font-weight: 600;
            cursor: pointer;
        `;

        // Save handler
        saveBtn.addEventListener('click', () => {
            if (type === 'item') {
                const item = this.character.items.find(i => i.id === id);
                if (item) {
                    item.description = textarea.value.trim();
                    this.saveAndRender();
                }
            } else {
                const ability = this.character.abilities.find(a => a.id === id);
                if (ability) {
                    ability.description = textarea.value.trim();
                    this.saveAndRender();
                }
            }
        });

        // Cancel handler
        cancelBtn.addEventListener('click', () => {
            this.saveAndRender();
        });

        buttonContainer.appendChild(saveBtn);
        buttonContainer.appendChild(cancelBtn);
        editContainer.appendChild(textarea);
        editContainer.appendChild(buttonContainer);

        // Replace description with edit container
        descEl.replaceWith(editContainer);

        // Focus on textarea
        textarea.focus();
        textarea.select();
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

        // Create form container
        const formContainer = document.createElement('div');
        formContainer.style.cssText = `
            padding: ${SPACING.lg};
            background: ${COLORS.medium};
            border-radius: ${RADIUS.lg};
            margin-bottom: ${SPACING.lg};
        `;

        // Name field
        const nameDiv = document.createElement('div');
        nameDiv.style.cssText = `margin-bottom: ${SPACING.md};`;
        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Name';
        nameLabel.style.cssText = `display: block; margin-bottom: 0.3em; font-weight: 500;`;
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Item name';
        nameInput.style.cssText = `width: 100%; padding: ${SPACING.sm}; border-radius: ${RADIUS.md}; background: ${COLORS.dark}; border: 1px solid ${COLORS.border}; color: ${COLORS.text}; box-sizing: border-box;`;
        nameDiv.appendChild(nameLabel);
        nameDiv.appendChild(nameInput);

        // Location field
        const locationDiv = document.createElement('div');
        locationDiv.style.cssText = `margin-bottom: ${SPACING.md};`;
        const locationLabel = document.createElement('label');
        locationLabel.textContent = 'Location';
        locationLabel.style.cssText = `display: block; margin-bottom: 0.3em; font-weight: 500;`;
        const locationInput = document.createElement('input');
        locationInput.type = 'text';
        locationInput.placeholder = 'e.g., melee weapon, armor, storage';
        locationInput.style.cssText = `width: 100%; padding: ${SPACING.sm}; border-radius: ${RADIUS.md}; background: ${COLORS.dark}; border: 1px solid ${COLORS.border}; color: ${COLORS.text}; box-sizing: border-box;`;
        locationDiv.appendChild(locationLabel);
        locationDiv.appendChild(locationInput);

        // Description field
        const descDiv = document.createElement('div');
        descDiv.style.cssText = `margin-bottom: ${SPACING.md};`;
        const descLabel = document.createElement('label');
        descLabel.textContent = 'Description';
        descLabel.style.cssText = `display: block; margin-bottom: 0.3em; font-weight: 500;`;
        const descTextarea = document.createElement('textarea');
        descTextarea.value = defaultDesc;
        descTextarea.placeholder = 'Item description';
        descTextarea.style.cssText = `width: 100%; min-height: 4em; padding: ${SPACING.sm}; border-radius: ${RADIUS.md}; background: ${COLORS.dark}; border: 1px solid ${COLORS.border}; color: ${COLORS.text}; font-family: monospace; font-size: 0.9em; box-sizing: border-box; resize: vertical;`;
        descDiv.appendChild(descLabel);
        descDiv.appendChild(descTextarea);

        // Help text for templates
        if (template) {
            const helpText = document.createElement('div');
            helpText.textContent = 'Use $$stat_name:value for buffs (e.g., $$melee_power:2)';
            helpText.style.cssText = `font-size: 0.8em; opacity: 0.6; margin-top: 0.2em;`;
            descDiv.appendChild(helpText);
        }

        // Button container
        const buttonDiv = document.createElement('div');
        buttonDiv.style.cssText = `display: flex; gap: ${SPACING.sm};`;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.style.cssText = `flex: 1; padding: ${SPACING.md}; background: ${COLORS.success}; color: ${COLORS.textDark}; border: none; border-radius: ${RADIUS.md}; font-weight: 600; cursor: pointer;`;
        saveBtn.addEventListener('click', () => {
            if (nameInput.value.trim()) {
                this.character.items.push({
                    id: Date.now().toString(),
                    name: nameInput.value.trim(),
                    location: locationInput.value.trim(),
                    description: descTextarea.value.trim(),
                    equipped: false
                });
                this.saveAndRender();
            }
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = `flex: 1; padding: ${SPACING.md}; background: ${COLORS.borderDark}; color: ${COLORS.text}; border: none; border-radius: ${RADIUS.md}; font-weight: 600; cursor: pointer;`;
        cancelBtn.addEventListener('click', () => {
            this.saveAndRender();
        });

        buttonDiv.appendChild(saveBtn);
        buttonDiv.appendChild(cancelBtn);

        formContainer.appendChild(nameDiv);
        formContainer.appendChild(locationDiv);
        formContainer.appendChild(descDiv);
        formContainer.appendChild(buttonDiv);

        // Insert form before the item template select
        const templateSelect_el = document.getElementById('item-template-select');
        if (templateSelect_el && templateSelect_el.parentElement) {
            templateSelect_el.parentElement.insertBefore(formContainer, templateSelect_el);
        }

        // Focus on name input
        nameInput.focus();
    }

    private createNewAbility() {
        // Create form container
        const formContainer = document.createElement('div');
        formContainer.style.cssText = `
            padding: ${SPACING.lg};
            background: ${COLORS.medium};
            border-radius: ${RADIUS.lg};
            margin-bottom: ${SPACING.lg};
        `;

        // Name field
        const nameDiv = document.createElement('div');
        nameDiv.style.cssText = `margin-bottom: ${SPACING.md};`;
        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Name';
        nameLabel.style.cssText = `display: block; margin-bottom: 0.3em; font-weight: 500;`;
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Ability name';
        nameInput.style.cssText = `width: 100%; padding: ${SPACING.sm}; border-radius: ${RADIUS.md}; background: ${COLORS.dark}; border: 1px solid ${COLORS.border}; color: ${COLORS.text}; box-sizing: border-box;`;
        nameDiv.appendChild(nameLabel);
        nameDiv.appendChild(nameInput);

        // Description field
        const descDiv = document.createElement('div');
        descDiv.style.cssText = `margin-bottom: ${SPACING.md};`;
        const descLabel = document.createElement('label');
        descLabel.textContent = 'Description';
        descLabel.style.cssText = `display: block; margin-bottom: 0.3em; font-weight: 500;`;
        const descTextarea = document.createElement('textarea');
        descTextarea.placeholder = 'Ability description';
        descTextarea.style.cssText = `width: 100%; min-height: 4em; padding: ${SPACING.sm}; border-radius: ${RADIUS.md}; background: ${COLORS.dark}; border: 1px solid ${COLORS.border}; color: ${COLORS.text}; font-family: monospace; font-size: 0.9em; box-sizing: border-box; resize: vertical;`;
        descDiv.appendChild(descLabel);
        descDiv.appendChild(descTextarea);

        // Button container
        const buttonDiv = document.createElement('div');
        buttonDiv.style.cssText = `display: flex; gap: ${SPACING.sm};`;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.style.cssText = `flex: 1; padding: ${SPACING.md}; background: ${COLORS.success}; color: ${COLORS.textDark}; border: none; border-radius: ${RADIUS.md}; font-weight: 600; cursor: pointer;`;
        saveBtn.addEventListener('click', () => {
            if (nameInput.value.trim()) {
                this.character.abilities.push({
                    id: Date.now().toString(),
                    name: nameInput.value.trim(),
                    description: descTextarea.value.trim()
                });
                this.saveAndRender();
            }
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = `flex: 1; padding: ${SPACING.md}; background: ${COLORS.borderDark}; color: ${COLORS.text}; border: none; border-radius: ${RADIUS.md}; font-weight: 600; cursor: pointer;`;
        cancelBtn.addEventListener('click', () => {
            this.saveAndRender();
        });

        buttonDiv.appendChild(saveBtn);
        buttonDiv.appendChild(cancelBtn);

        formContainer.appendChild(nameDiv);
        formContainer.appendChild(descDiv);
        formContainer.appendChild(buttonDiv);

        // Insert form before the "New Ability" button
        const newAbilityBtn = document.querySelector('.new-ability-btn') as HTMLElement;
        if (newAbilityBtn && newAbilityBtn.parentElement) {
            newAbilityBtn.parentElement.insertBefore(formContainer, newAbilityBtn);
        }

        // Focus on name input
        nameInput.focus();
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

            // Prevent checkbox click from affecting parent element
            input.addEventListener('click', (e: Event) => {
                e.stopPropagation();
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
