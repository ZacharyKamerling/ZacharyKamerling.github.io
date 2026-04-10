import { COLORS, SPACING, RADIUS, Z_INDEX, MODAL } from './constants.js';

/**
 * Edit popover for items and abilities
 * Shows inline form for editing with Save/Cancel buttons
 */
export class EditPopover {
    private container: HTMLDivElement | null = null;
    private onSave: ((data: any) => void) | null = null;
    private escapeHandler: ((e: KeyboardEvent) => void) | null = null;

    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'edit-popover';
        this.container.style.cssText = `
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${COLORS.dark};
            border: 2px solid ${COLORS.borderDark};
            border-radius: ${RADIUS.lg};
            padding: ${SPACING.lg};
            z-index: ${Z_INDEX.modal};
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
            max-width: 90vw;
            max-height: 90vh;
            width: 500px;
            overflow-y: auto;
            box-sizing: border-box;
        `;
        document.body.appendChild(this.container);
    }

    /**
     * Show edit form for an item or ability
     */
    show(
        type: 'item' | 'ability',
        data: any,
        onSave: (updatedData: any) => void,
        onCancel?: () => void
    ): void {
        this.onSave = onSave;

        // Clean up any previous escape handler
        this.removeEscapeHandler();

        const fields: { name: string; label: string; value: string }[] = [
            { name: 'name', label: 'Name', value: data.name || '' },
        ];

        if (type === 'item') {
            fields.push({ name: 'location', label: 'Location', value: data.location || '' });
        }

        fields.push({ name: 'description', label: 'Description', value: data.description || '' });

        let html = `<h3 style="margin-top: 0; margin-bottom: ${SPACING.md}; font-size: 1.1em;">${type === 'item' ? 'Edit Item' : 'Edit Ability'}</h3>`;
        html += `<div style="display: flex; flex-direction: column; height: 50vh; gap: ${SPACING.md};">`;

        fields.forEach((field, idx) => {
            if (field.name === 'description') {
                html += `
                    <div style="display: flex; flex-direction: column; flex: 1; min-height: 0;">
                        <label style="display: block; margin-bottom: 0.3em; font-weight: 500;">${field.label}</label>
                        <textarea name="${field.name}" style="flex: 1; min-height: 0; padding: ${SPACING.sm}; border-radius: ${RADIUS.md}; background: ${COLORS.medium}; border: 1px solid ${COLORS.border}; color: ${COLORS.text}; font-family: monospace; font-size: 0.9em; resize: none; box-sizing: border-box;">${field.value}</textarea>
                        ${type === 'item' ? `<div style="font-size: 0.8em; opacity: 0.6; margin-top: 0.2em;">Use $$stat_name:value for buffs (e.g., $$melee_power:2)</div>` : ''}
                    </div>
                `;
            } else {
                html += `
                    <div>
                        <label style="display: block; margin-bottom: 0.3em; font-weight: 500;">${field.label}</label>
                        <input type="text" name="${field.name}" value="${field.value}" style="width: 100%; padding: ${SPACING.sm}; border-radius: ${RADIUS.md}; background: ${COLORS.medium}; border: 1px solid ${COLORS.border}; color: ${COLORS.text}; box-sizing: border-box;">
                    </div>
                `;
            }
        });

        html += `
            </div>
            <div style="display: flex; gap: ${SPACING.sm}; margin-top: ${SPACING.lg};">
                <button class="popover-save-btn" style="flex: 1; padding: 0.6em; background: ${COLORS.success}; color: ${COLORS.textDark}; border: none; border-radius: ${RADIUS.md}; font-weight: 600; cursor: pointer;">Save</button>
                <button class="popover-cancel-btn" style="flex: 1; padding: 0.6em; background: ${COLORS.borderDark}; color: ${COLORS.text}; border: none; border-radius: ${RADIUS.md}; font-weight: 600; cursor: pointer;">Cancel</button>
            </div>
        `;

        if (this.container) {
            this.container.innerHTML = html;
            this.container.style.display = 'block';

            // Add focus to first input
            const firstInput = this.container.querySelector('input, textarea') as HTMLInputElement;
            if (firstInput) firstInput.focus();

            // Save button
            this.container.querySelector('.popover-save-btn')?.addEventListener('click', () => {
                const formData: any = {};
                fields.forEach(field => {
                    const input = this.container?.querySelector(`[name="${field.name}"]`) as HTMLInputElement | HTMLTextAreaElement;
                    if (input) formData[field.name] = input.value;
                });
                this.hide();
                this.onSave?.(formData);
            });

            // Cancel button
            this.container.querySelector('.popover-cancel-btn')?.addEventListener('click', () => {
                this.hide();
                onCancel?.();
            });

            // Close on Escape - attach new handler and store reference
            this.escapeHandler = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    this.hide();
                    onCancel?.();
                }
            };
            document.addEventListener('keydown', this.escapeHandler);
        }
    }

    private removeEscapeHandler(): void {
        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
            this.escapeHandler = null;
        }
    }

    /**
     * Hide the popover and clean up event listeners
     */
    hide(): void {
        this.removeEscapeHandler();
        if (this.container) {
            this.container.style.display = 'none';
        }
    }
}

// Singleton instance
export const editPopover = new EditPopover();
