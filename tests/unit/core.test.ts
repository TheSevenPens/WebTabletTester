import { describe, expect, it, vi } from 'vitest';
import {
    createPaintSettings,
    createProcessingSettings,
    createViewport,
} from '../../src/lib/initial_state';
import { SampleProcessor, processPressure } from '../../src/lib/processing';
import { NumericSmoother } from '../../src/lib/utils/numeric_smoother';
import { applyPressureCurve } from '../../src/lib/utils/numeric_curve';
import { lerp } from '../../src/lib/utils/interpolation';
import { quantize, sampleRate } from '../../src/lib/utils/numerics';
import { StrokeEngine, hoverProcessing } from '../../src/lib/stroke_engine';
import { timestampForFilename } from '../../src/lib/canvas_export';
import { evaluateBrush } from '../../src/lib/paint';
import { fitViewport, screenToDocument, zoomAt } from '../../src/lib/viewport';
import { createFrameScheduler } from '../../src/lib/frame_scheduler';
import { hasContact, pointerSamples, readPointer } from '../../src/lib/pointer_input';
import type { EngineSettings, RawSample } from '../../src/lib/types';

function raw(overrides: Partial<RawSample> = {}): RawSample {
    return {
        pointerId: 1,
        pointerType: 'pen',
        buttons: 1,
        pressure: 1,
        x: 10,
        y: 10,
        tiltX: 0,
        tiltY: 0,
        azimuth: 0,
        altitude: 90,
        twist: 0,
        time: 0,
        ...overrides,
    };
}

function setup() {
    const renderer = { clear: vi.fn(), dab: vi.fn(), segment: vi.fn() };
    const settings: EngineSettings = {
        paint: createPaintSettings(),
        processing: createProcessingSettings(),
    };
    return { renderer, settings, engine: new StrokeEngine(renderer) };
}

describe('processing contracts', () => {
    it('uses conventional interpolation endpoints', () => {
        expect(lerp(10, 20, 0)).toBe(10);
        expect(lerp(10, 20, 1)).toBe(20);
        expect(lerp(10, 20, 0.25)).toBe(12.5);
    });

    it.each([-0.9, -0.5, 0, 0.5, 0.9])('preserves curve endpoints for amount %s', (amount) => {
        expect(applyPressureCurve(0, amount)).toBe(0);
        expect(applyPressureCurve(1, amount)).toBe(1);
    });

    it('documents curve direction and protects finite bounds', () => {
        expect(applyPressureCurve(0.5, 0.5)).toBe(0.25);
        expect(applyPressureCurve(0.5, -0.5)).toBeCloseTo(Math.sqrt(0.5));
        expect(applyPressureCurve(NaN, Infinity)).toBe(0);
        expect(applyPressureCurve(2, 5)).toBe(1);
    });

    it('quantizes exactly the requested number of levels', () => {
        const levels = new Set(Array.from({ length: 101 }, (_, index) => quantize(index / 100, 4)));
        expect([...levels]).toEqual([0, 1 / 3, 2 / 3, 1]);
    });

    it.each([NaN, Infinity, -1, 2])('rejects invalid quantization input %s', (value) => {
        expect(() => quantize(value, 4)).toThrow(RangeError);
    });
    it.each([0, 1, 3.5, NaN])('rejects invalid levels %s', (levels) => {
        expect(() => quantize(0.5, levels)).toThrow(RangeError);
    });

    it('quantizes, curves, then smooths', () => {
        const smoother = new NumericSmoother();
        const settings = {
            ...createProcessingSettings(),
            pressureQuant: 4,
            pressureCurve: 0.5,
            pressureSmoothing: 0.5,
        };
        processPressure(0, settings, smoother);
        expect(processPressure(0.2, settings, smoother)).toBeCloseTo(1 / 18);
    });

    it('resets EMA history and follows the short arc for azimuth', () => {
        const smoother = new NumericSmoother();
        expect(smoother.apply(10, 0.5)).toBe(10);
        expect(smoother.apply(100, 0.5)).toBe(55);
        smoother.reset();
        expect(smoother.apply(200, 0.5)).toBe(200);
        smoother.reset();
        smoother.apply(359, 0.5, true);
        expect(smoother.apply(1, 0.5, true)).toBe(0);
    });

    it('uses sample timestamps for pixels per second and handles equal timestamps', () => {
        const processor = new SampleProcessor();
        const settings = { ...createProcessingSettings(), velocitySmoothing: 0 };
        processor.process(raw({ x: 0, time: 0 }), settings);
        expect(processor.process(raw({ x: 10, time: 10 }), settings).velocity).toBe(1000);
        expect(processor.process(raw({ x: 20, time: 10 }), settings).velocity).toBe(0);
    });
});

describe('stroke lifecycle regression coverage', () => {
    it('resets the active filters before a new stroke begins', () => {
        const { engine, settings, renderer } = setup();
        settings.processing = { ...settings.processing, positionSmoothing: 0.5 };
        engine.begin(raw({ x: 10 }), settings);
        engine.move(raw({ x: 100, time: 10 }), settings);
        engine.end(raw({ x: 100, pressure: 0, buttons: 0, time: 20 }), settings);
        engine.begin(raw({ x: 200, time: 30 }), settings);
        expect(renderer.dab.mock.lastCall?.[0].x).toBe(200);
    });

    it('draws taps and counts each completed stroke once', () => {
        const { engine, settings, renderer } = setup();
        engine.begin(raw(), settings);
        engine.end(raw({ pressure: 0, buttons: 0, time: 10 }), settings);
        engine.end(raw({ time: 20 }), settings);
        expect(renderer.dab).toHaveBeenCalledOnce();
        expect(renderer.segment).not.toHaveBeenCalled();
        expect(engine.statistics).toMatchObject({ strokeCount: 1, sampleCount: 2, duration: 10 });
    });

    it('finishes the release endpoint only where the hardware reported contact', () => {
        // Mouse release: pressure is always zero, so the endpoint uses the last contact brush.
        const mouse = setup();
        mouse.engine.begin(raw({ pointerType: 'mouse', pressure: 0.5 }), mouse.settings);
        const result = mouse.engine.end(
            raw({ pointerType: 'mouse', x: 100, buttons: 0, pressure: 0, time: 10 }),
            mouse.settings
        );
        expect(mouse.renderer.segment.mock.lastCall?.[1].x).toBe(100);
        expect(mouse.renderer.segment.mock.lastCall?.[2].size).toBe(25);
        expect(result).toMatchObject({ pressure: 0, buttons: 0, velocity: 0 });

        // Pen release with zero pressure: the tip already lifted, so no tail is drawn.
        const lifted = setup();
        lifted.engine.begin(raw(), lifted.settings);
        lifted.engine.end(raw({ x: 100, buttons: 0, pressure: 0, time: 10 }), lifted.settings);
        expect(lifted.renderer.segment).not.toHaveBeenCalled();
        expect(lifted.engine.statistics.strokeCount).toBe(1);

        // Pen release still reporting pressure: finish the endpoint with the last contact brush.
        const pressed = setup();
        pressed.engine.begin(raw(), pressed.settings);
        pressed.engine.end(raw({ x: 100, buttons: 0, pressure: 0.4, time: 10 }), pressed.settings);
        expect(pressed.renderer.segment.mock.lastCall?.[1].x).toBe(100);
        expect(pressed.renderer.segment.mock.lastCall?.[2].size).toBe(50);
    });

    it('rejects another pointer and makes cancellation idempotent', () => {
        const { engine, settings, renderer } = setup();
        engine.begin(raw(), settings);
        expect(engine.begin(raw({ pointerId: 2 }), settings)).toBeNull();
        expect(engine.move(raw({ pointerId: 2 }), settings)).toBeNull();
        expect(engine.end(raw({ pointerId: 2 }), settings)).toBeNull();
        expect(engine.cancel(2)).toBe(false);
        expect(engine.cancel(1)).toBe(true);
        expect(engine.cancel(1)).toBe(false);
        expect(engine.pointerId).toBeNull();
        engine.move(raw({ x: 200 }), settings);
        expect(renderer.segment).not.toHaveBeenCalled();
        expect(engine.statistics).toMatchObject({ strokeCount: 0, cancelledStrokeCount: 1 });
    });

    it('reports raw hover readings but smooths inside a stroke', () => {
        const { engine, settings } = setup();
        settings.processing = {
            ...settings.processing,
            positionSmoothing: 0.5,
            tiltSmoothing: 0.5,
        };
        engine.move(raw({ x: 10, tiltX: 0, pressure: 0, buttons: 0 }), settings);
        const hover = engine.move(
            raw({ x: 100, tiltX: 40, pressure: 0, buttons: 0, time: 10 }),
            settings
        );
        expect(hover).toMatchObject({ x: 100, tiltX: 40 });
        expect(hoverProcessing(settings.processing)).toMatchObject({
            positionSmoothing: 0,
            pressureSmoothing: 0,
            tiltSmoothing: 0,
            velocitySmoothing: settings.processing.velocitySmoothing,
        });
        engine.begin(raw({ x: 10, time: 20 }), settings);
        expect(engine.move(raw({ x: 100, time: 30 }), settings)?.x).toBe(55);
    });

    it('does not count stray up or hover samples as stroke samples', () => {
        const { engine, settings } = setup();
        engine.end(raw(), settings);
        engine.move(raw({ pressure: 0, buttons: 0 }), settings);
        expect(engine.statistics).toMatchObject({ strokeCount: 0, sampleCount: 0 });
    });

    it('reads new settings independently of any Svelte component', () => {
        const { engine, settings, renderer } = setup();
        settings.paint = { ...settings.paint, brushSize: 100, eraseOnStrokeStart: true };
        engine.begin(raw(), settings);
        expect(renderer.clear).toHaveBeenCalledOnce();
        expect(renderer.dab.mock.lastCall?.[1].size).toBe(100);
    });

    it('isolates histories across engine instances', () => {
        const first = setup();
        const second = setup();
        first.engine.begin(raw(), first.settings);
        expect(second.engine.pointerId).toBeNull();
        expect(second.engine.statistics.sampleCount).toBe(0);
    });
});

describe('brush and viewport contracts', () => {
    it('recognizes a combined hardware eraser bitmask and preserves pressure hue direction', () => {
        const settings = createPaintSettings();
        const sample = new SampleProcessor().process(
            raw({ buttons: 34, pressure: 0 }),
            createProcessingSettings()
        );
        const brush = evaluateBrush(sample, { ...settings, brushColorControl: 'PRESSURE' });
        expect(brush.erase).toBe(true);
        expect(brush.size).toBe(1);
        expect(brush.color).toBe('hsl(150, 100%, 50%)');
    });

    it('keeps signed tilt scaling explicit', () => {
        const sample = new SampleProcessor().process(
            raw({ tiltX: -30 }),
            createProcessingSettings()
        );
        expect(
            evaluateBrush(sample, { ...createPaintSettings(), brushSizeControl: 'TILTX' }).size
        ).toBe(1);
    });

    it.each([1, 1.5, 2])('maps a zoomed/panned canvas at DPR %s', (dpr) => {
        const scale = 0.8 / dpr;
        const point = screenToDocument(
            { x: 30 + 100 * scale, y: 50 + 200 * scale },
            { left: 30, top: 50, width: 1920 * scale, height: 1080 * scale },
            { width: 1920, height: 1080 }
        );
        expect(point.x).toBeCloseTo(100);
        expect(point.y).toBeCloseTo(200);
    });

    it('anchors zoom and clamps invalid/extreme zoom values', () => {
        const view = { ...createViewport(), panX: 20, panY: 30, zoom: 1 };
        const anchor = { x: 100, y: 200 };
        const next = zoomAt(view, 2, anchor);
        expect((anchor.x - next.panX) / next.zoom).toBe((anchor.x - view.panX) / view.zoom);
        expect(zoomAt(view, 100, anchor).zoom).toBe(10);
        expect(zoomAt(view, NaN, anchor).zoom).toBe(1);
    });

    it('fits with consistent padding at DPR 2', () => {
        const result = fitViewport({
            ...createViewport(),
            viewportWidth: 992,
            viewportHeight: 572,
            dpr: 2,
        });
        expect(result).toMatchObject({ zoom: 1, panX: 16, panY: 16 });
    });

    it('names exports with a local YYYYMMDD_HHMMSS timestamp', () => {
        expect(timestampForFilename(new Date(2026, 8, 28, 7, 5, 9))).toBe('20260928_070509');
        expect(timestampForFilename(new Date(2026, 11, 31, 23, 59, 59))).toBe('20261231_235959');
    });

    it('counts intervals for sample rates', () => {
        expect(sampleRate(3, 20)).toBe(100);
        expect(sampleRate(1, 0)).toBe(0);
    });
});

describe('input and frame boundaries', () => {
    it('uses coalesced samples once, with an empty/unsupported fallback', () => {
        const sample = { pointerId: 1 } as PointerEvent;
        const event = { type: 'pointermove', getCoalescedEvents: () => [sample] } as PointerEvent;
        expect(pointerSamples(event)).toEqual([sample]);
        expect(
            pointerSamples({ ...event, getCoalescedEvents: () => [] } as unknown as PointerEvent)
        ).toHaveLength(1);
        expect(pointerSamples({ type: 'pointermove' } as PointerEvent)).toHaveLength(1);
    });

    it('treats a pen with pressure as contact even when only the barrel bit is set', () => {
        // Measured on a Wacom pen in Chromium: barrel switch held at contact gives buttons=2.
        expect(hasContact({ pointerType: 'pen', buttons: 2, pressure: 0.6 })).toBe(true);
        expect(hasContact({ pointerType: 'pen', buttons: 32, pressure: 0.2 })).toBe(true);
        expect(hasContact({ pointerType: 'pen', buttons: 0, pressure: 0 })).toBe(false);
        expect(hasContact({ pointerType: 'pen', buttons: 2, pressure: 0 })).toBe(false);
        expect(hasContact({ pointerType: 'mouse', buttons: 2, pressure: 0.5 })).toBe(false);
        expect(hasContact({ pointerType: 'mouse', buttons: 1, pressure: 0.5 })).toBe(true);
        expect(hasContact({ pointerType: 'touch', buttons: 1, pressure: 0 })).toBe(true);
    });

    it('uses explicit canvas dimensions rather than event.target', () => {
        const event = {
            pointerId: 1,
            pointerType: 'pen',
            clientX: 60,
            clientY: 110,
            pressure: 0.5,
            tiltX: 0,
            tiltY: 0,
            buttons: 1,
            twist: 0,
            timeStamp: 42,
        } as PointerEvent;
        expect(
            readPointer(event, { left: 10, top: 10, width: 960, height: 540 } as DOMRect, {
                width: 1920,
                height: 1080,
            })
        ).toMatchObject({ x: 100, y: 200, altitude: 90, azimuth: 0, time: 42 });
    });

    it('processes every sample while publishing only once per frame', () => {
        const { engine, renderer, settings } = setup();
        const draw = vi.fn();
        let callback: FrameRequestCallback = () => {};
        const clock = {
            request: vi.fn((fn: FrameRequestCallback) => {
                callback = fn;
                return 1;
            }),
            cancel: vi.fn(),
        };
        const frames = createFrameScheduler(draw, clock);
        engine.begin(raw(), settings);
        for (let index = 1; index <= 240; index++) {
            engine.move(raw({ x: index, time: index }), settings);
            frames.request();
        }
        expect(renderer.segment).toHaveBeenCalledTimes(240);
        expect(engine.statistics.sampleCount).toBe(241);
        expect(clock.request).toHaveBeenCalledOnce();
        callback(16);
        expect(draw).toHaveBeenCalledOnce();
        frames.request();
        frames.flush();
        expect(draw).toHaveBeenCalledTimes(2);
        frames.request();
        frames.dispose();
        expect(clock.cancel).toHaveBeenCalledTimes(2);
    });
});
