import { Character } from '../models/character.js';

export class CharacterView {
    render(character: Character) {
        this.renderName(character.name);
        this.renderTokens(character);
        this.renderStats(character);
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
                        <input id="custom-roll-input" class="custom-roll-input round-style" type="number" value="0">
                        <button id="custom-pos-btn" class="custom-roll-btn round-style">+1</button>
                        <button id="custom-roll-btn" class="custom-roll-btn round-style" style="min-width: 5em; justify-content: center;">Roll</button>
                    </div>
                </div>
            `;
    }
}
