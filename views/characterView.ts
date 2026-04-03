import { Character } from '../models/character.js';

export class CharacterView {
    // REMEMBER: Increment VERSION when making UI changes
    private VERSION = '1.0.15';
    private currentPage = 0;
    private pages = ['Stats', 'Items', 'Abilities', 'Notes'];
    private TAB_HEIGHT = '70px'; // Approximate height of tab bar

    render(character: Character) {
        this.renderVersion();
        this.renderName(character.name);
        this.renderPageContainer();
        // Render all pages
        for (let i = 0; i < this.pages.length; i++) {
            this.renderPage(character, i);
        }
        // Always setup navigation after renderPageContainer since DOM is recreated
        this.setupPageNavigation();
        // Navigate to current page
        const pagesContent = document.getElementById('pages-content');
        if (pagesContent) {
            const translateX = -this.currentPage * 100;
            pagesContent.style.transform = `translateX(${translateX}%)`;
        }
    }

    private renderVersion() {
        const versionDiv = document.getElementById('version');
        if (versionDiv) versionDiv.textContent = `v${this.VERSION}`;
    }

    private renderName(name: string) {
        const nameDiv = document.getElementById('character-name');
        if (nameDiv) nameDiv.textContent = name;
    }

    private renderPageContainer() {
        const container = document.getElementById('page-container');
        if (!container) return;

        // Render tabs in the header
        const tabsBar = document.getElementById('tabs-bar');
        if (tabsBar) {
            tabsBar.innerHTML = this.pages.map((name, idx) => `
                <button class="page-btn round-style" data-page="${idx}" style="padding: 0.4em 0.8em; font-size: 0.9em; ${idx === this.currentPage ? 'background: #4a9eff; font-weight: bold;' : ''}">
                    ${name}
                </button>
            `).join('');
        }

        container.innerHTML = `
            <div id="pages-wrapper" style="display: flex; flex: 1; overflow: hidden; width: 100%; min-height: 0;">
                <div id="pages-content" style="display: flex; width: 100%; height: 100%; transition: transform 0.3s ease-out; transform: translateX(0);">
                    ${this.pages.map((_, idx) => `<div id="page-${idx}" style="flex: 0 0 100%; width: 100%; height: 100%; overflow-y: auto; overflow-x: hidden; touch-action: manipulation;"></div>`).join('')}
                </div>
            </div>
        `;
    }

    private renderPage(character: Character, pageIdx: number) {
        const pageEl = document.getElementById(`page-${pageIdx}`);
        if (!pageEl) return;

        let content = '';
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
    }

    private renderStatsPage(character: Character): string {
        let blood = '';
        let maxBlood = character.bloodMax || 1;
        let currentBlood = character.bloodTokens || 0;
        for (let i = 0; i < maxBlood; i++) {
            blood += `<button class="token-btn" data-type="blood" data-idx="${i}" style="font-size:1.5em; margin:2px 2px;${i < currentBlood ? '' : 'opacity:0.3;'}">🩸</button>`;
        }
        let stamina = '';
        let maxStamina = character.staminaMax || 1;
        let currentStamina = character.staminaTokens || 0;
        for (let i = 0; i < maxStamina; i++) {
            stamina += `<button class="token-btn" data-type="stamina" data-idx="${i}" style="font-size:1.5em; margin:2px 2px;${i < currentStamina ? '' : 'opacity:0.3;'}">⚡</button>`;
        }

        return `
            <div style="display: flex; flex-direction: column; gap: 1em; padding: 1em; max-width: 24em; margin: 0 auto; width: 100%;">
                <div id="token-section" style="width: 100%;">
                    <div style="font-size:1.2em; margin-bottom:0.5em; display: flex; flex-direction: column; gap: 0.5em;">
                        <div style="display: flex; flex-direction: column; align-items: flex-start;">
                            <span id="blood-label" style="padding-left: 0.5em; font-size: 1em;">Blood (${currentBlood} / ${maxBlood})</span>
                            <div>${blood}</div>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: flex-start;">
                            <span id="stamina-label" style="padding-left: 0.5em; font-size: 1em;">Stamina (${currentStamina} / ${maxStamina})</span>
                            <div>${stamina}</div>
                        </div>
                    </div>
                </div>
                <div id="stat-section" style="width: 100%;">
                    <div style="font-size:1em; display: flex; flex-direction: column;">
                        <div class="stat-row">
                            <span id="melee-power-label" class="stat-label round-style" title="Melee Power">Melee ⚔️</span>
                            <div class="stat-value">${character.meleePower}</div>
                            <span id="ranged-power-label" class="stat-label round-style" title="Ranged Power">Ranged 🏹</span>
                            <div class="stat-value">${character.rangedPower}</div>
                        </div>
                        <div class="stat-row">
                            <span id="might-label" class="stat-label round-style" title="Might">Might 💪</span>
                            <div class="stat-value">${character.might}</div>
                            <span id="awareness-label" class="stat-label round-style" title="Awareness">Awareness 👁️</span>
                            <div class="stat-value">${character.awareness}</div>
                        </div>
                        <div class="stat-row">
                            <span id="resolve-label" class="stat-label round-style" title="Resolve">Resolve ✊</span>
                            <div class="stat-value">${character.resolve}</div>
                            <span id="stress-label" class="stat-label round-style" title="Stress">Stress 💦</span>
                            <div class="stat-value">${character.stress}</div>
                        </div>
                        <div style="display: flex; flex-direction: row; align-items: center; column-gap: 0.5em;">
                            <button id="custom-neg-btn" class="custom-roll-btn round-style">-1</button>
                            <input id="custom-roll-input" class="custom-roll-input round-style" type="number" value="${character.customRoll}">
                            <button id="custom-pos-btn" class="custom-roll-btn round-style">+1</button>
                            <button id="custom-roll-btn" class="custom-roll-btn round-style" style="min-width: 5em; justify-content: center;">Roll</button>
                        </div>
                    </div>
                </div>
                <div id="dice-results" style="width: 100%;"></div>
                <div id="card-section-container" style="width: 100%;">
                    <div style="margin-top: 1.5em;">
                        <div style="display: flex; align-items: center; gap: 1em; margin-bottom: 1em;">
                            <button id="draw-cards-btn" class="round-style" style="padding: 0.5em 1em; flex: 1;">Draw Cards</button>
                            <label style="display: flex; align-items: center; gap: 0.5em; cursor: pointer;">
                                <input type="checkbox" id="unarmored-toggle" ${character.unarmored ? 'checked' : ''} style="cursor: pointer;">
                                <span>Unarmored</span>
                            </label>
                        </div>
                        <div id="card-result-box"></div>
                    </div>
                </div>
            </div>
        `;
    }

    private renderItemsPage(character: Character): string {
        const maxSlots = character.might + 5;
        const itemsUsed = character.items.length;
        const exceedsSlots = itemsUsed > maxSlots;

        let itemsHtml = character.items.map((item, idx) => `
            <div class="item-ability-entry" data-id="${item.id}" data-type="item">
                <div class="item-ability-header">
                    <input type="checkbox" class="item-checkbox" data-id="${item.id}" ${item.equipped ? 'checked' : ''} style="cursor: pointer;">
                    <span class="item-ability-name">${item.name}</span>
                    <span class="item-location">${item.location}</span>
                </div>
                <div class="item-ability-description" style="display: none;">
                    ${item.description}
                </div>
            </div>
        `).join('');

        return `
            <div style="padding: 1em; max-width: 24em; margin: 0 auto; width: 100%;">
                <h3 style="margin: 0.5em 0; font-size: 1.2em;">Items <span style="font-size: 0.9em; font-weight: normal;">(${itemsUsed}/${maxSlots})</span></h3>
                <div style="display: flex; flex-direction: column; gap: 0.5em; ${exceedsSlots ? 'margin-bottom: 0.5em;' : ''}">
                    ${itemsHtml || '<div style="font-size: 0.9em; opacity: 0.6; padding: 0.5em;">No items</div>'}
                </div>
                ${exceedsSlots ? `<div style="color: #ff6b6b; font-style: italic; font-size: 0.9em; margin-bottom: 0.5em;">⚠️ Item slots exceeded</div>` : ''}
                <button class="new-item-btn round-style" style="width: 100%; padding: 0.5em; margin-top: 0.5em;">+ New Item</button>
            </div>
        `;
    }

    private renderAbilitiesPage(character: Character): string {
        let abilitiesHtml = character.abilities.map((ability) => `
            <div class="item-ability-entry" data-id="${ability.id}" data-type="ability">
                <div class="item-ability-header">
                    <span class="item-ability-name">${ability.name}</span>
                </div>
                <div class="item-ability-description" style="display: none;">
                    ${ability.description}
                </div>
            </div>
        `).join('');

        return `
            <div style="padding: 1em; max-width: 24em; margin: 0 auto; width: 100%;">
                <h3 style="margin: 0.5em 0; font-size: 1.2em;">Abilities</h3>
                <div style="display: flex; flex-direction: column; gap: 0.5em;">
                    ${abilitiesHtml || '<div style="font-size: 0.9em; opacity: 0.6; padding: 0.5em;">No abilities</div>'}
                </div>
                <button class="new-ability-btn round-style" style="width: 100%; padding: 0.5em; margin-top: 0.5em;">+ New Ability</button>
            </div>
        `;
    }

    private renderNotesPage(character: Character): string {
        return `
            <div style="padding: 1em; max-width: 24em; margin: 0 auto; width: 100%; box-sizing: border-box;">
                <h3 style="margin: 0 0 0.5em 0; font-size: 1.2em;">Campaign Notes</h3>
                <div style="display: flex; flex-direction: column; height: 75vh;">
                    <textarea id="notes-input" style="
                        width: 100%;
                        flex: 1;
                        padding: 0.75em;
                        border: 1px solid #666;
                        border-radius: 4px;
                        background: rgba(0, 0, 0, 0.3);
                        color: #fff;
                        font-family: monospace;
                        font-size: 0.9em;
                        resize: none;
                        box-sizing: border-box;
                        margin-bottom: 0.5em;
                    ">${character.notes}</textarea>
                    <button id="save-notes-btn" class="round-style" style="width: 100%; padding: 0.5em;">Save Notes</button>
                </div>
            </div>
        `;
    }

    private setupPageNavigation() {
        const pagesContent = document.getElementById('pages-content');
        const pageButtons = document.querySelectorAll('.page-btn');

        pageButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pageIdx = parseInt((e.target as HTMLElement).getAttribute('data-page')!);
                this.goToPage(pageIdx, pagesContent);
            });
        });

        // Swipe detection
        let touchStartX = 0;
        let touchEndX = 0;

        pagesContent?.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        pagesContent?.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX, pagesContent);
        }, false);
    }

    private handleSwipe(startX: number, endX: number, pagesContent: HTMLElement | null) {
        const threshold = 80;
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swiped left, go to next page
                if (this.currentPage < this.pages.length - 1) {
                    this.goToPage(this.currentPage + 1, pagesContent);
                }
            } else {
                // Swiped right, go to previous page
                if (this.currentPage > 0) {
                    this.goToPage(this.currentPage - 1, pagesContent);
                }
            }
        }
    }

    private goToPage(pageIdx: number, pagesContent: HTMLElement | null) {
        if (pageIdx < 0 || pageIdx >= this.pages.length) return;

        this.currentPage = pageIdx;
        const translateX = -pageIdx * 100;
        if (pagesContent) {
            pagesContent.style.transform = `translateX(${translateX}%)`;
        }

        // Update button styles
        document.querySelectorAll('.page-btn').forEach((btn, idx) => {
            const btnEl = btn as HTMLElement;
            if (idx === pageIdx) {
                btnEl.style.background = '#4a9eff';
                btnEl.style.fontWeight = 'bold';
            } else {
                btnEl.style.background = '';
                btnEl.style.fontWeight = '';
            }
        });

        // Reset scroll position of the page
        const pageEl = document.getElementById(`page-${pageIdx}`);
        if (pageEl) {
            pageEl.scrollTop = 0;
        }
    }
}
