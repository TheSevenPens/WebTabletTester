<script lang="ts">
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import {
        appSettings, paintSettings, processingSettings, canvasViewport,
        pointerLiveStats, paintStrokeStats, exportStatus,
    } from '../lib/stores';
    import { createCanvasController } from '../lib/canvas_controller';
    import { copyCanvas, saveCanvas as downloadCanvas } from '../lib/canvas_export';

    let canvas: HTMLCanvasElement;
    let surface: HTMLDivElement;
    let panning = $state(false);
    let controller: ReturnType<typeof createCanvasController> | undefined;

    onMount(() => {
        let paint = get(paintSettings);
        let processing = get(processingSettings);
        let viewport = get(canvasViewport);
        const unsubscribe = [
            paintSettings.subscribe((value) => { paint = value; }),
            processingSettings.subscribe((value) => { processing = value; }),
            canvasViewport.subscribe((value) => { viewport = value; }),
        ];
        try {
            controller = createCanvasController(canvas, surface, {
                settings: () => ({ paint, processing }),
                viewport: () => viewport,
                updateViewport: (value) => canvasViewport.set(value),
                publish: (sample, stats) => { pointerLiveStats.set(sample); paintStrokeStats.set(stats); },
                panMode: (active) => { panning = active; },
            });
            unsubscribe.push(appSettings.subscribe((settings) => controller?.setBackground(settings)));
        } catch (error) {
            exportStatus.set(error instanceof Error ? error.message : 'The drawing canvas is unavailable.');
        }
        return () => { controller?.dispose(); unsubscribe.forEach((stop) => stop()); };
    });

    export function clearForeground() { controller?.clear(); }

    async function exportImage(action: 'save' | 'copy', background: boolean) {
        if (!controller) { exportStatus.set('The drawing canvas is unavailable.'); return; }
        try {
            const image = controller.image(background);
            if (action === 'save') await downloadCanvas(image, $appSettings.downloadFilename);
            else await copyCanvas(image);
            exportStatus.set(action === 'save' ? 'PNG download started.' : 'Image copied to clipboard.');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Please try again.';
            exportStatus.set(`${action === 'save' ? 'Save' : 'Copy'} failed: ${message}`);
        }
    }

    export function saveCanvas() { return exportImage('save', true); }
    export function copyForegroundToClipboard() { return exportImage('copy', false); }
    export function copyWithBackgroundToClipboard() { return exportImage('copy', true); }
</script>

<div bind:this={surface} class="canvas-viewport" class:panning>
    <div class="canvas-transform-wrapper"
        style:transform={`translate(${$canvasViewport.panX}px, ${$canvasViewport.panY}px) scale(${$canvasViewport.zoom / $canvasViewport.dpr})`}>
        <canvas bind:this={canvas} aria-label="Drawing canvas" tabindex="0"
            class:nearest-sampling={$appSettings.renderSampling === 'NEAREST'}>
            Use a pointer to draw. Focus this canvas for Delete or Backspace to clear and Space to pan.
        </canvas>
    </div>
</div>

<style>
    .canvas-viewport { position: relative; width: 100%; height: 100%; overflow: hidden; background: #888; touch-action: none; cursor: crosshair; }
    .canvas-viewport.panning { cursor: grab; }
    .canvas-viewport.panning:active { cursor: grabbing; }
    .canvas-transform-wrapper { position: absolute; transform-origin: 0 0; will-change: transform; box-shadow: 0 8px 40px #0009; }
    canvas { display: block; touch-action: none; }
    canvas:focus-visible { outline: 2px solid #1765cb; outline-offset: 2px; }
    .nearest-sampling { image-rendering: pixelated; }
</style>