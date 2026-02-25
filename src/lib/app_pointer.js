import { clearUxPointerStats, updateUxPointerStats } from './app_ux_pointer_stats.js';
import { updateUxStrokeStats } from './app_ux_stroke_stats.js';
import { Position } from './utils/geometry.js';
import { quantize } from './utils/numerics.js';
import { paintDab, paintStrokeStop } from './paint.js';
import { PointerRecord } from './pointer_record.js';


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

export function buttonToString(button) {
    if (button === pointerButtonCode.none) {
        return "none";
    } else if (button === pointerButtonCode.tip) {
        return "pen tip";
    } else if (button === pointerButtonCode.barrel) {
        return "pen button";
    } else if (button === pointerButtonCode.middle) {
        return "middle mouse";
    } else if (button === pointerButtonCode.eraser) {
        return "eraser";
    } else {
        return "unknown";
    }
}

export function isTargetPointerEvent(ptrEvent) {
    return (
        ptrEvent.pointerType === "mouse" ||
        ptrEvent.pointerType === "pen" ||
        ptrEvent.pointerType === "touch"
    );
}

export function defaultPtrEventHandlerDoNothing(ptrEvent) {
    // do nothing
}

/////////////////////////////////////////////////////////////////////////
// Handle drawing for HTML5 Pointer Events.
//
export function pointerEventHandler(ptrEvent, canvasEl, appSettings, processingSettings, paintState, paintStrokeStats) {
    // Ignore events we don't care about
    if (!isTargetPointerEvent(ptrEvent)) {
        return;
    }

    // The paint system needs to know the dimensions of the canvas it will draw on
    const canvasRect = canvasEl.getBoundingClientRect();
    // given the canvas and the pointer event the paint_rec
    // has all the information needed to draw
    const ptrRec = getPtrRec(canvasRect, ptrEvent, processingSettings, paintState, paintStrokeStats);

    // Live stats such as pointer position need to updated
    updateUxPointerStats(ptrRec);
    // perform the actual paint
    paintDab(ptrRec, canvasEl, appSettings);

    paintState.canvasPosOldAllEvents = new Position(ptrRec.canvasPosXProcessed, ptrRec.canvasPosYProcessed);
    paintState.timeOld = ptrRec.time;
}

export function onPointerUp(ptrEvent) {
    paintStrokeStop();
    updateUxStrokeStats();
}

export function onPointerEnter(ptrEvent) {
    document.body.style.cursor = "crosshair";
}

export function onPointerLeave(ptrEvent) {
    document.body.style.cursor = "default";
    clearUxPointerStats();
}

// Deprecated: HTML element binding is handled locally via CanvasArea.svelte event properties

export function getPtrRec(canvasRect, ptrEvent, processingSettings, paintState, paintStrokeStats) {
    paintStrokeStats.ptreventCount = paintStrokeStats.ptreventCount + 1;
    return new PointerRecord(canvasRect, ptrEvent, processingSettings, paintState);
}

export function processPressure(inputPressure, processingSettings) {
    var outputPressure = inputPressure;
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