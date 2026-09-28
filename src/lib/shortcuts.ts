/**
 * Canvas shortcut policy. Shortcuts are scoped by what has focus, not by whether the canvas
 * itself is focused, so they keep working after the user clicks a toolbar control.
 */
const EDITABLE = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])';
const INTERACTIVE = `${EDITABLE}, button, summary, a[href], [role="button"], [role="menuitem"]`;

function matches(target: EventTarget | null, selector: string): boolean {
    return target instanceof Element && target.closest(selector) !== null;
}

/** Plain, non-repeated, non-composing key press that nothing else has already handled. */
export function isPlainKeyPress(event: KeyboardEvent): boolean {
    return (
        !event.defaultPrevented &&
        !event.isComposing &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !event.shiftKey &&
        !event.repeat
    );
}

/** Delete/Backspace clear the document unless the user is editing a field. */
export function canClearFromKeyboard(event: KeyboardEvent): boolean {
    return (
        isPlainKeyPress(event) &&
        (event.key === 'Delete' || event.key === 'Backspace') &&
        !matches(event.target, EDITABLE)
    );
}

/** Space pans unless a control would consume it (buttons activate, fields insert a space). */
export function canPanFromKeyboard(event: KeyboardEvent, canvas: HTMLCanvasElement): boolean {
    return (
        isPlainKeyPress(event) &&
        event.code === 'Space' &&
        (event.target === canvas || !matches(event.target, INTERACTIVE))
    );
}
