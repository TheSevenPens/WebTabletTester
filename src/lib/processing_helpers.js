/**
 * Helpers for processing settings: reset to default and apply slider updates.
 * Keeps the list of processing knobs in one place.
 */

/**
 * Set all smoothing/curve amounts to 0 and pressureQuant to 0.
 * Caller should then trigger store update: $processingSettings = $processingSettings
 * @param {{ posXSmoother: { setSmoothingAmount: (v: number) => void }; posYSmoother: { setSmoothingAmount: (v: number) => void }; pressureSmoother: { setSmoothingAmount: (v: number) => void }; pressureCurveAmount: { setCurveAmount: (v: number) => void }; tiltXSmoother: { setSmoothingAmount: (v: number) => void }; tiltYSmoother: { setSmoothingAmount: (v: number) => void }; tiltAzimuthSmoother: { setSmoothingAmount: (v: number) => void }; tiltAltitudeSmoother: { setSmoothingAmount: (v: number) => void }; pressureQuant: number }} processing
 */
export function resetAllProcessingToDefault(processing) {
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
 * Usage: $processingSettings = setProcessingAndNotify($processingSettings, (p) => { ... });
 */
export function setProcessingAndNotify(processing, updateFn) {
    updateFn(processing);
    return processing;
}
