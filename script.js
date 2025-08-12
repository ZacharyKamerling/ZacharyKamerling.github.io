var _a;
import { db } from './db.js';
import { Character } from './character.js';
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
        // Delete character: click prompts, hold for 1s deletes immediately
        var holdTimer;
        deleteBtn.addEventListener('mousedown', function (e) {
            if (confirm('Delete this character?')) {
                db.deleteCharacter(character.id);
                renderCharacterList();
            }
        });
        deleteBtn.addEventListener('touchstart', function (e) {
            holdTimer = setTimeout(function () {
                db.deleteCharacter(character.id);
                renderCharacterList();
            }, 1000);
        });
        deleteBtn.addEventListener('touchend', function (e) {
            clearTimeout(holdTimer);
            if (e.detail === 1) {
                if (confirm('Delete this character?')) {
                    renderCharacterList();
                }
            }
        });
        deleteBtn.addEventListener('touchcancel', function () { return clearTimeout(holdTimer); });
        // Assemble
        li.appendChild(link);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
    // Show empty state if no characters
    if (characters.length === 0) {
        list.innerHTML = '<li>No characters yet. Create one!</li>';
    }
}
// Init
(_a = document.getElementById('create-character')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
    var name = prompt("Character name:");
    if (name) {
        db.saveCharacter(Character.default());
        renderCharacterList();
    }
});
renderCharacterList();
