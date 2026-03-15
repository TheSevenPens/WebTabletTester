/**
 * Centralized sync from Svelte store values to legacy paint_data objects
 * so paint.js and other libs keep working. Remove when everything reads from stores.
 */

/**
 * @param {Record<string, unknown>} storeValue
 * @param {Record<string, unknown>} legacy
 */
export function syncPaintSettingsToLegacy(storeValue, legacy) {
    legacy.brushSize = storeValue.brushSize;
    legacy.brushSizeControl = storeValue.brushSizeControl;
    legacy.brushColorControl = storeValue.brushColorControl;
    legacy.minStrokeSize = storeValue.minStrokeSize;
    legacy.eraseOnStrokeStart = storeValue.eraseOnStrokeStart;
}

/**
 * @param {{ posXSmoother: { setSmoothingAmount: (v: number) => void }; posYSmoother: { setSmoothingAmount: (v: number) => void }; pressureSmoother: { setSmoothingAmount: (v: number) => void }; pressureCurveAmount: { setCurveAmount: (v: number) => void }; tiltXSmoother: { setSmoothingAmount: (v: number) => void }; tiltYSmoother: { setSmoothingAmount: (v: number) => void }; tiltAzimuthSmoother: { setSmoothingAmount: (v: number) => void }; tiltAltitudeSmoother: { setSmoothingAmount: (v: number) => void }; pressureQuant: number }} storeValue
 * @param {Record<string, unknown>} legacy
 */
export function syncProcessingSettingsToLegacy(storeValue, legacy) {
    legacy.posXSmoother.setSmoothingAmount(storeValue.posXSmoother.amount);
    legacy.posYSmoother.setSmoothingAmount(storeValue.posYSmoother.amount);
    legacy.pressureSmoother.setSmoothingAmount(storeValue.pressureSmoother.amount);
    legacy.tiltXSmoother.setSmoothingAmount(storeValue.tiltXSmoother.amount);
    legacy.tiltYSmoother.setSmoothingAmount(storeValue.tiltYSmoother.amount);
    legacy.pressureCurveAmount.setCurveAmount(storeValue.pressureCurveAmount.amount);
    legacy.pressureQuant = parseInt(String(storeValue.pressureQuant || '0'), 10);
}
