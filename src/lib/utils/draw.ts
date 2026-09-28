import { CURVE_GRAPH_STROKE } from '../constants';
import { applyPressureCurve } from './numeric_curve';

export function drawPressureCurve(canvas: HTMLCanvasElement, amount: number): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for (let x = 0; x <= canvas.width; x++) {
        ctx.lineTo(x, canvas.height * (1 - applyPressureCurve(x / canvas.width, amount)));
    }
    ctx.strokeStyle = CURVE_GRAPH_STROKE;
    ctx.lineWidth = 2;
    ctx.stroke();
}
