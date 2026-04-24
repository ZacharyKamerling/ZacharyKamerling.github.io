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
var CardDrawer = /** @class */ (function () {
    function CardDrawer(character, resultBox) {
        this.onApplyEffects = null;
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
            var applyHint = card.type === 'negative'
                ? "<div class=\"card-apply-hint\" style=\"margin-top:0.7em;font-size:0.8em;color:#aaa;text-align:center;\">Tap to apply</div>"
                : '';
            return "\n                <div class=\"card\" data-card-id=\"".concat(card.id, "\" data-card-type=\"").concat(card.type, "\" style=\"\n                    border: 2px solid ").concat(borderColor, ";\n                    border-radius: 8px;\n                    padding: 1em;\n                    margin: 0.5em 0;\n                    background: rgba(0, 0, 0, 0.3);\n                    flex: 1;\n                    min-width: 200px;\n                    cursor: ").concat(card.type === 'negative' ? 'pointer' : 'default', ";\n                \">\n                    <div style=\"font-weight: bold; margin-bottom: 0.5em;\">").concat(card.title, "</div>\n                    <div style=\"font-size: 0.95em; line-height: 1.4;\">").concat(card.description, "</div>\n                    ").concat(applyHint, "\n                </div>\n            ");
        }).join('');
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
        this.resultBox.style.pointerEvents = 'auto';
        var drawButton = document.getElementById('draw-cards-btn');
        if (drawButton && drawButton.parentElement) {
            var page = drawButton.closest('[style*="overflow-y"]');
            if (page && page instanceof HTMLElement) {
                page.scrollTop = drawButton.offsetTop - 100;
            }
        }
        this.attachApplyListeners(cards);
        this.attachDismissListener();
    };
    CardDrawer.prototype.attachApplyListeners = function (cards) {
        var _this = this;
        cards.filter(function (c) { return c.type === 'negative'; }).forEach(function (card) {
            var cardEl = _this.resultBox.querySelector(".card[data-card-id=\"".concat(card.id, "\"]"));
            if (!cardEl || !card.effects)
                return;
            cardEl.addEventListener('click', function () {
                if (cardEl.classList.contains('applied'))
                    return;
                cardEl.classList.add('applied');
                cardEl.style.opacity = '0.5';
                var hint = cardEl.querySelector('.card-apply-hint');
                if (hint) {
                    hint.textContent = '✓ Applied';
                    hint.style.color = '#4ade80';
                }
                if (_this.onApplyEffects) {
                    _this.onApplyEffects(card.effects);
                }
            });
        });
    };
    CardDrawer.prototype.attachDismissListener = function () {
        var _this = this;
        var holdTimer = null;
        var isHolding = false;
        var touchMoved = false;
        var startHold = function (e) {
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
        var cards = this.resultBox.querySelectorAll('.card');
        cards.forEach(function (card) {
            card.addEventListener('mousedown', startHold);
            card.addEventListener('touchstart', startHold);
        });
        this.resultBox.addEventListener('mouseup', endHold);
        this.resultBox.addEventListener('touchend', endHold);
        this.resultBox.addEventListener('mouseleave', endHold);
        cards.forEach(function (card) {
            card.addEventListener('touchmove', handleMove);
        });
    };
    return CardDrawer;
}());
export { CardDrawer };
