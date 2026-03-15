/**
 * Single source of truth for initial/default state.
 * Used by stores.js and paint_data.js so structure is defined once.
 */
import { NumericSmoother } from './utils/numeric_smoother.js';
import { NumericCurve } from './utils/numeric_curve.js';

export const STYLUS_PEN_COLOR = 'black';

export const INITIAL_PAINT_SETTINGS = {
    brushSize: 50,
    brushSizeControl: 'PRESSURE',
    brushColorControl: 'DEFAULT',
    eraserSize: 30,
    linecap: 'round',
    minStrokeSize: 1.0,
    eraseOnStrokeStart: false,
};

export function createInitialProcessingSettings() {
    return {
        posXSmoother: new NumericSmoother(0.0),
        posYSmoother: new NumericSmoother(0.0),
        pressureSmoother: new NumericSmoother(0.0),
        pressureCurveAmount: new NumericCurve(0.0),
        tiltXSmoother: new NumericSmoother(0.0),
        tiltYSmoother: new NumericSmoother(0.0),
        tiltAzimuthSmoother: new NumericSmoother(0.0),
        tiltAltitudeSmoother: new NumericSmoother(0.0),
        velocitySmoother: new NumericSmoother(0.9),
        pressureQuant: 0,
        pressureQuantizationLevels: 0,
    };
}

export const INITIAL_PAINT_CURRENT_DAB_SETTINGS = {
    brushSize: 1,
    brushColor: STYLUS_PEN_COLOR,
};

export const INITIAL_PAINT_STATE = {
    canvasPosOldAllEvents: { x: 0, y: 0 },
    canvasPosOld: { x: 0, y: 0 },
    isDrawing: false,
    timeOld: null,
};

export const INITIAL_PAINT_STROKE_STATS = {
    strokeCount: 0,
    ptreventCount: 0,
    startTime: 0,
    endTime: 0,
    duration: 0,
    rate: 0,
};

export const POINTER_LIVE_STATS_DEFAULT = {
    buttons: '-',
    buttonString: '-',
    pressureProcessed: '-.----',
    tiltXProcessed: '\u00a0\u00a0\u00a0-.-',
    tiltYProcessed: '\u00a0\u00a0\u00a0-.-',
    tiltAzimuthProcessed: '\u00a0\u00a0--.-',
    tiltAltitudeProcessed: '\u00a0\u00a0--.-',
    canvasPosXProcessed: '\u00a0---.-',
    canvasPosYProcessed: '\u00a0---.-',
    barrelRotation: '-',
    velocity: '\u00a0---.-',
    direction: '\u00a0---.-',
    size: '-',
};
