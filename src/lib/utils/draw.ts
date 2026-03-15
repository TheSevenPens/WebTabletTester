import { lerpPoint } from '../utils/interpolation';
import { CURVE_GRAPH_STROKE } from '../constants';
import type { CurveLike } from '../types';
import type { Position } from '../utils/geometry';

/**
 * Get 2D context for a canvas. Returns null if canvas is missing or context is unavailable.
 */
export function getCanvas2DContext(canvas: HTMLCanvasElement | null | undefined): CanvasRenderingContext2D | null {
  if (!canvas || typeof canvas.getContext !== 'function') return null;
  const ctx = canvas.getContext('2d');
  return ctx;
}

export function clearCanvas(canvasContext: CanvasRenderingContext2D | null, canvasEl: HTMLCanvasElement, canvasColor: string): void {
  if (!canvasContext) return;
  canvasContext.fillStyle = canvasColor;
  canvasContext.fillRect(0, 0, canvasEl.width, canvasEl.height);
}

export function drawLine(canvasContext: CanvasRenderingContext2D | null, fromPos: { x: number, y: number }, toPos: { x: number, y: number }, width: number, color: string, linecap: CanvasLineCap): void {
  if (!canvasContext) return;
  canvasContext.lineWidth = width;
  canvasContext.strokeStyle = color;
  canvasContext.beginPath();
  canvasContext.lineCap = linecap;
  canvasContext.moveTo(fromPos.x, fromPos.y);
  const midPoint = lerpPoint(fromPos, toPos, 0.5);
  canvasContext.quadraticCurveTo(fromPos.x, fromPos.y, midPoint.x, midPoint.y);
  canvasContext.lineTo(toPos.x, toPos.y);
  canvasContext.stroke();
}

export function drawPressureCurve(canvasContext: CanvasRenderingContext2D | null, canvasEl: HTMLCanvasElement, pressureCurveAmount: CurveLike): void {
  if (!canvasContext) return;
  canvasContext.clearRect(0, 0, canvasEl.width, canvasEl.height);
  canvasContext.beginPath();
  canvasContext.moveTo(0, canvasEl.height);
  for (let x = 0; x <= canvasEl.width; x++) {
    const pressure = x / canvasEl.width;
    const curvedPressure = pressureCurveAmount.apply(pressure);
    const y = canvasEl.height * (1 - curvedPressure);
    canvasContext.lineTo(x, y);
  }
  canvasContext.strokeStyle = CURVE_GRAPH_STROKE;
  canvasContext.lineWidth = 3;
  canvasContext.stroke();

  // Draw axes
  canvasContext.beginPath();
  canvasContext.moveTo(0, 0);
  canvasContext.lineTo(0, canvasEl.height);
  canvasContext.lineTo(canvasEl.width, canvasEl.height);
  canvasContext.strokeStyle = "black";
  canvasContext.lineWidth = 1;
  canvasContext.stroke();
}
