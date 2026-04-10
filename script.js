var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
import { db } from './data/db.js';
import { Character } from './models/character.js';
import { STARTING_ABILITIES } from './data/startingAbilities.js';
import { COLORS, SPACING, RADIUS, Z_INDEX } from './utils/constants.js';
function renderCharacterList() {
    var list = document.getElementById('character-list');
    if (!list)
        return;
    var characters = db.getCharacters();
    console.log("Saved characters:", characters);
    // Clear existing list
    list.innerHTML = '';
    // Populate list
    characters.forEach(function (character) {
        var li = document.createElement('li');
        // Character link
        var link = document.createElement('a');
        link.href = "character.html?id=".concat(character.id);
        link.textContent = character.name;
        // Delete button
        var deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.dataset.id = character.id;
        // Delete character with modal confirmation
        deleteBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            showDeleteConfirmation(character.id, character.name);
        });
        // Assemble
        li.appendChild(link);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
    // Show empty state if no characters
    if (characters.length === 0) {
        list.innerHTML = '<li class="empty-state"><p>No characters yet</p></li>';
    }
}
function showDeleteConfirmation(characterId, characterName) {
    var modal = document.createElement('div');
    modal.style.cssText = "\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        background: rgba(0, 0, 0, 0.5);\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        z-index: ".concat(Z_INDEX.modal, ";\n    ");
    var container = document.createElement('div');
    container.style.cssText = "\n        background: ".concat(COLORS.dark, ";\n        border: 2px solid ").concat(COLORS.borderDark, ";\n        border-radius: ").concat(RADIUS.lg, ";\n        padding: ").concat(SPACING.xl, ";\n        z-index: ").concat(Z_INDEX.modalHigh, ";\n        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);\n        max-width: 300px;\n        text-align: center;\n    ");
    var title = document.createElement('h3');
    title.textContent = 'Delete Character?';
    title.style.cssText = "margin-top: 0; margin-bottom: ".concat(SPACING.md, "; font-size: 1.1em;");
    container.appendChild(title);
    var message = document.createElement('p');
    message.textContent = "Delete \"".concat(characterName, "\"? This cannot be undone.");
    message.style.cssText = "margin: ".concat(SPACING.md, " 0; color: #ccc;");
    container.appendChild(message);
    var buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = "display: flex; flex-direction: column; gap: ".concat(SPACING.sm, ";");
    var deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.cssText = "padding: ".concat(SPACING.md, "; background: ").concat(COLORS.danger, "; color: ").concat(COLORS.text, "; border: none; border-radius: ").concat(RADIUS.md, "; cursor: pointer; font-weight: 600;");
    deleteBtn.addEventListener('click', function () {
        db.deleteCharacter(characterId);
        modal.remove();
        renderCharacterList();
    });
    buttonContainer.appendChild(deleteBtn);
    var cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = "padding: ".concat(SPACING.md, "; background: ").concat(COLORS.borderDark, "; color: ").concat(COLORS.text, "; border: none; border-radius: ").concat(RADIUS.md, "; cursor: pointer;");
    cancelBtn.addEventListener('click', function () { return modal.remove(); });
    buttonContainer.appendChild(cancelBtn);
    container.appendChild(buttonContainer);
    modal.appendChild(container);
    document.body.appendChild(modal);
}
function showCharacterNameForm() {
    return new Promise(function (resolve) {
        var modal = document.createElement('div');
        modal.style.cssText = "\n            position: fixed;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: rgba(0, 0, 0, 0.5);\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            z-index: ".concat(Z_INDEX.modal, ";\n        ");
        var container = document.createElement('div');
        container.style.cssText = "\n            background: ".concat(COLORS.dark, ";\n            border: 2px solid ").concat(COLORS.borderDark, ";\n            border-radius: ").concat(RADIUS.lg, ";\n            padding: ").concat(SPACING.xl, ";\n            z-index: ").concat(Z_INDEX.modalHigh, ";\n            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);\n            max-width: 300px;\n            width: 90%;\n            box-sizing: border-box;\n        ");
        var title = document.createElement('h2');
        title.textContent = 'Character Name';
        title.style.cssText = "margin-top: 0; margin-bottom: ".concat(SPACING.md, "; font-size: 1.2em;");
        container.appendChild(title);
        var input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter character name';
        input.maxLength = 40;
        input.style.cssText = "\n            width: 100%;\n            padding: ".concat(SPACING.md, ";\n            border-radius: ").concat(RADIUS.md, ";\n            background: ").concat(COLORS.medium, ";\n            border: 1px solid ").concat(COLORS.border, ";\n            color: ").concat(COLORS.text, ";\n            box-sizing: border-box;\n            font-size: 1em;\n            margin-bottom: ").concat(SPACING.lg, ";\n        ");
        container.appendChild(input);
        var buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = "display: flex; flex-direction: column; gap: ".concat(SPACING.sm, ";");
        var createBtn = document.createElement('button');
        createBtn.textContent = 'Create';
        createBtn.style.cssText = "padding: ".concat(SPACING.md, "; background: ").concat(COLORS.success, "; color: ").concat(COLORS.textDark, "; border: none; border-radius: ").concat(RADIUS.md, "; cursor: pointer; font-weight: 600;");
        createBtn.addEventListener('click', function () {
            var name = input.value.trim();
            if (name) {
                modal.remove();
                resolve(name);
            }
        });
        buttonContainer.appendChild(createBtn);
        var cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = "padding: ".concat(SPACING.md, "; background: ").concat(COLORS.borderDark, "; color: ").concat(COLORS.text, "; border: none; border-radius: ").concat(RADIUS.md, "; cursor: pointer;");
        cancelBtn.addEventListener('click', function () {
            modal.remove();
            resolve(null);
        });
        buttonContainer.appendChild(cancelBtn);
        container.appendChild(buttonContainer);
        modal.appendChild(container);
        document.body.appendChild(modal);
        // Focus and select input, support Enter key
        setTimeout(function () {
            input.focus();
        }, 0);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter')
                createBtn.click();
            if (e.key === 'Escape')
                cancelBtn.click();
        });
    });
}
function showAbilitySelection(characterName) {
    return new Promise(function (resolve) {
        // Create modal
        var modal = document.createElement('div');
        modal.style.cssText = "\n            position: fixed;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: rgba(0, 0, 0, 0.8);\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            z-index: 1000;\n        ";
        var container = document.createElement('div');
        container.style.cssText = "\n            background: #1a1a1a;\n            color: #fff;\n            padding: 2em;\n            border-radius: 8px;\n            max-width: 90%;\n            max-height: 90%;\n            overflow-y: auto;\n            box-sizing: border-box;\n            font-family: inherit;\n        ";
        var title = document.createElement('h2');
        title.textContent = "Choose Starting Ability for ".concat(characterName);
        title.style.cssText = 'margin-top: 0; margin-bottom: 1.5em;';
        container.appendChild(title);
        // Create ability buttons
        var buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = "\n            display: grid;\n            grid-template-columns: 1fr;\n            gap: 1em;\n            margin-bottom: 1.5em;\n        ";
        // Add custom ability option first
        var customBtn = document.createElement('button');
        customBtn.style.cssText = "\n            padding: 1em;\n            border: 2px solid #666;\n            border-radius: 4px;\n            background: rgba(100, 100, 100, 0.3);\n            color: #fff;\n            cursor: pointer;\n            text-align: left;\n            transition: all 0.2s;\n        ";
        customBtn.innerHTML = '<strong>Custom Ability</strong><div style="font-size: 0.9em; margin-top: 0.5em;">Create your own starting ability</div>';
        customBtn.onmouseover = function () { return customBtn.style.borderColor = '#aaa'; };
        customBtn.onmouseout = function () { return customBtn.style.borderColor = '#666'; };
        customBtn.onclick = function () {
            modal.remove();
            resolve('');
        };
        buttonContainer.appendChild(customBtn);
        // Add starting abilities
        STARTING_ABILITIES.forEach(function (ability) {
            var btn = document.createElement('button');
            btn.style.cssText = "\n                padding: 1em;\n                border: 2px solid #444;\n                border-radius: 4px;\n                background: rgba(50, 50, 50, 0.5);\n                color: #fff;\n                cursor: pointer;\n                text-align: left;\n                transition: all 0.2s;\n            ";
            btn.innerHTML = "<strong>".concat(ability.name, "</strong><div style=\"font-size: 0.85em; margin-top: 0.5em; line-height: 1.4;\">").concat(ability.description, "</div>");
            btn.onmouseover = function () { return btn.style.borderColor = '#888'; };
            btn.onmouseout = function () { return btn.style.borderColor = '#444'; };
            btn.onclick = function () {
                modal.remove();
                resolve(ability.name);
            };
            buttonContainer.appendChild(btn);
        });
        container.appendChild(buttonContainer);
        // Cancel button
        var cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = "\n            padding: 0.5em 1em;\n            background: #444;\n            color: #fff;\n            border: none;\n            border-radius: 4px;\n            cursor: pointer;\n        ";
        cancelBtn.onclick = function () {
            modal.remove();
            resolve(null);
        };
        container.appendChild(cancelBtn);
        modal.appendChild(container);
        document.body.appendChild(modal);
    });
}
// Init
(_a = document.getElementById('create-character')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () {
    var name, abilityName_1, character, selectedAbility;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, showCharacterNameForm()];
            case 1:
                name = _a.sent();
                if (!name) return [3 /*break*/, 3];
                return [4 /*yield*/, showAbilitySelection(name)];
            case 2:
                abilityName_1 = _a.sent();
                if (abilityName_1 !== null) {
                    character = Character.default();
                    character.name = name;
                    // Add starting ability if selected
                    if (abilityName_1) {
                        selectedAbility = STARTING_ABILITIES.find(function (a) { return a.name === abilityName_1; });
                        if (selectedAbility) {
                            character.abilities.push({
                                id: Date.now().toString(),
                                name: selectedAbility.name,
                                description: selectedAbility.description
                            });
                        }
                    }
                    db.saveCharacter(character);
                    // Navigate to the newly created character
                    window.location.href = "character.html?id=".concat(character.id);
                }
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
renderCharacterList();
