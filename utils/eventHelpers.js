import { HOLD_PRESS_DURATION_MS } from './constants.js';
/**
 * Attach a hold-press handler that works on both mouse and touch
 * Triggers callback after holding for HOLD_PRESS_DURATION_MS
 */
export function attachHoldPress(element, callback, duration) {
    if (duration === void 0) { duration = HOLD_PRESS_DURATION_MS; }
    var holdTimer;
    var startHold = function () {
        holdTimer = setTimeout(callback, duration);
    };
    var endHold = function () {
        clearTimeout(holdTimer);
    };
    // Mouse events
    element.addEventListener('mousedown', startHold);
    element.addEventListener('mouseup', endHold);
    element.addEventListener('mouseleave', endHold);
    // Touch events
    element.addEventListener('touchstart', startHold);
    element.addEventListener('touchend', endHold);
    element.addEventListener('touchcancel', endHold);
    // Prevent context menu
    element.addEventListener('contextmenu', function (e) { return e.preventDefault(); });
}
/**
 * Toggle visibility of a description element
 */
export function toggleDescription(element) {
    var description = element.querySelector('.item-ability-description');
    if (description) {
        description.style.display = description.style.display === 'none' ? 'block' : 'none';
    }
}
/**
 * Stop event propagation and prevent default
 */
export function preventEvent(event) {
    event.preventDefault();
    event.stopPropagation();
}
