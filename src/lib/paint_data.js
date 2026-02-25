import { OrderedRange } from './utils/ranges.js';
import { NumericSmoother } from './utils/numeric_smoother.js';
import { NumericCurve } from './utils/numeric_curve.js';

export const settingStylusPenColor = "black";
export const PRESSURE_RANGE = new OrderedRange(0.0, 1.0);
export const BRUSHSIZE_RANGE = new OrderedRange(0.1, 300.0);

export const paintSettings =
{
    brushSize: 50,
    brushSizeControl: "PRESSURE",
    brushColorControl: "DEFAULT",
    eraserSize: 30,
    linecap: "round",
    minStrokeSize: 1.0,
    eraseOnStrokeStart: false,
};

export const processingSettings =
{
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

export const paintCurrentDabSettings =
{
    brushSize: 1,
    brushColor: settingStylusPenColor,
};

export const paintState =
{
    canvasPosOldAllEvents: { x: 0, y: 0 },
    canvasPosOld: { x: 0, y: 0 },
    isDrawing: false,
    timeOld: null,
};

export const paintStrokeStats =
{
    strokeCount: 0,
    ptreventCount: 0,
    startTime: 0,
    endTime: 0,
    duration: 0,
};
