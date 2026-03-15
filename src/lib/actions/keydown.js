/**
 * Svelte action: attach global keydown handlers. Listens on window so shortcuts work regardless of focus.
 * @param {HTMLElement} _node - Unused; handlers are attached to window
 * @param {{ [key: string]: (e: KeyboardEvent) => void }} handlers - Map of key names (e.g. 'Delete', 'Backspace') to handlers
 * @returns {{ destroy: () => void; update?: (handlers: { [key: string]: (e: KeyboardEvent) => void }) => void }}
 */
export function keydown(_node, handlers) {
    const handler = (e) => {
        const fn = handlers[e.key];
        if (fn) fn(e);
    };

    window.addEventListener('keydown', handler);

    return {
        destroy() {
            window.removeEventListener('keydown', handler);
        },
        update(newHandlers) {
            handlers = newHandlers;
        },
    };
}
