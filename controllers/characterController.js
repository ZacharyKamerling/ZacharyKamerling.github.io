import { db } from '../data/db.js';
import { DiceRoller } from '../utils/diceRollers.js';
import { showEditNameModal, numberPrompt } from '../utils/ui.js';
var CharacterController = /** @class */ (function () {
    function CharacterController(character, view) {
        var _a, _b;
        this.character = character;
        this.view = view;
        this.diceRoller = new DiceRoller(character, document.getElementById('dice-results'));
        (_a = document.getElementById('token-section')) === null || _a === void 0 ? void 0 : _a.addEventListener('contextmenu', function (e) { return e.preventDefault(); });
        (_b = document.getElementById('stat-section')) === null || _b === void 0 ? void 0 : _b.addEventListener('contextmenu', function (e) { return e.preventDefault(); });
        this.view.render(this.character);
        this.attachNameEditListener();
        this.attachStatRollListeners();
        this.attachStatMaxSetListeners();
        this.attachTokenListeners();
        this.attachTokenMaxSetListeners();
        this.attachCustomRollListeners();
    }
    CharacterController.prototype.saveAndRender = function () {
        db.saveCharacter(this.character);
        this.view.render(this.character);
        this.attachStatRollListeners();
        this.attachStatMaxSetListeners();
        this.attachTokenListeners();
        this.attachTokenMaxSetListeners();
        this.attachCustomRollListeners();
    };
    CharacterController.prototype.attachTokenMaxSetListeners = function () {
        var _this = this;
        document.querySelectorAll('.token-btn').forEach(function (btn) {
            var button = btn;
            var holdTimer;
            var timeoutFunction = function (btn) {
                return function () {
                    var type = btn.dataset.type;
                    var label = type === 'blood' ? 'Blood' : 'Stamina';
                    if (type === 'blood') {
                        numberPrompt("Set max ".concat(label, " (1-20):"), _this.character.bloodMax || 5, 1, 20).then(function (val) {
                            if (val !== null && !isNaN(val)) {
                                _this.character.bloodMax = val;
                                if (_this.character.bloodTokens > val)
                                    _this.character.bloodTokens = val;
                                _this.saveAndRender();
                            }
                        });
                    }
                    else {
                        numberPrompt("Set max ".concat(label, " (1-20):"), _this.character.staminaMax || 5, 1, 20).then(function (val) {
                            if (val !== null && !isNaN(val)) {
                                _this.character.staminaMax = val;
                                if (_this.character.staminaTokens > val)
                                    _this.character.staminaTokens = val;
                                _this.saveAndRender();
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
            button.addEventListener('touchend', function () {
                clearTimeout(holdTimer);
            });
            button.addEventListener('touchcancel', function () { return clearTimeout(holdTimer); });
            button.addEventListener('contextmenu', function (e) { return e.preventDefault(); });
        });
    };
    CharacterController.prototype.attachTokenListeners = function () {
        var _this = this;
        document.querySelectorAll('.token-btn').forEach(function (btn) {
            var button = btn;
            button.onclick = function (e) {
                var type = button.dataset.type;
                var idx = parseInt(button.dataset.idx);
                if (type === 'blood') {
                    if (_this.character.bloodTokens === (idx + 1)) {
                        _this.character.bloodTokens -= 1;
                    }
                    else {
                        _this.character.bloodTokens = idx + 1;
                    }
                }
                if (type === 'stamina') {
                    if (_this.character.staminaTokens === (idx + 1)) {
                        _this.character.staminaTokens -= 1;
                    }
                    else {
                        _this.character.staminaTokens = idx + 1;
                    }
                }
                _this.saveAndRender();
            };
        });
    };
    CharacterController.prototype.attachStatRollListeners = function () {
        var _this = this;
        [
            ['melee-power-label', 'meleePower', 'Melee Power'],
            ['ranged-power-label', 'rangedPower', 'Ranged Power'],
            ['might-label', 'might', 'Might'],
            ['awareness-label', 'awareness', 'Awareness'],
            ['resolve-label', 'resolve', 'Resolve'],
            ['stress-label', 'stress', 'Stress'],
        ].forEach(function (_a) {
            var id = _a[0], stat = _a[1], label = _a[2];
            var el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', function (e) {
                    if (e.detail === 1) {
                        if (stat === 'stress') {
                            _this.diceRoller.rollStress();
                        }
                        else {
                            _this.diceRoller.rollPMAR(stat, label);
                        }
                    }
                });
            }
        });
    };
    CharacterController.prototype.attachNameEditListener = function () {
        var _this = this;
        var nameDiv = document.getElementById('character-name');
        if (nameDiv) {
            nameDiv.textContent = this.character.name;
            var holdTimer_1;
            nameDiv.style.cursor = 'pointer';
            nameDiv.title = 'Hold to edit name';
            nameDiv.addEventListener('mousedown', function (e) {
                if (e.button === 2)
                    return;
                holdTimer_1 = setTimeout(function () {
                    showEditNameModal(_this.character, nameDiv);
                }, 600);
            });
            nameDiv.addEventListener('mouseup', function () { return clearTimeout(holdTimer_1); });
            nameDiv.addEventListener('mouseleave', function () { return clearTimeout(holdTimer_1); });
            nameDiv.addEventListener('touchstart', function (e) {
                holdTimer_1 = setTimeout(function () {
                    showEditNameModal(_this.character, nameDiv);
                }, 600);
            });
            nameDiv.addEventListener('touchend', function () { clearTimeout(holdTimer_1); });
            nameDiv.addEventListener('touchcancel', function () { return clearTimeout(holdTimer_1); });
            nameDiv.addEventListener('contextmenu', function (e) { return e.preventDefault(); });
        }
    };
    CharacterController.prototype.attachStatMaxSetListeners = function () {
        var _this = this;
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
                var holdTimer_2;
                var held_1 = false;
                el.addEventListener('mousedown', function (e) {
                    if (e.button === 2)
                        return; // ignore right click
                    held_1 = false;
                    holdTimer_2 = setTimeout(function () {
                        held_1 = true;
                        numberPrompt("Set ".concat(label, " (0-100):"), _this.character[prop] || 0, 0, 100).then(function (val) {
                            if (val !== null && !isNaN(val)) {
                                _this.character[prop] = val;
                                _this.saveAndRender();
                            }
                        });
                    }, 600);
                });
                el.addEventListener('mouseup', function (e) {
                    clearTimeout(holdTimer_2);
                    if (!held_1 && e.button === 0) {
                        if (prop === 'stress') {
                            _this.diceRoller.rollStress();
                        }
                        else {
                            _this.diceRoller.rollPMAR(prop, label);
                        }
                    }
                });
                el.addEventListener('mouseleave', function () { return clearTimeout(holdTimer_2); });
                el.addEventListener('touchstart', function () {
                    held_1 = false;
                    holdTimer_2 = setTimeout(function () {
                        held_1 = true;
                        numberPrompt("Set ".concat(label, " (0-100):"), _this.character[prop] || 0, 0, 100).then(function (val) {
                            if (val !== null && !isNaN(val)) {
                                _this.character[prop] = val;
                                _this.saveAndRender();
                            }
                        });
                    }, 600);
                });
                el.addEventListener('touchend', function () {
                    clearTimeout(holdTimer_2);
                    if (!held_1) {
                        if (prop === 'stress') {
                            _this.diceRoller.rollStress();
                        }
                        else {
                            _this.diceRoller.rollPMAR(prop, label);
                        }
                    }
                });
                el.addEventListener('touchcancel', function () { return clearTimeout(holdTimer_2); });
                el.addEventListener('contextmenu', function (e) { return e.preventDefault(); });
            }
        });
    };
    CharacterController.prototype.attachCustomRollListeners = function () {
        var _this = this;
        var customRollInput = document.getElementById('custom-roll-input');
        var minusBtn = document.getElementById('custom-neg-btn');
        var plusBtn = document.getElementById('custom-pos-btn');
        var rollBtn = document.getElementById('custom-roll-btn');
        // Update the input field with current value and save
        var updateInput = function () {
            customRollInput.value = _this.character.customRoll.toString();
            db.saveCharacter(_this.character.toJSON());
        };
        // Set initial value
        updateInput();
        // Handle -1 button
        minusBtn.addEventListener('click', function () {
            _this.character.customRoll = Math.max(1, _this.character.customRoll - 1);
            updateInput();
        });
        // Handle +1 button
        plusBtn.addEventListener('click', function () {
            _this.character.customRoll = Math.min(100, _this.character.customRoll + 1);
            updateInput();
        });
        // Handle direct input changes
        customRollInput.addEventListener('change', function () {
            var value = parseInt(customRollInput.value) || 1;
            _this.character.customRoll = Math.max(1, Math.min(100, value));
            _this.saveAndRender();
        });
        // Handle roll button
        rollBtn.addEventListener('click', function () {
            _this.diceRoller.rollPMAR('customRoll', 'Custom');
        });
        // Handle Enter key to trigger roll
        customRollInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                _this.diceRoller.rollPMAR('customRoll', 'Custom');
            }
        });
    };
    return CharacterController;
}());
export { CharacterController };
