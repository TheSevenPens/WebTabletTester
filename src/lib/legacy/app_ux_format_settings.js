import { paintSettings } from './paint_data.js';
import { uxPointerStats } from './app_ux_pointer_stats.js';

export const uxFormatSettings = {
    get brushSize() { return /** @type {HTMLSelectElement} */ (document.getElementById("brushSizeControlSelect")); },
    get brushColor() { return /** @type {HTMLSelectElement} */ (document.getElementById("brushColorControlSelect")); },
    get eraseOnStrokeStart() { return /** @type {HTMLInputElement} */ (document.getElementById("toggleEraseOnStartStrokeCheckbox")); },
    get minStrokeSize() { return /** @type {HTMLSelectElement} */ (document.getElementById("minStrokeSizeSelect")); }
};

export function updateFormatSettingsFromUx() {
    paintSettings.brushSizeControl = uxFormatSettings.brushSize.value;
    paintSettings.brushSize = parseInt(uxPointerStats.brushSize.value);
    paintSettings.brushColorControl = uxFormatSettings.brushColor.value;
    paintSettings.minStrokeSize = parseFloat(uxFormatSettings.minStrokeSize.value);
}

