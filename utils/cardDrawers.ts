import { Character } from "../models/character.js";

export type CardEffect =
    | { type: 'blood_loss' }
    | { type: 'stamina_loss' }
    | { type: 'panic' }
    | { type: 'stunned' }
    | { type: 'wound' }
    | { type: 'dismemberment' };

export interface Card {
    id: string;
    type: 'positive' | 'negative';
    title: string;
    description: string;
    effects?: CardEffect[];
}

const CARD_POOL: Card[] = [
    // NEGATIVE CARDS
    {
        id: 'neg-1',
        type: 'negative',
        title: 'Negative',
        description: '- Lose a <b>Blood Token</b><br><br>- Lose a <b>Blood Token</b>',
        effects: [{ type: 'blood_loss' }, { type: 'blood_loss' }]
    },
    {
        id: 'neg-2',
        type: 'negative',
        title: 'Negative',
        description: '- Lose a <b>Stamina Token</b><br><br>- Lose a <b>Blood Token</b>',
        effects: [{ type: 'stamina_loss' }, { type: 'blood_loss' }]
    },
    {
        id: 'neg-3',
        type: 'negative',
        title: 'Negative',
        description: '- Lose a <b>Stamina Token</b><br><br>- Lose a <b>Stamina Token</b>',
        effects: [{ type: 'stamina_loss' }, { type: 'stamina_loss' }]
    },
    {
        id: 'neg-4',
        type: 'negative',
        title: 'Negative',
        description: '- Lose a <b>Stamina Token</b><br><br>- You <b>Panic!</b> You gain <b>Stress</b><br><i>(Roll on the Panic table)</i>',
        effects: [{ type: 'stamina_loss' }, { type: 'panic' }]
    },
    {
        id: 'neg-5',
        type: 'negative',
        title: 'Negative',
        description: '- Lose a <b>Stamina Token</b><br><br>- You are <b>Stunned</b><br><i>(Can\'t use abilities next round)</i>',
        effects: [{ type: 'stamina_loss' }, { type: 'stunned' }]
    },
    {
        id: 'neg-6',
        type: 'negative',
        title: 'Negative',
        description: '- Lose a <b>Stamina Token</b><br><br>- You have been <b>Dismembered</b><br><i>(Roll on the Dismember table)</i>',
        effects: [{ type: 'stamina_loss' }, { type: 'dismemberment' }]
    },
    {
        id: 'neg-7',
        type: 'negative',
        title: 'Negative',
        description: '- Lose a <b>Stamina Token</b><br><br>- You have been <b>Wounded</b><br><i>(Roll on the Wound table)</i>',
        effects: [{ type: 'stamina_loss' }, { type: 'wound' }]
    },
    {
        id: 'neg-8',
        type: 'negative',
        title: 'Negative',
        description: '- You <b>Panic!</b> You gain <b>Stress</b><br><i>(Roll on the Panic table)</i><br><br>- Lose a <b>Blood Token</b>',
        effects: [{ type: 'panic' }, { type: 'blood_loss' }]
    },
    {
        id: 'neg-9',
        type: 'negative',
        title: 'Negative',
        description: '- You <b>Panic!</b> You gain <b>Stress</b><br><i>(Roll on the Panic table)</i><br><br>- You <b>Panic!</b> You gain <b>Stress</b><br><i>(Roll on the Panic table)</i>',
        effects: [{ type: 'panic' }, { type: 'panic' }]
    },
    {
        id: 'neg-10',
        type: 'negative',
        title: 'Negative',
        description: '- You <b>Panic!</b> You gain <b>Stress</b><br><i>(Roll on the Panic table)</i><br><br>- You have been <b>Dismembered</b><br><i>(Roll on the Dismember table)</i>',
        effects: [{ type: 'panic' }, { type: 'dismemberment' }]
    },
    {
        id: 'neg-11',
        type: 'negative',
        title: 'Negative',
        description: '- You are <b>Stunned</b><br><i>(Can\'t use abilities next round)</i><br><br>- Lose a <b>Blood Token</b>',
        effects: [{ type: 'stunned' }, { type: 'blood_loss' }]
    },
    {
        id: 'neg-12',
        type: 'negative',
        title: 'Negative',
        description: '- You are <b>Stunned</b><br><i>(Can\'t use abilities next round)</i><br><br>- You <b>Panic!</b> You gain <b>Stress</b><br><i>(Roll on the Panic table)</i>',
        effects: [{ type: 'stunned' }, { type: 'panic' }]
    },
    {
        id: 'neg-13',
        type: 'negative',
        title: 'Negative',
        description: '- You are <b>Stunned</b><br><i>(Can\'t use abilities next round)</i><br><br>- You are <b>Stunned</b><br><i>(Can\'t use abilities next round)</i><br><br><i>These stack</i>',
        effects: [{ type: 'stunned' }, { type: 'stunned' }]
    },
    {
        id: 'neg-14',
        type: 'negative',
        title: 'Negative',
        description: '- You are <b>Stunned</b><br><i>(Can\'t use abilities next round)</i><br><br>- You have been <b>Dismembered</b><br><i>(Roll on the Dismember table)</i>',
        effects: [{ type: 'stunned' }, { type: 'dismemberment' }]
    },
    {
        id: 'neg-15',
        type: 'negative',
        title: 'Negative',
        description: '- You are <b>Stunned</b><br><i>(Can\'t use abilities next round)</i><br><br>- You have been <b>Wounded</b><br><i>(Roll on the Wound table)</i>',
        effects: [{ type: 'stunned' }, { type: 'wound' }]
    },
    {
        id: 'neg-16',
        type: 'negative',
        title: 'Negative',
        description: '- You have been <b>Dismembered</b><br><i>(Roll on the Dismember table)</i><br><br>- Lose a <b>Blood Token</b>',
        effects: [{ type: 'dismemberment' }, { type: 'blood_loss' }]
    },
    {
        id: 'neg-17',
        type: 'negative',
        title: 'Negative',
        description: '- You have been <b>Dismembered</b><br><i>(Roll on the Dismember table)</i><br><br>- You have been <b>Dismembered</b><br><i>(Roll on the Dismember table)</i>',
        effects: [{ type: 'dismemberment' }, { type: 'dismemberment' }]
    },
    {
        id: 'neg-18',
        type: 'negative',
        title: 'Negative',
        description: '- You have been <b>Wounded</b><br><i>(Roll on the Wound table)</i><br><br>- Lose a <b>Blood Token</b>',
        effects: [{ type: 'wound' }, { type: 'blood_loss' }]
    },
    {
        id: 'neg-19',
        type: 'negative',
        title: 'Negative',
        description: '- You have been <b>Wounded</b><br><i>(Roll on the Wound table)</i><br><br>- You <b>Panic!</b> You gain <b>Stress</b><br><i>(Roll on the Panic table)</i>',
        effects: [{ type: 'wound' }, { type: 'panic' }]
    },
    {
        id: 'neg-20',
        type: 'negative',
        title: 'Negative',
        description: '- You have been <b>Wounded</b><br><i>(Roll on the Wound table)</i><br><br>- You have been <b>Dismembered</b><br><i>(Roll on the Dismember table)</i>',
        effects: [{ type: 'wound' }, { type: 'dismemberment' }]
    },
    {
        id: 'neg-21',
        type: 'negative',
        title: 'Negative',
        description: '- You have been <b>Wounded</b><br><i>(Roll on the Wound table)</i><br><br>- You have been <b>Wounded</b><br><i>(Roll on the Wound table)</i>',
        effects: [{ type: 'wound' }, { type: 'wound' }]
    },
    // POSITIVE CARDS
    {
        id: 'pos-1',
        type: 'positive',
        title: 'Positive',
        description: '- You deliver a killing blow'
    },
    {
        id: 'pos-2',
        type: 'positive',
        title: 'Positive',
        description: '- You wound an enemy'
    },
    {
        id: 'pos-3',
        type: 'positive',
        title: 'Positive',
        description: '- You stun an enemy'
    },
    {
        id: 'pos-4',
        type: 'positive',
        title: 'Positive',
        description: '- You bleed an enemy'
    },
    {
        id: 'pos-5',
        type: 'positive',
        title: 'Positive',
        description: '- An enemies will falters'
    },
    {
        id: 'pos-6',
        type: 'positive',
        title: 'Positive',
        description: '- You gain a <b>Stamina Token</b>'
    },
    {
        id: 'pos-7',
        type: 'positive',
        title: 'Positive',
        description: '- Reduce your <b>Stress</b>'
    },
    {
        id: 'pos-8',
        type: 'positive',
        title: 'Positive',
        description: '- You wound an enemy<br><br>- You stun an enemy'
    },
    {
        id: 'pos-9',
        type: 'positive',
        title: 'Positive',
        description: '- You wound an enemy<br><br>- You bleed an enemy'
    },
    {
        id: 'pos-10',
        type: 'positive',
        title: 'Positive',
        description: '- You wound an enemy<br><br>- An enemies will falters'
    },
    {
        id: 'pos-11',
        type: 'positive',
        title: 'Positive',
        description: '- You wound an enemy<br><br>- You gain a <b>Stamina Token</b>'
    },
    {
        id: 'pos-12',
        type: 'positive',
        title: 'Positive',
        description: '- You wound an enemy<br><br>- Reduce your <b>Stress</b>'
    },
    {
        id: 'pos-13',
        type: 'positive',
        title: 'Positive',
        description: '- You stun an enemy<br><br>- You bleed an enemy'
    },
    {
        id: 'pos-14',
        type: 'positive',
        title: 'Positive',
        description: '- You stun an enemy<br><br>- An enemies will falters'
    },
    {
        id: 'pos-15',
        type: 'positive',
        title: 'Positive',
        description: '- You stun an enemy<br><br>- You gain a <b>Stamina Token</b>'
    },
    {
        id: 'pos-16',
        type: 'positive',
        title: 'Positive',
        description: '- You stun an enemy<br><br>- Reduce your <b>Stress</b>'
    },
    {
        id: 'pos-17',
        type: 'positive',
        title: 'Positive',
        description: '- You bleed an enemy<br><br>- An enemies will falters'
    },
    {
        id: 'pos-18',
        type: 'positive',
        title: 'Positive',
        description: '- You bleed an enemy<br><br>- You gain a <b>Stamina Token</b>'
    },
    {
        id: 'pos-19',
        type: 'positive',
        title: 'Positive',
        description: '- You bleed an enemy<br><br>- Reduce your <b>Stress</b>'
    },
    {
        id: 'pos-20',
        type: 'positive',
        title: 'Positive',
        description: '- An enemies will falters<br><br>- You gain a <b>Stamina Token</b>'
    },
    {
        id: 'pos-21',
        type: 'positive',
        title: 'Positive',
        description: '- An enemies will falters<br><br>- Reduce your <b>Stress</b>'
    },
    {
        id: 'pos-22',
        type: 'positive',
        title: 'Positive',
        description: '- You gain a <b>Stamina Token</b><br><br>- Reduce your <b>Stress</b>'
    }
];

export class CardDrawer {
    character: Character;
    resultBox: HTMLElement;
    lastDrawnCards: Card[] | null;
    onApplyEffects: ((effects: CardEffect[]) => void) | null = null;

    constructor(character: Character, resultBox: HTMLElement) {
        this.character = character;
        this.resultBox = resultBox;
        this.lastDrawnCards = null;
    }

    drawCards() {
        const numCards = this.character.unarmored ? 3 : 2;
        const drawn: Card[] = [];
        const shuffled = [...CARD_POOL].sort(() => Math.random() - 0.5);

        for (let i = 0; i < numCards && i < shuffled.length; i++) {
            drawn.push(shuffled[i]);
        }

        this.lastDrawnCards = drawn;
        this.renderCards(drawn);
    }

    private renderCards(cards: Card[]) {
        const cardsHtml = cards.map(card => {
            const borderColor = card.type === 'positive' ? '#3b82f6' : '#f59e0b';
            const applyHint = card.type === 'negative'
                ? `<div class="card-apply-hint" style="margin-top:0.7em;font-size:0.8em;color:#aaa;text-align:center;">Tap to apply</div>`
                : '';
            return `
                <div class="card" data-card-id="${card.id}" data-card-type="${card.type}" style="
                    border: 2px solid ${borderColor};
                    border-radius: 8px;
                    padding: 1em;
                    margin: 0.5em 0;
                    background: rgba(0, 0, 0, 0.3);
                    flex: 1;
                    min-width: 200px;
                    cursor: ${card.type === 'negative' ? 'pointer' : 'default'};
                ">
                    <div style="font-weight: bold; margin-bottom: 0.5em;">${card.title}</div>
                    <div style="font-size: 0.95em; line-height: 1.4;">${card.description}</div>
                    ${applyHint}
                </div>
            `;
        }).join('');

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '0.5em';
        wrapper.innerHTML = cardsHtml;

        const dismissText = document.createElement('div');
        dismissText.style.fontStyle = 'italic';
        dismissText.style.color = '#999';
        dismissText.style.fontSize = '0.85em';
        dismissText.style.marginTop = '1em';
        dismissText.textContent = 'Press and hold to dismiss';

        this.resultBox.innerHTML = '';
        this.resultBox.appendChild(wrapper);
        this.resultBox.appendChild(dismissText);
        this.resultBox.style.pointerEvents = 'auto';

        const drawButton = document.getElementById('draw-cards-btn');
        if (drawButton && drawButton.parentElement) {
            const page = drawButton.closest('[style*="overflow-y"]');
            if (page && page instanceof HTMLElement) {
                page.scrollTop = drawButton.offsetTop - 100;
            }
        }

        this.attachApplyListeners(cards);
        this.attachDismissListener();
    }

    private attachApplyListeners(cards: Card[]) {
        cards.filter(c => c.type === 'negative').forEach(card => {
            const cardEl = this.resultBox.querySelector(`.card[data-card-id="${card.id}"]`) as HTMLElement | null;
            if (!cardEl || !card.effects) return;

            cardEl.addEventListener('click', () => {
                if (cardEl.classList.contains('applied')) return;
                cardEl.classList.add('applied');
                cardEl.style.opacity = '0.5';
                const hint = cardEl.querySelector('.card-apply-hint') as HTMLElement | null;
                if (hint) {
                    hint.textContent = '✓ Applied';
                    hint.style.color = '#4ade80';
                }
                if (this.onApplyEffects) {
                    this.onApplyEffects(card.effects!);
                }
            });
        });
    }

    private attachDismissListener() {
        let holdTimer: number | null = null;
        let isHolding = false;
        let touchMoved = false;

        const startHold = (e: Event) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.card') && e.target !== this.resultBox) {
                return;
            }

            touchMoved = false;
            isHolding = true;
            holdTimer = window.setTimeout(() => {
                if (isHolding && !touchMoved) {
                    this.resultBox.innerHTML = '';
                    this.resultBox.style.pointerEvents = 'none';
                    this.lastDrawnCards = null;
                }
            }, 500);
        };

        const endHold = () => {
            isHolding = false;
            if (holdTimer !== null) {
                clearTimeout(holdTimer);
                holdTimer = null;
            }
        };

        const handleMove = () => {
            touchMoved = true;
            endHold();
        };

        const cards = this.resultBox.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('mousedown', startHold as EventListener);
            card.addEventListener('touchstart', startHold as EventListener);
        });

        this.resultBox.addEventListener('mouseup', endHold);
        this.resultBox.addEventListener('touchend', endHold);
        this.resultBox.addEventListener('mouseleave', endHold);

        cards.forEach(card => {
            card.addEventListener('touchmove', handleMove);
        });
    }
}
