import type { ProcessedSample, ProcessingSettings, RawSample } from './types';
import { NumericSmoother } from './utils/numeric_smoother';
import { applyPressureCurve } from './utils/numeric_curve';
import { clamp, finite, quantize, radiansToDegrees, wrapDegrees } from './utils/numerics';

export function processPressure(
    input: number,
    settings: Readonly<ProcessingSettings>,
    smoother: NumericSmoother
): number {
    let pressure = clamp(finite(input), 0, 1);
    if (Number.isInteger(settings.pressureQuant) && settings.pressureQuant >= 2) {
        pressure = quantize(pressure, settings.pressureQuant);
    }
    return smoother.apply(
        applyPressureCurve(pressure, settings.pressureCurve),
        settings.pressureSmoothing
    );
}

export class SampleProcessor {
    private filters = {
        x: new NumericSmoother(),
        y: new NumericSmoother(),
        pressure: new NumericSmoother(),
        tiltX: new NumericSmoother(),
        tiltY: new NumericSmoother(),
        azimuth: new NumericSmoother(),
        altitude: new NumericSmoother(),
        velocity: new NumericSmoother(),
    };
    private previous: ProcessedSample | null = null;

    reset(): void {
        Object.values(this.filters).forEach((filter) => filter.reset());
        this.previous = null;
    }

    process(raw: RawSample, settings: Readonly<ProcessingSettings>): ProcessedSample {
        const sample: ProcessedSample = {
            ...raw,
            raw: { ...raw },
            x: this.filters.x.apply(raw.x, settings.positionSmoothing),
            y: this.filters.y.apply(raw.y, settings.positionSmoothing),
            pressure: processPressure(raw.pressure, settings, this.filters.pressure),
            tiltX: this.filters.tiltX.apply(raw.tiltX, settings.tiltSmoothing),
            tiltY: this.filters.tiltY.apply(raw.tiltY, settings.tiltSmoothing),
            azimuth: this.filters.azimuth.apply(raw.azimuth, settings.tiltSmoothing, true),
            altitude: this.filters.altitude.apply(raw.altitude, settings.tiltSmoothing),
            velocity: 0,
            direction: 0,
        };
        if (this.previous) {
            const dx = sample.x - this.previous.x;
            const dy = sample.y - this.previous.y;
            const seconds = (sample.time - this.previous.time) / 1000;
            if (seconds > 0) {
                sample.velocity = this.filters.velocity.apply(
                    Math.hypot(dx, dy) / seconds,
                    settings.velocitySmoothing
                );
                sample.direction = wrapDegrees(radiansToDegrees(Math.atan2(dy, dx)));
            }
        }
        this.previous = sample;
        return sample;
    }
}
