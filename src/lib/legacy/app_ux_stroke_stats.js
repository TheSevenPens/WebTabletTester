import { roundTo1DecimalPlaces } from './numerics.js';
import { paintStrokeStats } from './paint_data.js';

export const uxStrokeStats = {
    get strokeCount() { return document.getElementById("strokeCountVal"); },
    get pointerEventCount() { return document.getElementById("pointerEventCountVal"); },
    get strokeDuration() { return document.getElementById("strokeDurationVal"); },
    get pointerEventRate() { return document.getElementById("strokeEventsPerSecVal"); },
};

export function updateUxStrokeStats()
{
    uxStrokeStats.strokeCount.innerText = paintStrokeStats.strokeCount;
    uxStrokeStats.pointerEventCount.innerText = paintStrokeStats.ptreventCount;
    uxStrokeStats.strokeDuration.innerText = paintStrokeStats.duration;
    uxStrokeStats.pointerEventRate.innerText = roundTo1DecimalPlaces( paintStrokeStats.ptreventCount / paintStrokeStats.duration * 1000 ) ;
}