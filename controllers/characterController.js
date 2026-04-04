import { db } from '../data/db.js';
import { DiceRoller } from '../utils/diceRollers.js';
import { CardDrawer } from '../utils/cardDrawers.js';
import { showEditNameModal, numberPrompt } from '../utils/ui.js';
var CharacterController = /** @class */ (function () {
    function CharacterController(character, view) {
        var _a, _b;
        this.character = character;
        this.view = view;
        // Render view first to create DOM elements
        this.view.render(this.character);
        // Initialize components after DOM exists
        this.diceRoller = new DiceRoller(character, document.getElementById('dice-results'));
        this.cardDrawer = new CardDrawer(character, document.getElementById('card-result-box'));
        // Attach all listeners
        (_a = document.getElementById('token-section')) === null || _a === void 0 ? void 0 : _a.addEventListener('contextmenu', function (e) { return e.preventDefault(); });
        (_b = document.getElementById('stat-section')) === null || _b === void 0 ? void 0 : _b.addEventListener('contextmenu', function (e) { return e.preventDefault(); });
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
    CharacterController.prototype.saveAndRender = function () {
        db.saveCharacter(this.character);
        this.view.render(this.character);
        // Re-initialize diceRoller and cardDrawer after DOM is ready
        var diceResultBox = document.getElementById('dice-results');
        if (diceResultBox) {
            this.diceRoller.resultBox = diceResultBox;
        }
        var cardResultBox = document.getElementById('card-result-box');
        if (cardResultBox) {
            this.cardDrawer = new CardDrawer(this.character, cardResultBox);
        }
        // Re-attach all listeners immediately (DOM is already rendered)
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
                el.onclick = function () {
                    if (stat === 'stress') {
                        _this.diceRoller.rollStress();
                    }
                    else {
                        _this.diceRoller.rollPMAR(stat, label);
                    }
                };
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
                el.onmousedown = function (e) {
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
                };
                el.onmouseup = function (e) {
                    clearTimeout(holdTimer_2);
                    if (!held_1 && e.button === 0) {
                        if (prop === 'stress') {
                            _this.diceRoller.rollStress();
                        }
                        else {
                            _this.diceRoller.rollPMAR(prop, label);
                        }
                    }
                };
                el.onmouseleave = function () { return clearTimeout(holdTimer_2); };
                el.ontouchstart = function () {
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
                };
                el.ontouchend = function () {
                    clearTimeout(holdTimer_2);
                    if (!held_1) {
                        if (prop === 'stress') {
                            _this.diceRoller.rollStress();
                        }
                        else {
                            _this.diceRoller.rollPMAR(prop, label);
                        }
                    }
                };
                el.ontouchcancel = function () { return clearTimeout(holdTimer_2); };
                el.oncontextmenu = function (e) {
                    e.preventDefault();
                    return false;
                };
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
            _this.character.invalidateEffectiveStatsCache();
            updateInput();
        });
        // Handle +1 button
        plusBtn.addEventListener('click', function () {
            _this.character.customRoll = Math.min(100, _this.character.customRoll + 1);
            _this.character.invalidateEffectiveStatsCache();
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
    CharacterController.prototype.attachItemAbilityListeners = function () {
        var _this = this;
        document.querySelectorAll('.item-ability-entry').forEach(function (entry) {
            var element = entry;
            var id = element.dataset.id;
            var type = element.dataset.type;
            var description = element.querySelector('.item-ability-description');
            var holdTimer;
            // Tap to toggle description
            element.addEventListener('click', function () {
                if (description.style.display === 'none') {
                    description.style.display = 'block';
                }
                else {
                    description.style.display = 'none';
                }
            });
            // Long press to edit/delete
            element.addEventListener('mousedown', function (e) {
                holdTimer = setTimeout(function () {
                    _this.showItemAbilityMenu(id, type);
                }, 600);
            });
            element.addEventListener('mouseup', function () { return clearTimeout(holdTimer); });
            element.addEventListener('mouseleave', function () { return clearTimeout(holdTimer); });
            element.addEventListener('touchstart', function (e) {
                holdTimer = setTimeout(function () {
                    _this.showItemAbilityMenu(id, type);
                }, 600);
            });
            element.addEventListener('touchend', function () { return clearTimeout(holdTimer); });
            element.addEventListener('touchcancel', function () { return clearTimeout(holdTimer); });
            element.addEventListener('contextmenu', function (e) { return e.preventDefault(); });
        });
    };
    CharacterController.prototype.showItemAbilityMenu = function (id, type) {
        var options = ['Edit', 'Delete', 'Cancel'];
        var choice = prompt("".concat(type === 'item' ? 'Item' : 'Ability', " options:\n").concat(options.map(function (o, i) { return "".concat(i + 1, ". ").concat(o); }).join('\n'), "\n\nEnter number or cancel"));
        if (choice === '1' || (choice === null || choice === void 0 ? void 0 : choice.toLowerCase()) === 'edit') {
            this.editItemOrAbility(id, type);
        }
        else if (choice === '2' || (choice === null || choice === void 0 ? void 0 : choice.toLowerCase()) === 'delete') {
            this.deleteItemOrAbility(id, type);
        }
    };
    CharacterController.prototype.editItemOrAbility = function (id, type) {
        if (type === 'item') {
            var item = this.character.items.find(function (i) { return i.id === id; });
            if (!item)
                return;
            var name_1 = prompt('Item name:', item.name);
            if (name_1 === null)
                return;
            var location_1 = prompt('Location (e.g., melee weapon, ranged weapon, armor, storage, or custom):', item.location);
            if (location_1 === null)
                return;
            var description = prompt('Description:', item.description);
            if (description === null)
                return;
            item.name = name_1;
            item.location = location_1;
            item.description = description;
        }
        else {
            var ability = this.character.abilities.find(function (a) { return a.id === id; });
            if (!ability)
                return;
            var name_2 = prompt('Ability name:', ability.name);
            if (name_2 === null)
                return;
            var description = prompt('Description:', ability.description);
            if (description === null)
                return;
            ability.name = name_2;
            ability.description = description;
        }
        this.saveAndRender();
    };
    CharacterController.prototype.deleteItemOrAbility = function (id, type) {
        var confirm = window.confirm("Delete this ".concat(type, "?"));
        if (!confirm)
            return;
        if (type === 'item') {
            this.character.items = this.character.items.filter(function (i) { return i.id !== id; });
        }
        else {
            this.character.abilities = this.character.abilities.filter(function (a) { return a.id !== id; });
        }
        this.saveAndRender();
    };
    CharacterController.prototype.attachNewItemListener = function () {
        var _this = this;
        var newItemBtn = document.querySelector('.new-item-btn');
        if (newItemBtn) {
            newItemBtn.addEventListener('click', function () {
                _this.createNewItem();
            });
        }
    };
    CharacterController.prototype.attachNewAbilityListener = function () {
        var _this = this;
        var newAbilityBtn = document.querySelector('.new-ability-btn');
        if (newAbilityBtn) {
            newAbilityBtn.addEventListener('click', function () {
                _this.createNewAbility();
            });
        }
    };
    CharacterController.prototype.createNewItem = function () {
        var name = prompt('Item name:');
        if (!name)
            return;
        var location = prompt('Location (e.g., melee weapon, ranged weapon, armor, storage, or custom):');
        if (location === null)
            return;
        var description = prompt('Description:');
        if (description === null)
            return;
        this.character.items.push({
            id: Date.now().toString(),
            name: name,
            location: location,
            description: description,
            equipped: false
        });
        this.saveAndRender();
    };
    CharacterController.prototype.createNewAbility = function () {
        var name = prompt('Ability name:');
        if (!name)
            return;
        var description = prompt('Description:');
        if (description === null)
            return;
        this.character.abilities.push({
            id: Date.now().toString(),
            name: name,
            description: description
        });
        this.saveAndRender();
    };
    CharacterController.prototype.attachCardDrawingListeners = function () {
        var _this = this;
        var drawBtn = document.getElementById('draw-cards-btn');
        var unarmoredToggle = document.getElementById('unarmored-toggle');
        if (drawBtn) {
            drawBtn.addEventListener('click', function () {
                _this.cardDrawer.drawCards();
            });
        }
        if (unarmoredToggle) {
            unarmoredToggle.addEventListener('change', function () {
                _this.character.unarmored = unarmoredToggle.checked;
                _this.saveAndRender();
            });
        }
    };
    CharacterController.prototype.attachItemCheckboxListeners = function () {
        var _this = this;
        document.querySelectorAll('.item-checkbox').forEach(function (checkbox) {
            var input = checkbox;
            input.addEventListener('change', function () {
                var itemId = input.dataset.id;
                var item = _this.character.items.find(function (i) { return i.id === itemId; });
                if (item) {
                    item.equipped = input.checked;
                    _this.character.invalidateEffectiveStatsCache();
                    db.saveCharacter(_this.character);
                }
            });
        });
    };
    CharacterController.prototype.attachNotesListener = function () {
        var _this = this;
        var notesInput = document.getElementById('notes-input');
        var saveNotesBtn = document.getElementById('save-notes-btn');
        if (notesInput) {
            notesInput.addEventListener('input', function () {
                _this.character.notes = notesInput.value;
            });
        }
        if (saveNotesBtn) {
            saveNotesBtn.addEventListener('click', function () {
                db.saveCharacter(_this.character);
                saveNotesBtn.textContent = 'Saved!';
                setTimeout(function () {
                    saveNotesBtn.textContent = 'Save Notes';
                }, 1500);
            });
        }
    };
    return CharacterController;
}());
export { CharacterController };
