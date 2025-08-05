import { Character, CharacterData } from './Character.js';
import { db } from './db.js';

// Utility: add hold-to-set-MAX-value to a label
type MaxProp = 'bloodMax' | 'staminaMax';
interface CharacterLike {
    [key: string]: number | string | undefined;
}
interface DBLike {
    saveCharacter: (character: CharacterLike) => void;
}
export function addHoldToSetMax(
    id: string,
    label: string,
    maxProp: MaxProp,
    character: CharacterLike,
    db: DBLike,
    renderTokens: () => void,
    renderStats: () => void,
    numberPrompt: (msg: string, val: number, min: number, max: number) => Promise<number|null>
): void {
    const el = document.getElementById(id);
    if (!el) return;
    let holdTimer: ReturnType<typeof setTimeout> | undefined;
    function handleSetMax(label: string, maxProp: MaxProp): void {
        numberPrompt(`Set max ${label} (1-20):`, (character[maxProp] as number) || 5, 1, 20).then(val => {
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
        el.addEventListener('mousedown', (e: MouseEvent) => {
            holdTimer = setTimeout(() => {
                handleSetMax(label, maxProp);
            }, 600);
        });
        el.addEventListener('mouseup', () => clearTimeout(holdTimer));
        el.addEventListener('mouseleave', () => clearTimeout(holdTimer));
        el.addEventListener('touchstart', (e: TouchEvent) => {
            holdTimer = setTimeout(() => {
                handleSetMax(label, maxProp);
            }, 600);
        });
        el.addEventListener('touchend', () => clearTimeout(holdTimer));
        el.addEventListener('touchcancel', () => clearTimeout(holdTimer));
    }
}
export function numberPrompt(
    message: string,
    defaultValue: number,
    min: number,
    max: number
): Promise<number|null> {
    return new Promise<number|null>((resolve: (value: number|null) => void) => {
        let length = defaultValue.toString().length;
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
        input.min = String(min);
        input.max = String(max);
        input.value = String(defaultValue);
        input.style.fontSize = '1.2em';
        input.style.width = '5em';
        input.style.marginBottom = '1em';
        input.style.background = '#222';
        input.style.color = '#fff';
        input.style.border = '1px solid #888';
        input.style.borderRadius = '0.4em';
        input.style.textAlign = 'center';
        input.select();
        input.addEventListener('keydown', (e: KeyboardEvent) => {
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

declare const character: Character;
// db is assumed to be declared elsewhere
declare const nameDiv: HTMLElement;
export function showEditNameModal(): void {
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
    input.value = typeof character.name === 'string' ? character.name : '';
    input.maxLength = 40;
    input.style.fontSize = '1.2em';
    input.style.width = '14em';
    input.style.marginBottom = '1em';
    input.style.background = '#222';
    input.style.color = '#fff';
    input.style.border = '1px solid #888';
    input.style.borderRadius = '0.4em';
    input.style.textAlign = 'center';
    input.addEventListener('keydown', (e: KeyboardEvent) => {
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
        db.saveCharacter(character as CharacterData);
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
