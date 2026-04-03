import { Character } from "../models/character.js";

export interface Card {
    id: string;
    type: 'positive' | 'negative';
    title: string;
    description: string;
}

const CARD_POOL: Card[] = [
    {
        id: 'pos-1',
        type: 'positive',
        title: 'Positive',
        description: 'You find yourself in a position of advantage. Make an aggressive move.'
    },
    {
        id: 'pos-2',
        type: 'positive',
        title: 'Positive',
        description: 'The situation breaks in your favor. You gain momentum.'
    },
    {
        id: 'pos-3',
        type: 'positive',
        title: 'Positive',
        description: 'An unexpected ally appears to aid you in your struggle.'
    },
    {
        id: 'pos-4',
        type: 'positive',
        title: 'Positive',
        description: 'Fortune smiles upon you. Press your advantage immediately.'
    },
    {
        id: 'pos-5',
        type: 'positive',
        title: 'Positive',
        description: 'You spot an opening. Act swiftly and decisively.'
    },
    {
        id: 'neg-1',
        type: 'negative',
        title: 'Negative',
        description: 'Things take a turn for the worse. You are forced to react defensively.'
    },
    {
        id: 'neg-2',
        type: 'negative',
        title: 'Negative',
        description: 'Complications arise unexpectedly. Your plans are disrupted.'
    },
    {
        id: 'neg-3',
        type: 'negative',
        title: 'Negative',
        description: 'An adversary gains the upper hand. You must adapt or fall.'
    },
    {
        id: 'neg-4',
        type: 'negative',
        title: 'Negative',
        description: 'Bad luck strikes. You suffer a setback.'
    },
    {
        id: 'neg-5',
        type: 'negative',
        title: 'Negative',
        description: 'The situation spirals out of control. You must salvage what you can.'
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

        this.resultBox.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 0.5em;">
                ${cardsHtml}
            </div>
            <div style="font-style: italic; color: #999; font-size: 0.85em; margin-top: 1em;">
                Press and hold to dismiss
            </div>
        `;

        this.attachDismissListener();
    }

    private attachDismissListener() {
        let holdTimer: number | null = null;
        let isHolding = false;

        const startHold = () => {
            isHolding = true;
            holdTimer = window.setTimeout(() => {
                if (isHolding) {
                    this.resultBox.innerHTML = '';
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

        this.resultBox.addEventListener('mousedown', startHold);
        this.resultBox.addEventListener('touchstart', startHold);
        this.resultBox.addEventListener('mouseup', endHold);
        this.resultBox.addEventListener('touchend', endHold);
        this.resultBox.addEventListener('mouseleave', endHold);
    }
}
