export interface Point { x: number; y: number; }
export type BrushType = 'MARKER' | 'ERASER';
export type SizeControl = 'USER' | 'PRESSURE' | 'TILTX' | 'TILTY' | 'TILTAZ' | 'TILTALT';
export type ColorControl = Exclude<SizeControl, 'USER'> | 'DEFAULT' | 'RED' | 'BARRELROTATION';
export type RenderSampling = 'NEAREST' | 'SMOOTH';
export type PointerKind = 'mouse' | 'pen' | 'touch';

export interface PaintSettings {
    brushType: BrushType;
    brushSize: number;
    brushSizeControl: SizeControl;
    brushColorControl: ColorControl;
    linecap: CanvasLineCap;
    minStrokeSize: number;
    eraseOnStrokeStart: boolean;
}

/** Serializable configuration. Filter history belongs exclusively to the engine. */
export interface ProcessingSettings {
    positionSmoothing: number;
    pressureSmoothing: number;
    tiltSmoothing: number;
    velocitySmoothing: number;
    pressureCurve: number;
    pressureQuant: number;
}

export interface AppSettings {
    canvasColor: string;
    showGrid: boolean;
    gridSize: number;
    gridColor: string;
    renderSampling: RenderSampling;
    downloadFilename: string;
}

export interface Viewport {
    width: number; height: number; zoom: number;
    panX: number; panY: number; viewportWidth: number; viewportHeight: number; dpr: number;
}

/** Document pixels, degrees, pressure [0,1], and a monotonic timestamp in ms. */
export interface RawSample extends Point {
    pointerId: number;
    pointerType: PointerKind;
    buttons: number;
    pressure: number;
    tiltX: number; tiltY: number;
    azimuth: number; altitude: number; twist: number;
    time: number;
}

export interface ProcessedSample extends RawSample {
    raw: Readonly<RawSample>;
    velocity: number;
    direction: number;
}

export interface StrokeStats {
    strokeCount: number;
    cancelledStrokeCount: number;
    sampleCount: number;
    duration: number;
}

export interface EngineSettings {
    paint: Readonly<PaintSettings>;
    processing: Readonly<ProcessingSettings>;
}

export interface Brush {
    size: number;
    color: string;
    linecap: CanvasLineCap;
    erase: boolean;
}

export interface StrokeRenderer {
    clear(): void;
    dab(point: Point, brush: Brush): void;
    segment(from: Point, to: Point, brush: Brush): void;
}