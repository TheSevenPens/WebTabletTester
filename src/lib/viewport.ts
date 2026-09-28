import type { Point, Viewport } from './types';
import { DEFAULT_CANVAS_PAN_X, DEFAULT_CANVAS_PAN_Y } from './constants';
import { clamp, finite } from './utils/numerics';

export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 10;

export function screenToDocument(
    point: Point,
    rect: { left: number; top: number; width: number; height: number },
    size: { width: number; height: number }
): Point {
    return {
        x: ((point.x - rect.left) * size.width) / Math.max(rect.width, Number.EPSILON),
        y: ((point.y - rect.top) * size.height) / Math.max(rect.height, Number.EPSILON),
    };
}

export function zoomAt(view: Viewport, zoom: number, anchor: Point): Viewport {
    const nextZoom = clamp(finite(zoom, view.zoom), MIN_ZOOM, MAX_ZOOM);
    const ratio = nextZoom / view.zoom;
    return {
        ...view,
        zoom: nextZoom,
        panX: anchor.x - (anchor.x - view.panX) * ratio,
        panY: anchor.y - (anchor.y - view.panY) * ratio,
    };
}

export function zoomAtCenter(view: Viewport, zoom: number): Viewport {
    return zoomAt(view, zoom, { x: view.viewportWidth / 2, y: view.viewportHeight / 2 });
}

export function resetViewport(view: Viewport): Viewport {
    return { ...view, zoom: 1, panX: DEFAULT_CANVAS_PAN_X, panY: DEFAULT_CANVAS_PAN_Y };
}

export function fitViewport(view: Viewport): Viewport {
    const width = Math.max(1, view.viewportWidth - DEFAULT_CANVAS_PAN_X * 2);
    const height = Math.max(1, view.viewportHeight - DEFAULT_CANVAS_PAN_Y * 2);
    return {
        ...resetViewport(view),
        zoom: clamp(
            Math.min((width * view.dpr) / view.width, (height * view.dpr) / view.height),
            MIN_ZOOM,
            MAX_ZOOM
        ),
    };
}
