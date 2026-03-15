/**
 * Shared option lists for selects and other UI constants.
 * Also numeric/theme constants used across lib (paint, pointer, draw).
 */

/** HSL hue range for pressure/tilt-to-color mapping (min, max in degrees). */
export const HUE_RANGE = { min: 150, max: 360 };

/** Milliseconds per second for rate calculations. */
export const MS_PER_SECOND = 1000;

/** When pen is vertical (tilt altitude), dab size scale offset so size stays small. */
export const MIN_TILT_SIZE_OFFSET = 0.05;

/** Stroke color for the pressure curve preview in ProcessingSettingsPanel. */
export const CURVE_GRAPH_STROKE = 'rgb(150,180,255)';

export const BRUSH_SIZES = [
    { value: 1, label: '1px' },
    { value: 5, label: '5px' },
    { value: 10, label: '10px' },
    { value: 50, label: '50px' },
    { value: 100, label: '100px' },
    { value: 300, label: '300px' },
];

export const BRUSH_TYPE_OPTIONS = [
    { value: 'MARKER', label: 'Marker' },
    { value: 'ERASER', label: 'Eraser' },
];

export const SIZE_CONTROL_OPTIONS = [
    { value: 'USER', label: "Don't scale" },
    { value: 'PRESSURE', label: 'Pressure' },
    { value: 'TILTX', label: 'Tilt X' },
    { value: 'TILTY', label: 'Tilt Y' },
    { value: 'TILTAZ', label: 'Tilt Azimuth' },
    { value: 'TILTALT', label: 'Tilt Altitude' },
];

export const COLOR_CONTROL_OPTIONS = [
    { value: 'DEFAULT', label: 'Black' },
    { value: 'RED', label: 'Red' },
    { value: 'PRESSURE', label: 'Pressure' },
    { value: 'TILTX', label: 'Tilt X' },
    { value: 'TILTY', label: 'Tilt Y' },
    { value: 'TILTAZ', label: 'Tilt Azimuth' },
    { value: 'TILTALT', label: 'Tilt Altitude' },
    { value: 'BARRELROTATION', label: 'Barrel rotation' },
];

export const MIN_STROKE_SIZES = [
    { value: 0.25, label: '0.25px' },
    { value: 0.5, label: '0.5px' },
    { value: 1, label: '1px' },
    { value: 2, label: '2px' },
    { value: 3, label: '3px' },
    { value: 4, label: '4px' },
    { value: 5, label: '5px' },
    { value: 6, label: '6px' },
    { value: 7, label: '7px' },
    { value: 8, label: '8px' },
    { value: 9, label: '9px' },
    { value: 10, label: '10px' },
];

export const PRESSURE_QUANT_OPTIONS = [
    { value: 0, label: 'OFF' },
    { value: 4, label: '4' },
    { value: 8, label: '8' },
    { value: 16, label: '16' },
    { value: 32, label: '32' },
    { value: 64, label: '64' },
    { value: 128, label: '128' },
    { value: 256, label: '256' },
    { value: 1024, label: '1024' },
    { value: 2048, label: '2048' },
    { value: 4096, label: '4096' },
    { value: 8192, label: '8192' },
];

/** Default canvas viewport offset from top-left of viewport in CSS pixels. */
export const DEFAULT_CANVAS_PAN_X = 16;
export const DEFAULT_CANVAS_PAN_Y = 16;
