import { roundTo1DecimalPlaces } from './numerics.js';
import { paintStrokeStats } from './paint_data.js';

export const uxStrokeStats = {
    get strokeCount() { return /** @type {HTMLElement} */ (document.getElementById("strokeCountVal")); },
    get pointerEventCount() { return /** @type {HTMLElement} */ (document.getElementById("pointerEventCountVal")); },
    get strokeDuration() { return /** @type {HTMLElement} */ (document.getElementById("strokeDurationVal")); },
    get pointerEventRate() { return /** @type {HTMLElement} */ (document.getElementById("strokeEventsPerSecVal")); },
};

export function updateUxStrokeStats() {
    uxStrokeStats.strokeCount.innerText = paintStrokeStats.strokeCount.toString();
    uxStrokeStats.pointerEventCount.innerText = paintStrokeStats.ptreventCount.toString();
    uxStrokeStats.strokeDuration.innerText = paintStrokeStats.duration.toString();
    uxStrokeStats.pointerEventRate.innerText = roundTo1DecimalPlaces(paintStrokeStats.ptreventCount / paintStrokeStats.duration * 1000).toString();
}