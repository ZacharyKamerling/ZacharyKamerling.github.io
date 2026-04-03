var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var CARD_POOL = [
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
var CardDrawer = /** @class */ (function () {
    function CardDrawer(character, resultBox) {
        this.character = character;
        this.resultBox = resultBox;
        this.lastDrawnCards = null;
    }
    CardDrawer.prototype.drawCards = function () {
        var numCards = this.character.unarmored ? 3 : 2;
        var drawn = [];
        var shuffled = __spreadArray([], CARD_POOL, true).sort(function () { return Math.random() - 0.5; });
        for (var i = 0; i < numCards && i < shuffled.length; i++) {
            drawn.push(shuffled[i]);
        }
        this.lastDrawnCards = drawn;
        this.renderCards(drawn);
    };
    CardDrawer.prototype.renderCards = function (cards) {
        var cardsHtml = cards.map(function (card) {
            var borderColor = card.type === 'positive' ? '#3b82f6' : '#f59e0b';
            return "\n                <div class=\"card\" style=\"\n                    border: 2px solid ".concat(borderColor, ";\n                    border-radius: 8px;\n                    padding: 1em;\n                    margin: 0.5em 0;\n                    background: rgba(0, 0, 0, 0.3);\n                    flex: 1;\n                    min-width: 200px;\n                \">\n                    <div style=\"font-weight: bold; margin-bottom: 0.5em;\">").concat(card.title, "</div>\n                    <div style=\"font-size: 0.95em; line-height: 1.4;\">").concat(card.description, "</div>\n                </div>\n            ");
        }).join('');
        this.resultBox.innerHTML = "\n            <div style=\"display: flex; flex-direction: column; gap: 0.5em;\">\n                ".concat(cardsHtml, "\n            </div>\n            <div style=\"font-style: italic; color: #999; font-size: 0.85em; margin-top: 1em;\">\n                Press and hold to dismiss\n            </div>\n        ");
        this.attachDismissListener();
    };
    CardDrawer.prototype.attachDismissListener = function () {
        var _this = this;
        var holdTimer = null;
        var isHolding = false;
        var startHold = function () {
            isHolding = true;
            holdTimer = window.setTimeout(function () {
                if (isHolding) {
                    _this.resultBox.innerHTML = '';
                    _this.lastDrawnCards = null;
                }
            }, 500);
        };
        var endHold = function () {
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
    };
    return CardDrawer;
}());
export { CardDrawer };
