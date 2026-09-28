/** Only the focused drawing surface receives canvas shortcuts. */
export function canHandleCanvasShortcut(event: KeyboardEvent, canvas: HTMLCanvasElement): boolean {
    return (
        event.target === canvas &&
        !event.defaultPrevented &&
        !event.isComposing &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !event.shiftKey &&
        !event.repeat
    );
}
