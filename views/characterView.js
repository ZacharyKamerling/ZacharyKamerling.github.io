var CharacterView = /** @class */ (function () {
    function CharacterView() {
    }
    CharacterView.prototype.render = function (character) {
        this.renderName(character.name);
        this.renderTokens(character);
        this.renderStats(character);
    };
    CharacterView.prototype.renderName = function (name) {
        var nameDiv = document.getElementById('character-name');
        if (nameDiv)
            nameDiv.textContent = name;
    };
    // public for initial attachment, but internal for logic
    CharacterView.prototype.renderTokens = function (character) {
        var blood = '';
        var maxBlood = character.bloodMax || 1;
        var currentBlood = character.bloodTokens || 0;
        for (var i = 0; i < maxBlood; i++) {
            blood += "<button class=\"token-btn\" data-type=\"blood\" data-idx=\"".concat(i, "\" style=\"font-size:1.5em; margin:2px 2px;").concat(i < currentBlood ? '' : 'opacity:0.3;', "\">\uD83E\uDE78</button>");
        }
        var stamina = '';
        var maxStamina = character.staminaMax || 1;
        var currentStamina = character.staminaTokens || 0;
        for (var i = 0; i < maxStamina; i++) {
            stamina += "<button class=\"token-btn\" data-type=\"stamina\" data-idx=\"".concat(i, "\" style=\"font-size:1.5em; margin:2px 2px;").concat(i < currentStamina ? '' : 'opacity:0.3;', "\">\u26A1</button>");
        }
        var tokenSection = document.getElementById('token-section');
        if (!tokenSection)
            return;
        tokenSection.innerHTML = "\n                    <div style=\"font-size:1.2em; margin-bottom:0.5em; display: flex; flex-direction: column; gap: 0.5em;\">\n                        <div style=\"display: flex; flex-direction: column; align-items: flex-start;\">\n                            <span id=\"blood-label\" style=\"padding-left: 0.5em; font-size: 1em;\">Blood (".concat(currentBlood, " / ").concat(maxBlood, ")</span>\n                            <div>").concat(blood, "</div>\n                        </div>\n                        <div style=\"display: flex; flex-direction: column; align-items: flex-start;\">\n                            <span id=\"stamina-label\" style=\"padding-left: 0.5em; font-size: 1em;\">Stamina (").concat(currentStamina, " / ").concat(maxStamina, ")</span>\n                            <div>").concat(stamina, "</div>\n                        </div>\n                    </div>\n                ");
    };
    CharacterView.prototype.renderStats = function (character) {
        var statSection = document.getElementById('stat-section');
        if (!statSection)
            return;
        statSection.innerHTML = "\n                <div style=\"font-size:1em; display: flex; flex-direction: column;\">\n                    <div class=\"stat-row\">\n                        <span id=\"melee-power-label\" class=\"stat-label round-style\" title=\"Melee Power\">Melee \u2694\uFE0F</span>\n                        <div class=\"stat-value\">".concat(character.meleePower, "</div>\n                        <span id=\"ranged-power-label\" class=\"stat-label round-style\" title=\"Ranged Power\">Ranged \uD83C\uDFF9</span>\n                        <div class=\"stat-value\">").concat(character.rangedPower, "</div>\n                    </div>\n                    <div class=\"stat-row\">\n                        <span id=\"might-label\" class=\"stat-label round-style\" title=\"Might\">Might \uD83D\uDCAA</span>\n                        <div class=\"stat-value\">").concat(character.might, "</div>\n                        <span id=\"awareness-label\" class=\"stat-label round-style\" title=\"Awareness\">Awareness \uD83D\uDC41\uFE0F</span>\n                        <div class=\"stat-value\">").concat(character.awareness, "</div>\n                    </div>\n                    <div class=\"stat-row\"\">\n                        <span id=\"resolve-label\" class=\"stat-label round-style\" title=\"Resolve\">Resolve \u270A</span>\n                        <div class=\"stat-value\">").concat(character.resolve, "</div>\n                        <span id=\"stress-label\" class=\"stat-label round-style\" title=\"Stress\">Stress \uD83D\uDCA6</span>\n                        <div class=\"stat-value\">").concat(character.stress, "</div>\n                    </div>\n                    <div style=\"display: flex; flex-direction: row; align-items: center; column-gap: 0.5em;\">\n                        <button id=\"custom-neg-btn\" class=\"custom-roll-btn round-style\">-1</button>\n                        <input id=\"custom-roll-input\" class=\"custom-roll-input round-style\" type=\"number\" value=\"0\">\n                        <button id=\"custom-pos-btn\" class=\"custom-roll-btn round-style\">+1</button>\n                        <button id=\"custom-roll-btn\" class=\"custom-roll-btn round-style\" style=\"min-width: 5em; justify-content: center;\">Roll</button>\n                    </div>\n                </div>\n            ");
    };
    return CharacterView;
}());
export { CharacterView };
