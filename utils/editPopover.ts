/**
 * Edit popover for items and abilities
 * Shows inline form for editing with Save/Cancel buttons
 */
export class EditPopover {
    private container: HTMLDivElement | null = null;
    private onSave: ((data: any) => void) | null = null;

    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'edit-popover';
        this.container.style.cssText = `
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2a2a2a;
            border: 2px solid #666;
            border-radius: 0.5em;
            padding: 1em;
            z-index: 1000;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
            max-width: 90vw;
            width: 100%;
            max-width: 400px;
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

        const fields: { name: string; label: string; value: string }[] = [
            { name: 'name', label: 'Name', value: data.name || '' },
        ];

        if (type === 'item') {
            fields.push({ name: 'location', label: 'Location', value: data.location || '' });
        }

        fields.push({ name: 'description', label: 'Description', value: data.description || '' });

        let html = `<h3 style="margin-top: 0; font-size: 1.1em;">${type === 'item' ? 'Edit Item' : 'Edit Ability'}</h3>`;

        fields.forEach(field => {
            if (field.name === 'description') {
                html += `
                    <div style="margin-bottom: 0.8em;">
                        <label style="display: block; margin-bottom: 0.3em; font-weight: 500;">${field.label}</label>
                        <textarea name="${field.name}" style="width: 100%; min-height: 4em; padding: 0.5em; border-radius: 0.3em; background: #333; border: 1px solid #555; color: #fff; font-family: monospace; font-size: 0.9em;">${field.value}</textarea>
                        ${type === 'item' ? '<div style="font-size: 0.8em; opacity: 0.6; margin-top: 0.2em;">Use $$stat_name:value for buffs (e.g., $$melee_power:2)</div>' : ''}
                    </div>
                `;
            } else {
                html += `
                    <div style="margin-bottom: 0.8em;">
                        <label style="display: block; margin-bottom: 0.3em; font-weight: 500;">${field.label}</label>
                        <input type="text" name="${field.name}" value="${field.value}" style="width: 100%; padding: 0.5em; border-radius: 0.3em; background: #333; border: 1px solid #555; color: #fff; box-sizing: border-box;">
                    </div>
                `;
            }
        });

        html += `
            <div style="display: flex; gap: 0.5em; margin-top: 1em;">
                <button class="popover-save-btn" style="flex: 1; padding: 0.6em; background: #4ade80; color: #000; border: none; border-radius: 0.3em; font-weight: 600; cursor: pointer;">Save</button>
                <button class="popover-cancel-btn" style="flex: 1; padding: 0.6em; background: #666; color: #fff; border: none; border-radius: 0.3em; font-weight: 600; cursor: pointer;">Cancel</button>
            </div>
        `;

        if (this.container) {
            this.container.innerHTML = html;
            this.container.style.display = 'block';

            // Add focus to first input
            setTimeout(() => {
                const firstInput = this.container?.querySelector('input, textarea') as HTMLInputElement;
                if (firstInput) firstInput.focus();
            }, 0);

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

            // Close on Escape
            const escapeHandler = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    this.hide();
                    onCancel?.();
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
        }
    }

    /**
     * Hide the popover
     */
    hide(): void {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }
}

// Singleton instance
export const editPopover = new EditPopover();
