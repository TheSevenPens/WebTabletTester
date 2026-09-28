import { clamp, finite, wrapDegrees } from './numerics';

/** EMA: amount is the previous sample's weight; zero disables smoothing. */
export class NumericSmoother {
    private previous: number | null = null;

    reset(): void { this.previous = null; }

    apply(input: number, amount: number, circular = false): number {
        const value = finite(input);
        const weight = clamp(finite(amount), 0, 0.999);
        let output = value;
        if (this.previous !== null) {
            const delta = circular
                ? wrapDegrees(value - this.previous + 180) - 180
                : value - this.previous;
            output = this.previous + delta * (1 - weight);
        }
        this.previous = circular ? wrapDegrees(output) : output;
        return this.previous;
    }
}