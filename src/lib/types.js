/**
 * JSDoc typedefs for the app. Import in other files for @param and @returns.
 * @module types
 */

/**
 * @typedef {Object} PaintSettings
 * @property {number} brushSize
 * @property {string} brushSizeControl
 * @property {string} brushColorControl
 * @property {number} eraserSize
 * @property {string} linecap
 * @property {number} minStrokeSize
 * @property {boolean} eraseOnStrokeStart
 */

/**
 * @typedef {Object} SmootherLike
 * @property {number} amount
 * @property {(v: number) => void} setSmoothingAmount
 * @property {(v: number) => number} apply
 * @property {() => void} [resetState]
 */

/**
 * @typedef {Object} CurveLike
 * @property {number} amount
 * @property {(v: number) => void} setCurveAmount
 * @property {(v: number) => number} apply
 * @property {() => void} [resetState]
 */

/**
 * @typedef {Object} ProcessingSettings
 * @property {SmootherLike} posXSmoother
 * @property {SmootherLike} posYSmoother
 * @property {SmootherLike} pressureSmoother
 * @property {CurveLike} pressureCurveAmount
 * @property {SmootherLike} tiltXSmoother
 * @property {SmootherLike} tiltYSmoother
 * @property {SmootherLike} tiltAzimuthSmoother
 * @property {SmootherLike} tiltAltitudeSmoother
 * @property {SmootherLike} velocitySmoother
 * @property {number} pressureQuant
 * @property {number} pressureQuantizationLevels
 */

/**
 * @typedef {Object} PaintState
 * @property {{ x: number; y: number }} canvasPosOldAllEvents
 * @property {{ x: number; y: number }} canvasPosOld
 * @property {boolean} isDrawing
 * @property {number|null} timeOld
 */

/**
 * @typedef {Object} PaintStrokeStats
 * @property {number} strokeCount
 * @property {number} ptreventCount
 * @property {number} startTime
 * @property {number} endTime
 * @property {number} duration
 * @property {number} [rate]
 */

// No runtime exports; this file is for JSDoc only. Export a dummy so the file is a module.
export const __jsdocOnly = true;
