var CharacterView = /** @class */ (function () {
    function CharacterView() {
        // REMEMBER: Increment VERSION when making UI changes
        this.VERSION = '1.0.4';
        this.currentPage = 0;
        this.pages = ['Stats', 'Items', 'Abilities', 'Notes'];
    }
    CharacterView.prototype.render = function (character) {
        this.renderVersion();
        this.renderName(character.name);
        this.renderPageContainer();
        this.renderPage(character, this.currentPage);
        this.setupPageNavigation();
    };
    CharacterView.prototype.renderVersion = function () {
        var versionDiv = document.getElementById('version');
        if (versionDiv)
            versionDiv.textContent = "v".concat(this.VERSION);
    };
    CharacterView.prototype.renderName = function (name) {
        var nameDiv = document.getElementById('character-name');
        if (nameDiv)
            nameDiv.textContent = name;
    };
    CharacterView.prototype.renderPageContainer = function () {
        var _this = this;
        var container = document.getElementById('page-container');
        if (!container)
            return;
        container.innerHTML = "\n            <div style=\"display: flex; justify-content: center; gap: 0.5em; padding: 1em 0; flex-wrap: wrap; flex-shrink: 0; border-bottom: 1px solid #444; position: sticky; top: 0; z-index: 10; background: rgba(0, 0, 0, 0.5);\">\n                ".concat(this.pages.map(function (name, idx) { return "\n                    <button class=\"page-btn round-style\" data-page=\"".concat(idx, "\" style=\"padding: 0.5em 1em; ").concat(idx === _this.currentPage ? 'background: #4a9eff; font-weight: bold;' : '', "\">\n                        ").concat(name, "\n                    </button>\n                "); }).join(''), "\n            </div>\n            <div id=\"pages-wrapper\" style=\"display: flex; flex: 1; overflow: hidden; width: 100%; position: relative;\">\n                <div id=\"pages-content\" style=\"display: flex; width: 100%; height: 100%; transition: transform 0.3s ease-out; transform: translateX(0);\">\n                    ").concat(this.pages.map(function (_, idx) { return "<div id=\"page-".concat(idx, "\" style=\"flex: 0 0 100%; width: 100%; overflow-y: auto; overflow-x: hidden;\"></div>"); }).join(''), "\n                </div>\n            </div>\n        ");
    };
    CharacterView.prototype.renderPage = function (character, pageIdx) {
        var pageEl = document.getElementById("page-".concat(pageIdx));
        if (!pageEl)
            return;
        var content = '';
        switch (pageIdx) {
            case 0:
                content = this.renderStatsPage(character);
                break;
            case 1:
                content = this.renderItemsPage(character);
                break;
            case 2:
                content = this.renderAbilitiesPage(character);
                break;
            case 3:
                content = this.renderNotesPage(character);
                break;
        }
        pageEl.innerHTML = content;
    };
    CharacterView.prototype.renderStatsPage = function (character) {
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
        return "\n            <div style=\"display: flex; flex-direction: column; padding: 1em;\">\n                <div id=\"token-section\" style=\"max-width: 22em; margin: 0 auto; width: 100%;\">\n                    <div style=\"font-size:1.2em; margin-bottom:0.5em; display: flex; flex-direction: column; gap: 0.5em;\">\n                        <div style=\"display: flex; flex-direction: column; align-items: flex-start;\">\n                            <span id=\"blood-label\" style=\"padding-left: 0.5em; font-size: 1em;\">Blood (".concat(currentBlood, " / ").concat(maxBlood, ")</span>\n                            <div>").concat(blood, "</div>\n                        </div>\n                        <div style=\"display: flex; flex-direction: column; align-items: flex-start;\">\n                            <span id=\"stamina-label\" style=\"padding-left: 0.5em; font-size: 1em;\">Stamina (").concat(currentStamina, " / ").concat(maxStamina, ")</span>\n                            <div>").concat(stamina, "</div>\n                        </div>\n                    </div>\n                </div>\n                <div id=\"stat-section\" style=\"max-width: 22em; margin: 0 auto; width: 100%;\">\n                    <div style=\"font-size:1em; display: flex; flex-direction: column;\">\n                        <div class=\"stat-row\">\n                            <span id=\"melee-power-label\" class=\"stat-label round-style\" title=\"Melee Power\">Melee \u2694\uFE0F</span>\n                            <div class=\"stat-value\">").concat(character.meleePower, "</div>\n                            <span id=\"ranged-power-label\" class=\"stat-label round-style\" title=\"Ranged Power\">Ranged \uD83C\uDFF9</span>\n                            <div class=\"stat-value\">").concat(character.rangedPower, "</div>\n                        </div>\n                        <div class=\"stat-row\">\n                            <span id=\"might-label\" class=\"stat-label round-style\" title=\"Might\">Might \uD83D\uDCAA</span>\n                            <div class=\"stat-value\">").concat(character.might, "</div>\n                            <span id=\"awareness-label\" class=\"stat-label round-style\" title=\"Awareness\">Awareness \uD83D\uDC41\uFE0F</span>\n                            <div class=\"stat-value\">").concat(character.awareness, "</div>\n                        </div>\n                        <div class=\"stat-row\">\n                            <span id=\"resolve-label\" class=\"stat-label round-style\" title=\"Resolve\">Resolve \u270A</span>\n                            <div class=\"stat-value\">").concat(character.resolve, "</div>\n                            <span id=\"stress-label\" class=\"stat-label round-style\" title=\"Stress\">Stress \uD83D\uDCA6</span>\n                            <div class=\"stat-value\">").concat(character.stress, "</div>\n                        </div>\n                        <div style=\"display: flex; flex-direction: row; align-items: center; column-gap: 0.5em;\">\n                            <button id=\"custom-neg-btn\" class=\"custom-roll-btn round-style\">-1</button>\n                            <input id=\"custom-roll-input\" class=\"custom-roll-input round-style\" type=\"number\" value=\"").concat(character.customRoll, "\">\n                            <button id=\"custom-pos-btn\" class=\"custom-roll-btn round-style\">+1</button>\n                            <button id=\"custom-roll-btn\" class=\"custom-roll-btn round-style\" style=\"min-width: 5em; justify-content: center;\">Roll</button>\n                        </div>\n                    </div>\n                </div>\n                <div id=\"dice-results\" style=\"margin: 1em auto 0 auto; max-width: 22em;\"></div>\n                <div id=\"card-section-container\" style=\"max-width: 22em; margin: 0 auto; width: 100%;\"></div>\n            </div>\n        ");
    };
    CharacterView.prototype.renderItemsPage = function (character) {
        var maxSlots = character.might + 5;
        var itemsUsed = character.items.length;
        var exceedsSlots = itemsUsed > maxSlots;
        var itemsHtml = character.items.map(function (item, idx) { return "\n            <div class=\"item-ability-entry\" data-id=\"".concat(item.id, "\" data-type=\"item\">\n                <div class=\"item-ability-header\">\n                    <input type=\"checkbox\" class=\"item-checkbox\" data-id=\"").concat(item.id, "\" ").concat(item.equipped ? 'checked' : '', " style=\"cursor: pointer;\">\n                    <span class=\"item-ability-name\">").concat(item.name, "</span>\n                    <span class=\"item-location\">").concat(item.location, "</span>\n                </div>\n                <div class=\"item-ability-description\" style=\"display: none;\">\n                    ").concat(item.description, "\n                </div>\n            </div>\n        "); }).join('');
        return "\n            <div style=\"padding: 1em;\">\n                <div style=\"max-width: 22em; margin: 0 auto;\">\n                    <h3 style=\"margin: 0.5em 0; font-size: 1.2em;\">Items <span style=\"font-size: 0.9em; font-weight: normal;\">(".concat(itemsUsed, "/").concat(maxSlots, ")</span></h3>\n                    <div style=\"display: flex; flex-direction: column; gap: 0.5em; ").concat(exceedsSlots ? 'margin-bottom: 0.5em;' : '', "\">\n                        ").concat(itemsHtml || '<div style="font-size: 0.9em; opacity: 0.6; padding: 0.5em;">No items</div>', "\n                    </div>\n                    ").concat(exceedsSlots ? "<div style=\"color: #ff6b6b; font-style: italic; font-size: 0.9em; margin-bottom: 0.5em;\">\u26A0\uFE0F Item slots exceeded</div>" : '', "\n                    <button class=\"new-item-btn round-style\" style=\"width: 100%; padding: 0.5em; margin-top: 0.5em;\">+ New Item</button>\n                </div>\n            </div>\n        ");
    };
    CharacterView.prototype.renderAbilitiesPage = function (character) {
        var abilitiesHtml = character.abilities.map(function (ability) { return "\n            <div class=\"item-ability-entry\" data-id=\"".concat(ability.id, "\" data-type=\"ability\">\n                <div class=\"item-ability-header\">\n                    <span class=\"item-ability-name\">").concat(ability.name, "</span>\n                </div>\n                <div class=\"item-ability-description\" style=\"display: none;\">\n                    ").concat(ability.description, "\n                </div>\n            </div>\n        "); }).join('');
        return "\n            <div style=\"padding: 1em;\">\n                <div style=\"max-width: 22em; margin: 0 auto;\">\n                    <h3 style=\"margin: 0.5em 0; font-size: 1.2em;\">Abilities</h3>\n                    <div style=\"display: flex; flex-direction: column; gap: 0.5em;\">\n                        ".concat(abilitiesHtml || '<div style="font-size: 0.9em; opacity: 0.6; padding: 0.5em;">No abilities</div>', "\n                    </div>\n                    <button class=\"new-ability-btn round-style\" style=\"width: 100%; padding: 0.5em; margin-top: 0.5em;\">+ New Ability</button>\n                </div>\n            </div>\n        ");
    };
    CharacterView.prototype.renderNotesPage = function (character) {
        return "\n            <div style=\"padding: 1em; display: flex; flex-direction: column;\">\n                <div style=\"max-width: 22em; margin: 0 auto; width: 100%;\">\n                    <h3 style=\"margin: 0.5em 0; font-size: 1.2em;\">Campaign Notes</h3>\n                    <textarea id=\"notes-input\" style=\"\n                        width: 100%;\n                        flex: 1;\n                        min-height: 250px;\n                        padding: 0.75em;\n                        border: 1px solid #666;\n                        border-radius: 4px;\n                        background: rgba(0, 0, 0, 0.3);\n                        color: #fff;\n                        font-family: monospace;\n                        font-size: 0.9em;\n                        resize: none;\n                        box-sizing: border-box;\n                    \">".concat(character.notes, "</textarea>\n                    <button id=\"save-notes-btn\" class=\"round-style\" style=\"width: 100%; padding: 0.5em; margin-top: 0.5em;\">Save Notes</button>\n                </div>\n            </div>\n        ");
    };
    CharacterView.prototype.setupPageNavigation = function () {
        var _this = this;
        var pagesWrapper = document.getElementById('pages-wrapper');
        var pagesContent = document.getElementById('pages-content');
        var pageButtons = document.querySelectorAll('.page-btn');
        pageButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                var pageIdx = parseInt(e.target.getAttribute('data-page'));
                _this.goToPage(pageIdx, pagesContent);
            });
        });
        // Swipe detection
        var touchStartX = 0;
        var touchEndX = 0;
        pagesWrapper === null || pagesWrapper === void 0 ? void 0 : pagesWrapper.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        pagesWrapper === null || pagesWrapper === void 0 ? void 0 : pagesWrapper.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            _this.handleSwipe(touchStartX, touchEndX, pagesContent);
        }, false);
    };
    CharacterView.prototype.handleSwipe = function (startX, endX, pagesContent) {
        var threshold = 30;
        var diff = startX - endX;
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swiped left, go to next page
                if (this.currentPage < this.pages.length - 1) {
                    this.goToPage(this.currentPage + 1, pagesContent);
                }
            }
            else {
                // Swiped right, go to previous page
                if (this.currentPage > 0) {
                    this.goToPage(this.currentPage - 1, pagesContent);
                }
            }
        }
    };
    CharacterView.prototype.goToPage = function (pageIdx, pagesContent) {
        if (pageIdx < 0 || pageIdx >= this.pages.length)
            return;
        this.currentPage = pageIdx;
        var translateX = -pageIdx * 100;
        if (pagesContent) {
            pagesContent.style.transform = "translateX(".concat(translateX, "%)");
        }
        // Update button styles
        document.querySelectorAll('.page-btn').forEach(function (btn, idx) {
            var btnEl = btn;
            if (idx === pageIdx) {
                btnEl.style.background = '#4a9eff';
                btnEl.style.fontWeight = 'bold';
            }
            else {
                btnEl.style.background = '';
                btnEl.style.fontWeight = '';
            }
        });
    };
    // For controller to re-render a specific page
    CharacterView.prototype.renderCurrentPage = function (character) {
        this.renderPage(character, this.currentPage);
        this.setupPageNavigation();
    };
    return CharacterView;
}());
export { CharacterView };
