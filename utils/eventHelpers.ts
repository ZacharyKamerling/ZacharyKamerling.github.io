import { HOLD_PRESS_DURATION_MS } from './constants.js';

/**
 * Attach a hold-press handler that works on both mouse and touch
 * Triggers callback after holding for HOLD_PRESS_DURATION_MS
 */
export function attachHoldPress(
    element: HTMLElement,
    callback: () => void,
    duration: number = HOLD_PRESS_DURATION_MS
): void {
    let holdTimer: ReturnType<typeof setTimeout> | undefined;

    const startHold = () => {
        holdTimer = setTimeout(callback, duration);
    };

    const endHold = () => {
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
    element.addEventListener('contextmenu', (e) => e.preventDefault());
}

/**
 * Toggle visibility of a description element
 */
export function toggleDescription(element: HTMLElement): void {
    const description = element.querySelector('.item-ability-description') as HTMLElement;
    if (description) {
        description.style.display = description.style.display === 'none' ? 'block' : 'none';
    }
}

/**
 * Stop event propagation and prevent default
 */
export function preventEvent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
}
