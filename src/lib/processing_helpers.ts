/**
 * Helpers for processing settings: reset to default and apply slider updates.
 * Keeps the list of processing knobs in one place.
 */

import type { ProcessingSettings } from './types';

/**
 * Set all smoothing/curve amounts to 0 and pressureQuant to 0.
 * Caller should then trigger store update: $processingSettings = $processingSettings
 */
export function resetAllProcessingToDefault(processing: ProcessingSettings): void {
    processing.posXSmoother.setSmoothingAmount(0.0);
    processing.posYSmoother.setSmoothingAmount(0.0);
    processing.pressureSmoother.setSmoothingAmount(0.0);
    processing.tiltXSmoother.setSmoothingAmount(0.0);
    processing.tiltYSmoother.setSmoothingAmount(0.0);
    processing.tiltAzimuthSmoother.setSmoothingAmount(0.0);
    processing.tiltAltitudeSmoother.setSmoothingAmount(0.0);
    processing.pressureCurveAmount.setCurveAmount(0.0);
    processing.pressureQuant = 0;
}

/**
 * Apply a slider update and return the same object so caller can assign to trigger reactivity.
 */
export function setProcessingAndNotify(processing: ProcessingSettings, updateFn: (p: ProcessingSettings) => void): ProcessingSettings {
    updateFn(processing);
    return processing;
}
