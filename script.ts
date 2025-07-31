
import { db } from './db.js';
function renderCharacterList() {
    const list = document.getElementById('character-list');
    if (!list) return;
    const characters = db.getCharacters();

    console.log("Saved characters:", characters)

    // Clear existing list
    list.innerHTML = '';

    // Populate list
    characters.forEach(character => {
        const li = document.createElement('li');

        // Character link
        const link = document.createElement('a');
        link.href = `character.html?id=${character.id}`;
        link.textContent = character.name;

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.dataset.id = character.id;

        // Delete character: click prompts, hold for 1s deletes immediately
        let holdTimer: number | undefined;
        deleteBtn.addEventListener('mousedown', (e) => {
            if (confirm('Delete this character?')) {
                db.deleteCharacter(character.id);
                renderCharacterList();
            }
        });
        deleteBtn.addEventListener('touchstart', (e) => {
            holdTimer = setTimeout(() => {
                db.deleteCharacter(character.id);
                renderCharacterList();
            }, 1000);
        });
        deleteBtn.addEventListener('touchend', (e) => {
            clearTimeout(holdTimer);
            if (e.detail === 1) {
                if (confirm('Delete this character?')) {
                    renderCharacterList();
                }
            }
        });
        deleteBtn.addEventListener('touchcancel', () => clearTimeout(holdTimer));

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
document.getElementById('create-character')?.addEventListener('click', () => {
    const name = prompt("Character name:");
    if (name) {
        db.saveCharacter({
            id: Date.now().toString(),
            name,
            bloodTokens: 3,
            bloodMax: 3,
            staminaTokens: 3,
            staminaMax: 3,
            meleePower: 3,
            rangedPower: 3,
            might: 3,
            awareness: 3,
            resolve: 3,
            stress: 0,
            equipment: [],
            abilities: []
        });
        renderCharacterList();
    }
});

renderCharacterList();