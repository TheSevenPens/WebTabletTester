import { clamp, finite, wrapDegrees } from './numerics';

export class RGBColor {
    r: number;
    g: number;
    b: number;

    constructor(r: number, g: number, b: number) {
        this.r = Math.max(0.0, Math.min(1.0, r));
        this.g = Math.max(0.0, Math.min(1.0, g));
        this.b = Math.max(0.0, Math.min(1.0, b));
    }

    static interpolate(color1: RGBColor, color2: RGBColor, t: number): RGBColor {
        const tClamped = Math.max(0.0, Math.min(1.0, t));
        return new RGBColor(
            color1.r + (color2.r - color1.r) * tClamped,
            color1.g + (color2.g - color1.g) * tClamped,
            color1.b + (color2.b - color1.b) * tClamped
        );
    }

    toWebRGB(): string {
        const r = Math.round(this.r * 255);
        const g = Math.round(this.g * 255);
        const b = Math.round(this.b * 255);
        return `rgb(${r}, ${g}, ${b})`;
    }
}

export const azimuthColorStops: RGBColor[] = [
    new RGBColor(1.0, 1.0, 0.0), // Yellow
    new RGBColor(1.0, 0.0, 1.0), // Magenta
    new RGBColor(0.0, 0.7, 1.0), // Blue
    new RGBColor(0.0, 1.0, 1.0), // Cyan
    new RGBColor(1.0, 1.0, 0.0), // Yellow (cyclic)
];

export const azimuthAngleStops: number[] = [0, 90, 180, 270, 360];

export function angleToColor(
    angle: number,
    colorStops: RGBColor[],
    angleStops: number[]
): RGBColor {
    const normalizedAngle = wrapDegrees(finite(angle));
    let lowerIdx = 0;
    let upperIdx = 1;
    let t = 0;

    // Find the two closest stops
    for (let i = 0; i < angleStops.length - 1; i++) {
        if (normalizedAngle >= angleStops[i] && normalizedAngle <= angleStops[i + 1]) {
            lowerIdx = i;
            upperIdx = i + 1;
            t = (normalizedAngle - angleStops[i]) / (angleStops[i + 1] - angleStops[i]);
            break;
        }
    }

    // Interpolate between the two colors
    const outputColor = RGBColor.interpolate(colorStops[lowerIdx], colorStops[upperIdx], t);
    return outputColor;
}

export function rotationToColor(twist: number): string {
    const t = clamp(finite(twist), 0, 359) / 359;
    return `hsl(${t * 360}, 100%, 50%)`;
}
