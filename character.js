function numberPrompt(message, defaultValue, min, max) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '9999';
        const box = document.createElement('div');
        box.style.background = '#333';
        box.style.padding = '2em 2em 1.5em 2em';
        box.style.borderRadius = '1em';
        box.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
        box.style.textAlign = 'center';
        const label = document.createElement('div');
        label.textContent = message;
        label.style.marginBottom = '1em';
        label.style.color = '#fff';
        const input = document.createElement('input');
        input.type = 'number';
        input.min = min;
        input.max = max;
        input.value = defaultValue;
        input.style.fontSize = '1.2em';
        input.style.width = '5em';
        input.style.marginBottom = '1em';
        input.style.background = '#222';
        input.style.color = '#fff';
        input.style.border = '1px solid #888';
        input.style.borderRadius = '0.4em';
        input.style.textAlign = 'center';
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') okBtn.click();
        });
        const okBtn = document.createElement('button');
        okBtn.textContent = 'OK';
        okBtn.style.margin = '0 0.7em 0 0';
        okBtn.style.fontSize = '1em';
        okBtn.style.padding = '0.3em 1.2em';
        okBtn.style.background = '#2196f3';
        okBtn.style.color = '#fff';
        okBtn.style.border = 'none';
        okBtn.style.borderRadius = '0.4em';
        okBtn.addEventListener('click', () => {
            let val = parseInt(input.value);
            if (isNaN(val)) val = defaultValue;
            val = Math.max(min, Math.min(max, val));
            document.body.removeChild(modal);
            resolve(val);
        });
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.fontSize = '1em';
        cancelBtn.style.padding = '0.3em 1.2em';
        cancelBtn.style.background = '#888';
        cancelBtn.style.color = '#fff';
        cancelBtn.style.border = 'none';
        cancelBtn.style.borderRadius = '0.4em';
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
            resolve(null);
        });
        box.appendChild(label);
        box.appendChild(input);
        box.appendChild(document.createElement('br'));
        box.appendChild(okBtn);
        box.appendChild(cancelBtn);
        modal.appendChild(box);
        document.body.appendChild(modal);
        input.focus();
    });
}
// Load character data
const characterId = new URLSearchParams(window.location.search).get('id');
const character = db.getCharacter(characterId);
if (!character) {
    alert("Character not found!");
    window.location.href = "index.html";
}

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
        // Click to set current value (original contiguous behavior)
        btn.onclick = (e) => {
            const type = btn.dataset.type;
            const idx = parseInt(btn.dataset.idx);
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
            db.saveCharacter(character);
            renderTokens();
        };
        // Hold-to-set-max on any token
        let holdTimer;
        btn.addEventListener('mousedown', (e) => {
            holdTimer = setTimeout(() => {
                const type = btn.dataset.type;
                let label = type === 'blood' ? 'Blood' : 'Stamina';
                let maxProp = type === 'blood' ? 'bloodMax' : 'staminaMax';
                let valueProp = type === 'blood' ? 'bloodTokens' : 'staminaTokens';
                numberPrompt(`Set max ${label} (1-20):`, character[maxProp] || 5, 1, 20).then(val => {
                    if (val !== null && !isNaN(val)) {
                        character[maxProp] = val;
                        if (character[valueProp] > val) character[valueProp] = val;
                        db.saveCharacter(character);
                        renderTokens();
                    }
                });
            }, 600);
        });
        btn.addEventListener('mouseup', () => clearTimeout(holdTimer));
        btn.addEventListener('mouseleave', () => clearTimeout(holdTimer));
        btn.addEventListener('touchstart', (e) => {
            holdTimer = setTimeout(() => {
                const type = btn.dataset.type;
                let label = type === 'blood' ? 'Blood' : 'Stamina';
                let maxProp = type === 'blood' ? 'bloodMax' : 'staminaMax';
                let valueProp = type === 'blood' ? 'bloodTokens' : 'staminaTokens';
                numberPrompt(`Set max ${label} (1-20):`, character[maxProp] || 5, 1, 20).then(val => {
                    if (val !== null && !isNaN(val)) {
                        character[maxProp] = val;
                        if (character[valueProp] > val) character[valueProp] = val;
                        db.saveCharacter(character);
                        renderTokens();
                    }
                });
            }, 600);
        });
        btn.addEventListener('touchend', () => clearTimeout(holdTimer));
        btn.addEventListener('touchcancel', () => clearTimeout(holdTimer));
    });
}

// Render stats
function renderStats() {
    const statSection = document.getElementById('stat-section');
    if (!statSection) return;
    statSection.innerHTML = `
                <div style="font-size:1.2em; display: flex; flex-direction: column; max-width: 24em;">
                    <div class="stat-row">
                        <span id="melee-power-label" class="stat-label" title="Melee Power">Melee Power</span>
                        <div class="stat-value">${character.meleePower || 0}d6</div>
                    </div>
                    <div class="stat-row">
                        <span id="ranged-power-label" class="stat-label" title="Ranged Power">Ranged Power</span>
                        <div class="stat-value">${character.rangedPower || 0}d6</div>
                    </div>
                    <div class="stat-row">
                        <span id="might-label" class="stat-label" title="Might">Might</span>
                        <div class="stat-value">${character.might || 0}d6</div>
                    </div>
                    <div class="stat-row">
                        <span id="awareness-label" class="stat-label" title="Awareness">Awareness</span>
                        <div class="stat-value">${character.awareness || 0}d6</div>
                    </div>
                    <div class="stat-row">
                        <span id="resolve-label" class="stat-label" title="Resolve">Resolve</span>
                        <div class="stat-value">${character.resolve || 0}d6</div>
                    </div>
                </div>
            `;
    // Add hold-to-set for stat values only (not max)
    [
        ['melee-power-label', 'Melee Power', 'meleePower'],
        ['ranged-power-label', 'Ranged Power', 'rangedPower'],
        ['might-label', 'Might', 'might'],
        ['awareness-label', 'Awareness', 'awareness'],
        ['resolve-label', 'Resolve', 'resolve']
    ].forEach(([id, label, prop]) => {
        const el = document.getElementById(id);
        if (el) {
            el.style.cursor = 'pointer';
            el.title = `Hold to set ${label}`;
            let holdTimer;
            let held = false;
            el.addEventListener('mousedown', (e) => {
                if (e.button === 2) return; // ignore right click
                held = false;
                holdTimer = setTimeout(() => {
                    held = true;
                    numberPrompt(`Set ${label} (0-20):`, character[prop] || 0, 0, 20).then(val => {
                        if (val !== null && !isNaN(val)) {
                            character[prop] = val;
                            db.saveCharacter(character);
                            renderStats();
                        }
                    });
                }, 600);
            });
            el.addEventListener('mouseup', (e) => {
                clearTimeout(holdTimer);
                if (!held && e.button === 0) {
                    rollDiceAndShow(prop, label);
                }
            });
            el.addEventListener('mouseleave', () => clearTimeout(holdTimer));
            el.addEventListener('touchstart', (e) => {
                held = false;
                holdTimer = setTimeout(() => {
                    held = true;
                    numberPrompt(`Set ${label} (0-20):`, character[prop] || 0, 0, 20).then(val => {
                        if (val !== null && !isNaN(val)) {
                            character[prop] = val;
                            db.saveCharacter(character);
                            renderStats();
                        }
                    });
                }, 600);
            });
            el.addEventListener('touchend', (e) => {
                clearTimeout(holdTimer);
                if (!held) {
                    rollDiceAndShow(prop, label);
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
        statSection.parentNode.insertBefore(diceResultBox, statSection.nextSibling);
    }
    // Store the last rolls for rerolling
    let lastRolls = null;
    let lastStat = null;
    let lastLabel = null;
    function rollDiceAndShow(stat, label, rerollIdx = null) {
        const dice = character[stat] || 0;
        if (dice < 1) {
            diceResultBox.innerHTML = `<div class="dice-result-label">No dice to roll for ${label}.</div>`;
            lastRolls = null;
            lastStat = null;
            lastLabel = null;
            return;
        }
        let rolls;
        if (lastRolls && lastStat === stat && lastLabel === label && rerollIdx !== null) {
            // Copy previous rolls and reroll only the selected die
            rolls = lastRolls.slice();
            rolls[rerollIdx] = Math.floor(Math.random() * 6) + 1;
        } else {
            // New roll
            rolls = [];
            for (let i = 0; i < dice; i++) {
                rolls.push(Math.floor(Math.random() * 6) + 1);
            }
        }
        lastRolls = rolls;
        lastStat = stat;
        lastLabel = label;
        let successes = rolls.filter(r => r >= 4).length;
        // Render dice visually with data-idx for rerolling
        const diceHtml = rolls.map((roll, i) =>
            `<span class="dice-face${roll >= 4 ? ' dice-success' : ' dice-fail'}" data-idx="${i}" style="cursor:pointer;" title="Click to reroll">${roll}</span>`
        ).join('');
        diceResultBox.innerHTML = `
                    <div class="dice-result-label">${label} Roll</div>
                    <div class="dice-result-row">${diceHtml}</div>
                    <div class="dice-result-summary">${successes} Successes (4+)</div>
                `;
        // Add click and touch event to each die for rerolling
        diceResultBox.querySelectorAll('.dice-face').forEach(face => {
            const reroll = (e) => {
                e.preventDefault();
                const idx = parseInt(face.getAttribute('data-idx'));
                rollDiceAndShow(stat, label, idx);
            };
            face.addEventListener('click', reroll);
            face.addEventListener('touchstart', reroll);
        });
    }
    [
        ['melee-power-label', 'meleePower', 'Melee Power'],
        ['ranged-power-label', 'rangedPower', 'Ranged Power'],
        ['might-label', 'might', 'Might'],
        ['awareness-label', 'awareness', 'Awareness'],
        ['resolve-label', 'resolve', 'Resolve']
    ].forEach(([id, stat, label]) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', (e) => {
                if (e.detail === 1) {
                    rollDiceAndShow(stat, label);
                }
            });
        }
    });
    // Dice result styles
}

// Utility: add hold-to-set-MAX-value to a label
function addHoldToSetMax(id, label, maxProp) {
    const el = document.getElementById(id);
    if (!el) return;
    let holdTimer;
    function handleSetMax(label, maxProp) {
        numberPrompt(`Set max ${label} (1-20):`, character[maxProp] || 5, 1, 20).then(val => {
            if (val !== null && !isNaN(val)) {
                character[maxProp] = val;
                db.saveCharacter(character);
                renderTokens();
                renderStats();
            }
        });
    }
    // Only attach to Blood and Stamina labels, not PMAR
    if (id === 'blood-label' || id === 'stamina-label') {
        el.addEventListener('mousedown', (e) => {
            holdTimer = setTimeout(() => {
                handleSetMax(label, maxProp);
            }, 600);
        });
        el.addEventListener('mouseup', () => clearTimeout(holdTimer));
        el.addEventListener('mouseleave', () => clearTimeout(holdTimer));
        el.addEventListener('touchstart', (e) => {
            holdTimer = setTimeout(() => {
                handleSetMax(label, maxProp);
            }, 600);
        });
        el.addEventListener('touchend', () => clearTimeout(holdTimer));
        el.addEventListener('touchcancel', () => clearTimeout(holdTimer));
    }
}

renderTokens();
renderStats();
// Set character name at the top and allow hold-to-edit
const nameDiv = document.getElementById('character-name');
if (nameDiv) {
    nameDiv.textContent = character.name || 'Unnamed Character';
    let holdTimer;
    nameDiv.style.cursor = 'pointer';
    nameDiv.title = 'Hold to edit name';
    nameDiv.addEventListener('mousedown', (e) => {
        if (e.button === 2) return;
        holdTimer = setTimeout(() => {
            // Show modal for editing name
            showEditNameModal();
        }, 600);
    });
    nameDiv.addEventListener('mouseup', () => clearTimeout(holdTimer));
    nameDiv.addEventListener('mouseleave', () => clearTimeout(holdTimer));
    nameDiv.addEventListener('touchstart', (e) => {
        holdTimer = setTimeout(() => {
            showEditNameModal();
        }, 600);
    });
    nameDiv.addEventListener('touchend', () => clearTimeout(holdTimer));
    nameDiv.addEventListener('touchcancel', () => clearTimeout(holdTimer));
}

function showEditNameModal() {
    // Modal for editing character name
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    const box = document.createElement('div');
    box.style.background = '#333';
    box.style.padding = '2em 2em 1.5em 2em';
    box.style.borderRadius = '1em';
    box.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
    box.style.textAlign = 'center';
    const label = document.createElement('div');
    label.textContent = 'Edit Character Name:';
    label.style.marginBottom = '1em';
    label.style.color = '#fff';
    const input = document.createElement('input');
    input.type = 'text';
    input.value = character.name || '';
    input.maxLength = 40;
    input.style.fontSize = '1.2em';
    input.style.width = '14em';
    input.style.marginBottom = '1em';
    input.style.background = '#222';
    input.style.color = '#fff';
    input.style.border = '1px solid #888';
    input.style.borderRadius = '0.4em';
    input.style.textAlign = 'center';
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') okBtn.click();
    });
    const okBtn = document.createElement('button');
    okBtn.textContent = 'OK';
    okBtn.style.margin = '0 0.7em 0 0';
    okBtn.style.fontSize = '1em';
    okBtn.style.padding = '0.3em 1.2em';
    okBtn.style.background = '#2196f3';
    okBtn.style.color = '#fff';
    okBtn.style.border = 'none';
    okBtn.style.borderRadius = '0.4em';
    okBtn.addEventListener('click', () => {
        const newName = input.value.trim() || 'Unnamed Character';
        character.name = newName;
        db.saveCharacter(character);
        nameDiv.textContent = newName;
        document.body.removeChild(modal);
    });
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.fontSize = '1em';
    cancelBtn.style.padding = '0.3em 1.2em';
    cancelBtn.style.background = '#888';
    cancelBtn.style.color = '#fff';
    cancelBtn.style.border = 'none';
    cancelBtn.style.borderRadius = '0.4em';
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    box.appendChild(label);
    box.appendChild(input);
    box.appendChild(document.createElement('br'));
    box.appendChild(okBtn);
    box.appendChild(cancelBtn);
    modal.appendChild(box);
    document.body.appendChild(modal);
    input.focus();
}