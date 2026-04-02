/**
 * Edit popover for items and abilities
 * Shows inline form for editing with Save/Cancel buttons
 */
var EditPopover = /** @class */ (function () {
    function EditPopover() {
        this.container = null;
        this.onSave = null;
        this.container = document.createElement('div');
        this.container.id = 'edit-popover';
        this.container.style.cssText = "\n            display: none;\n            position: fixed;\n            top: 50%;\n            left: 50%;\n            transform: translate(-50%, -50%);\n            background: #2a2a2a;\n            border: 2px solid #666;\n            border-radius: 0.5em;\n            padding: 1em;\n            z-index: 1000;\n            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);\n            max-width: 90vw;\n            width: 100%;\n            max-width: 400px;\n        ";
        document.body.appendChild(this.container);
    }
    /**
     * Show edit form for an item or ability
     */
    EditPopover.prototype.show = function (type, data, onSave, onCancel) {
        var _this = this;
        var _a, _b;
        this.onSave = onSave;
        var fields = [
            { name: 'name', label: 'Name', value: data.name || '' },
        ];
        if (type === 'item') {
            fields.push({ name: 'location', label: 'Location', value: data.location || '' });
        }
        fields.push({ name: 'description', label: 'Description', value: data.description || '' });
        var html = "<h3 style=\"margin-top: 0; font-size: 1.1em;\">".concat(type === 'item' ? 'Edit Item' : 'Edit Ability', "</h3>");
        fields.forEach(function (field) {
            if (field.name === 'description') {
                html += "\n                    <div style=\"margin-bottom: 0.8em;\">\n                        <label style=\"display: block; margin-bottom: 0.3em; font-weight: 500;\">".concat(field.label, "</label>\n                        <textarea name=\"").concat(field.name, "\" style=\"width: 100%; min-height: 4em; padding: 0.5em; border-radius: 0.3em; background: #333; border: 1px solid #555; color: #fff; font-family: monospace; font-size: 0.9em;\">").concat(field.value, "</textarea>\n                        ").concat(type === 'item' ? '<div style="font-size: 0.8em; opacity: 0.6; margin-top: 0.2em;">Use $$stat_name:value for buffs (e.g., $$melee_power:2)</div>' : '', "\n                    </div>\n                ");
            }
            else {
                html += "\n                    <div style=\"margin-bottom: 0.8em;\">\n                        <label style=\"display: block; margin-bottom: 0.3em; font-weight: 500;\">".concat(field.label, "</label>\n                        <input type=\"text\" name=\"").concat(field.name, "\" value=\"").concat(field.value, "\" style=\"width: 100%; padding: 0.5em; border-radius: 0.3em; background: #333; border: 1px solid #555; color: #fff; box-sizing: border-box;\">\n                    </div>\n                ");
            }
        });
        html += "\n            <div style=\"display: flex; gap: 0.5em; margin-top: 1em;\">\n                <button class=\"popover-save-btn\" style=\"flex: 1; padding: 0.6em; background: #4ade80; color: #000; border: none; border-radius: 0.3em; font-weight: 600; cursor: pointer;\">Save</button>\n                <button class=\"popover-cancel-btn\" style=\"flex: 1; padding: 0.6em; background: #666; color: #fff; border: none; border-radius: 0.3em; font-weight: 600; cursor: pointer;\">Cancel</button>\n            </div>\n        ";
        if (this.container) {
            this.container.innerHTML = html;
            this.container.style.display = 'block';
            // Add focus to first input
            setTimeout(function () {
                var _a;
                var firstInput = (_a = _this.container) === null || _a === void 0 ? void 0 : _a.querySelector('input, textarea');
                if (firstInput)
                    firstInput.focus();
            }, 0);
            // Save button
            (_a = this.container.querySelector('.popover-save-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
                var _a;
                var formData = {};
                fields.forEach(function (field) {
                    var _a;
                    var input = (_a = _this.container) === null || _a === void 0 ? void 0 : _a.querySelector("[name=\"".concat(field.name, "\"]"));
                    if (input)
                        formData[field.name] = input.value;
                });
                _this.hide();
                (_a = _this.onSave) === null || _a === void 0 ? void 0 : _a.call(_this, formData);
            });
            // Cancel button
            (_b = this.container.querySelector('.popover-cancel-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
                _this.hide();
                onCancel === null || onCancel === void 0 ? void 0 : onCancel();
            });
            // Close on Escape
            var escapeHandler_1 = function (e) {
                if (e.key === 'Escape') {
                    _this.hide();
                    onCancel === null || onCancel === void 0 ? void 0 : onCancel();
                    document.removeEventListener('keydown', escapeHandler_1);
                }
            };
            document.addEventListener('keydown', escapeHandler_1);
        }
    };
    /**
     * Hide the popover
     */
    EditPopover.prototype.hide = function () {
        if (this.container) {
            this.container.style.display = 'none';
        }
    };
    return EditPopover;
}());
export { EditPopover };
// Singleton instance
export var editPopover = new EditPopover();
