import type {
    AppSettings,
    PaintSettings,
    ProcessingSettings,
    StrokeStats,
    Viewport,
} from './types';
import { DEFAULT_CANVAS_PAN_X, DEFAULT_CANVAS_PAN_Y } from './constants';

export function createPaintSettings(): PaintSettings {
    return {
        brushType: 'MARKER',
        brushSize: 50,
        brushSizeControl: 'PRESSURE',
        brushColorControl: 'DEFAULT',
        linecap: 'round',
        minStrokeSize: 1,
        eraseOnStrokeStart: false,
    };
}

export function createProcessingSettings(): ProcessingSettings {
    return {
        positionSmoothing: 0,
        pressureSmoothing: 0,
        tiltSmoothing: 0,
        velocitySmoothing: 0.9,
        pressureCurve: 0,
        pressureQuant: 0,
    };
}

export function createAppSettings(): AppSettings {
    return {
        canvasColor: '#e6e6fa',
        showGrid: false,
        gridSize: 100,
        gridColor: '#b8b8d0',
        renderSampling: 'NEAREST',
        downloadFilename: 'TabletTester_Untitled',
    };
}

export function createStrokeStats(): StrokeStats {
    return { strokeCount: 0, cancelledStrokeCount: 0, sampleCount: 0, duration: 0 };
}

export function createViewport(): Viewport {
    return {
        width: 1920,
        height: 1080,
        zoom: 1,
        panX: DEFAULT_CANVAS_PAN_X,
        panY: DEFAULT_CANVAS_PAN_Y,
        viewportWidth: 0,
        viewportHeight: 0,
        dpr: 1,
    };
}
