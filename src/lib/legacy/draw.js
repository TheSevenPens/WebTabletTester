import { appCanvasContext, appCanvasEl, appPressureCurveCanvas, appPressureCurveCanvasCtx } from './app_canvas.js';
import { processingSettings } from './paint_data.js';
import { lerpPoint } from './interpolation.js';
import { appSettings } from './app.js';

export function clearCanvas() 
{
    appCanvasContext.fillStyle = appSettings.canvasColor;
    appCanvasContext.fillRect(0, 0, appCanvasEl.width, appCanvasEl.height);
}

export function drawLine( canvasContext, fromPos, toPos, width, color, linecap)
{
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

export function drawPressureCurve() {
  appPressureCurveCanvasCtx.clearRect(0, 0, appPressureCurveCanvas.width, appPressureCurveCanvas.height);
  appPressureCurveCanvasCtx.beginPath();
  appPressureCurveCanvasCtx.moveTo(0, appPressureCurveCanvas.height);
  for (let x = 0; x <= appPressureCurveCanvas.width; x++) {
    const pressure = x / appPressureCurveCanvas.width;
    const curvedPressure = processingSettings.pressureCurveAmount.apply( pressure );
    const y = appPressureCurveCanvas.height * (1 - curvedPressure);
    appPressureCurveCanvasCtx.lineTo(x, y);
  }
  appPressureCurveCanvasCtx.strokeStyle = "rgb(150,180,255)";
  appPressureCurveCanvasCtx.lineWidth = 3;
  appPressureCurveCanvasCtx.stroke();

  // Draw axes
  appPressureCurveCanvasCtx.beginPath();
  appPressureCurveCanvasCtx.moveTo(0, 0);
  appPressureCurveCanvasCtx.lineTo(0, appPressureCurveCanvas.height);
  appPressureCurveCanvasCtx.lineTo(appPressureCurveCanvas.width, appPressureCurveCanvas.height);
  appPressureCurveCanvasCtx.strokeStyle = "black";
  appPressureCurveCanvasCtx.lineWidth = 1;
  appPressureCurveCanvasCtx.stroke();
}

