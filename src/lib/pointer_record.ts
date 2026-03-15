import { clampToRange } from './utils/ranges';
import { radiansToDegrees } from './utils/numerics';
import { PRESSURE_RANGE } from './paint_data';
import { processPressure } from './app_pointer';
import { MS_PER_SECOND } from './constants';
import type { ProcessingSettings, PaintState } from './types';

export class PointerRecord {
    type: string;
    buttons: number;
    pointerType: string;

    screenPosX: number;
    screenPosY: number;

    canvasPosXRaw: number;
    canvasPosYRaw: number;

    canvasPosXProcessed: number;
    canvasPosYProcessed: number;

    pressureRaw: number;
    pressureProcessed: number;

    tiltX: number;
    tiltY: number;

    tiltAzimuth: number;
    tiltAltitude: number;

    tiltXProcessed: number;
    tiltYProcessed: number;

    tiltAzimuthProcessed: number;
    tiltAltitudeProcessed: number;

    barrelRotation: number;

    time: number;

    velocity: number;
    direction: number;

    constructor(canvasRect: DOMRect, ptrEvent: any, processingSettings: ProcessingSettings, paintState: PaintState) {
        // get the pressure reported in the event
        // if it is pointer pen event, just use that pressure
        // if it is any other kind of event, then just the maximum pressure
        const pressureRaw = clampToRange(ptrEvent.pressure, PRESSURE_RANGE);

        // Calculate coordinates correctly reversing the CSS transform scaling.
        // offsetX/Y is preserved by browsers even under scale(), but we will 
        // calculate it from clientX/Y and bounding ClientRect to be absolutely robust
        // across all interactions.
        const canvasPosXRaw = (ptrEvent.clientX - canvasRect.left) * (ptrEvent.target.width / canvasRect.width);
        const canvasPosYRaw = (ptrEvent.clientY - canvasRect.top) * (ptrEvent.target.height / canvasRect.height);
        
        this.type = ptrEvent.type;
        this.buttons = ptrEvent.buttons;
        this.pointerType = ptrEvent.pointerType;

        this.screenPosX = ptrEvent.clientX;
        this.screenPosY = ptrEvent.clientY;

        this.canvasPosXRaw = canvasPosXRaw;
        this.canvasPosYRaw = canvasPosYRaw;

        this.canvasPosXProcessed = processingSettings.posXSmoother.apply(canvasPosXRaw);
        this.canvasPosYProcessed = processingSettings.posYSmoother.apply(canvasPosYRaw);

        this.pressureRaw = pressureRaw;
        this.pressureProcessed = processPressure(pressureRaw, processingSettings);

        this.tiltX = ptrEvent.tiltX;
        this.tiltY = ptrEvent.tiltY;

        this.tiltAzimuth = radiansToDegrees(ptrEvent.azimuthAngle);
        this.tiltAltitude = radiansToDegrees(ptrEvent.altitudeAngle);

        this.tiltXProcessed = processingSettings.tiltXSmoother.apply(ptrEvent.tiltX);
        this.tiltYProcessed = processingSettings.tiltYSmoother.apply(ptrEvent.tiltY);

        this.tiltAzimuthProcessed = radiansToDegrees(processingSettings.tiltAzimuthSmoother.apply(ptrEvent.azimuthAngle));
        this.tiltAltitudeProcessed = radiansToDegrees(processingSettings.tiltAltitudeSmoother.apply(ptrEvent.altitudeAngle));

        this.barrelRotation = ptrEvent.twist;

        this.time = performance.now();

        this.velocity = 0;
        this.direction = 0;

        if (paintState.canvasPosOld != null) {
            const dx = this.canvasPosXProcessed - paintState.canvasPosOldAllEvents.x;
            const dy = this.canvasPosYProcessed - paintState.canvasPosOldAllEvents.y;

            if (paintState.timeOld != null) {
                const dt = (this.time - paintState.timeOld) / MS_PER_SECOND;
                if (dt > 0) {

                    const dist = Math.hypot(dx, dy);
                    const rawSpeed = dist / dt;
                    const smoothedSpeed = processingSettings.velocitySmoother.apply(rawSpeed);
                    let direction = Math.atan2(dy, dx) * 180.0 / Math.PI;
                    if (direction < 0) {
                        direction = 360 + direction;
                    }

                    this.velocity = smoothedSpeed;
                    this.direction = direction;

                }
            }

        }

    }
}