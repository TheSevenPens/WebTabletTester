import { lerpPoint } from '../utils/interpolation.js';

/**
 * 
 * @param {CanvasRenderingContext2D} canvasContext 
 * @param {HTMLCanvasElement} canvasEl 
 * @param {string} canvasColor 
 */
export function clearCanvas(canvasContext, canvasEl, canvasColor) {
  canvasContext.fillStyle = canvasColor;
  canvasContext.fillRect(0, 0, canvasEl.width, canvasEl.height);
}

export function drawLine(canvasContext, fromPos, toPos, width, color, linecap) {
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
 * 
 * @param {CanvasRenderingContext2D} canvasContext 
 * @param {HTMLCanvasElement} canvasEl 
 * @param {{apply: (val: number) => number}} pressureCurveAmount 
 */
export function drawPressureCurve(canvasContext, canvasEl, pressureCurveAmount) {
  canvasContext.clearRect(0, 0, canvasEl.width, canvasEl.height);
  canvasContext.beginPath();
  canvasContext.moveTo(0, canvasEl.height);
  for (let x = 0; x <= canvasEl.width; x++) {
    const pressure = x / canvasEl.width;
    const curvedPressure = pressureCurveAmount.apply(pressure);
    const y = canvasEl.height * (1 - curvedPressure);
    canvasContext.lineTo(x, y);
  }
  canvasContext.strokeStyle = "rgb(150,180,255)";
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

