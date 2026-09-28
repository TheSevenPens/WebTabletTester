import type { AppSettings, EngineSettings, ProcessedSample, StrokeStats, Viewport } from './types';
import { CanvasRenderer } from './canvas_renderer';
import { StrokeEngine } from './stroke_engine';
import { createFrameScheduler } from './frame_scheduler';
import { pointerSamples, readPointer } from './pointer_input';
import { POINTER_BUTTONS } from './paint';
import { canHandleCanvasShortcut } from './shortcuts';
import { zoomAt } from './viewport';

interface ControllerOptions {
    settings(): EngineSettings;
    viewport(): Viewport;
    updateViewport(viewport: Viewport): void;
    publish(sample: ProcessedSample | null, stats: StrokeStats): void;
    panMode(active: boolean): void;
}

type Interaction =
    | { mode: 'idle' }
    | { mode: 'drawing'; pointerId: number }
    | { mode: 'panning'; pointerId: number; x: number; y: number };

/** Browser boundary: event/capture lifecycle, subscriptions, and presentation cadence. */
export function createCanvasController(
    canvas: HTMLCanvasElement,
    surface: HTMLElement,
    options: ControllerOptions
) {
    const view = options.viewport();
    const renderer = new CanvasRenderer(canvas, view.width, view.height);
    const engine = new StrokeEngine(renderer);
    let interaction: Interaction = { mode: 'idle' };
    let spaceDown = false;
    let latest: ProcessedSample | null = null;
    const abort = new AbortController();
    const signal = abort.signal;
    const frames = createFrameScheduler(
        () => {
            renderer.compose();
            options.publish(latest, engine.statistics);
        },
        {
            request: (callback) => requestAnimationFrame(callback),
            cancel: (id) => cancelAnimationFrame(id),
        }
    );

    function setPanMode() {
        options.panMode(
            (spaceDown && interaction.mode === 'idle') || interaction.mode === 'panning'
        );
    }

    function release(pointerId: number) {
        if (canvas.hasPointerCapture(pointerId)) canvas.releasePointerCapture(pointerId);
    }

    function cancel(pointerId?: number) {
        if (
            interaction.mode !== 'idle' &&
            (pointerId === undefined || pointerId === interaction.pointerId)
        ) {
            const id = interaction.pointerId;
            engine.cancel(id);
            interaction = { mode: 'idle' };
            release(id);
            latest = null;
            frames.request();
        }
        setPanMode();
    }

    function clear() {
        cancel();
        renderer.clear();
        frames.request();
    }

    function pointerDown(event: PointerEvent) {
        if (interaction.mode !== 'idle') return;
        const raw = readPointer(event, canvas.getBoundingClientRect(), canvas);
        if (!raw) return;
        event.preventDefault();
        canvas.focus({ preventScroll: true });
        const pan = (event.buttons & POINTER_BUTTONS.middle) !== 0 || spaceDown;
        const contact = (event.buttons & (POINTER_BUTTONS.tip | POINTER_BUTTONS.eraser)) !== 0;
        if (!pan && !contact) return;
        canvas.setPointerCapture(event.pointerId);
        if (pan) {
            interaction = {
                mode: 'panning',
                pointerId: event.pointerId,
                x: event.clientX,
                y: event.clientY,
            };
            setPanMode();
        } else {
            interaction = { mode: 'drawing', pointerId: event.pointerId };
            latest = engine.begin(raw, options.settings());
            frames.request();
        }
    }

    function pointerMove(event: PointerEvent) {
        if (interaction.mode !== 'idle' && interaction.pointerId !== event.pointerId) return;
        if (interaction.mode === 'panning') {
            const current = options.viewport();
            options.updateViewport({
                ...current,
                panX: current.panX + event.clientX - interaction.x,
                panY: current.panY + event.clientY - interaction.y,
            });
            interaction.x = event.clientX;
            interaction.y = event.clientY;
            return;
        }
        if (
            interaction.mode === 'drawing' &&
            (event.buttons & (POINTER_BUTTONS.tip | POINTER_BUTTONS.eraser)) === 0
        ) {
            pointerUp(event);
            return;
        }
        const rect = canvas.getBoundingClientRect();
        for (const eventSample of pointerSamples(event)) {
            const raw = readPointer(eventSample, rect, canvas);
            if (!raw) continue;
            const sample = engine.move(raw, options.settings());
            if (sample) latest = sample;
        }
        frames.request();
    }

    function pointerUp(event: PointerEvent) {
        if (interaction.mode === 'idle' || event.pointerId !== interaction.pointerId) return;
        if (interaction.mode === 'drawing') {
            const raw = readPointer(event, canvas.getBoundingClientRect(), canvas);
            if (raw) latest = engine.end(raw, options.settings());
            else {
                engine.cancel(event.pointerId);
                latest = null;
            }
            frames.request();
        }
        interaction = { mode: 'idle' };
        release(event.pointerId);
        setPanMode();
    }

    canvas.addEventListener('pointerdown', pointerDown, { signal });
    canvas.addEventListener('pointermove', pointerMove, { signal });
    canvas.addEventListener('pointerup', pointerUp, { signal });
    canvas.addEventListener('pointercancel', (event) => cancel(event.pointerId), { signal });
    canvas.addEventListener('lostpointercapture', (event) => cancel(event.pointerId), { signal });
    canvas.addEventListener(
        'pointerleave',
        () => {
            if (interaction.mode === 'idle') {
                latest = null;
                frames.request();
            }
        },
        { signal }
    );
    canvas.addEventListener('contextmenu', (event) => event.preventDefault(), { signal });
    canvas.addEventListener(
        'keydown',
        (event) => {
            if (!canHandleCanvasShortcut(event, canvas)) return;
            if (event.code === 'Space') {
                event.preventDefault();
                spaceDown = true;
                setPanMode();
            }
            if (event.key === 'Delete' || event.key === 'Backspace') {
                event.preventDefault();
                clear();
            }
        },
        { signal }
    );
    window.addEventListener(
        'keyup',
        (event) => {
            if (event.code === 'Space') {
                spaceDown = false;
                setPanMode();
            }
        },
        { signal }
    );
    const blur = () => {
        spaceDown = false;
        cancel();
        latest = null;
        frames.request();
        setPanMode();
    };
    window.addEventListener('blur', blur, { signal });
    canvas.addEventListener('blur', blur, { signal });
    surface.addEventListener(
        'wheel',
        (event) => {
            event.preventDefault();
            const current = options.viewport();
            const rect = surface.getBoundingClientRect();
            const delta =
                event.deltaY *
                (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rect.height : 1);
            options.updateViewport(
                zoomAt(current, current.zoom * Math.exp(-delta * 0.001), {
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                })
            );
        },
        { signal, passive: false }
    );

    function updateDimensions() {
        const rect = surface.getBoundingClientRect();
        options.updateViewport({
            ...options.viewport(),
            viewportWidth: rect.width,
            viewportHeight: rect.height,
            dpr: window.devicePixelRatio || 1,
        });
    }
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(surface);
    window.addEventListener('resize', updateDimensions, { signal });
    updateDimensions();

    return {
        clear,
        setBackground(settings: AppSettings) {
            renderer.setBackground(settings);
            frames.request();
        },
        image(includeBackground: boolean): HTMLCanvasElement {
            frames.flush();
            renderer.compose();
            return includeBackground ? renderer.output : renderer.foreground;
        },
        dispose() {
            abort.abort();
            cancel();
            observer.disconnect();
            frames.dispose();
        },
    };
}
