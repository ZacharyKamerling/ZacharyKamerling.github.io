import { db } from '../data/db.js';
import { DiceRoller } from '../utils/diceRollers.js';
import { showEditNameModal, numberPrompt } from '../utils/ui.js';
import { attachHoldPress, toggleDescription } from '../utils/eventHelpers.js';
import { editPopover } from '../utils/editPopover.js';
import { TOKEN_MIN, TOKEN_MAX, STAT_MIN, STAT_MAX, CUSTOM_ROLL_MIN, CUSTOM_ROLL_MAX } from '../utils/constants.js';
var CharacterController = /** @class */ (function () {
    function CharacterController(character, view) {
        var _a, _b;
        this.itemAbilityListenersAttached = false;
        this.newButtonListenersAttached = false;
        this.character = character;
        this.view = view;
        this.diceRoller = new DiceRoller(character, document.getElementById('dice-results'));
        // Prevent context menu on main sections
        (_a = this.safeQuery('#token-section')) === null || _a === void 0 ? void 0 : _a.addEventListener('contextmenu', function (e) { return e.preventDefault(); });
        (_b = this.safeQuery('#stat-section')) === null || _b === void 0 ? void 0 : _b.addEventListener('contextmenu', function (e) { return e.preventDefault(); });
        this.view.render(this.character);
        this.initializeListeners();
    }
    /**
     * Initialize all event listeners (only called once)
     */
    CharacterController.prototype.initializeListeners = function () {
        this.attachNameEditListener();
        this.attachStatRollListeners();
        this.attachStatMaxSetListeners();
        this.attachTokenListeners();
        this.attachTokenMaxSetListeners();
        this.attachCustomRollListeners();
        this.attachItemAbilityListeners();
        this.attachNewItemAbilityListeners();
    };
    /**
     * Save character to DB and re-render only what changed
     */
    CharacterController.prototype.saveAndRender = function () {
        try {
            db.saveCharacter(this.character);
            this.view.render(this.character);
            // Re-attach listeners that depend on DOM (item/ability entries)
            this.attachItemAbilityListeners();
            this.attachNewItemAbilityListeners();
        }
        catch (error) {
            console.error('Error saving character:', error);
        }
    };
    /**
     * Safe DOM query with optional chaining
     */
    CharacterController.prototype.safeQuery = function (selector) {
        try {
            return document.querySelector(selector);
        }
        catch (_a) {
            console.warn("Failed to query selector: ".concat(selector));
            return null;
        }
    };
    // ==================== TOKEN LISTENERS ====================
    CharacterController.prototype.attachTokenListeners = function () {
        var _this = this;
        document.querySelectorAll('.token-btn').forEach(function (btn) {
            var button = btn;
            button.onclick = function () {
                var _a;
                var type = button.dataset.type;
                var idx = parseInt((_a = button.dataset.idx) !== null && _a !== void 0 ? _a : '0');
                _this.toggleToken(type, idx);
            };
        });
    };
    CharacterController.prototype.attachTokenMaxSetListeners = function () {
        var _this = this;
        document.querySelectorAll('.token-btn').forEach(function (btn) {
            var button = btn;
            var type = button.dataset.type;
            attachHoldPress(button, function () { return _this.setTokenMax(type); });
        });
    };
    CharacterController.prototype.toggleToken = function (type, idx) {
        var field = type === 'blood' ? 'bloodTokens' : 'staminaTokens';
        var newValue = this.character[field] === idx + 1 ? idx : idx + 1;
        this.character[field] = newValue;
        this.saveAndRender();
    };
    CharacterController.prototype.setTokenMax = function (type) {
        var _this = this;
        var label = type === 'blood' ? 'Blood' : 'Stamina';
        var maxField = type === 'blood' ? 'bloodMax' : 'staminaMax';
        var currentField = type === 'blood' ? 'bloodTokens' : 'staminaTokens';
        var currentMax = this.character[maxField];
        numberPrompt("Set max ".concat(label, " (").concat(TOKEN_MIN, "-").concat(TOKEN_MAX, "):"), currentMax || 5, TOKEN_MIN, TOKEN_MAX).then(function (val) {
            if (val !== null && !isNaN(val)) {
                _this.character[maxField] = val;
                if (_this.character[currentField] > val) {
                    _this.character[currentField] = val;
                }
                _this.saveAndRender();
            }
        });
    };
    // ==================== STAT LISTENERS ====================
    CharacterController.prototype.attachStatRollListeners = function () {
        var _this = this;
        var statConfigs = [
            { id: 'melee-power-label', prop: 'meleePower', label: 'Melee Power' },
            { id: 'ranged-power-label', prop: 'rangedPower', label: 'Ranged Power' },
            { id: 'might-label', prop: 'might', label: 'Might' },
            { id: 'awareness-label', prop: 'awareness', label: 'Awareness' },
            { id: 'resolve-label', prop: 'resolve', label: 'Resolve' },
            { id: 'stress-label', prop: 'stress', label: 'Stress' },
        ];
        statConfigs.forEach(function (_a) {
            var id = _a.id, prop = _a.prop, label = _a.label;
            var el = _this.safeQuery("#".concat(id));
            if (el) {
                el.addEventListener('click', function (e) {
                    if (e.detail === 1) {
                        if (prop === 'stress') {
                            _this.diceRoller.rollStress();
                        }
                        else {
                            _this.diceRoller.rollPMAR(prop, label);
                        }
                    }
                });
            }
        });
    };
    CharacterController.prototype.attachStatMaxSetListeners = function () {
        var _this = this;
        var statConfigs = [
            { id: 'melee-power-label', prop: 'meleePower', label: 'Melee Power' },
            { id: 'ranged-power-label', prop: 'rangedPower', label: 'Ranged Power' },
            { id: 'might-label', prop: 'might', label: 'Might' },
            { id: 'awareness-label', prop: 'awareness', label: 'Awareness' },
            { id: 'resolve-label', prop: 'resolve', label: 'Resolve' },
            { id: 'stress-label', prop: 'stress', label: 'Stress' },
        ];
        statConfigs.forEach(function (_a) {
            var id = _a.id, prop = _a.prop, label = _a.label;
            var el = _this.safeQuery("#".concat(id));
            if (el) {
                el.style.cursor = 'pointer';
                el.title = "Click to roll, hold to set";
                var held_1 = false;
                attachHoldPress(el, function () {
                    held_1 = true;
                    var currentValue = _this.character[prop];
                    numberPrompt("Set ".concat(label, " (").concat(STAT_MIN, "-").concat(STAT_MAX, "):"), currentValue || 0, STAT_MIN, STAT_MAX).then(function (val) {
                        if (val !== null && !isNaN(val)) {
                            _this.character[prop] = val;
                            _this.saveAndRender();
                        }
                    });
                });
                // Also allow clicking to roll
                el.addEventListener('click', function () {
                    if (!held_1) {
                        if (prop === 'stress') {
                            _this.diceRoller.rollStress();
                        }
                        else {
                            _this.diceRoller.rollPMAR(prop, label);
                        }
                    }
                    held_1 = false;
                });
            }
        });
    };
    // ==================== CUSTOM ROLL LISTENERS ====================
    CharacterController.prototype.attachCustomRollListeners = function () {
        var _this = this;
        var input = this.safeQuery('#custom-roll-input');
        var minusBtn = this.safeQuery('#custom-neg-btn');
        var plusBtn = this.safeQuery('#custom-pos-btn');
        var rollBtn = this.safeQuery('#custom-roll-btn');
        if (!input || !minusBtn || !plusBtn || !rollBtn)
            return;
        var updateInput = function () {
            input.value = _this.character.customRoll.toString();
            db.saveCharacter(_this.character);
        };
        updateInput();
        minusBtn.addEventListener('click', function () {
            _this.character.customRoll = Math.max(CUSTOM_ROLL_MIN, _this.character.customRoll - 1);
            updateInput();
        });
        plusBtn.addEventListener('click', function () {
            _this.character.customRoll = Math.min(CUSTOM_ROLL_MAX, _this.character.customRoll + 1);
            updateInput();
        });
        input.addEventListener('change', function () {
            var value = parseInt(input.value) || 1;
            _this.character.customRoll = Math.max(CUSTOM_ROLL_MIN, Math.min(CUSTOM_ROLL_MAX, value));
            _this.saveAndRender();
        });
        rollBtn.addEventListener('click', function () {
            _this.diceRoller.rollPMAR('customRoll', 'Custom');
        });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                _this.diceRoller.rollPMAR('customRoll', 'Custom');
            }
        });
    };
    // ==================== NAME LISTENERS ====================
    CharacterController.prototype.attachNameEditListener = function () {
        var _this = this;
        var nameDiv = this.safeQuery('#character-name');
        if (nameDiv) {
            nameDiv.textContent = this.character.name;
            nameDiv.style.cursor = 'pointer';
            nameDiv.title = 'Hold to edit name';
            attachHoldPress(nameDiv, function () {
                showEditNameModal(_this.character, nameDiv);
            });
        }
    };
    // ==================== ITEM & ABILITY LISTENERS ====================
    CharacterController.prototype.attachItemAbilityListeners = function () {
        var _this = this;
        document.querySelectorAll('.item-ability-entry').forEach(function (entry) {
            var element = entry;
            var id = element.dataset.id;
            var type = element.dataset.type;
            if (!id || !type)
                return;
            var checkbox = element.querySelector('.item-checkbox');
            // Checkbox toggle for items
            if (checkbox && type === 'item') {
                checkbox.addEventListener('change', function (e) {
                    e.stopPropagation();
                    var item = _this.character.items.find(function (i) { return i.id === id; });
                    if (item) {
                        item.equipped = checkbox.checked;
                        _this.character.invalidateEffectiveStatsCache();
                        _this.saveAndRender();
                    }
                });
            }
            // Click to toggle description
            element.addEventListener('click', function (e) {
                if (e.target !== checkbox) {
                    toggleDescription(element);
                }
            });
            // Long press to edit/delete
            attachHoldPress(element, function () {
                _this.showItemAbilityMenu(id, type);
            });
        });
        this.itemAbilityListenersAttached = true;
    };
    CharacterController.prototype.attachNewItemAbilityListeners = function () {
        var _this = this;
        var newItemBtn = this.safeQuery('.new-item-btn');
        var newAbilityBtn = this.safeQuery('.new-ability-btn');
        if (newItemBtn && !this.newButtonListenersAttached) {
            newItemBtn.addEventListener('click', function () { return _this.createNewItem(); });
        }
        if (newAbilityBtn && !this.newButtonListenersAttached) {
            newAbilityBtn.addEventListener('click', function () { return _this.createNewAbility(); });
        }
        this.newButtonListenersAttached = true;
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
        var _this = this;
        if (type === 'item') {
            var item_1 = this.character.items.find(function (i) { return i.id === id; });
            if (!item_1)
                return;
            editPopover.show(type, item_1, function (data) {
                item_1.name = data.name;
                item_1.location = data.location;
                item_1.description = data.description;
                _this.character.invalidateEffectiveStatsCache();
                _this.saveAndRender();
            });
        }
        else {
            var ability_1 = this.character.abilities.find(function (a) { return a.id === id; });
            if (!ability_1)
                return;
            editPopover.show(type, ability_1, function (data) {
                ability_1.name = data.name;
                ability_1.description = data.description;
                _this.saveAndRender();
            });
        }
    };
    CharacterController.prototype.deleteItemOrAbility = function (id, type) {
        if (window.confirm("Delete this ".concat(type, "?"))) {
            if (type === 'item') {
                this.character.items = this.character.items.filter(function (i) { return i.id !== id; });
                this.character.invalidateEffectiveStatsCache();
            }
            else {
                this.character.abilities = this.character.abilities.filter(function (a) { return a.id !== id; });
            }
            this.saveAndRender();
        }
    };
    CharacterController.prototype.createNewItem = function () {
        var _this = this;
        editPopover.show('item', { name: '', location: 'melee weapon', description: '' }, function (data) {
            if (!data.name)
                return;
            _this.character.items.push({
                id: Date.now().toString(),
                name: data.name,
                location: data.location || 'melee weapon',
                description: data.description,
                equipped: false,
            });
            _this.character.invalidateEffectiveStatsCache();
            _this.saveAndRender();
        });
    };
    CharacterController.prototype.createNewAbility = function () {
        var _this = this;
        editPopover.show('ability', { name: '', description: '' }, function (data) {
            if (!data.name)
                return;
            _this.character.abilities.push({
                id: Date.now().toString(),
                name: data.name,
                description: data.description,
            });
            _this.saveAndRender();
        });
    };
    return CharacterController;
}());
export { CharacterController };
