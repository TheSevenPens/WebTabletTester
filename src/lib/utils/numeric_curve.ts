import { clamp, finite } from './numerics';

/** Positive amounts sharpen pressure; negative amounts soften it. */
export function applyPressureCurve(input: number, amount: number): number {
    const pressure = clamp(finite(input), 0, 1);
    const curve = clamp(finite(amount), -0.9, 0.9);
    return Math.pow(pressure, curve < 0 ? 1 + curve : 1 / (1 - curve));
}