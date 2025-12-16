import { Character } from '../models/character.js';
import { db } from '../data/db.js';
import { DiceRoller } from '../utils/diceRollers.js';
import { CharacterView } from '../views/characterView.js';
import { showEditNameModal, numberPrompt } from '../utils/ui.js';

export class CharacterController {
    private character: Character;
    private view: CharacterView;
    private diceRoller: DiceRoller;

    constructor(character: Character, view: CharacterView) {
        this.character = character;
        this.view = view;
        this.diceRoller = new DiceRoller(character, document.getElementById('dice-results')!);
        document.getElementById('token-section')?.addEventListener('contextmenu', (e) => e.preventDefault());
        document.getElementById('stat-section')?.addEventListener('contextmenu', (e) => e.preventDefault());
        this.view.render(this.character);
        this.attachNameEditListener();
        this.attachStatRollListeners();
        this.attachStatMaxSetListeners();
        this.attachTokenListeners();
        this.attachTokenMaxSetListeners();
        this.attachCustomRollListeners();
    }

    private saveAndRender() {
        db.saveCharacter(this.character);
        this.view.render(this.character);
        this.attachStatRollListeners();
        this.attachStatMaxSetListeners();
        this.attachTokenListeners();
        this.attachTokenMaxSetListeners();
        this.attachCustomRollListeners();
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
                        numberPrompt(`Set ${label} (0-20):`, this.character[prop] || 0, 0, 20).then(val => {
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
                        numberPrompt(`Set ${label} (0-20):`, this.character[prop] || 0, 0, 20).then(val => {
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
            updateInput();
        });

        // Handle +1 button
        plusBtn.addEventListener('click', () => {
            this.character.customRoll = Math.min(20, this.character.customRoll + 1);
            updateInput();
        });

        // Handle direct input changes
        customRollInput.addEventListener('change', () => {
            const value = parseInt(customRollInput.value) || 1;
            this.character.customRoll = Math.max(1, Math.min(20, value));
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
}
