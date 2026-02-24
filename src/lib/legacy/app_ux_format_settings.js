import { paintSettings } from './paint_data.js';
import { uxPointerStats } from './app_ux_pointer_stats.js';

export const uxFormatSettings = {
    get brushSize() { return document.getElementById("brushSizeControlSelect"); },
    get brushColor() { return document.getElementById("brushColorControlSelect"); },
    get eraseOnStrokeStart() { return document.getElementById("toggleEraseOnStartStrokeCheckbox"); },
    get minStrokeSize() { return document.getElementById("minStrokeSizeSelect"); }

};

export function updateFormatSettingsFromUx() {
    paintSettings.brushSizeControl = uxFormatSettings.brushSize.value;
    paintSettings.brushSize = parseInt(uxPointerStats.brushSize.value);
    paintSettings.brushColorControl = uxFormatSettings.brushColor.value;
    paintSettings.minStrokeSize = parseFloat(uxFormatSettings.minStrokeSize.value);
}

