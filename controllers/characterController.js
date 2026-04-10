import { db } from '../data/db.js';
import { DiceRoller } from '../utils/diceRollers.js';
import { CardDrawer } from '../utils/cardDrawers.js';
import { showEditNameModal, numberPrompt } from '../utils/ui.js';
import { editPopover } from '../utils/editPopover.js';
import { COLORS, SPACING, RADIUS, Z_INDEX, MODAL, HOLD_PRESS_DURATION_MS } from '../utils/constants.js';
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
    CharacterController.prototype.saveAndRender = function () {
        db.saveCharacter(this.character.toJSON());
        this.view.render(this.character);
        // Re-initialize diceRoller and cardDrawer after DOM is ready
        var diceResultBox = document.getElementById('dice-results');
        if (diceResultBox) {
            this.diceRoller.resultBox = diceResultBox;
            this.diceRoller.redisplay();
        }
        var cardResultBox = document.getElementById('card-result-box');
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
    };
    CharacterController.prototype.attachTokenListeners = function () {
        var _this = this;
        document.querySelectorAll('.token-btn').forEach(function (btn) {
            var button = btn;
            var holdTimer;
            var held = false;
            var startHold = function () {
                held = false;
                holdTimer = setTimeout(function () {
                    held = true;
                    var type = button.dataset.type;
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
                }, HOLD_PRESS_DURATION_MS);
            };
            var endHold = function (doClick) {
                clearTimeout(holdTimer);
                if (doClick && !held) {
                    var type = button.dataset.type;
                    var idx = parseInt(button.dataset.idx);
                    if (type === 'blood') {
                        _this.character.bloodTokens = _this.character.bloodTokens === idx + 1 ? idx : idx + 1;
                    }
                    else {
                        _this.character.staminaTokens = _this.character.staminaTokens === idx + 1 ? idx : idx + 1;
                    }
                    _this.saveAndRender();
                }
            };
            button.addEventListener('mousedown', function (e) { if (e.button === 0)
                startHold(); });
            button.addEventListener('mouseup', function (e) { if (e.button === 0)
                endHold(true); });
            button.addEventListener('mouseleave', function () { return clearTimeout(holdTimer); });
            button.addEventListener('touchstart', function () { return startHold(); });
            button.addEventListener('touchend', function (e) { e.preventDefault(); endHold(true); });
            button.addEventListener('touchcancel', function () { return clearTimeout(holdTimer); });
            button.addEventListener('contextmenu', function (e) { return e.preventDefault(); });
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
                }, HOLD_PRESS_DURATION_MS);
            });
            nameDiv.addEventListener('mouseup', function () { return clearTimeout(holdTimer_1); });
            nameDiv.addEventListener('mouseleave', function () { return clearTimeout(holdTimer_1); });
            nameDiv.addEventListener('touchstart', function (e) {
                holdTimer_1 = setTimeout(function () {
                    showEditNameModal(_this.character, nameDiv);
                }, HOLD_PRESS_DURATION_MS);
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
                                _this.character.invalidateEffectiveStatsCache();
                                _this.saveAndRender();
                            }
                        });
                    }, HOLD_PRESS_DURATION_MS);
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
                                _this.character.invalidateEffectiveStatsCache();
                                _this.saveAndRender();
                            }
                        });
                    }, HOLD_PRESS_DURATION_MS);
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
                }, HOLD_PRESS_DURATION_MS);
            });
            element.addEventListener('mouseup', function () { return clearTimeout(holdTimer); });
            element.addEventListener('mouseleave', function () { return clearTimeout(holdTimer); });
            element.addEventListener('touchstart', function (e) {
                holdTimer = setTimeout(function () {
                    _this.showItemAbilityMenu(id, type);
                }, HOLD_PRESS_DURATION_MS);
            });
            element.addEventListener('touchend', function () { return clearTimeout(holdTimer); });
            element.addEventListener('touchcancel', function () { return clearTimeout(holdTimer); });
            element.addEventListener('contextmenu', function (e) { return e.preventDefault(); });
        });
    };
    CharacterController.prototype.showItemAbilityMenu = function (id, type) {
        var _this = this;
        var modal = document.createElement('div');
        modal.style.cssText = "\n            position: fixed;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: rgba(0, 0, 0, ".concat(MODAL.overlayOpacity, ");\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            z-index: ").concat(Z_INDEX.modalOverlay, ";\n        ");
        var container = document.createElement('div');
        container.style.cssText = "\n            background: ".concat(COLORS.dark, ";\n            border: 2px solid ").concat(COLORS.borderDark, ";\n            border-radius: ").concat(RADIUS.lg, ";\n            padding: ").concat(SPACING.xl, ";\n            z-index: ").concat(Z_INDEX.modalHigh, ";\n            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);\n            max-width: ").concat(MODAL.menuMaxWidth, ";\n        ");
        var title = document.createElement('h3');
        title.textContent = "".concat(type === 'item' ? 'Item' : 'Ability', " Options");
        title.style.cssText = "margin-top: 0; margin-bottom: ".concat(SPACING.lg, "; font-size: 1.1em;");
        container.appendChild(title);
        var buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = "display: flex; flex-direction: column; gap: ".concat(SPACING.sm, ";");
        var editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.style.cssText = "padding: ".concat(SPACING.md, "; background: ").concat(COLORS.primary, "; color: ").concat(COLORS.text, "; border: none; border-radius: ").concat(RADIUS.md, "; cursor: pointer; font-weight: 600;");
        editBtn.onclick = function () {
            modal.remove();
            _this.editItemOrAbility(id, type);
        };
        buttonContainer.appendChild(editBtn);
        var deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.cssText = "padding: ".concat(SPACING.md, "; background: ").concat(COLORS.danger, "; color: ").concat(COLORS.text, "; border: none; border-radius: ").concat(RADIUS.md, "; cursor: pointer; font-weight: 600;");
        deleteBtn.onclick = function () {
            modal.remove();
            _this.deleteItemOrAbility(id, type);
        };
        buttonContainer.appendChild(deleteBtn);
        var cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = "padding: ".concat(SPACING.md, "; background: ").concat(COLORS.borderDark, "; color: ").concat(COLORS.text, "; border: none; border-radius: ").concat(RADIUS.md, "; cursor: pointer;");
        cancelBtn.onclick = function () { return modal.remove(); };
        buttonContainer.appendChild(cancelBtn);
        container.appendChild(buttonContainer);
        modal.appendChild(container);
        document.body.appendChild(modal);
        // Close on Escape
        var escapeHandler = function (e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    };
    CharacterController.prototype.editItemOrAbility = function (id, type) {
        var _this = this;
        if (type === 'item') {
            var item_1 = this.character.items.find(function (i) { return i.id === id; });
            if (!item_1)
                return;
            editPopover.show('item', item_1, function (updatedData) {
                item_1.name = updatedData.name;
                item_1.location = updatedData.location;
                item_1.description = updatedData.description;
                _this.saveAndRender();
            });
        }
        else {
            var ability_1 = this.character.abilities.find(function (a) { return a.id === id; });
            if (!ability_1)
                return;
            editPopover.show('ability', ability_1, function (updatedData) {
                ability_1.name = updatedData.name;
                ability_1.description = updatedData.description;
                _this.saveAndRender();
            });
        }
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
        var _this = this;
        var templateSelect = document.getElementById('item-template-select');
        var template = (templateSelect === null || templateSelect === void 0 ? void 0 : templateSelect.value) || '';
        var templateDescriptions = {
            melee_power: '$$melee_power:1',
            ranged_power: '$$ranged_power:1',
            might: '$$might:1',
            awareness: '$$awareness:1',
            resolve: '$$resolve:1',
            stress: '$$stress:1',
            blood_max: '$$blood_max:1',
            stamina_max: '$$stamina_max:1',
        };
        var defaultDesc = template ? templateDescriptions[template] || '' : '';
        editPopover.show('item', {
            id: Date.now().toString(),
            name: '',
            location: '',
            description: defaultDesc,
            equipped: false
        }, function (data) {
            if (data.name.trim()) {
                _this.character.items.push({
                    id: Date.now().toString(),
                    name: data.name.trim(),
                    location: data.location.trim(),
                    description: data.description.trim(),
                    equipped: false
                });
                _this.saveAndRender();
            }
        });
    };
    CharacterController.prototype.createNewAbility = function () {
        var _this = this;
        editPopover.show('ability', {
            id: Date.now().toString(),
            name: '',
            description: ''
        }, function (data) {
            if (data.name.trim()) {
                _this.character.abilities.push({
                    id: Date.now().toString(),
                    name: data.name.trim(),
                    description: data.description.trim()
                });
                _this.saveAndRender();
            }
        });
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
