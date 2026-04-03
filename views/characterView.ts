import { Character } from '../models/character.js';

export class CharacterView {
    // REMEMBER: Increment VERSION when making UI changes
    private VERSION = '1.0.3';

    render(character: Character) {
        this.renderVersion();
        this.renderName(character.name);
        this.renderTokens(character);
        this.renderStats(character);
        this.renderItems(character);
        this.renderAbilities(character);
        this.renderCardSection(character);
    }

    private renderVersion() {
        const versionDiv = document.getElementById('version');
        if (versionDiv) versionDiv.textContent = `v${this.VERSION}`;
    }

    private renderName(name: string) {
        const nameDiv = document.getElementById('character-name');
        if (nameDiv) nameDiv.textContent = name;
    }

    // public for initial attachment, but internal for logic
    public renderTokens(character: Character) {
        let blood = '';
        let maxBlood = character.bloodMax || 1;
        let currentBlood = character.bloodTokens || 0;
        for (let i = 0; i < maxBlood; i++) {
            blood += `<button class="token-btn" data-type="blood" data-idx="${i}" style="font-size:1.5em; margin:2px 2px;${i < currentBlood ? '' : 'opacity:0.3;'}">🩸</button>`;
        }
        let stamina = '';
        let maxStamina = character.staminaMax || 1;
        let currentStamina = character.staminaTokens || 0;
        for (let i = 0; i < maxStamina; i++) {
            stamina += `<button class="token-btn" data-type="stamina" data-idx="${i}" style="font-size:1.5em; margin:2px 2px;${i < currentStamina ? '' : 'opacity:0.3;'}">⚡</button>`;
        }
        const tokenSection = document.getElementById('token-section');
        if (!tokenSection) return;
        tokenSection.innerHTML = `
                    <div style="font-size:1.2em; margin-bottom:0.5em; display: flex; flex-direction: column; gap: 0.5em;">
                        <div style="display: flex; flex-direction: column; align-items: flex-start;">
                            <span id="blood-label" style="padding-left: 0.5em; font-size: 1em;">Blood (${currentBlood} / ${maxBlood})</span>
                            <div>${blood}</div>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: flex-start;">
                            <span id="stamina-label" style="padding-left: 0.5em; font-size: 1em;">Stamina (${currentStamina} / ${maxStamina})</span>
                            <div>${stamina}</div>
                        </div>
                    </div>
                `;
    }

    public renderStats(character: Character) {
        const statSection = document.getElementById('stat-section');
        if (!statSection) return;
        statSection.innerHTML = `
                <div style="font-size:1em; display: flex; flex-direction: column;">
                    <div class="stat-row">
                        <span id="melee-power-label" class="stat-label round-style" title="Melee Power">Melee ⚔️</span>
                        <div class="stat-value">${character.meleePower}</div>
                        <span id="ranged-power-label" class="stat-label round-style" title="Ranged Power">Ranged 🏹</span>
                        <div class="stat-value">${character.rangedPower}</div>
                    </div>
                    <div class="stat-row">
                        <span id="might-label" class="stat-label round-style" title="Might">Might 💪</span>
                        <div class="stat-value">${character.might}</div>
                        <span id="awareness-label" class="stat-label round-style" title="Awareness">Awareness 👁️</span>
                        <div class="stat-value">${character.awareness}</div>
                    </div>
                    <div class="stat-row"">
                        <span id="resolve-label" class="stat-label round-style" title="Resolve">Resolve ✊</span>
                        <div class="stat-value">${character.resolve}</div>
                        <span id="stress-label" class="stat-label round-style" title="Stress">Stress 💦</span>
                        <div class="stat-value">${character.stress}</div>
                    </div>
                    <div style="display: flex; flex-direction: row; align-items: center; column-gap: 0.5em;">
                        <button id="custom-neg-btn" class="custom-roll-btn round-style">-1</button>
                        <input id="custom-roll-input" class="custom-roll-input round-style" type="number" value="${character.customRoll}">
                        <button id="custom-pos-btn" class="custom-roll-btn round-style">+1</button>
                        <button id="custom-roll-btn" class="custom-roll-btn round-style" style="min-width: 5em; justify-content: center;">Roll</button>
                    </div>
                </div>
            `;
    }

    public renderItems(character: Character) {
        const maxSlots = character.might + 5;
        const itemsUsed = character.items.length;
        const exceedsSlots = itemsUsed > maxSlots;

        let itemsHtml = character.items.map((item, idx) => `
            <div class="item-ability-entry" data-id="${item.id}" data-type="item">
                <div class="item-ability-header">
                    <input type="checkbox" class="item-checkbox" data-id="${item.id}" ${item.equipped ? 'checked' : ''} style="cursor: pointer;">
                    <span class="item-ability-name">${item.name}</span>
                    <span class="item-location">${item.location}</span>
                </div>
                <div class="item-ability-description" style="display: none;">
                    ${item.description}
                </div>
            </div>
        `).join('');

        const container = document.getElementById('items-abilities-container');
        if (!container) return;

        let itemsSection = document.getElementById('items-section');
        if (!itemsSection) {
            itemsSection = document.createElement('div');
            itemsSection.id = 'items-section';
            container.appendChild(itemsSection);
        }

        itemsSection.className = 'items-abilities-section';
        itemsSection.innerHTML = `
            <div style="margin-top: 1.5em;">
                <h3 style="margin: 0.5em 0; font-size: 1.2em;">Items <span style="font-size: 0.9em; font-weight: normal;">(${itemsUsed}/${maxSlots})</span></h3>
                <div style="display: flex; flex-direction: column; gap: 0.5em; ${exceedsSlots ? 'margin-bottom: 0.5em;' : ''}">
                    ${itemsHtml || '<div style="font-size: 0.9em; opacity: 0.6; padding: 0.5em;">No items</div>'}
                </div>
                ${exceedsSlots ? `<div style="color: #ff6b6b; font-style: italic; font-size: 0.9em; margin-bottom: 0.5em;">⚠️ Item slots exceeded</div>` : ''}
                <button class="new-item-btn round-style" style="width: 100%; padding: 0.5em; margin-top: 0.5em;">+ New Item</button>
            </div>
        `;
    }

    public renderAbilities(character: Character) {
        let abilitiesHtml = character.abilities.map((ability) => `
            <div class="item-ability-entry" data-id="${ability.id}" data-type="ability">
                <div class="item-ability-header">
                    <span class="item-ability-name">${ability.name}</span>
                </div>
                <div class="item-ability-description" style="display: none;">
                    ${ability.description}
                </div>
            </div>
        `).join('');

        const container = document.getElementById('items-abilities-container');
        if (!container) return;

        let abilitiesSection = document.getElementById('abilities-section');
        if (!abilitiesSection) {
            abilitiesSection = document.createElement('div');
            abilitiesSection.id = 'abilities-section';
            container.appendChild(abilitiesSection);
        }

        abilitiesSection.className = 'items-abilities-section';
        abilitiesSection.innerHTML = `
            <div style="margin-top: 1.5em;">
                <h3 style="margin: 0.5em 0; font-size: 1.2em;">Abilities</h3>
                <div style="display: flex; flex-direction: column; gap: 0.5em;">
                    ${abilitiesHtml || '<div style="font-size: 0.9em; opacity: 0.6; padding: 0.5em;">No abilities</div>'}
                </div>
                <button class="new-ability-btn round-style" style="width: 100%; padding: 0.5em; margin-top: 0.5em;">+ New Ability</button>
            </div>
        `;
    }

    public renderCardSection(character: Character) {
        const container = document.getElementById('card-section-container');
        if (!container) return;

        let cardSection = document.getElementById('card-section');
        if (!cardSection) {
            cardSection = document.createElement('div');
            cardSection.id = 'card-section';
            container.appendChild(cardSection);
        }

        cardSection.innerHTML = `
            <div style="margin-top: 1.5em;">
                <div style="display: flex; align-items: center; gap: 1em; margin-bottom: 1em;">
                    <button id="draw-cards-btn" class="round-style" style="padding: 0.5em 1em; flex: 1;">Draw Cards</button>
                    <label style="display: flex; align-items: center; gap: 0.5em; cursor: pointer;">
                        <input type="checkbox" id="unarmored-toggle" ${character.unarmored ? 'checked' : ''} style="cursor: pointer;">
                        <span>Unarmored</span>
                    </label>
                </div>
                <div id="card-result-box"></div>
            </div>
        `;
    }
}
