
import { db } from './data/db.js';
import { Character } from './models/character.js';
import { STARTING_ABILITIES } from './data/startingAbilities.js';
import { COLORS, SPACING, RADIUS, Z_INDEX } from './utils/constants.js';

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

        // Delete character with modal confirmation
        deleteBtn.addEventListener('click', (e) => {
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

function showDeleteConfirmation(characterId: string, characterName: string): void {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: ${Z_INDEX.modal};
    `;

    const container = document.createElement('div');
    container.style.cssText = `
        background: ${COLORS.dark};
        border: 2px solid ${COLORS.borderDark};
        border-radius: ${RADIUS.lg};
        padding: ${SPACING.xl};
        z-index: ${Z_INDEX.modalHigh};
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
        max-width: 300px;
        text-align: center;
    `;

    const title = document.createElement('h3');
    title.textContent = 'Delete Character?';
    title.style.cssText = `margin-top: 0; margin-bottom: ${SPACING.md}; font-size: 1.1em;`;
    container.appendChild(title);

    const message = document.createElement('p');
    message.textContent = `Delete "${characterName}"? This cannot be undone.`;
    message.style.cssText = `margin: ${SPACING.md} 0; color: #ccc;`;
    container.appendChild(message);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `display: flex; flex-direction: column; gap: ${SPACING.sm};`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.cssText = `padding: ${SPACING.md}; background: ${COLORS.danger}; color: ${COLORS.text}; border: none; border-radius: ${RADIUS.md}; cursor: pointer; font-weight: 600;`;
    deleteBtn.addEventListener('click', () => {
        db.deleteCharacter(characterId);
        modal.remove();
        renderCharacterList();
    });
    buttonContainer.appendChild(deleteBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = `padding: ${SPACING.md}; background: ${COLORS.borderDark}; color: ${COLORS.text}; border: none; border-radius: ${RADIUS.md}; cursor: pointer;`;
    cancelBtn.addEventListener('click', () => modal.remove());
    buttonContainer.appendChild(cancelBtn);

    container.appendChild(buttonContainer);
    modal.appendChild(container);
    document.body.appendChild(modal);
}

function showCharacterNameForm(): Promise<string | null> {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: ${Z_INDEX.modal};
        `;

        const container = document.createElement('div');
        container.style.cssText = `
            background: ${COLORS.dark};
            border: 2px solid ${COLORS.borderDark};
            border-radius: ${RADIUS.lg};
            padding: ${SPACING.xl};
            z-index: ${Z_INDEX.modalHigh};
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
            max-width: 300px;
            width: 90%;
            box-sizing: border-box;
        `;

        const title = document.createElement('h2');
        title.textContent = 'Character Name';
        title.style.cssText = `margin-top: 0; margin-bottom: ${SPACING.md}; font-size: 1.2em;`;
        container.appendChild(title);

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter character name';
        input.maxLength = 40;
        input.style.cssText = `
            width: 100%;
            padding: ${SPACING.md};
            border-radius: ${RADIUS.md};
            background: ${COLORS.medium};
            border: 1px solid ${COLORS.border};
            color: ${COLORS.text};
            box-sizing: border-box;
            font-size: 1em;
            margin-bottom: ${SPACING.lg};
        `;
        container.appendChild(input);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `display: flex; flex-direction: column; gap: ${SPACING.sm};`;

        const createBtn = document.createElement('button');
        createBtn.textContent = 'Create';
        createBtn.style.cssText = `padding: ${SPACING.md}; background: ${COLORS.success}; color: ${COLORS.textDark}; border: none; border-radius: ${RADIUS.md}; cursor: pointer; font-weight: 600;`;
        createBtn.addEventListener('click', () => {
            const name = input.value.trim();
            if (name) {
                modal.remove();
                resolve(name);
            }
        });
        buttonContainer.appendChild(createBtn);

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = `padding: ${SPACING.md}; background: ${COLORS.borderDark}; color: ${COLORS.text}; border: none; border-radius: ${RADIUS.md}; cursor: pointer;`;
        cancelBtn.addEventListener('click', () => {
            modal.remove();
            resolve(null);
        });
        buttonContainer.appendChild(cancelBtn);

        container.appendChild(buttonContainer);
        modal.appendChild(container);
        document.body.appendChild(modal);

        // Focus and select input, support Enter key
        setTimeout(() => {
            input.focus();
        }, 0);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') createBtn.click();
            if (e.key === 'Escape') cancelBtn.click();
        });
    });
}

function showAbilitySelection(characterName: string): Promise<string | null> {
    return new Promise((resolve) => {
        // Create modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;

        const container = document.createElement('div');
        container.style.cssText = `
            background: #1a1a1a;
            color: #fff;
            padding: 2em;
            border-radius: 8px;
            max-width: 90%;
            max-height: 90%;
            overflow-y: auto;
            box-sizing: border-box;
            font-family: inherit;
        `;

        const title = document.createElement('h2');
        title.textContent = `Choose Starting Ability for ${characterName}`;
        title.style.cssText = 'margin-top: 0; margin-bottom: 1.5em;';
        container.appendChild(title);

        // Create ability buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: grid;
            grid-template-columns: 1fr;
            gap: 1em;
            margin-bottom: 1.5em;
        `;

        // Add custom ability option first
        const customBtn = document.createElement('button');
        customBtn.style.cssText = `
            padding: 1em;
            border: 2px solid #666;
            border-radius: 4px;
            background: rgba(100, 100, 100, 0.3);
            color: #fff;
            cursor: pointer;
            text-align: left;
            transition: all 0.2s;
        `;
        customBtn.innerHTML = '<strong>Custom Ability</strong><div style="font-size: 0.9em; margin-top: 0.5em;">Create your own starting ability</div>';
        customBtn.onmouseover = () => customBtn.style.borderColor = '#aaa';
        customBtn.onmouseout = () => customBtn.style.borderColor = '#666';
        customBtn.onclick = () => {
            modal.remove();
            resolve('');
        };
        buttonContainer.appendChild(customBtn);

        // Add starting abilities
        STARTING_ABILITIES.forEach(ability => {
            const btn = document.createElement('button');
            btn.style.cssText = `
                padding: 1em;
                border: 2px solid #444;
                border-radius: 4px;
                background: rgba(50, 50, 50, 0.5);
                color: #fff;
                cursor: pointer;
                text-align: left;
                transition: all 0.2s;
            `;
            btn.innerHTML = `<strong>${ability.name}</strong><div style="font-size: 0.85em; margin-top: 0.5em; line-height: 1.4;">${ability.description}</div>`;
            btn.onmouseover = () => btn.style.borderColor = '#888';
            btn.onmouseout = () => btn.style.borderColor = '#444';
            btn.onclick = () => {
                modal.remove();
                resolve(ability.name);
            };
            buttonContainer.appendChild(btn);
        });

        container.appendChild(buttonContainer);

        // Cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = `
            padding: 0.5em 1em;
            background: #444;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        cancelBtn.onclick = () => {
            modal.remove();
            resolve(null);
        };
        container.appendChild(cancelBtn);

        modal.appendChild(container);
        document.body.appendChild(modal);
    });
}

// Init
document.getElementById('create-character')?.addEventListener('click', async () => {
    const name = await showCharacterNameForm();
    if (name) {
        const abilityName = await showAbilitySelection(name);
        if (abilityName !== null) {
            let character = Character.default();
            character.name = name;

            // Add starting ability if selected
            if (abilityName) {
                const selectedAbility = STARTING_ABILITIES.find(a => a.name === abilityName);
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
            window.location.href = `character.html?id=${character.id}`;
        }
    }
});

renderCharacterList();
