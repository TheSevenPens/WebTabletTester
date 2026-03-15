import { lerpPoint } from '../utils/interpolation.js';
import { CURVE_GRAPH_STROKE } from '../constants.js';

/**
 * Get 2D context for a canvas. Returns null if canvas is missing or context is unavailable.
 * @param {HTMLCanvasElement | null | undefined} canvas
 * @returns {CanvasRenderingContext2D | null}
 */
export function getCanvas2DContext(canvas) {
  if (!canvas || typeof canvas.getContext !== 'function') return null;
  const ctx = canvas.getContext('2d');
  return ctx;
}

/**
 * @param {CanvasRenderingContext2D | null} canvasContext
 * @param {HTMLCanvasElement} canvasEl
 * @param {string} canvasColor
 */
export function clearCanvas(canvasContext, canvasEl, canvasColor) {
  if (!canvasContext) return;
  canvasContext.fillStyle = canvasColor;
  canvasContext.fillRect(0, 0, canvasEl.width, canvasEl.height);
}

/**
 * @param {CanvasRenderingContext2D | null} canvasContext
 * @param {{ x: number; y: number }} fromPos
 * @param {{ x: number; y: number }} toPos
 * @param {number} width
 * @param {string} color
 * @param {string} linecap
 */
export function drawLine(canvasContext, fromPos, toPos, width, color, linecap) {
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

/**
 * @param {CanvasRenderingContext2D | null} canvasContext
 * @param {HTMLCanvasElement} canvasEl
 * @param {{ apply: (val: number) => number }} pressureCurveAmount
 */
export function drawPressureCurve(canvasContext, canvasEl, pressureCurveAmount) {
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

