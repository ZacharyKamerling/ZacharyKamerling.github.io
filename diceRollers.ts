import { Character } from "./Character.js";

// DiceRoller class encapsulates dice logic and state
export class DiceRoller {
    character: Character;
    resultBox: HTMLElement;
    lastRolls: number[] | null;
    lastStat: string | null;
    lastLabel: string | null;
    lastStressDice: number[] | null;
    
    constructor(character: Character, resultBox: HTMLElement) {
        this.character = character;
        this.resultBox = resultBox;
        this.lastRolls = null;
        this.lastStat = null;
        this.lastLabel = null;
        this.lastStressDice = null;
    }

    rollPMAR(stat: string, label: string, rerollIdx: number | null = null) {
        const dice = this.character[stat] || 0;
        if (dice < 1) {
            this.resultBox.innerHTML = `<div class="dice-result-label">No dice to roll for ${label}.</div>`;
            this.lastRolls = null;
            this.lastStat = null;
            this.lastLabel = null;
            return;
        }
        let rolls;
        if (this.lastRolls && this.lastStat === stat && this.lastLabel === label && rerollIdx !== null) {
            rolls = this.lastRolls.slice();
            rolls[rerollIdx] = Math.floor(Math.random() * 6) + 1;
        } else {
            rolls = [];
            for (let i = 0; i < dice; i++) {
                rolls.push(Math.floor(Math.random() * 6) + 1);
            }
        }
        this.lastRolls = rolls;
        this.lastStat = stat;
        this.lastLabel = label;
        let successes = rolls.filter(r => r >= 4).length;
        const diceHtml = rolls.map((roll, i) =>
            `<span class="dice-face${roll >= 4 ? ' dice-success' : ' dice-fail'}" data-idx="${i}" style="cursor:pointer;" title="Click to reroll">${roll}</span>`
        ).join('');
        this.resultBox.innerHTML = `
            <div class="dice-result-label">${label} Roll</div>
            <div class="dice-result-row">${diceHtml}</div>
            <div class="dice-result-summary">${successes} Successes (4+)</div>
        `;
        // Animate dice jitter
        const faces = this.resultBox.querySelectorAll('.dice-face');
        if (rerollIdx !== null) {
            const face = this.resultBox.querySelector(`.dice-face[data-idx="${rerollIdx}"]`);
            if (face) {
                face.classList.remove('jitter');
                void (face as HTMLElement).offsetWidth;
                face.classList.add('jitter');
            }
        } else {
            faces.forEach(face => {
                face.classList.remove('jitter');
                void (face as HTMLElement).offsetWidth;
                face.classList.add('jitter');
            });
        }
        // Add click/touch to reroll
        this.resultBox.querySelectorAll('.dice-face').forEach(face => {
            const reroll = (e: Event) => {
                e.preventDefault();
                const idx = parseInt(face.getAttribute('data-idx') || '0');
                this.rollPMAR(stat, label, idx);
            };
            face.addEventListener('click', reroll);
            face.addEventListener('touchstart', reroll);
        });
    }

    rollStress(rerollIdx: number | null = null) {
        const stress = this.character.stress || 0;
        const resolve = this.character.resolve || 0;
        let diceArr;
        if (this.lastStressDice && rerollIdx !== null) {
            diceArr = this.lastStressDice.slice();
            diceArr[rerollIdx] = Math.floor(Math.random() * 6) + 1;
        } else {
            diceArr = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
        }
        this.lastStressDice = diceArr;
        const d1 = diceArr[0];
        const d2 = diceArr[1];
        const total = Math.max(0, Math.min(20, d1 + d2 + stress - resolve));
        let resultText = '';
        if (total <= 5) {
            resultText = 'Steady Nerves - No effect as you steel yourself and press on.';
        } else if (total <= 7) {
            resultText = 'Shaken - Ignore the next Positive card result you take.';
        } else if (total <= 9) {
            resultText = 'Jittery - Lose 1 Stamina Token.';
        } else if (total <= 11) {
            resultText = 'Hesitation - You can’t use abilities in your next round of combat.';
        } else if (total <= 13) {
            resultText = 'Lash Out - You bleed or wound an ally.';
        } else if (total <= 15) {
            resultText = 'Despair - You cannot reduce your Stress for 24 hours.';
        } else if (total <= 17) {
            resultText = 'Faint - Collapse. You can do nothing until one round passes.';
        } else if (total <= 19) {
            resultText = 'Heart Attack - Your heart stops and you collapse. You die in 2 rounds unless revived.';
        } else {
            resultText = 'Retirement - You’ve seen enough. Your adventuring days are done.';
        }
        this.resultBox.innerHTML = `
            <div class="dice-result-label">Stress Panic Roll</div>
            <div class="dice-result-row">
                <span class="dice-face" data-idx="0" style="margin-right:0.5em; color:#fff; background:none; font-weight:bold; text-shadow:none; cursor:pointer;" title="Click to reroll">${d1}</span>
                <span class="dice-face" data-idx="1" style="margin-right:0.5em; color:#fff; background:none; font-weight:bold; text-shadow:none; cursor:pointer;" title="Click to reroll">${d2}</span>
                <span style="font-weight:bold;">+ Stress (${stress}) - Resolve (${resolve}) = <span style="color:#ffb300;">${total}</span></span>
            </div>
            <hr style="border:0;border-top:1.5px solid #666; margin:0.7em 0 0.7em 0; width:90%;">
            <div class="dice-result-summary">${resultText}</div>
        `;
        // Animate dice jitter
        const faces = this.resultBox.querySelectorAll('.dice-face');
        if (rerollIdx !== null) {
            const face = this.resultBox.querySelector(`.dice-face[data-idx="${rerollIdx}"]`);
            if (face) {
                face.classList.remove('jitter');
                void (face as HTMLElement).offsetWidth;
                face.classList.add('jitter');
            }
        } else {
            faces.forEach(face => {
                face.classList.remove('jitter');
                void (face as HTMLElement).offsetWidth;
                face.classList.add('jitter');
            });
        }
        // Add click/tap to reroll each die
        this.resultBox.querySelectorAll('.dice-face').forEach(face => {
            const reroll = (e: Event) => {
                e.preventDefault();
                const idx = parseInt(face.getAttribute('data-idx') || '0');
                this.rollStress(idx);
            };
            face.addEventListener('click', reroll);
            face.addEventListener('touchstart', reroll);
        });
    }
}
