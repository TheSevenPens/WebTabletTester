import { format1Digit4Decimals, format4Digits1Decimal } from './utils/numerics.js';
import { paintCurrentDabSettings } from './paint_data.js';
import { buttonToString } from './app_pointer.js';
import { pointerLiveStats } from './stores.js';
import { POINTER_LIVE_STATS_DEFAULT } from './initial_state.js';

export function updateUxPointerStats(ptrRec) {
    pointerLiveStats.update(stats => {
        stats.buttons = ptrRec.buttons;
        stats.buttonString = buttonToString(ptrRec.buttons);
        stats.pressureProcessed = format1Digit4Decimals(ptrRec.pressureProcessed);
        stats.tiltXProcessed = format4Digits1Decimal(ptrRec.tiltXProcessed);
        stats.tiltYProcessed = format4Digits1Decimal(ptrRec.tiltYProcessed);
        stats.tiltAzimuthProcessed = format4Digits1Decimal(ptrRec.tiltAzimuthProcessed);
        stats.tiltAltitudeProcessed = format4Digits1Decimal(ptrRec.tiltAltitudeProcessed);
        stats.canvasPosXProcessed = format4Digits1Decimal(ptrRec.canvasPosXProcessed);
        stats.canvasPosYProcessed = format4Digits1Decimal(ptrRec.canvasPosYProcessed);
        stats.barrelRotation = ptrRec.barrelRotation.toString();

        if (ptrRec.velocity > 0) {
            stats.velocity = format4Digits1Decimal(ptrRec.velocity);
            stats.direction = format4Digits1Decimal(ptrRec.direction);
        }

        if (ptrRec.pressureProcessed > 0) {
            stats.size = paintCurrentDabSettings.brushSize.toString() + "px";
        } else {
            stats.size = "xxx";
        }

        return stats;
    });
}


export function clearUxPointerStats() {
    pointerLiveStats.set({ ...POINTER_LIVE_STATS_DEFAULT });
}