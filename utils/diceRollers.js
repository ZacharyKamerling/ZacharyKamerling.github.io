// DiceRoller class encapsulates dice logic and state
var DiceRoller = /** @class */ (function () {
    function DiceRoller(character, resultBox) {
        this.character = character;
        this.resultBox = resultBox;
        this.lastRolls = null;
        this.lastStat = null;
        this.lastLabel = null;
        this.lastStressDice = null;
    }
    DiceRoller.prototype.rollPMAR = function (stat, label, rerollIdx) {
        var _this = this;
        if (rerollIdx === void 0) { rerollIdx = null; }
        var dice = this.character[stat] || 0;
        if (dice < 1) {
            this.resultBox.innerHTML = "<div class=\"dice-result-label\">No dice to roll for ".concat(label, ".</div>");
            this.lastRolls = null;
            this.lastStat = null;
            this.lastLabel = null;
            return;
        }
        var rolls;
        if (this.lastRolls && this.lastStat === stat && this.lastLabel === label && rerollIdx !== null) {
            rolls = this.lastRolls.slice();
            rolls[rerollIdx] = Math.floor(Math.random() * 6) + 1;
        }
        else {
            rolls = [];
            for (var i = 0; i < dice; i++) {
                rolls.push(Math.floor(Math.random() * 6) + 1);
            }
        }
        this.lastRolls = rolls;
        this.lastStat = stat;
        this.lastLabel = label;
        var successes = rolls.filter(function (r) { return r >= 4; }).length;
        var diceHtml = rolls.map(function (roll, i) {
            return "<span class=\"dice-face".concat(roll >= 4 ? ' dice-success' : ' dice-fail', "\" data-idx=\"").concat(i, "\" style=\"cursor:pointer;\" title=\"Click to reroll\">").concat(roll, "</span>");
        }).join('');
        this.resultBox.innerHTML = "\n            <div class=\"dice-result-label\">".concat(label, " Roll</div>\n            <div class=\"dice-result-row\">").concat(diceHtml, "</div>\n            <div class=\"dice-result-summary\">").concat(successes, " Successes (4+)</div>\n        ");
        // Animate dice jitter
        var faces = this.resultBox.querySelectorAll('.dice-face');
        if (rerollIdx !== null) {
            var face = this.resultBox.querySelector(".dice-face[data-idx=\"".concat(rerollIdx, "\"]"));
            if (face) {
                face.classList.remove('jitter');
                void face.offsetWidth;
                face.classList.add('jitter');
            }
        }
        else {
            faces.forEach(function (face) {
                face.classList.remove('jitter');
                void face.offsetWidth;
                face.classList.add('jitter');
            });
        }
        // Add click/touch to reroll
        this.resultBox.querySelectorAll('.dice-face').forEach(function (face) {
            var reroll = function (e) {
                e.preventDefault();
                var idx = parseInt(face.getAttribute('data-idx') || '0');
                _this.rollPMAR(stat, label, idx);
            };
            face.addEventListener('click', reroll);
            face.addEventListener('touchstart', reroll);
        });
    };
    DiceRoller.prototype.rollStress = function (rerollIdx) {
        var _this = this;
        if (rerollIdx === void 0) { rerollIdx = null; }
        var stress = this.character.stress || 0;
        var resolve = this.character.resolve || 0;
        var diceArr;
        if (this.lastStressDice && rerollIdx !== null) {
            diceArr = this.lastStressDice.slice();
            diceArr[rerollIdx] = Math.floor(Math.random() * 6) + 1;
        }
        else {
            diceArr = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
        }
        this.lastStressDice = diceArr;
        var d1 = diceArr[0];
        var d2 = diceArr[1];
        var total = Math.max(0, Math.min(20, d1 + d2 + stress - resolve));
        var resultText = '';
        if (total <= 5) {
            resultText = 'Steady Nerves - No effect as you steel yourself and press on.';
        }
        else if (total <= 7) {
            resultText = 'Shaken - Ignore the next Positive card result you take.';
        }
        else if (total <= 9) {
            resultText = 'Jittery - Lose 1 Stamina Token.';
        }
        else if (total <= 11) {
            resultText = 'Hesitation - You can’t use abilities in your next round of combat.';
        }
        else if (total <= 13) {
            resultText = 'Lash Out - You bleed or wound an ally.';
        }
        else if (total <= 15) {
            resultText = 'Despair - You cannot reduce your Stress for 24 hours.';
        }
        else if (total <= 17) {
            resultText = 'Faint - Collapse. You can do nothing until one round passes.';
        }
        else if (total <= 19) {
            resultText = 'Heart Attack - Your heart stops and you collapse. You die in 2 rounds unless revived.';
        }
        else {
            resultText = 'Retirement - You’ve seen enough. Your adventuring days are done.';
        }
        this.resultBox.innerHTML = "\n            <div class=\"dice-result-label\">Stress Panic Roll</div>\n            <div class=\"dice-result-row\">\n                <span class=\"dice-face\" data-idx=\"0\" style=\"margin-right:0.5em; color:#fff; background:none; font-weight:bold; text-shadow:none; cursor:pointer;\" title=\"Click to reroll\">".concat(d1, "</span>\n                <span class=\"dice-face\" data-idx=\"1\" style=\"margin-right:0.5em; color:#fff; background:none; font-weight:bold; text-shadow:none; cursor:pointer;\" title=\"Click to reroll\">").concat(d2, "</span>\n                <span style=\"font-weight:bold;\">+ Stress (").concat(stress, ") - Resolve (").concat(resolve, ") = <span style=\"color:#ffb300;\">").concat(total, "</span></span>\n            </div>\n            <hr style=\"border:0;border-top:1.5px solid #666; margin:0.7em 0 0.7em 0; width:90%;\">\n            <div class=\"dice-result-summary\">").concat(resultText, "</div>\n        ");
        // Animate dice jitter
        var faces = this.resultBox.querySelectorAll('.dice-face');
        if (rerollIdx !== null) {
            var face = this.resultBox.querySelector(".dice-face[data-idx=\"".concat(rerollIdx, "\"]"));
            if (face) {
                face.classList.remove('jitter');
                void face.offsetWidth;
                face.classList.add('jitter');
            }
        }
        else {
            faces.forEach(function (face) {
                face.classList.remove('jitter');
                void face.offsetWidth;
                face.classList.add('jitter');
            });
        }
        // Add click/tap to reroll each die
        this.resultBox.querySelectorAll('.dice-face').forEach(function (face) {
            var reroll = function (e) {
                e.preventDefault();
                var idx = parseInt(face.getAttribute('data-idx') || '0');
                _this.rollStress(idx);
            };
            face.addEventListener('click', reroll);
            face.addEventListener('touchstart', reroll);
        });
    };
    return DiceRoller;
}());
export { DiceRoller };
