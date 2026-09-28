import type { AppSettings, Brush, Point, StrokeRenderer } from './types';

function context(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('This browser could not create a 2D drawing canvas.');
    return ctx;
}

export class CanvasRenderer implements StrokeRenderer {
    readonly foreground: HTMLCanvasElement;
    private background: HTMLCanvasElement;
    private foregroundContext: CanvasRenderingContext2D;
    private backgroundContext: CanvasRenderingContext2D;
    private outputContext: CanvasRenderingContext2D;
    private dirty = true;
    private backgroundKey = '';

    constructor(readonly output: HTMLCanvasElement, width: number, height: number) {
        output.width = width;
        output.height = height;
        this.foreground = document.createElement('canvas');
        this.background = document.createElement('canvas');
        for (const layer of [this.foreground, this.background]) {
            layer.width = width;
            layer.height = height;
        }
        this.foregroundContext = context(this.foreground);
        this.backgroundContext = context(this.background);
        this.outputContext = context(output);
    }

    setBackground(settings: AppSettings): void {
        const key = JSON.stringify([settings.canvasColor, settings.showGrid, settings.gridSize, settings.gridColor]);
        if (key === this.backgroundKey) return;
        this.backgroundKey = key;
        const ctx = this.backgroundContext;
        const { width, height } = this.background;
        ctx.fillStyle = settings.canvasColor;
        ctx.fillRect(0, 0, width, height);
        if (settings.showGrid) {
            const spacing = Number.isFinite(settings.gridSize) ? Math.max(5, settings.gridSize) : 100;
            ctx.beginPath();
            for (let x = spacing; x < width; x += spacing) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, height); }
            for (let y = spacing; y < height; y += spacing) { ctx.moveTo(0, y + 0.5); ctx.lineTo(width, y + 0.5); }
            ctx.lineWidth = 1;
            ctx.strokeStyle = settings.gridColor;
            ctx.stroke();
        }
        this.dirty = true;
    }

    clear(): void {
        this.foregroundContext.clearRect(0, 0, this.foreground.width, this.foreground.height);
        this.dirty = true;
    }

    dab(point: Point, brush: Brush): void {
        this.withBrush(brush, (ctx) => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, brush.size / 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    segment(from: Point, to: Point, brush: Brush): void {
        this.withBrush(brush, (ctx) => {
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        });
    }

    private withBrush(brush: Brush, draw: (ctx: CanvasRenderingContext2D) => void): void {
        const ctx = this.foregroundContext;
        ctx.save();
        try {
            ctx.globalCompositeOperation = brush.erase ? 'destination-out' : 'source-over';
            ctx.fillStyle = ctx.strokeStyle = brush.color;
            ctx.lineWidth = brush.size;
            ctx.lineCap = brush.linecap;
            draw(ctx);
        } finally {
            ctx.restore();
        }
        this.dirty = true;
    }

    compose(): boolean {
        if (!this.dirty) return false;
        this.outputContext.clearRect(0, 0, this.output.width, this.output.height);
        this.outputContext.drawImage(this.background, 0, 0);
        this.outputContext.drawImage(this.foreground, 0, 0);
        this.dirty = false;
        return true;
    }
}