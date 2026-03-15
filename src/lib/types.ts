export interface PaintSettings {
  brushSize: number;
  brushSizeControl: string;
  brushColorControl: string;
  eraserSize: number;
  linecap: string;
  minStrokeSize: number;
  eraseOnStrokeStart: boolean;
}

export interface SmootherLike {
  amount: number;
  oldSmoothed: number | null;
  setSmoothingAmount: (v: number) => void;
  apply: (v: number) => number;
  resetSettings: () => void;
  resetState?: () => void;
}

export interface CurveLike {
  amount: number;
  setCurveAmount: (v: number) => void;
  apply: (v: number) => number;
  resetState?: () => void;
}

export interface ProcessingSettings {
  posXSmoother: SmootherLike;
  posYSmoother: SmootherLike;
  pressureSmoother: SmootherLike;
  pressureCurveAmount: CurveLike;
  tiltXSmoother: SmootherLike;
  tiltYSmoother: SmootherLike;
  tiltAzimuthSmoother: SmootherLike;
  tiltAltitudeSmoother: SmootherLike;
  velocitySmoother: SmootherLike;
  pressureQuant: number;
  pressureQuantizationLevels: number;
}

export interface PaintState {
  canvasPosOldAllEvents: { x: number; y: number };
  canvasPosOld: { x: number; y: number };
  isDrawing: boolean;
  timeOld: number | null;
}

export interface PaintStrokeStats {
  strokeCount: number;
  ptreventCount: number;
  startTime: number;
  endTime: number;
  duration: number;
  rate?: number;
}
