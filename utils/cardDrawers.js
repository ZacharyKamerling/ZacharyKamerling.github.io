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
        // Create a wrapper div for cards to isolate event listeners
        var wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '0.5em';
        wrapper.innerHTML = cardsHtml;
        var dismissText = document.createElement('div');
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
        this.attachDismissListener();
    };
    CardDrawer.prototype.attachDismissListener = function () {
        var _this = this;
        var holdTimer = null;
        var isHolding = false;
        var touchMoved = false;
        var startHold = function (e) {
            // Only listen for events on the cards themselves or their descendants
            var target = e.target;
            if (!target.closest('.card') && e.target !== _this.resultBox) {
                return;
            }
            touchMoved = false;
            isHolding = true;
            holdTimer = window.setTimeout(function () {
                if (isHolding && !touchMoved) {
                    _this.resultBox.innerHTML = '';
                    _this.resultBox.style.pointerEvents = 'none';
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
        var handleMove = function () {
            touchMoved = true;
            endHold();
        };
        // Only attach to direct card children to avoid interfering with page scrolling
        var cards = this.resultBox.querySelectorAll('.card');
        cards.forEach(function (card) {
            card.addEventListener('mousedown', startHold);
            card.addEventListener('touchstart', startHold);
        });
        this.resultBox.addEventListener('mouseup', endHold);
        this.resultBox.addEventListener('touchend', endHold);
        this.resultBox.addEventListener('mouseleave', endHold);
        // Only track touch moves on the cards to avoid interfering with page scrolling
        cards.forEach(function (card) {
            card.addEventListener('touchmove', handleMove);
        });
    };
    return CardDrawer;
}());
export { CardDrawer };
