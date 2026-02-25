import { roundTo1DecimalPlaces } from './utils/numerics.js';
import { paintStrokeStats as dbStats } from './paint_data.js';
import { paintStrokeStats } from './stores.js';

export function updateUxStrokeStats() {
    paintStrokeStats.update(stats => {
        stats.strokeCount = dbStats.strokeCount;
        stats.ptreventCount = dbStats.ptreventCount;
        stats.duration = dbStats.duration;
        stats.rate = roundTo1DecimalPlaces(dbStats.ptreventCount / dbStats.duration * 1000);
        return stats;
    });
}