import type { PointerKind, RawSample } from './types';
import { POINTER_BUTTONS } from './paint';
import { clamp, finite, radiansToDegrees, wrapDegrees } from './utils/numerics';
import { screenToDocument } from './viewport';

/**
 * Tip or eraser bits mean contact for every pointer type. Pen drivers can report a held barrel
 * switch as `buttons = 2` with no tip bit (measured on a Wacom pen in Chromium), so a pen that
 * reports pressure is also in contact. Mice report pressure 0.5 for any button, so they are excluded.
 */
export function hasContact(sample: { pointerType: string; buttons: number; pressure: number }) {
    return (
        (sample.buttons & (POINTER_BUTTONS.tip | POINTER_BUTTONS.eraser)) !== 0 ||
        (sample.pointerType === 'pen' && sample.pressure > 0)
    );
}

export function pointerSamples(event: PointerEvent): PointerEvent[] {
    const coalesced = event.type === 'pointermove' ? event.getCoalescedEvents?.() : undefined;
    return coalesced?.length ? coalesced : [event];
}

export function readPointer(
    event: PointerEvent,
    rect: DOMRect,
    size: { width: number; height: number }
): RawSample | null {
    if (!['mouse', 'pen', 'touch'].includes(event.pointerType)) return null;
    const point = screenToDocument(
        { x: finite(event.clientX), y: finite(event.clientY) },
        rect,
        size
    );
    const tiltX = clamp(finite(event.tiltX), -90, 90);
    const tiltY = clamp(finite(event.tiltY), -90, 90);
    // Older implementations may omit orientation angles. Derive them from signed tilt.
    const tanX = Math.tan((tiltX * Math.PI) / 180);
    const tanY = Math.tan((tiltY * Math.PI) / 180);
    const fallbackAzimuth = wrapDegrees(radiansToDegrees(Math.atan2(tanY, tanX)));
    const fallbackAltitude = radiansToDegrees(Math.atan2(1, Math.hypot(tanX, tanY)));
    return {
        ...point,
        pointerId: event.pointerId,
        pointerType: event.pointerType as PointerKind,
        buttons: event.buttons,
        pressure: clamp(finite(event.pressure), 0, 1),
        tiltX,
        tiltY,
        azimuth: wrapDegrees(
            Number.isFinite(event.azimuthAngle)
                ? radiansToDegrees(event.azimuthAngle)
                : fallbackAzimuth
        ),
        altitude: clamp(
            Number.isFinite(event.altitudeAngle)
                ? radiansToDegrees(event.altitudeAngle)
                : fallbackAltitude,
            0,
            90
        ),
        twist: wrapDegrees(finite(event.twist)),
        time: finite(event.timeStamp),
    };
}
