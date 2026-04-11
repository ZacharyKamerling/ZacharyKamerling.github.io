var CharacterView = /** @class */ (function () {
    function CharacterView() {
        // REMEMBER: Increment VERSION when making UI changes
        this.VERSION = '1.0.32';
        this.currentPage = 0;
        this.pages = ['Stats', 'Items', 'Abilities', 'Notes'];
        this.TAB_HEIGHT = '70px'; // Approximate height of tab bar
    }
    CharacterView.prototype.render = function (character) {
        this.renderVersion();
        this.renderName(character.name);
        this.renderPageContainer();
        // Render all pages
        for (var i = 0; i < this.pages.length; i++) {
            this.renderPage(character, i);
        }
        // Always setup navigation after renderPageContainer since DOM is recreated
        this.setupPageNavigation();
        // Navigate to current page
        var pagesContent = document.getElementById('pages-content');
        if (pagesContent) {
            var translateX = -this.currentPage * 100;
            pagesContent.style.transform = "translateX(".concat(translateX, "%)");
        }
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
        // Render tabs in the header
        var tabsBar = document.getElementById('tabs-bar');
        if (tabsBar) {
            tabsBar.innerHTML = this.pages.map(function (name, idx) { return "\n                <button class=\"page-btn round-style\" data-page=\"".concat(idx, "\" style=\"padding: 0.4em 0.8em; font-size: 0.9em; ").concat(idx === _this.currentPage ? 'background: #4a9eff; font-weight: bold;' : '', "\">\n                    ").concat(name, "\n                </button>\n            "); }).join('');
        }
        container.innerHTML = "\n            <div id=\"pages-wrapper\" style=\"display: flex; flex: 1; overflow: hidden; width: 100%; min-height: 0;\">\n                <div id=\"pages-content\" style=\"display: flex; width: 100%; height: 100%; transition: transform 0.3s ease-out; transform: translateX(0);\">\n                    ".concat(this.pages.map(function (_, idx) { return "<div id=\"page-".concat(idx, "\" style=\"flex: 0 0 100%; width: 100%; height: 100%; overflow-y: auto; overflow-x: hidden; touch-action: manipulation;\"></div>"); }).join(''), "\n                </div>\n            </div>\n        ");
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
        return "\n            <div style=\"display: flex; flex-direction: column; gap: 1em; padding: 1em; max-width: 24em; margin: 0 auto; width: 100%;\">\n                <div id=\"token-section\" style=\"width: 100%;\">\n                    <div style=\"font-size:1.2em; margin-bottom:0.5em; display: flex; flex-direction: column; gap: 0.5em;\">\n                        <div style=\"display: flex; flex-direction: column; align-items: flex-start;\">\n                            <span id=\"blood-label\" style=\"padding-left: 0.5em; font-size: 1em;\">Blood (".concat(currentBlood, " / ").concat(maxBlood, ")</span>\n                            <div>").concat(blood, "</div>\n                        </div>\n                        <div style=\"display: flex; flex-direction: column; align-items: flex-start;\">\n                            <span id=\"stamina-label\" style=\"padding-left: 0.5em; font-size: 1em;\">Stamina (").concat(currentStamina, " / ").concat(maxStamina, ")</span>\n                            <div>").concat(stamina, "</div>\n                        </div>\n                    </div>\n                </div>\n                <div id=\"stat-section\" style=\"width: 100%;\">\n                    <div style=\"font-size:1em; display: flex; flex-direction: column;\">\n                        <div class=\"stat-row\">\n                            <span id=\"melee-power-label\" class=\"stat-label round-style\" title=\"Melee Power\">Melee \u2694\uFE0F</span>\n                            <div class=\"stat-value\">").concat(character.meleePower, "</div>\n                            <span id=\"ranged-power-label\" class=\"stat-label round-style\" title=\"Ranged Power\">Ranged \uD83C\uDFF9</span>\n                            <div class=\"stat-value\">").concat(character.rangedPower, "</div>\n                        </div>\n                        <div class=\"stat-row\">\n                            <span id=\"might-label\" class=\"stat-label round-style\" title=\"Might\">Might \uD83D\uDCAA</span>\n                            <div class=\"stat-value\">").concat(character.might, "</div>\n                            <span id=\"awareness-label\" class=\"stat-label round-style\" title=\"Awareness\">Awareness \uD83D\uDC41\uFE0F</span>\n                            <div class=\"stat-value\">").concat(character.awareness, "</div>\n                        </div>\n                        <div class=\"stat-row\">\n                            <span id=\"resolve-label\" class=\"stat-label round-style\" title=\"Resolve\">Resolve \u270A</span>\n                            <div class=\"stat-value\">").concat(character.resolve, "</div>\n                            <span id=\"stress-label\" class=\"stat-label round-style\" title=\"Stress\">Stress \uD83D\uDCA6</span>\n                            <div class=\"stat-value\">").concat(character.stress, "</div>\n                        </div>\n                        <div style=\"display: flex; flex-direction: row; align-items: center; column-gap: 0.5em;\">\n                            <button id=\"custom-neg-btn\" class=\"custom-roll-btn round-style\">-1</button>\n                            <input id=\"custom-roll-input\" class=\"custom-roll-input round-style\" type=\"number\" value=\"").concat(character.customRoll, "\">\n                            <button id=\"custom-pos-btn\" class=\"custom-roll-btn round-style\">+1</button>\n                            <button id=\"custom-roll-btn\" class=\"custom-roll-btn round-style\" style=\"min-width: 5em; justify-content: center;\">Roll</button>\n                        </div>\n                    </div>\n                </div>\n                <div id=\"dice-results\" style=\"width: 100%;\"></div>\n                <div id=\"card-section-container\" style=\"width: 100%;\">\n                    <div style=\"margin-top: 1.5em;\">\n                        <div style=\"display: flex; align-items: center; gap: 1em; margin-bottom: 1em;\">\n                            <button id=\"draw-cards-btn\" class=\"round-style\" style=\"padding: 0.5em 1em; flex: 1;\">Draw Cards</button>\n                            <label style=\"display: flex; align-items: center; gap: 0.5em; cursor: pointer;\">\n                                <input type=\"checkbox\" id=\"unarmored-toggle\" ").concat(character.unarmored ? 'checked' : '', " style=\"cursor: pointer;\">\n                                <span>Unarmored</span>\n                            </label>\n                        </div>\n                        <div id=\"card-result-box\"></div>\n                    </div>\n                </div>\n            </div>\n        ");
    };
    CharacterView.prototype.renderItemsPage = function (character) {
        var maxSlots = character.might + 5;
        var itemsUsed = character.items.length;
        var exceedsSlots = itemsUsed > maxSlots;
        var itemsHtml = character.items.map(function (item, idx) { return "\n            <div class=\"item-ability-entry\" data-id=\"".concat(item.id, "\" data-type=\"item\">\n                <div class=\"item-ability-header\">\n                    <input type=\"checkbox\" class=\"item-checkbox\" data-id=\"").concat(item.id, "\" ").concat(item.equipped ? 'checked' : '', " style=\"cursor: pointer;\">\n                    <span class=\"item-ability-name\">").concat(item.name, "</span>\n                    <span class=\"item-location\">").concat(item.location, "</span>\n                </div>\n                <div class=\"item-ability-description\" style=\"display: none;\">\n                    ").concat(item.description, "\n                </div>\n            </div>\n        "); }).join('');
        return "\n            <div style=\"padding: 1em; max-width: 24em; margin: 0 auto; width: 100%;\">\n                <h3 style=\"margin: 0.5em 0; font-size: 1.2em;\">Items <span style=\"font-size: 0.9em; font-weight: normal;\">(".concat(itemsUsed, "/").concat(maxSlots, ")</span></h3>\n                <div style=\"display: flex; flex-direction: column; gap: 0.5em; ").concat(exceedsSlots ? 'margin-bottom: 0.5em;' : '', "\">\n                    ").concat(itemsHtml || '<div style="font-size: 0.9em; opacity: 0.6; padding: 0.5em;">No items</div>', "\n                </div>\n                ").concat(exceedsSlots ? "<div style=\"color: #ff6b6b; font-style: italic; font-size: 0.9em; margin-bottom: 0.5em;\">\u26A0\uFE0F Item slots exceeded</div>" : '', "\n                <div style=\"margin-top: 0.5em; display: flex; flex-direction: column; gap: 0.4em;\">\n                    <select id=\"item-template-select\" class=\"round-style\" style=\"width: 100%; padding: 0.5em;\">\n                        <option value=\"\">Custom Item</option>\n                        <option value=\"melee_power\">\u2694\uFE0F  Melee Power Bonus  ($$melee_power:1)</option>\n                        <option value=\"ranged_power\">\uD83C\uDFF9  Ranged Power Bonus  ($$ranged_power:1)</option>\n                        <option value=\"might\">\uD83D\uDCAA  Might Bonus  ($$might:1)</option>\n                        <option value=\"awareness\">\uD83D\uDC41\uFE0F  Awareness Bonus  ($$awareness:1)</option>\n                        <option value=\"resolve\">\u270A  Resolve Bonus  ($$resolve:1)</option>\n                        <option value=\"stress\">\uD83D\uDCA6  Stress Modifier  ($$stress:1)</option>\n                        <option value=\"blood_max\">\uD83E\uDE78  Blood Max Bonus  ($$blood_max:1)</option>\n                        <option value=\"stamina_max\">\u26A1  Stamina Max Bonus  ($$stamina_max:1)</option>\n                    </select>\n                    <button class=\"new-item-btn round-style\" style=\"width: 100%; padding: 0.5em;\">+ Add Item</button>\n                </div>\n            </div>\n        ");
    };
    CharacterView.prototype.renderAbilitiesPage = function (character) {
        var abilitiesHtml = character.abilities.map(function (ability) { return "\n            <div class=\"item-ability-entry\" data-id=\"".concat(ability.id, "\" data-type=\"ability\">\n                <div class=\"item-ability-header\">\n                    <span class=\"item-ability-name\">").concat(ability.name, "</span>\n                </div>\n                <div class=\"item-ability-description\" style=\"display: none;\">\n                    ").concat(ability.description, "\n                </div>\n            </div>\n        "); }).join('');
        return "\n            <div style=\"padding: 1em; max-width: 24em; margin: 0 auto; width: 100%;\">\n                <h3 style=\"margin: 0.5em 0; font-size: 1.2em;\">Abilities</h3>\n                <div style=\"display: flex; flex-direction: column; gap: 0.5em;\">\n                    ".concat(abilitiesHtml || '<div style="font-size: 0.9em; opacity: 0.6; padding: 0.5em;">No abilities</div>', "\n                </div>\n                <button class=\"new-ability-btn round-style\" style=\"width: 100%; padding: 0.5em; margin-top: 0.5em;\">+ New Ability</button>\n            </div>\n        ");
    };
    CharacterView.prototype.renderNotesPage = function (character) {
        return "\n            <div style=\"padding: 1em; max-width: 24em; margin: 0 auto; width: 100%; box-sizing: border-box;\">\n                <h3 style=\"margin: 0 0 0.5em 0; font-size: 1.2em;\">Campaign Notes</h3>\n                <div style=\"display: flex; flex-direction: column; height: 75vh;\">\n                    <textarea id=\"notes-input\" style=\"\n                        width: 100%;\n                        flex: 1;\n                        padding: 0.75em;\n                        border: 1px solid #666;\n                        border-radius: 4px;\n                        background: rgba(0, 0, 0, 0.3);\n                        color: #fff;\n                        font-family: monospace;\n                        font-size: 0.9em;\n                        resize: none;\n                        box-sizing: border-box;\n                        margin-bottom: 0.5em;\n                    \">".concat(character.notes, "</textarea>\n                    <button id=\"save-notes-btn\" class=\"round-style\" style=\"width: 100%; padding: 0.5em;\">Save Notes</button>\n                </div>\n            </div>\n        ");
    };
    CharacterView.prototype.setupPageNavigation = function () {
        var _this = this;
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
        pagesContent === null || pagesContent === void 0 ? void 0 : pagesContent.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        pagesContent === null || pagesContent === void 0 ? void 0 : pagesContent.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            _this.handleSwipe(touchStartX, touchEndX, pagesContent);
        }, false);
    };
    CharacterView.prototype.handleSwipe = function (startX, endX, pagesContent) {
        var threshold = 80;
        var diff = startX - endX;
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.goToPage((this.currentPage + 1) % this.pages.length, pagesContent);
            }
            else {
                this.goToPage((this.currentPage - 1 + this.pages.length) % this.pages.length, pagesContent);
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
        // Reset scroll position of the page
        var pageEl = document.getElementById("page-".concat(pageIdx));
        if (pageEl) {
            pageEl.scrollTop = 0;
        }
    };
    return CharacterView;
}());
export { CharacterView };
