import { db } from './db.js';
import { Character, CharacterData } from './Character.js';
import { DiceRoller } from './diceRollers.js';

declare function numberPrompt(msg: string, val: number, min: number, max: number): Promise<number|null>;
declare function showEditNameModal(): void;

const characterId = new URLSearchParams(window.location.search).get('id')!;
const rawCharacter = db.getCharacter(characterId);
if (!rawCharacter) {
    alert("Character not found!");
    window.location.href = "index.html";
    throw new Error("Character not found");
}
const character = Character.fromRaw(rawCharacter);

function renderTokens() {
    let blood = '';
    let maxBlood = character.bloodMax || 1;
    let currentBlood = character.bloodTokens || 0;
    for (let i = 0; i < maxBlood; i++) {
        blood += `<button class="token-btn" data-type="blood" data-idx="${i}" style="font-size:1.5em; margin:2px 2px;${i < currentBlood ? '' : 'opacity:0.3;'}">🩸</button>`;
    }
    let stamina = '';
    let maxStamina = character.staminaMax || 1;
    let currentStamina = character.staminaTokens || 0;
    for (let i = 0; i < maxStamina; i++) {
        stamina += `<button class="token-btn" data-type="stamina" data-idx="${i}" style="font-size:1.5em; margin:2px 2px;${i < currentStamina ? '' : 'opacity:0.3;'}">⚡</button>`;
    }
    const tokenSection = document.getElementById('token-section');
    if (!tokenSection) return;
    tokenSection.innerHTML = `
                <div style="font-size:1.2em; margin-bottom:0.5em; display: flex; flex-direction: column; gap: 0.5em;">
                    <div style="display: flex; flex-direction: column; align-items: flex-start;">
                        <span id="blood-label" style="padding-left: 0.5em; font-size: 1em;">Blood (${currentBlood} / ${maxBlood})</span>
                        <div>${blood}</div>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: flex-start;">
                        <span id="stamina-label" style="padding-left: 0.5em; font-size: 1em;">Stamina (${currentStamina} / ${maxStamina})</span>
                        <div>${stamina}</div>
                    </div>
                </div>
            `;

    // Clicking a token sets current to that value (contiguous) and long-press sets max
    document.querySelectorAll('.token-btn').forEach(btn => {
        const button = btn as HTMLButtonElement;
        // Click to set current value (original contiguous behavior)
        button.onclick = (e: MouseEvent) => {
            const type = button.dataset.type as 'blood' | 'stamina';
            const idx = parseInt(button.dataset.idx!);
            if (type === 'blood') {
                if (character.bloodTokens === (idx + 1)) {
                    character.bloodTokens -= 1;
                } else {
                    character.bloodTokens = idx + 1;
                }
            }
            if (type === 'stamina') {
                if (character.staminaTokens === (idx + 1)) {
                    character.staminaTokens -= 1;
                } else {
                    character.staminaTokens = idx + 1;
                }
            }
            db.saveCharacter(character.toJSON());
            renderTokens();
        };
        // Hold-to-set-max on any token
        let holdTimer: ReturnType<typeof setTimeout> | undefined;
        const timeoutFunction = (btn: HTMLButtonElement) => {
            return () => {
                const type = btn.dataset.type as 'blood' | 'stamina';
                let label = type === 'blood' ? 'Blood' : 'Stamina';
                if (type === 'blood') {
                    numberPrompt(`Set max ${label} (1-20):`, character.bloodMax || 5, 1, 20).then(val => {
                        if (val !== null && !isNaN(val)) {
                            character.bloodMax = val;
                            if (character.bloodTokens > val) character.bloodTokens = val;
                            db.saveCharacter(character.toJSON());
                            renderTokens();
                        }
                    });
                } else {
                    numberPrompt(`Set max ${label} (1-20):`, character.staminaMax || 5, 1, 20).then(val => {
                        if (val !== null && !isNaN(val)) {
                            character.staminaMax = val;
                            if (character.staminaTokens > val) character.staminaTokens = val;
                            db.saveCharacter(character.toJSON());
                            renderTokens();
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
        button.addEventListener('touchend', () => clearTimeout(holdTimer));
        button.addEventListener('touchcancel', () => clearTimeout(holdTimer));
    });
}

// Render stats
function renderStats() {
    const statSection = document.getElementById('stat-section');
    if (!statSection) return;
    statSection.innerHTML = `
                <div style="font-size:1em; display: flex; flex-direction: column;">
                    <div class="stat-row">
                        <span id="melee-power-label" class="stat-label" title="Melee Power">Melee ⚔️</span>
                        <div class="stat-value">${character.meleePower}</div>
                        <span id="ranged-power-label" class="stat-label" title="Ranged Power">Ranged 🏹</span>
                        <div class="stat-value">${character.rangedPower}</div>
                    </div>
                    <div class="stat-row">
                        <span id="might-label" class="stat-label" title="Might">Might 💪</span>
                        <div class="stat-value">${character.might}</div>
                        <span id="awareness-label" class="stat-label" title="Awareness">Awareness 👁️</span>
                        <div class="stat-value">${character.awareness}</div>
                    </div>
                    <div class="stat-row"">
                        <span id="resolve-label" class="stat-label" title="Resolve">Resolve ✊</span>
                        <div class="stat-value">${character.resolve}</div>
                        <span id="stress-label" class="stat-label" title="Resolve">Stress 💦</span>
                        <div class="stat-value">${character.stress}</div>
                    </div>
                </div>
            `;

    // Add hold-to-set for stat values
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
                    numberPrompt(`Set ${label} (0-20):`, character[prop] || 0, 0, 20).then(val => {
                        if (val !== null && !isNaN(val)) {
                            character[prop] = val;
                            db.saveCharacter(character.toJSON());
                            renderStats();
                        }
                    });
                }, 600);
            });
            el.addEventListener('mouseup', (e: MouseEvent) => {
                clearTimeout(holdTimer);
                if (!held && e.button === 0) {
                    if (prop === 'stress') {
                        diceRoller.rollStress();
                    } else {
                        diceRoller.rollPMAR(prop, label);
                    }
                }
            });
            el.addEventListener('mouseleave', () => clearTimeout(holdTimer));
            el.addEventListener('touchstart', (e: TouchEvent) => {
                held = false;
                holdTimer = setTimeout(() => {
                    held = true;
                    numberPrompt(`Set ${label} (0-20):`, character[prop] || 0, 0, 20).then(val => {
                        if (val !== null && !isNaN(val)) {
                            character[prop] = val;
                            db.saveCharacter(character.toJSON());
                            renderStats();
                        }
                    });
                }, 600);
            });
            el.addEventListener('touchend', (e: TouchEvent) => {
                clearTimeout(holdTimer);
                if (!held) {
                    if (prop === 'stress') {
                        diceRoller.rollStress();
                    } else {
                        diceRoller.rollPMAR(prop, label);
                    }
                }
            });
            el.addEventListener('touchcancel', () => clearTimeout(holdTimer));
            el.addEventListener('contextmenu', (e) => e.preventDefault());
        }
    });

    // Add dice rolling for PMAR

    // Dice result box container
    let diceResultBox = document.getElementById('dice-result-box');
    if (!diceResultBox) {
        diceResultBox = document.createElement('div');
        diceResultBox.id = 'dice-result-box';
        diceResultBox.style.margin = '1em auto 0 auto';
        diceResultBox.style.maxWidth = '22em';
        if (statSection.parentNode) {
            statSection.parentNode.insertBefore(diceResultBox, statSection.nextSibling);
        }
    }
    // Create DiceRoller instance
    const diceRoller = new DiceRoller(character, diceResultBox);
    [
        ['melee-power-label', 'meleePower', 'Melee Power'],
        ['ranged-power-label', 'rangedPower', 'Ranged Power'],
        ['might-label', 'might', 'Might'],
        ['awareness-label', 'awareness', 'Awareness'],
        ['resolve-label', 'resolve', 'Resolve'],
    ].forEach(([id, stat, label]) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', (e) => {
                if (e.detail === 1) {
                    diceRoller.rollPMAR(stat, label);
                }
            });
        }
    });

    // Stress: click/tap to roll 2d6 + Stress - Resolve and show Panic result
    const stressLabel = document.getElementById('stress-label');
    if (stressLabel) {
        stressLabel.replaceWith(stressLabel.cloneNode(true));
        const newStressLabel = document.getElementById('stress-label');
        if (newStressLabel) {
            newStressLabel.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (e.detail !== 1) return;
                diceRoller.rollStress();
            });
            newStressLabel.addEventListener('touchend', (e) => {
                e.stopPropagation();
                e.preventDefault();
                diceRoller.rollStress();
            });
        }
    }

}

// Utility: add hold-to-set-MAX-value to a label
function addHoldToSetMax(id: 'blood-label' | 'stamina-label', label: string, maxProp: 'bloodMax' | 'staminaMax') {
    const el = document.getElementById(id);
    if (!el) return;
    let holdTimer: ReturnType<typeof setTimeout> | undefined;
    function handleSetMax(label: string, maxProp: 'bloodMax' | 'staminaMax') {
        numberPrompt(`Set max ${label} (1-20):`, character[maxProp] || 5, 1, 20).then(val => {
            if (val !== null && !isNaN(val)) {
                character[maxProp] = val;
                db.saveCharacter(character.toJSON());
                renderTokens();
                renderStats();
            }
        });
    }
    // Only attach to Blood and Stamina labels, not PMAR
    el.addEventListener('mousedown', (e: MouseEvent) => {
        holdTimer = setTimeout(() => {
            handleSetMax(label, maxProp);
        }, 600);
    });
    el.addEventListener('mouseup', () => clearTimeout(holdTimer));
    el.addEventListener('mouseleave', () => clearTimeout(holdTimer));
    el.addEventListener('touchstart', (e: TouchEvent) => {
        holdTimer = setTimeout(() => {
            handleSetMax(label, maxProp);
        }, 600);
    });
    el.addEventListener('touchend', () => clearTimeout(holdTimer));
    el.addEventListener('touchcancel', () => clearTimeout(holdTimer));
}

renderTokens();
renderStats();

// Set character name at the top and allow hold-to-edit
const nameDiv = document.getElementById('character-name');
if (nameDiv) {
    nameDiv.textContent = character.name || 'Unnamed Character';
    let holdTimer: ReturnType<typeof setTimeout> | undefined;
    nameDiv.style.cursor = 'pointer';
    nameDiv.title = 'Hold to edit name';
    nameDiv.addEventListener('mousedown', (e: MouseEvent) => {
        if (e.button === 2) return;
        holdTimer = setTimeout(() => {
            showEditNameModal();
        }, 600);
    });
    nameDiv.addEventListener('mouseup', () => clearTimeout(holdTimer));
    nameDiv.addEventListener('mouseleave', () => clearTimeout(holdTimer));
    nameDiv.addEventListener('touchstart', (e: TouchEvent) => {
        holdTimer = setTimeout(() => {
            showEditNameModal();
        }, 600);
    });
    nameDiv.addEventListener('touchend', () => clearTimeout(holdTimer));
    nameDiv.addEventListener('touchcancel', () => clearTimeout(holdTimer));
}
