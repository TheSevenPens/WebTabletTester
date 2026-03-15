import { BRUSHSIZE_RANGE, paintCurrentDabSettings, paintSettings, paintState, paintStrokeStats, processingSettings, settingStylusPenColor } from './paint_data';
import { clampToRange } from './utils/ranges';
import { lerp } from './utils/interpolation';
import { clearCanvasToTransparent, drawLine, getCanvas2DContext } from './utils/draw';
import { angleToColor, azimuthAngleStops, azimuthColorStops, getCETColor } from './utils/color';
import { Position } from './utils/geometry';
import { roundTo3DecimalPlaces } from './utils/numerics';
import { pointerButtonCode, pointerConstants } from './app_pointer';
import { HUE_RANGE, MIN_TILT_SIZE_OFFSET } from './constants';
import type { PointerRecord } from './pointer_record';
import type { PaintSettings } from './types';


export function paintStrokeStart(settings: PaintSettings, canvasEl: HTMLCanvasElement, appSettings: any): void {
    if (settings.eraseOnStrokeStart) {
        const ctx = getCanvas2DContext(canvasEl);
        if (ctx) clearCanvasToTransparent(ctx, canvasEl);
    }
    paintState.isDrawing = true;
    paintStrokeStats.ptreventCount = 0;
    paintStrokeStats.startTime = performance.now();
    processingSettings.posXSmoother.resetState!();
    processingSettings.posYSmoother.resetState!();
    processingSettings.pressureSmoother.resetState!();
    processingSettings.tiltXSmoother.resetState!();
    processingSettings.tiltYSmoother.resetState!();
    processingSettings.tiltAzimuthSmoother.resetState!();
    processingSettings.tiltAltitudeSmoother.resetState!();
    processingSettings.velocitySmoother.resetState!();
}

export function paintStrokeStop(): void {
    paintState.isDrawing = false;
    paintStrokeStats.strokeCount = paintStrokeStats.strokeCount + 1;
    paintStrokeStats.endTime = performance.now();
    paintStrokeStats.duration = Math.round(paintStrokeStats.endTime - paintStrokeStats.startTime);
}


/**
 * Compute dab size from pointer record and current paint settings (brush size control, min size).
 */
export function getDabSize(ptrRec: PointerRecord): number {
    let newSize = paintSettings.brushSize;

    // HANDLE DAB SIZE
    if (paintSettings.brushSizeControl === "PRESSURE") {
        newSize = newSize * ptrRec.pressureProcessed;
    }
    else if (paintSettings.brushSizeControl === "TILTX") {
        newSize = newSize * ptrRec.tiltXProcessed / pointerConstants.maxTiltX;
    }
    else if (paintSettings.brushSizeControl === "TILTY") {
        newSize = newSize * ptrRec.tiltYProcessed / pointerConstants.maxTiltY;
    }
    else if (paintSettings.brushSizeControl === "TILTAZ") {
        newSize = newSize * ptrRec.tiltAzimuthProcessed / pointerConstants.maxTiltAzimuth;
    }
    else if (paintSettings.brushSizeControl === "TILTALT") {
        newSize = newSize * ((1.0 - (ptrRec.tiltAltitudeProcessed / pointerConstants.maxTiltAltitude)) + MIN_TILT_SIZE_OFFSET);
    }
    newSize = clampToRange(newSize, BRUSHSIZE_RANGE)
    // Apply minimum stroke size constraint
    if (newSize < paintSettings.minStrokeSize) {
        newSize = paintSettings.minStrokeSize;
    }
    newSize = roundTo3DecimalPlaces(newSize);
    return newSize;
}

/**
 * Compute dab color from pointer record and app settings (brush color control, eraser, etc.).
 */
export function getDabColor(ptrRec: PointerRecord, appSettings: any): string {
    let dabColor = settingStylusPenColor;

    if (ptrRec.buttons === pointerButtonCode.eraser) {
        dabColor = appSettings.canvasColor;
    }
    else if (paintSettings.brushColorControl === "PRESSURE") {
        const hue1 = lerp(HUE_RANGE.max, HUE_RANGE.min, ptrRec.pressureProcessed);
        dabColor = `hsl(${hue1}, 100%, 50%)`;
    }
    else if (paintSettings.brushColorControl === "TILTALT") {
        const hue2 = lerp(HUE_RANGE.max, HUE_RANGE.min, ptrRec.tiltAltitudeProcessed / pointerConstants.maxTiltAltitude);
        dabColor = `hsl(${hue2}, 100%, 50%)`;
    }
    else if (paintSettings.brushColorControl === "TILTAZ") {
        dabColor = angleToColor(ptrRec.tiltAzimuthProcessed, azimuthColorStops, azimuthAngleStops).toWebRGB();
    }
    else if (paintSettings.brushColorControl === "TILTX") {
        const hue3 = lerp(HUE_RANGE.max, HUE_RANGE.min, ptrRec.tiltXProcessed / pointerConstants.maxTiltX);
        dabColor = `hsl(${hue3}, 100%, 50%)`;
    }
    else if (paintSettings.brushColorControl === "TILTY") {
        const hue4 = lerp(HUE_RANGE.max, HUE_RANGE.min, ptrRec.tiltYProcessed / pointerConstants.maxTiltY);
        dabColor = `hsl(${hue4}, 100%, 50%)`;
    }
    else if (paintSettings.brushColorControl === "BARRELROTATION") {
        dabColor = getCETColor(ptrRec.barrelRotation);
    }
    else if (paintSettings.brushColorControl === "ERASER") {
        dabColor = appSettings.canvasColor;
    }
    else if (paintSettings.brushColorControl === "RED") {
        // CANVAS COLOR TO COLOR
        dabColor = "rgba(250, 0, 0, 1.0)";
    }

    return dabColor;
}

export function updateDabSettings(ptrRec: PointerRecord, appSettings: any): void {
    // SIZE
    const newSize = getDabSize(ptrRec);
    paintCurrentDabSettings.brushSize = newSize;

    // COLOR
    paintCurrentDabSettings.brushColor = getDabColor(ptrRec, appSettings);
}

/**
 * Handle one pointer event: start stroke, or continue stroke (draw segment), or no-op.
 */
export function paintDab(ptrRec: PointerRecord, canvasEl: HTMLCanvasElement, appSettings: any): void {
    const appCanvasContext = getCanvas2DContext(canvasEl);
    if (ptrRec.pressureRaw <= 0) {
        // If No pressure input
        // - reset any smoothing
        processingSettings.posXSmoother.resetState!();
        processingSettings.posYSmoother.resetState!();
        processingSettings.pressureSmoother.resetState!();
        processingSettings.tiltXSmoother.resetState!();
        processingSettings.tiltYSmoother.resetState!();
        processingSettings.tiltAzimuthSmoother.resetState!();
        processingSettings.tiltAltitudeSmoother.resetState!();

    }


    const currentPos = new Position(ptrRec.canvasPosXProcessed, ptrRec.canvasPosYProcessed);

    switch (ptrRec.type) {
        case "pointerdown":
            paintStrokeStart(paintSettings, canvasEl, appSettings);
            paintState.canvasPosOld = currentPos;
            break;

        case "pointermove":
            if (!paintState.isDrawing) {
                return;
            }

            updateDabSettings(ptrRec, appSettings);


            if (ptrRec.pressureRaw > 0 && appCanvasContext) {
                const shouldErase =
                    ptrRec.buttons === pointerButtonCode.eraser ||
                    paintSettings.brushColorControl === 'ERASER';

                if (shouldErase) {
                    appCanvasContext.save();
                    appCanvasContext.globalCompositeOperation = 'destination-out';
                    drawLine(
                        appCanvasContext,
                        paintState.canvasPosOld,
                        currentPos,
                        paintCurrentDabSettings.brushSize,
                        'rgba(0,0,0,1.0)',
                        paintSettings.linecap as CanvasLineCap
                    );
                    appCanvasContext.restore();
                } else {
                    drawLine(
                        appCanvasContext,
                        paintState.canvasPosOld,
                        currentPos,
                        paintCurrentDabSettings.brushSize,
                        paintCurrentDabSettings.brushColor,
                        paintSettings.linecap as CanvasLineCap
                    );
                }
            }

            paintState.canvasPosOld = currentPos;
            break;
    }

}
