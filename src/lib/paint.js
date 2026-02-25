import { BRUSHSIZE_RANGE, paintCurrentDabSettings, paintSettings, paintState, paintStrokeStats, processingSettings, settingStylusPenColor } from './paint_data.js';
import { clampToRange } from './utils/ranges.js';
import { lerp } from './utils/interpolation.js';
import { clearCanvas, drawLine } from './utils/draw.js';
import { angleToColor, azimuthAngleStops, azimuthColorStops, getCETColor } from './utils/color.js';
import { Position } from './utils/geometry.js';
import { roundTo3DecimalPlaces } from './utils/numerics.js';
import { pointerButtonCode, pointerConstants } from './app_pointer.js';


export function paintStrokeStart(settings, canvasEl, appSettings) {
    if (settings.eraseOnStrokeStart) {
        clearCanvas(canvasEl.getContext('2d'), canvasEl, appSettings.canvasColor);
    }
    paintState.isDrawing = true;
    paintStrokeStats.ptreventCount = 0;
    paintStrokeStats.startTime = performance.now();
    processingSettings.posXSmoother.resetState();
    processingSettings.posYSmoother.resetState();
    processingSettings.pressureSmoother.resetState();
    processingSettings.tiltXSmoother.resetState();
    processingSettings.tiltYSmoother.resetState();
    processingSettings.tiltAzimuthSmoother.resetState();
    processingSettings.tiltAltitudeSmoother.resetState();
    processingSettings.velocitySmoother.resetState();
}

export function paintStrokeStop() {
    paintState.isDrawing = false;
    paintStrokeStats.strokeCount = paintStrokeStats.strokeCount + 1;
    paintStrokeStats.endTime = performance.now();
    paintStrokeStats.duration = Math.round(paintStrokeStats.endTime - paintStrokeStats.startTime);
}


export function getDabSize(ptrRec) {
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
        newSize = newSize * ((1.0 - (ptrRec.tiltAltitudeProcessed / pointerConstants.maxTiltAltitude)) + 0.05); // when pen is vertical size is small, as pen tilts dab gets larger
    }
    newSize = clampToRange(newSize, BRUSHSIZE_RANGE)
    // Apply minimum stroke size constraint
    if (newSize < paintSettings.minStrokeSize) {
        newSize = paintSettings.minStrokeSize;
    }
    newSize = roundTo3DecimalPlaces(newSize);
    return newSize;
}

export function getDabColor(ptrRec, appSettings) {
    let dabColor = settingStylusPenColor;

    if (ptrRec.buttons === pointerButtonCode.eraser) {
        dabColor = appSettings.canvasColor;
    }
    else if (paintSettings.brushColorControl === "PRESSURE") {
        const hue1 = lerp(360, 150, ptrRec.pressureProcessed);
        dabColor = `hsl(${hue1}, 100%, 50%)`;
    }
    else if (paintSettings.brushColorControl === "TILTALT") {
        const hue2 = lerp(360, 150, ptrRec.tiltAltitudeProcessed / pointerConstants.maxTiltAltitude);
        dabColor = `hsl(${hue2}, 100%, 50%)`;
    }
    else if (paintSettings.brushColorControl === "TILTAZ") {
        dabColor = angleToColor(ptrRec.tiltAzimuthProcessed, azimuthColorStops, azimuthAngleStops).toWebRGB();
    }
    else if (paintSettings.brushColorControl === "TILTX") {
        const hue3 = lerp(360, 150, ptrRec.tiltXProcessed / pointerConstants.maxTiltX);
        dabColor = `hsl(${hue3}, 100%, 50%)`;
    }
    else if (paintSettings.brushColorControl === "TILTY") {
        const hue4 = lerp(360, 150, ptrRec.tiltYProcessed / pointerConstants.maxTiltY);
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

export function updateDabSettings(ptrRec, appSettings) {
    // SIZE
    const newSize = getDabSize(ptrRec);
    paintCurrentDabSettings.brushSize = newSize;

    // COLOR
    paintCurrentDabSettings.brushColor = getDabColor(ptrRec, appSettings);
}

export function paintDab(ptrRec, canvasEl, appSettings) {
    const appCanvasContext = canvasEl.getContext('2d');
    if (ptrRec.pressureRaw <= 0) {
        // If No pressure input
        // - reset any smoothing
        processingSettings.posXSmoother.resetState();
        processingSettings.posYSmoother.resetState();
        processingSettings.pressureSmoother.resetState();
        processingSettings.tiltXSmoother.resetState();
        processingSettings.tiltYSmoother.resetState();
        processingSettings.tiltAzimuthSmoother.resetState();
        processingSettings.tiltAltitudeSmoother.resetState();

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


            if (ptrRec.pressureRaw > 0) {
                drawLine(appCanvasContext,
                    paintState.canvasPosOld,
                    currentPos,
                    paintCurrentDabSettings.brushSize,
                    paintCurrentDabSettings.brushColor,
                    paintSettings.linecap);
            }

            paintState.canvasPosOld = currentPos;
            break;
    }

}

