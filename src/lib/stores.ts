import { writable, derived } from 'svelte/store';
import { roundTo1DecimalPlaces } from './utils/numerics';
import { MS_PER_SECOND } from './constants';
import { OrderedRange } from './utils/ranges';
import {
    STYLUS_PEN_COLOR,
    INITIAL_PAINT_SETTINGS,
    createInitialProcessingSettings,
    INITIAL_PAINT_CURRENT_DAB_SETTINGS,
    INITIAL_PAINT_STATE,
    INITIAL_PAINT_STROKE_STATS,
    POINTER_LIVE_STATS_DEFAULT,
} from './initial_state';

// Re-export for consumers that expect it from stores
export const settingStylusPenColor = STYLUS_PEN_COLOR;
export const PRESSURE_RANGE = new OrderedRange(0.0, 1.0);
export const BRUSHSIZE_RANGE = new OrderedRange(0.1, 300.0);

// Global App Settings
export const appSettings = writable({
    canvasColor: "rgba(230, 230, 250, 1.0)",
    downloadFilename: "TabletTester_Untitled",
});

// Paint Format Settings
export const paintSettings = writable({ ...INITIAL_PAINT_SETTINGS });

// Processing Math Handlers
export const processingSettings = writable(createInitialProcessingSettings());

// The current evaluated dab
export const paintCurrentDabSettings = writable({ ...INITIAL_PAINT_CURRENT_DAB_SETTINGS });

// Current Paint State
export const paintState = writable({ ...INITIAL_PAINT_STATE });

// Statistics (rate is derived, not stored)
export const paintStrokeStats = writable({ ...INITIAL_PAINT_STROKE_STATS });

/** Derived store: stroke stats with rate = events/sec computed from duration and ptreventCount. */
export const paintStrokeStatsWithRate = derived(paintStrokeStats, ($s) => {
    const rate = $s.duration > 0
        ? roundTo1DecimalPlaces(($s.ptreventCount / $s.duration) * MS_PER_SECOND)
        : 0;
    return { ...$s, rate };
});

// UI View State
export const uiState = writable({
    showStrokeStats: false
});

// Live Pointer Record State
export const pointerLiveStats = writable({ ...POINTER_LIVE_STATS_DEFAULT });

// Canvas Viewport State
export const canvasViewport = writable({
    width: 1920,
    height: 1080,
    zoom: 1.0,
    panX: 0,
    panY: 0
});
