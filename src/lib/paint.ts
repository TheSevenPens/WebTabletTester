import type { Brush, PaintSettings, ProcessedSample } from './types';
import { HUE_RANGE, MIN_TILT_SIZE_OFFSET } from './constants';
import { angleToColor, azimuthAngleStops, azimuthColorStops, rotationToColor } from './utils/color';
import { clamp, finite } from './utils/numerics';
import { lerp } from './utils/interpolation';

export const POINTER_BUTTONS = { tip: 1, barrel: 2, middle: 4, eraser: 32 } as const;

/** Preserve the original signed tilt mapping, calibrated to 60 degrees. */
export function getDabSize(sample: ProcessedSample, settings: Readonly<PaintSettings>): number {
    const size = clamp(finite(settings.brushSize, 50), 0.1, 300);
    const factors: Record<PaintSettings['brushSizeControl'], number> = {
        USER: 1,
        PRESSURE: sample.pressure,
        TILTX: sample.tiltX / 60,
        TILTY: sample.tiltY / 60,
        TILTAZ: sample.azimuth / 360,
        TILTALT: 1 - sample.altitude / 90 + MIN_TILT_SIZE_OFFSET,
    };
    const minimum = clamp(finite(settings.minStrokeSize, 1), 0.1, 300);
    return Math.max(minimum, clamp(finite(size * factors[settings.brushSizeControl]), 0.1, 300));
}

export function getDabColor(sample: ProcessedSample, settings: Readonly<PaintSettings>): string {
    let fraction: number;
    switch (settings.brushColorControl) {
        case 'DEFAULT':
            return 'black';
        case 'RED':
            return 'rgba(250, 0, 0, 1)';
        case 'TILTAZ':
            return angleToColor(sample.azimuth, azimuthColorStops, azimuthAngleStops).toWebRGB();
        case 'BARRELROTATION':
            return rotationToColor(sample.twist);
        case 'PRESSURE':
            fraction = sample.pressure;
            break;
        case 'TILTX':
            fraction = sample.tiltX / 60;
            break;
        case 'TILTY':
            fraction = sample.tiltY / 60;
            break;
        case 'TILTALT':
            fraction = sample.altitude / 90;
            break;
    }
    // Conventional lerp endpoints preserve the previous application's hue direction.
    return `hsl(${lerp(HUE_RANGE.min, HUE_RANGE.max, finite(fraction))}, 100%, 50%)`;
}

export function evaluateBrush(sample: ProcessedSample, settings: Readonly<PaintSettings>): Brush {
    return {
        size: getDabSize(sample, settings),
        color: getDabColor(sample, settings),
        linecap: settings.linecap,
        erase: settings.brushType === 'ERASER' || (sample.buttons & POINTER_BUTTONS.eraser) !== 0,
    };
}
