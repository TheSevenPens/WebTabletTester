/**
 * Svelte action: attach global keydown handlers. Listens on window so shortcuts work regardless of focus.
 */
export function keydown(_node: HTMLElement, handlers: { [key: string]: (e: KeyboardEvent) => void }) {
    const handler = (e: KeyboardEvent) => {
        const fn = handlers[e.key];
        if (fn) fn(e);
    };

    window.addEventListener('keydown', handler);

    return {
        destroy() {
            window.removeEventListener('keydown', handler);
        },
        update(newHandlers: { [key: string]: (e: KeyboardEvent) => void }) {
            handlers = newHandlers;
        },
    };
}
