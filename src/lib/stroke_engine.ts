import type {
    Brush,
    EngineSettings,
    ProcessedSample,
    RawSample,
    StrokeRenderer,
    StrokeStats,
} from './types';
import { createStrokeStats } from './initial_state';
import { SampleProcessor } from './processing';
import { evaluateBrush } from './paint';

/** One instance per document. No DOM, stores, clocks, or global mutable state. */
export class StrokeEngine {
    private processor = new SampleProcessor();
    private activeId: number | null = null;
    private previous: ProcessedSample | null = null;
    private previousBrush: Brush | null = null;
    private startedAt = 0;
    private stats = createStrokeStats();

    constructor(private renderer: StrokeRenderer) {}

    get pointerId(): number | null {
        return this.activeId;
    }
    get statistics(): StrokeStats {
        return { ...this.stats };
    }

    begin(raw: RawSample, settings: EngineSettings): ProcessedSample | null {
        if (this.activeId !== null) return null;
        this.processor.reset();
        this.activeId = raw.pointerId;
        this.startedAt = raw.time;
        this.stats.sampleCount = 0;
        this.stats.duration = 0;
        if (settings.paint.eraseOnStrokeStart) this.renderer.clear();
        const sample = this.accept(raw, settings);
        this.previousBrush = evaluateBrush(sample, settings.paint);
        this.renderer.dab(sample, this.previousBrush);
        this.previous = sample;
        return sample;
    }

    move(raw: RawSample, settings: EngineSettings): ProcessedSample | null {
        if (this.activeId !== null && this.activeId !== raw.pointerId) return null;
        if (this.activeId === null) return this.processor.process(raw, settings.processing);
        const sample = this.accept(raw, settings);
        const brush = evaluateBrush(sample, settings.paint);
        if (this.previous && raw.pressure > 0) this.renderer.segment(this.previous, sample, brush);
        this.previous = sample;
        this.previousBrush = brush;
        return sample;
    }

    end(raw: RawSample, settings: EngineSettings): ProcessedSample | null {
        if (this.activeId !== raw.pointerId) return null;
        const sample = this.accept(raw, settings);
        // Release pressure is usually zero. Finish the endpoint using the last contact's brush.
        if (
            this.previous &&
            this.previousBrush &&
            (sample.x !== this.previous.x || sample.y !== this.previous.y)
        ) {
            this.renderer.segment(this.previous, sample, this.previousBrush);
        }
        this.stats.strokeCount++;
        this.resetStroke();
        return { ...sample, pressure: 0, buttons: 0, velocity: 0 };
    }

    cancel(pointerId = this.activeId): boolean {
        if (this.activeId === null || pointerId !== this.activeId) return false;
        this.stats.cancelledStrokeCount++;
        this.resetStroke();
        return true;
    }

    private accept(raw: RawSample, settings: EngineSettings): ProcessedSample {
        this.stats.sampleCount++;
        this.stats.duration = Math.max(this.stats.duration, raw.time - this.startedAt, 0);
        return this.processor.process(raw, settings.processing);
    }

    private resetStroke(): void {
        this.activeId = null;
        this.previous = null;
        this.previousBrush = null;
        this.processor.reset();
    }
}
