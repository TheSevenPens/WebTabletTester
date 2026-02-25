import { roundTo1DecimalPlaces } from './utils/numerics.js';
import { paintStrokeStats as legacyStrokeStats } from './paint_data.js';
import { paintStrokeStats, uiState } from './stores.js';
import { get } from 'svelte/store';

export function updateUxStrokeStats() {
    if (!get(uiState).showStrokeStats) return;

    paintStrokeStats.update(stats => {
        stats.strokeCount = legacyStrokeStats.strokeCount;
        stats.ptreventCount = legacyStrokeStats.ptreventCount;
        stats.duration = legacyStrokeStats.duration;
        stats.rate = roundTo1DecimalPlaces(legacyStrokeStats.ptreventCount / legacyStrokeStats.duration * 1000);
        return stats;
    });
}