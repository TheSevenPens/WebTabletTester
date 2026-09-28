import { derived, writable } from 'svelte/store';
import {
    createAppSettings,
    createPaintSettings,
    createProcessingSettings,
    createStrokeStats,
    createViewport,
} from './initial_state';
import type { ProcessedSample } from './types';
import { sampleRate } from './utils/numerics';

export const appSettings = writable(createAppSettings());
export const paintSettings = writable(createPaintSettings());
export const processingSettings = writable(createProcessingSettings());
export const canvasViewport = writable(createViewport());
export const uiState = writable({ showStrokeStats: false });
export const pointerLiveStats = writable<ProcessedSample | null>(null);
export const paintStrokeStats = writable(createStrokeStats());
export const paintStrokeStatsWithRate = derived(paintStrokeStats, (stats) => ({
    ...stats,
    rate: sampleRate(stats.sampleCount, stats.duration),
}));
export const exportStatus = writable('');
