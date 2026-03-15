import { clearUxPointerStats, updateUxPointerStats } from './app_ux_pointer_stats';
import { updateUxStrokeStats } from './app_ux_stroke_stats';
import { Position } from './utils/geometry';
import { quantize } from './utils/numerics';
import { paintDab, paintStrokeStop } from './paint';
import { PointerRecord } from './pointer_record';
import { paintStrokeStats as legacyStrokeStats } from './paint_data';
import type { ProcessingSettings, PaintState, PaintStrokeStats } from './types';


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

export function buttonToString(button: number): string {
    return buttonNames.get(button) ?? "unknown";
}

export function isTargetPointerEvent(ptrEvent: PointerEvent): boolean {
    return (
        ptrEvent.pointerType === "mouse" ||
        ptrEvent.pointerType === "pen" ||
        ptrEvent.pointerType === "touch"
    );
}

export function defaultPtrEventHandlerDoNothing(_ptrEvent: PointerEvent): void {
    // do nothing
}

/////////////////////////////////////////////////////////////////////////
// Handle drawing for HTML5 Pointer Events. Thin orchestrator: filter → build record → apply.
//
export function pointerEventHandler(
    ptrEvent: PointerEvent,
    inputCanvasEl: HTMLCanvasElement,
    drawCanvasEl: HTMLCanvasElement,
    appSettings: any,
    processingSettings: ProcessingSettings,
    paintState: PaintState,
    _paintStrokeStats: PaintStrokeStats
): void {
    if (!isTargetPointerEvent(ptrEvent)) return;

    const canvasRect = inputCanvasEl.getBoundingClientRect();
    const ptrRec = getPtrRec(canvasRect, ptrEvent, processingSettings, paintState);

    applyPointerEvent(ptrRec, drawCanvasEl, appSettings, paintState);
}

/**
 * Update live stats, perform paint, and persist state for next event.
 */
export function applyPointerEvent(ptrRec: PointerRecord, canvasEl: HTMLCanvasElement, appSettings: any, paintState: PaintState): void {
    updateUxPointerStats(ptrRec);
    paintDab(ptrRec, canvasEl, appSettings);
    paintState.canvasPosOldAllEvents = new Position(ptrRec.canvasPosXProcessed, ptrRec.canvasPosYProcessed);
    paintState.timeOld = ptrRec.time;
}

export function onPointerUp(_ptrEvent: PointerEvent): void {
    paintStrokeStop();
    updateUxStrokeStats();
}

export function onPointerEnter(_ptrEvent: PointerEvent): void {
    document.body.style.cursor = "crosshair";
}

export function onPointerLeave(_ptrEvent: PointerEvent): void {
    document.body.style.cursor = "default";
    clearUxPointerStats();
}

// Deprecated: HTML element binding is handled locally via CanvasArea.svelte event properties

export function getPtrRec(canvasRect: DOMRect, ptrEvent: PointerEvent, processingSettings: ProcessingSettings, paintState: PaintState): PointerRecord {
    legacyStrokeStats.ptreventCount = legacyStrokeStats.ptreventCount + 1;
    return new PointerRecord(canvasRect, ptrEvent, processingSettings, paintState);
}

/**
 * Apply quantization, curve, and smoothing to raw pressure.
 */
export function processPressure(inputPressure: number, processingSettings: ProcessingSettings): number {
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