import { writable } from 'svelte/store';
import { OrderedRange } from './utils/ranges.js';
import {
    STYLUS_PEN_COLOR,
    INITIAL_PAINT_SETTINGS,
    createInitialProcessingSettings,
    INITIAL_PAINT_CURRENT_DAB_SETTINGS,
    INITIAL_PAINT_STATE,
    INITIAL_PAINT_STROKE_STATS,
    POINTER_LIVE_STATS_DEFAULT,
} from './initial_state.js';

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

// Statistics
export const paintStrokeStats = writable({ ...INITIAL_PAINT_STROKE_STATS });

// UI View State
export const uiState = writable({
    showStrokeStats: false
});

// Live Pointer Record State
export const pointerLiveStats = writable({ ...POINTER_LIVE_STATS_DEFAULT });
