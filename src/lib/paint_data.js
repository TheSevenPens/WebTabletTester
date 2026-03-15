import { settingStylusPenColor, PRESSURE_RANGE, BRUSHSIZE_RANGE } from './stores.js';
import {
    INITIAL_PAINT_SETTINGS,
    createInitialProcessingSettings,
    INITIAL_PAINT_CURRENT_DAB_SETTINGS,
    INITIAL_PAINT_STATE,
    INITIAL_PAINT_STROKE_STATS,
} from './initial_state.js';

export { settingStylusPenColor, PRESSURE_RANGE, BRUSHSIZE_RANGE };

export const paintSettings = { ...INITIAL_PAINT_SETTINGS };

export const processingSettings = createInitialProcessingSettings();

export const paintCurrentDabSettings = { ...INITIAL_PAINT_CURRENT_DAB_SETTINGS };

export const paintState = { ...INITIAL_PAINT_STATE };

export const paintStrokeStats = { ...INITIAL_PAINT_STROKE_STATS };
