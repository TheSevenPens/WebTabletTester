export const clamp = (value: number, min: number, max: number): number =>
    Math.min(max, Math.max(min, value));

export function finite(value: number, fallback = 0): number {
    return Number.isFinite(value) ? value : fallback;
}

export const radiansToDegrees = (radians: number): number => (radians * 180) / Math.PI;
export const wrapDegrees = (degrees: number): number => ((degrees % 360) + 360) % 360;

export function quantize(value: number, levels: number): number {
    if (!Number.isFinite(value) || value < 0 || value > 1) {
        throw new RangeError('Pressure must be finite and within [0, 1].');
    }
    if (!Number.isInteger(levels) || levels < 2) {
        throw new RangeError('Quantization levels must be an integer >= 2.');
    }
    return Math.round(value * (levels - 1)) / (levels - 1);
}

/** Count intervals, not endpoints. Down/move/up samples are all included. */
export function sampleRate(count: number, durationMs: number): number {
    return durationMs > 0 ? (Math.max(0, count - 1) * 1000) / durationMs : 0;
}
