import { writable } from 'svelte/store';
import { OrderedRange } from './utils/ranges.js';
import { NumericSmoother } from './utils/numeric_smoother.js';
import { NumericCurve } from './utils/numeric_curve.js';

// Global App Settings
export const appSettings = writable({
    canvasColor: "rgba(230, 230, 250, 1.0)",
    downloadFilename: "TabletTester_Untitled",
});

// Stylus
export const settingStylusPenColor = "black";
export const PRESSURE_RANGE = new OrderedRange(0.0, 1.0);
export const BRUSHSIZE_RANGE = new OrderedRange(0.1, 300.0);

// Paint Format Settings
export const paintSettings = writable({
    brushSize: 50,
    brushSizeControl: "PRESSURE",
    brushColorControl: "DEFAULT",
    eraserSize: 30,
    linecap: "round",
    minStrokeSize: 1.0,
    eraseOnStrokeStart: false,
});

// Processing Math Handlers
export const processingSettings = writable({
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
});

// The current evaluated dab
export const paintCurrentDabSettings = writable({
    brushSize: 1,
    brushColor: settingStylusPenColor,
});

// Current Paint State
export const paintState = writable({
    canvasPosOldAllEvents: { x: 0, y: 0 },
    canvasPosOld: { x: 0, y: 0 },
    isDrawing: false,
    timeOld: null,
});

// Statistics
export const paintStrokeStats = writable({
    strokeCount: 0,
    ptreventCount: 0,
    startTime: 0,
    endTime: 0,
    duration: 0,
    rate: 0
});

// UI View State
export const uiState = writable({
    showStrokeStats: false
});

// Live Pointer Record State
export const pointerLiveStats = writable({
    buttons: "-",
    buttonString: "-",
    pressureProcessed: "-.----",
    tiltXProcessed: "\u00a0\u00a0\u00a0-.-",
    tiltYProcessed: "\u00a0\u00a0\u00a0-.-",
    tiltAzimuthProcessed: "\u00a0\u00a0--.-",
    tiltAltitudeProcessed: "\u00a0\u00a0--.-",
    canvasPosXProcessed: "\u00a0---.-",
    canvasPosYProcessed: "\u00a0---.-",
    barrelRotation: "-",
    velocity: "\u00a0---.-",
    direction: "\u00a0---.-",
    size: "-"
});
