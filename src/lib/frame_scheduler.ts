export interface AnimationClock {
    request(callback: FrameRequestCallback): number;
    cancel(id: number): void;
}

/** One pending frame; flush supports exports and deterministic tests. */
export function createFrameScheduler(draw: () => void, clock: AnimationClock) {
    let pending: number | null = null;
    const flush = () => {
        if (pending === null) return;
        clock.cancel(pending);
        pending = null;
        draw();
    };
    return {
        request() {
            if (pending !== null) return;
            pending = clock.request(() => {
                pending = null;
                draw();
            });
        },
        flush,
        dispose() {
            if (pending !== null) clock.cancel(pending);
            pending = null;
        },
    };
}
