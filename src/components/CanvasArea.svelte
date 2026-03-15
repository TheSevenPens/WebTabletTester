<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import {
        appSettings,
        processingSettings,
        paintState,
        paintStrokeStats,
        canvasViewport
    } from '../lib/stores';
    import {
        pointerEventHandler,
        onPointerUp,
        onPointerEnter,
        onPointerLeave,
        defaultPtrEventHandlerDoNothing,
    } from '../lib/app_pointer';
    import { clearCanvas, getCanvas2DContext } from '../lib/utils/draw';
    import { DEFAULT_CANVAS_PAN_X, DEFAULT_CANVAS_PAN_Y } from '../lib/constants';

    /** @type {HTMLCanvasElement} */
    export let canvas: HTMLCanvasElement;

    /** @type {HTMLAnchorElement} */
    let downloadLink: HTMLAnchorElement;

    const dispatch = createEventDispatcher();

    // Pan interaction state
    let isPanning = false;
    let lastPanX = 0;
    let lastPanY = 0;

    // Device Pixel Ratio binding
    let dpr = 1;

    // Keyboard state
    let isSpacebarDown = false;

    function handleKeyDown(e: KeyboardEvent) {
        if (e.code === 'Space' && !e.repeat) {
            // Only prevent default if we're not typing in an input field
            const target = e.target as HTMLElement;
            if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                isSpacebarDown = true;
            }
        }
    }

    function handleKeyUp(e: KeyboardEvent) {
        if (e.code === 'Space') {
            isSpacebarDown = false;
        }
    }

    function handlePointer(e: PointerEvent) {
        // Intercept middle mouse button OR spacebar for panning
        if (e.buttons === 4 || isSpacebarDown || isPanning) {
            handlePan(e);
            return;
        }

        pointerEventHandler(
            e,
            canvas,
            $appSettings,
            $processingSettings,
            $paintState,
            $paintStrokeStats
        );
    }

    function handlePan(e: PointerEvent) {
        if (e.type === 'pointerdown' && (e.buttons === 4 || isSpacebarDown)) {
            isPanning = true;
            lastPanX = e.clientX;
            lastPanY = e.clientY;
            if (canvas) {
                // Setp pointer capture to continue panning even if mouse leaves the element
                canvas.setPointerCapture(e.pointerId);
            }
        } else if (e.type === 'pointermove' && isPanning) {
            const dx = e.clientX - lastPanX;
            const dy = e.clientY - lastPanY;
            $canvasViewport.panX += dx;
            $canvasViewport.panY += dy;
            lastPanX = e.clientX;
            lastPanY = e.clientY;
        } else if (e.type === 'pointerup') {
            isPanning = false;
            if (canvas && canvas.hasPointerCapture(e.pointerId)) {
                canvas.releasePointerCapture(e.pointerId);
            }
        }
    }


    function handleWheel(e: WheelEvent) {
        e.preventDefault();

        const zoomSensitivity = 0.001;
        const delta = -e.deltaY * zoomSensitivity;
        
        let newZoom = $canvasViewport.zoom * Math.exp(delta);
        
        // Clamp zoom between 0.1x and 10x
        newZoom = Math.max(0.1, Math.min(newZoom, 10.0));

        // Calculate zoom around pointer location
        // The pointer position relative to the container
        const container = e.currentTarget as HTMLElement;
        const rect = container.getBoundingClientRect();
        
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const currentRenderScale = $canvasViewport.zoom / dpr;
        const newRenderScale = newZoom / dpr;

        // Where is the mouse currently relative to the raw canvas size (scaled inversely)
        const unscaledX = (mouseX - $canvasViewport.panX) / currentRenderScale;
        const unscaledY = (mouseY - $canvasViewport.panY) / currentRenderScale;

        // Apply new zoom
        $canvasViewport.zoom = newZoom;

        // Adjust pan to keep the unscaled point under the mouse
        $canvasViewport.panX = mouseX - unscaledX * newRenderScale;
        $canvasViewport.panY = mouseY - unscaledY * newRenderScale;

    }

    onMount(() => {
        dpr = window.devicePixelRatio || 1;
        const updateDpr = () => { dpr = window.devicePixelRatio || 1; };
        window.addEventListener('resize', updateDpr);

        // Initialize our fixed canvas
        canvas.width = $canvasViewport.width;
        canvas.height = $canvasViewport.height;
        
        // Start near the top-left so the drawing area is easier to reach quickly.
        $canvasViewport.panX = DEFAULT_CANVAS_PAN_X;
        $canvasViewport.panY = DEFAULT_CANVAS_PAN_Y;

        const ctx = getCanvas2DContext(canvas);
        if (ctx) clearCanvas(ctx, canvas, $appSettings.canvasColor);

        return () => window.removeEventListener('resize', updateDpr);
    });

    export function saveCanvas() {
        if (!canvas || !downloadLink) return;

        const now = new Date();
        const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
        const filename = `${$appSettings.downloadFilename}_${timestamp}.png`;

        const url = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');

        downloadLink.download = filename;
        downloadLink.href = url;
        downloadLink.click();
    }

</script>

<svelte:window onkeydown={handleKeyDown} onkeyup={handleKeyUp} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
    class="canvas-viewport" 
    class:panning-mode={isSpacebarDown || isPanning}
    oncontextmenu={(e) => e.preventDefault()}
    onwheel={handleWheel}
>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_mouse_events_have_key_events -->
    <div class="canvas-transform-wrapper" style="transform: translate({Math.round($canvasViewport.panX)}px, {Math.round($canvasViewport.panY)}px) scale({$canvasViewport.zoom / dpr});">
        <canvas
            bind:this={canvas}
            id="myCanvas"
            class="drawing-canvas"
            onpointerdown={handlePointer}
            onpointerup={(e) => { e.buttons === 4 || isPanning ? handlePan(e) : onPointerUp(e); }}
            onpointercancel={handlePointer}
            onpointermove={handlePointer}
            onpointerover={defaultPtrEventHandlerDoNothing}
            onpointerout={defaultPtrEventHandlerDoNothing}
            onpointerenter={onPointerEnter}
            onpointerleave={onPointerLeave}
            ongotpointercapture={defaultPtrEventHandlerDoNothing}
            onlostpointercapture={defaultPtrEventHandlerDoNothing}
        >
        </canvas>
    </div>
</div>

<!-- Hidden download link for saving the canvas -->
<a bind:this={downloadLink} href={'#'} style="display:none;">download</a>

<style>
    .canvas-viewport {
        position: relative;
        width: 100vw;
        height: 100vh; /* Actually this should ideally match outer constraints. For now give it large flex size. */
        overflow: hidden;
        background-color: #888;
        cursor: Default;
        touch-action: none; /* Disable browser zooming/panning via touch */
    }

    .canvas-viewport.panning-mode {
        cursor: grab;
    }

    .canvas-viewport.panning-mode:active {
        cursor: grabbing;
    }

    .canvas-transform-wrapper {
        position: absolute;
        transform-origin: 0 0;
        will-change: transform;
        /* Shadow for fixed document look */
        box-shadow: 0px 8px 40px rgba(0,0,0,0.6);
    }

    .drawing-canvas {
        display: block;
        background-color: white; /* Make sure the fixed bounds are always solidly backgrounded */
        touch-action: none;
    }
</style>
