import { Character } from "../models/character.js";

export interface Card {
    id: string;
    type: 'positive' | 'negative';
    title: string;
    description: string;
}

const CARD_POOL: Card[] = [
    // NEGATIVE CARDS
    {
        id: 'neg-1',
        type: 'negative',
        title: 'Negative',
        description: '- Lose a <b>Blood Token</b><br><br>- Lose a <b>Blood Token</b>'
    },
    {
        id: 'neg-2',
        type: 'negative',
        title: 'Negative',
        description: '- Lose a <b>Stamina Token</b><br><br>- Lose a <b>Blood Token</b>'
    },
    {
        id: 'neg-3',
        type: 'negative',
        title: 'Negative',
        description: '- Lose a <b>Stamina Token</b><br><br>- Lose a <b>Stamina Token</b>'
    },
    {
        id: 'neg-4',
        type: 'negative',
        title: 'Negative',
        description: '- Lose a <b>Stamina Token</b><br><br>- You <b>Panic!</b> You gain <b>Stress</b><br><i>(Roll on the Panic table)</i>'
    },
    {
        id: 'neg-5',
        type: 'negative',
        title: 'Negative',
        description: '- Lose a <b>Stamina Token</b><br><br>- You are <b>Stunned</b><br><i>(Can\'t use abilities next round)</i>'
    },
    {
        id: 'neg-6',
        type: 'negative',
        title: 'Negative',
        description: '- Lose a <b>Stamina Token</b><br><br>- You have been <b>Dismembered</b><br><i>(Roll on the Dismember table)</i>'
    },
    {
        id: 'neg-7',
        type: 'negative',
        title: 'Negative',
        description: '- Lose a <b>Stamina Token</b><br><br>- You have been <b>Wounded</b><br><i>(Roll on the Wound table)</i>'
    },
    {
        id: 'neg-8',
        type: 'negative',
        title: 'Negative',
        description: '- You <b>Panic!</b> You gain <b>Stress</b><br><i>(Roll on the Panic table)</i><br><br>- Lose a <b>Blood Token</b>'
    },
    {
        id: 'neg-9',
        type: 'negative',
        title: 'Negative',
        description: '- You <b>Panic!</b> You gain <b>Stress</b><br><i>(Roll on the Panic table)</i><br><br>- You <b>Panic!</b> You gain <b>Stress</b><br><i>(Roll on the Panic table)</i>'
    },
    {
        id: 'neg-10',
        type: 'negative',
        title: 'Negative',
        description: '- You <b>Panic!</b> You gain <b>Stress</b><br><i>(Roll on the Panic table)</i><br><br>- You have been <b>Dismembered</b><br><i>(Roll on the Dismember table)</i>'
    },
    {
        id: 'neg-11',
        type: 'negative',
        title: 'Negative',
        description: '- You are <b>Stunned</b><br><i>(Can\'t use abilities next round)</i><br><br>- Lose a <b>Blood Token</b>'
    },
    {
        id: 'neg-12',
        type: 'negative',
        title: 'Negative',
        description: '- You are <b>Stunned</b><br><i>(Can\'t use abilities next round)</i><br><br>- You <b>Panic!</b> You gain <b>Stress</b><br><i>(Roll on the Panic table)</i>'
    },
    {
        id: 'neg-13',
        type: 'negative',
        title: 'Negative',
        description: '- You are <b>Stunned</b><br><i>(Can\'t use abilities next round)</i><br><br>- You are <b>Stunned</b><br><i>(Can\'t use abilities next round)</i><br><br><i>These stack</i>'
    },
    {
        id: 'neg-14',
        type: 'negative',
        title: 'Negative',
        description: '- You are <b>Stunned</b><br><i>(Can\'t use abilities next round)</i><br><br>- You have been <b>Dismembered</b><br><i>(Roll on the Dismember table)</i>'
    },
    {
        id: 'neg-15',
        type: 'negative',
        title: 'Negative',
        description: '- You are <b>Stunned</b><br><i>(Can\'t use abilities next round)</i><br><br>- You have been <b>Wounded</b><br><i>(Roll on the Wound table)</i>'
    },
    {
        id: 'neg-16',
        type: 'negative',
        title: 'Negative',
        description: '- You have been <b>Dismembered</b><br><i>(Roll on the Dismember table)</i><br><br>- Lose a <b>Blood Token</b>'
    },
    {
        id: 'neg-17',
        type: 'negative',
        title: 'Negative',
        description: '- You have been <b>Dismembered</b><br><i>(Roll on the Dismember table)</i><br><br>- You have been <b>Dismembered</b><br><i>(Roll on the Dismember table)</i>'
    },
    {
        id: 'neg-18',
        type: 'negative',
        title: 'Negative',
        description: '- You have been <b>Wounded</b><br><i>(Roll on the Wound table)</i><br><br>- Lose a <b>Blood Token</b>'
    },
    {
        id: 'neg-19',
        type: 'negative',
        title: 'Negative',
        description: '- You have been <b>Wounded</b><br><i>(Roll on the Wound table)</i><br><br>- You <b>Panic!</b> You gain <b>Stress</b><br><i>(Roll on the Panic table)</i>'
    },
    {
        id: 'neg-20',
        type: 'negative',
        title: 'Negative',
        description: '- You have been <b>Wounded</b><br><i>(Roll on the Wound table)</i><br><br>- You have been <b>Dismembered</b><br><i>(Roll on the Dismember table)</i>'
    },
    {
        id: 'neg-21',
        type: 'negative',
        title: 'Negative',
        description: '- You have been <b>Wounded</b><br><i>(Roll on the Wound table)</i><br><br>- You have been <b>Wounded</b><br><i>(Roll on the Wound table)</i>'
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
            return `
                <div class="card" style="
                    border: 2px solid ${borderColor};
                    border-radius: 8px;
                    padding: 1em;
                    margin: 0.5em 0;
                    background: rgba(0, 0, 0, 0.3);
                    flex: 1;
                    min-width: 200px;
                ">
                    <div style="font-weight: bold; margin-bottom: 0.5em;">${card.title}</div>
                    <div style="font-size: 0.95em; line-height: 1.4;">${card.description}</div>
                </div>
            `;
        }).join('');

        // Create a wrapper div for cards to isolate event listeners
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

        // Allow pointer events to pass through when needed
        this.resultBox.style.pointerEvents = 'auto';

        // Scroll to cards
        this.resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        this.attachDismissListener();
    }

    private attachDismissListener() {
        let holdTimer: number | null = null;
        let isHolding = false;
        let touchMoved = false;

        const startHold = (e: Event) => {
            // Only listen for events on the cards themselves or their descendants
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

        // Only attach to direct card children to avoid interfering with page scrolling
        const cards = this.resultBox.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('mousedown', startHold as EventListener);
            card.addEventListener('touchstart', startHold as EventListener);
        });

        this.resultBox.addEventListener('mouseup', endHold);
        this.resultBox.addEventListener('touchend', endHold);
        this.resultBox.addEventListener('mouseleave', endHold);

        // Only track touch moves on the cards to avoid interfering with page scrolling
        cards.forEach(card => {
            card.addEventListener('touchmove', handleMove);
        });
    }
}
