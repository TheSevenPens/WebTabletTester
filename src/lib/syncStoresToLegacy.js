/**
 * Centralized sync from Svelte store values to legacy paint_data objects
 * so paint.js and other libs keep working. Remove when everything reads from stores.
 */

/**
 * Copy paint settings from store value into legacy object for paint_data consumers.
 * @param {import('./types.js').PaintSettings} storeValue
 * @param {Record<string, unknown>} legacy
 * @returns {void}
 */
export function syncPaintSettingsToLegacy(storeValue, legacy) {
    legacy.brushSize = storeValue.brushSize;
    legacy.brushSizeControl = storeValue.brushSizeControl;
    legacy.brushColorControl = storeValue.brushColorControl;
    legacy.minStrokeSize = storeValue.minStrokeSize;
    legacy.eraseOnStrokeStart = storeValue.eraseOnStrokeStart;
}

/**
 * Sync processing settings (smoother amounts, pressure quant) from store to legacy object.
 * @param {import('./types.js').ProcessingSettings} storeValue
 * @param {Record<string, unknown>} legacy
 * @returns {void}
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
