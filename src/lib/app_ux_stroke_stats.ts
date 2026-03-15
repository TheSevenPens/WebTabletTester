import { paintStrokeStats as legacyStrokeStats } from './paint_data';
import { paintStrokeStats, uiState } from './stores';
import { get } from 'svelte/store';

/** Sync legacy stroke stats into the store. Rate is computed via derived store paintStrokeStatsWithRate. */
export function updateUxStrokeStats() {
    if (!get(uiState).showStrokeStats) return;

    paintStrokeStats.update((stats) => {
        stats.strokeCount = legacyStrokeStats.strokeCount;
        stats.ptreventCount = legacyStrokeStats.ptreventCount;
        stats.duration = legacyStrokeStats.duration;
        return stats;
    });
}