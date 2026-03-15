import { clearUxPointerStats, updateUxPointerStats } from './app_ux_pointer_stats.js';
import { updateUxStrokeStats } from './app_ux_stroke_stats.js';
import { Position } from './utils/geometry.js';
import { quantize } from './utils/numerics.js';
import { paintDab, paintStrokeStop } from './paint.js';
import { PointerRecord } from './pointer_record.js';
import { paintStrokeStats as legacyStrokeStats } from './paint_data.js';


export const pointerButtonCode = {
    none: 0x0, // nothing is pressed
    tip: 0x1, // left mouse, touch contact, pen contact
    barrel: 0x2, // right mouse, pen barrel button
    middle: 0x4, // middle mouse
    eraser: 0x20, // pen eraser button
};

export const pointerConstants =
{
    maxTiltAltitude: 90.0,
    maxTiltAzimuth: 360.0,
    maxTiltX: 60.0,
    maxTiltY: 60.0,
}

const buttonNames = new Map([
    [pointerButtonCode.none,   "none"],
    [pointerButtonCode.tip,    "pen tip"],
    [pointerButtonCode.barrel, "pen button"],
    [pointerButtonCode.middle, "middle mouse"],
    [pointerButtonCode.eraser, "eraser"],
]);

export function buttonToString(button) {
    return buttonNames.get(button) ?? "unknown";
}

export function isTargetPointerEvent(ptrEvent) {
    return (
        ptrEvent.pointerType === "mouse" ||
        ptrEvent.pointerType === "pen" ||
        ptrEvent.pointerType === "touch"
    );
}

export function defaultPtrEventHandlerDoNothing(_ptrEvent) {
    // do nothing
}

/////////////////////////////////////////////////////////////////////////
// Handle drawing for HTML5 Pointer Events. Thin orchestrator: filter → build record → apply.
//
export function pointerEventHandler(ptrEvent, canvasEl, appSettings, processingSettings, paintState, _paintStrokeStats) {
    if (!isTargetPointerEvent(ptrEvent)) return;

    const canvasRect = canvasEl.getBoundingClientRect();
    const ptrRec = getPtrRec(canvasRect, ptrEvent, processingSettings, paintState);

    applyPointerEvent(ptrRec, canvasEl, appSettings, paintState);
}

/**
 * Update live stats, perform paint, and persist state for next event.
 * @param {import('./pointer_record.js').PointerRecord} ptrRec
 * @param {HTMLCanvasElement} canvasEl
 * @param {{ canvasColor: string }} appSettings
 * @param {import('./types.js').PaintState} paintState
 * @returns {void}
 */
export function applyPointerEvent(ptrRec, canvasEl, appSettings, paintState) {
    updateUxPointerStats(ptrRec);
    paintDab(ptrRec, canvasEl, appSettings);
    paintState.canvasPosOldAllEvents = new Position(ptrRec.canvasPosXProcessed, ptrRec.canvasPosYProcessed);
    paintState.timeOld = ptrRec.time;
}

export function onPointerUp(_ptrEvent) {
    paintStrokeStop();
    updateUxStrokeStats();
}

export function onPointerEnter(_ptrEvent) {
    document.body.style.cursor = "crosshair";
}

export function onPointerLeave(_ptrEvent) {
    document.body.style.cursor = "default";
    clearUxPointerStats();
}

// Deprecated: HTML element binding is handled locally via CanvasArea.svelte event properties

export function getPtrRec(canvasRect, ptrEvent, processingSettings, paintState) {
    legacyStrokeStats.ptreventCount = legacyStrokeStats.ptreventCount + 1;
    return new PointerRecord(canvasRect, ptrEvent, processingSettings, paintState);
}

/**
 * Apply quantization, curve, and smoothing to raw pressure.
 * @param {number} inputPressure - Raw pressure in [0, 1]
 * @param {import('./types.js').ProcessingSettings} processingSettings
 * @returns {number} Processed pressure in [0, 1]
 */
export function processPressure(inputPressure, processingSettings) {
    let outputPressure = inputPressure;
    // FIRST QUANTIZE
    if (processingSettings.pressureQuant > 0) {
        outputPressure = quantize(inputPressure, processingSettings.pressureQuant);
    }

    // SECOND APPLY A CURVE
    outputPressure = processingSettings.pressureCurveAmount.apply(outputPressure);

    // THIRD APPLY SMOOTHING (negative old values mean there is no old value)
    outputPressure = processingSettings.pressureSmoother.apply(outputPressure);


    return outputPressure;
}