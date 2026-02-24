import { format1Digit4Decimals, format4Digits1Decimal } from './numerics.js';
import { paintCurrentDabSettings } from './paint_data.js';
import { buttonToString } from './app_pointer.js';

// POINTER STATS ----------------------------------------------
export const uxPointerStats = {
    get buttons() { return document.getElementById("buttonsVal"); },
    get pressureProcessed() { return document.getElementById("pressureProcessedVal"); },

    get tiltXProcessed() { return document.getElementById("tiltXProcessedVal"); },
    get tiltYProcessed() { return document.getElementById("tiltYProcessedVal"); },
    get tiltAzimuthProcessed() { return document.getElementById("tiltAzimuthProcessedVal"); },
    get tiltAltitudeProcessed() { return document.getElementById("tiltAltitudeProcessedVal"); },

    get posXCanvasProcessed() { return document.getElementById("posXVal"); },
    get posYCanvasProcessed() { return document.getElementById("posYVal"); },

    get velocity() { return document.getElementById("velocityVal"); },
    get direction() { return document.getElementById("directionVal"); },

    get brushSize() { return document.getElementById("brushSizeSelect"); },
    get barrelRotation() { return document.getElementById("barrelRotationVal"); },

    get size() { return document.getElementById("sizeVal"); },

};

export function updateUxPointerStats(ptrRec) {
    uxPointerStats.buttons.innerText = ptrRec.buttons + " (" + buttonToString(ptrRec.buttons) + ")";

    uxPointerStats.pressureProcessed.innerText = format1Digit4Decimals(ptrRec.pressureProcessed);
    uxPointerStats.tiltXProcessed.innerText = format4Digits1Decimal(ptrRec.tiltXProcessed);
    uxPointerStats.tiltYProcessed.innerText = format4Digits1Decimal(ptrRec.tiltYProcessed);
    uxPointerStats.tiltAzimuthProcessed.innerText = format4Digits1Decimal(ptrRec.tiltAzimuthProcessed);
    uxPointerStats.tiltAltitudeProcessed.innerText = format4Digits1Decimal(ptrRec.tiltAltitudeProcessed);
    uxPointerStats.posXCanvasProcessed.innerText = format4Digits1Decimal(ptrRec.canvasPosXProcessed);
    uxPointerStats.posYCanvasProcessed.innerText = format4Digits1Decimal(ptrRec.canvasPosYProcessed);
    uxPointerStats.barrelRotation.innerText = ptrRec.barrelRotation.toString();

    if (ptrRec.velocity>0) {
        uxPointerStats.velocity.innerText = format4Digits1Decimal(ptrRec.velocity);
        uxPointerStats.direction.innerText = format4Digits1Decimal(ptrRec.direction);
    }

    if (ptrRec.pressureProcessed > 0) {
        uxPointerStats.size.innerText =
            paintCurrentDabSettings.brushSize.toString() + "px";
    } else {
        uxPointerStats.size.innerText = "xxx";
    }
}


export function clearUxPointerStats() {
    const empty = "-";
    uxPointerStats.buttons.innerText = empty;

    uxPointerStats.posXCanvasProcessed.innerText = "\u00a0---.-";
    uxPointerStats.posYCanvasProcessed.innerText = "\u00a0---.-";
    uxPointerStats.size.innerText = empty;
    uxPointerStats.pressureProcessed.innerText = "-.----";
    uxPointerStats.barrelRotation.innerText = empty;

    uxPointerStats.tiltXProcessed.innerText = "\u00a0\u00a0\u00a0-.-";
    uxPointerStats.tiltYProcessed.innerText = "\u00a0\u00a0\u00a0-.-";
    uxPointerStats.tiltAltitudeProcessed.innerText = "\u00a0\u00a0--.-";
    uxPointerStats.tiltAzimuthProcessed.innerText = "\u00a0\u00a0--.-";

    uxPointerStats.velocity.innerText = "\u00a0---.-";
    uxPointerStats.direction.innerText = "\u00a0---.-";

}