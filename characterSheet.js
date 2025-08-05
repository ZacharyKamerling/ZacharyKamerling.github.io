import { db } from './db.js';
import { Character } from './character.js';
import { DiceRoller } from './diceRollers.js';
import { numberPrompt, showEditNameModal } from './misc.js';
var characterId = new URLSearchParams(window.location.search).get('id');
var rawCharacter = db.getCharacter(characterId);
if (!rawCharacter) {
    alert("Character not found!");
    window.location.href = "index.html";
    throw new Error("Character not found");
}
var character = Character.fromRaw(rawCharacter);
function renderTokens() {
    var blood = '';
    var maxBlood = character.bloodMax || 1;
    var currentBlood = character.bloodTokens || 0;
    for (var i = 0; i < maxBlood; i++) {
        blood += "<button class=\"token-btn\" data-type=\"blood\" data-idx=\"".concat(i, "\" style=\"font-size:1.5em; margin:2px 2px;").concat(i < currentBlood ? '' : 'opacity:0.3;', "\">\uD83E\uDE78</button>");
    }
    var stamina = '';
    var maxStamina = character.staminaMax || 1;
    var currentStamina = character.staminaTokens || 0;
    for (var i = 0; i < maxStamina; i++) {
        stamina += "<button class=\"token-btn\" data-type=\"stamina\" data-idx=\"".concat(i, "\" style=\"font-size:1.5em; margin:2px 2px;").concat(i < currentStamina ? '' : 'opacity:0.3;', "\">\u26A1</button>");
    }
    var tokenSection = document.getElementById('token-section');
    if (!tokenSection)
        return;
    tokenSection.innerHTML = "\n                <div style=\"font-size:1.2em; margin-bottom:0.5em; display: flex; flex-direction: column; gap: 0.5em;\">\n                    <div style=\"display: flex; flex-direction: column; align-items: flex-start;\">\n                        <span id=\"blood-label\" style=\"padding-left: 0.5em; font-size: 1em;\">Blood (".concat(currentBlood, " / ").concat(maxBlood, ")</span>\n                        <div>").concat(blood, "</div>\n                    </div>\n                    <div style=\"display: flex; flex-direction: column; align-items: flex-start;\">\n                        <span id=\"stamina-label\" style=\"padding-left: 0.5em; font-size: 1em;\">Stamina (").concat(currentStamina, " / ").concat(maxStamina, ")</span>\n                        <div>").concat(stamina, "</div>\n                    </div>\n                </div>\n            ");
    // Clicking a token sets current to that value (contiguous) and long-press sets max
    document.querySelectorAll('.token-btn').forEach(function (btn) {
        var button = btn;
        // Click to set current value (original contiguous behavior)
        button.onclick = function (e) {
            var type = button.dataset.type;
            var idx = parseInt(button.dataset.idx);
            if (type === 'blood') {
                if (character.bloodTokens === (idx + 1)) {
                    character.bloodTokens -= 1;
                }
                else {
                    character.bloodTokens = idx + 1;
                }
            }
            if (type === 'stamina') {
                if (character.staminaTokens === (idx + 1)) {
                    character.staminaTokens -= 1;
                }
                else {
                    character.staminaTokens = idx + 1;
                }
            }
            db.saveCharacter(character.toJSON());
            renderTokens();
        };
        // Hold-to-set-max on any token
        var holdTimer;
        var timeoutFunction = function (btn) {
            return function () {
                var type = btn.dataset.type;
                var label = type === 'blood' ? 'Blood' : 'Stamina';
                if (type === 'blood') {
                    numberPrompt("Set max ".concat(label, " (1-20):"), character.bloodMax || 5, 1, 20).then(function (val) {
                        if (val !== null && !isNaN(val)) {
                            character.bloodMax = val;
                            if (character.bloodTokens > val)
                                character.bloodTokens = val;
                            db.saveCharacter(character.toJSON());
                            renderTokens();
                        }
                    });
                }
                else {
                    numberPrompt("Set max ".concat(label, " (1-20):"), character.staminaMax || 5, 1, 20).then(function (val) {
                        if (val !== null && !isNaN(val)) {
                            character.staminaMax = val;
                            if (character.staminaTokens > val)
                                character.staminaTokens = val;
                            db.saveCharacter(character.toJSON());
                            renderTokens();
                        }
                    });
                }
            };
        };
        button.addEventListener('mousedown', function (e) {
            holdTimer = setTimeout(timeoutFunction(button), 600);
        });
        button.addEventListener('mouseup', function () { return clearTimeout(holdTimer); });
        button.addEventListener('mouseleave', function () { return clearTimeout(holdTimer); });
        button.addEventListener('touchstart', function (e) {
            holdTimer = setTimeout(timeoutFunction(button), 600);
        });
        button.addEventListener('touchend', function () { return clearTimeout(holdTimer); });
        button.addEventListener('touchcancel', function () { return clearTimeout(holdTimer); });
    });
}
// Render stats
function renderStats() {
    var statSection = document.getElementById('stat-section');
    if (!statSection)
        return;
    statSection.innerHTML = "\n                <div style=\"font-size:1em; display: flex; flex-direction: column;\">\n                    <div class=\"stat-row\">\n                        <span id=\"melee-power-label\" class=\"stat-label\" title=\"Melee Power\">Melee \u2694\uFE0F</span>\n                        <div class=\"stat-value\">".concat(character.meleePower, "</div>\n                        <span id=\"ranged-power-label\" class=\"stat-label\" title=\"Ranged Power\">Ranged \uD83C\uDFF9</span>\n                        <div class=\"stat-value\">").concat(character.rangedPower, "</div>\n                    </div>\n                    <div class=\"stat-row\">\n                        <span id=\"might-label\" class=\"stat-label\" title=\"Might\">Might \uD83D\uDCAA</span>\n                        <div class=\"stat-value\">").concat(character.might, "</div>\n                        <span id=\"awareness-label\" class=\"stat-label\" title=\"Awareness\">Awareness \uD83D\uDC41\uFE0F</span>\n                        <div class=\"stat-value\">").concat(character.awareness, "</div>\n                    </div>\n                    <div class=\"stat-row\"\">\n                        <span id=\"resolve-label\" class=\"stat-label\" title=\"Resolve\">Resolve \u270A</span>\n                        <div class=\"stat-value\">").concat(character.resolve, "</div>\n                        <span id=\"stress-label\" class=\"stat-label\" title=\"Resolve\">Stress \uD83D\uDCA6</span>\n                        <div class=\"stat-value\">").concat(character.stress, "</div>\n                    </div>\n                </div>\n            ");
    var statDefs = [
        ['melee-power-label', 'Melee Power', 'meleePower'],
        ['ranged-power-label', 'Ranged Power', 'rangedPower'],
        ['might-label', 'Might', 'might'],
        ['awareness-label', 'Awareness', 'awareness'],
        ['resolve-label', 'Resolve', 'resolve'],
        ['stress-label', 'Stress', 'stress'],
    ];
    statDefs.forEach(function (_a) {
        var id = _a[0], label = _a[1], prop = _a[2];
        var el = document.getElementById(id);
        if (el) {
            el.style.cursor = 'pointer';
            el.title = "Hold to set ".concat(label);
            var holdTimer_1;
            var held_1 = false;
            el.addEventListener('mousedown', function (e) {
                if (e.button === 2)
                    return; // ignore right click
                held_1 = false;
                holdTimer_1 = setTimeout(function () {
                    held_1 = true;
                    numberPrompt("Set ".concat(label, " (0-20):"), character[prop] || 0, 0, 20).then(function (val) {
                        if (val !== null && !isNaN(val)) {
                            character[prop] = val;
                            db.saveCharacter(character.toJSON());
                            renderStats();
                        }
                    });
                }, 600);
            });
            el.addEventListener('mouseup', function (e) {
                clearTimeout(holdTimer_1);
                if (!held_1 && e.button === 0) {
                    if (prop === 'stress') {
                        diceRoller.rollStress();
                    }
                    else {
                        diceRoller.rollPMAR(prop, label);
                    }
                }
            });
            el.addEventListener('mouseleave', function () { return clearTimeout(holdTimer_1); });
            el.addEventListener('touchstart', function (e) {
                held_1 = false;
                holdTimer_1 = setTimeout(function () {
                    held_1 = true;
                    numberPrompt("Set ".concat(label, " (0-20):"), character[prop] || 0, 0, 20).then(function (val) {
                        if (val !== null && !isNaN(val)) {
                            character[prop] = val;
                            db.saveCharacter(character.toJSON());
                            renderStats();
                        }
                    });
                }, 600);
            });
            el.addEventListener('touchend', function (e) {
                clearTimeout(holdTimer_1);
                if (!held_1) {
                    if (prop === 'stress') {
                        diceRoller.rollStress();
                    }
                    else {
                        diceRoller.rollPMAR(prop, label);
                    }
                }
            });
            el.addEventListener('touchcancel', function () { return clearTimeout(holdTimer_1); });
            el.addEventListener('contextmenu', function (e) { return e.preventDefault(); });
        }
    });
    // Add dice rolling for PMAR
    // Dice result box container
    var diceResultBox = document.getElementById('dice-result-box');
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
    var diceRoller = new DiceRoller(character, diceResultBox);
    [
        ['melee-power-label', 'meleePower', 'Melee Power'],
        ['ranged-power-label', 'rangedPower', 'Ranged Power'],
        ['might-label', 'might', 'Might'],
        ['awareness-label', 'awareness', 'Awareness'],
        ['resolve-label', 'resolve', 'Resolve'],
    ].forEach(function (_a) {
        var id = _a[0], stat = _a[1], label = _a[2];
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', function (e) {
                if (e.detail === 1) {
                    diceRoller.rollPMAR(stat, label);
                }
            });
        }
    });
    // Stress: click/tap to roll 2d6 + Stress - Resolve and show Panic result
    var stressLabel = document.getElementById('stress-label');
    if (stressLabel) {
        stressLabel.replaceWith(stressLabel.cloneNode(true));
        var newStressLabel = document.getElementById('stress-label');
        if (newStressLabel) {
            newStressLabel.addEventListener('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                if (e.detail !== 1)
                    return;
                diceRoller.rollStress();
            });
            newStressLabel.addEventListener('touchend', function (e) {
                e.stopPropagation();
                e.preventDefault();
                diceRoller.rollStress();
            });
        }
    }
}
// Utility: add hold-to-set-MAX-value to a label
function addHoldToSetMax(id, label, maxProp) {
    var el = document.getElementById(id);
    if (!el)
        return;
    var holdTimer;
    function handleSetMax(label, maxProp) {
        numberPrompt("Set max ".concat(label, " (1-20):"), character[maxProp] || 5, 1, 20).then(function (val) {
            if (val !== null && !isNaN(val)) {
                character[maxProp] = val;
                db.saveCharacter(character.toJSON());
                renderTokens();
                renderStats();
            }
        });
    }
    // Only attach to Blood and Stamina labels, not PMAR
    el.addEventListener('mousedown', function (e) {
        holdTimer = setTimeout(function () {
            handleSetMax(label, maxProp);
        }, 600);
    });
    el.addEventListener('mouseup', function () { return clearTimeout(holdTimer); });
    el.addEventListener('mouseleave', function () { return clearTimeout(holdTimer); });
    el.addEventListener('touchstart', function (e) {
        holdTimer = setTimeout(function () {
            handleSetMax(label, maxProp);
        }, 600);
    });
    el.addEventListener('touchend', function () { return clearTimeout(holdTimer); });
    el.addEventListener('touchcancel', function () { return clearTimeout(holdTimer); });
}
renderTokens();
renderStats();
// Set character name at the top and allow hold-to-edit
var nameDiv = document.getElementById('character-name');
if (nameDiv) {
    nameDiv.textContent = character.name || 'Unnamed Character';
    var holdTimer_2;
    nameDiv.style.cursor = 'pointer';
    nameDiv.title = 'Hold to edit name';
    nameDiv.addEventListener('mousedown', function (e) {
        if (e.button === 2)
            return;
        holdTimer_2 = setTimeout(function () {
            showEditNameModal();
        }, 600);
    });
    nameDiv.addEventListener('mouseup', function () { return clearTimeout(holdTimer_2); });
    nameDiv.addEventListener('mouseleave', function () { return clearTimeout(holdTimer_2); });
    nameDiv.addEventListener('touchstart', function (e) {
        holdTimer_2 = setTimeout(function () {
            showEditNameModal();
        }, 600);
    });
    nameDiv.addEventListener('touchend', function () { return clearTimeout(holdTimer_2); });
    nameDiv.addEventListener('touchcancel', function () { return clearTimeout(holdTimer_2); });
}
