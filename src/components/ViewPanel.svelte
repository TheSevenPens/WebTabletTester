<script lang="ts">
    import { canvasViewport } from '../lib/stores';
    import { DEFAULT_CANVAS_PAN_X, DEFAULT_CANVAS_PAN_Y } from '../lib/constants';
    import StatsRow from './StatsRow.svelte';

    function zoomIn() {
        // Zoom by 1.25x scaling towards the center of the viewport
        applyZoomAtCenter($canvasViewport.zoom * 1.25);
    }

    function zoomOut() {
        // Zoom by 0.8x scaling towards the center of the viewport
        applyZoomAtCenter($canvasViewport.zoom * 0.8);
    }

    function resetZoomAndPan() {
        $canvasViewport.zoom = 1.0;
        $canvasViewport.panX = DEFAULT_CANVAS_PAN_X;
        $canvasViewport.panY = DEFAULT_CANVAS_PAN_Y;
    }

    function fitToViewport() {
        const dpr = window.devicePixelRatio || 1;
        const viewportWidth = $canvasViewport.viewportWidth || window.innerWidth;
        const viewportHeight = $canvasViewport.viewportHeight || window.innerHeight;
        const fitPaddingX = DEFAULT_CANVAS_PAN_X;
        const fitPaddingY = DEFAULT_CANVAS_PAN_Y;

        const baseCanvasWidth = $canvasViewport.width / dpr;
        const baseCanvasHeight = $canvasViewport.height / dpr;
        if (baseCanvasWidth <= 0 || baseCanvasHeight <= 0) {
            return;
        }

        const availableWidth = Math.max(1, viewportWidth - fitPaddingX * 2);
        const availableHeight = Math.max(1, viewportHeight - fitPaddingY * 2);

        const fitZoom = Math.max(
            0.1,
            Math.min(
                10.0,
                Math.min(availableWidth / baseCanvasWidth, availableHeight / baseCanvasHeight)
            )
        );

        $canvasViewport.zoom = fitZoom;
        $canvasViewport.panX = DEFAULT_CANVAS_PAN_X;
        $canvasViewport.panY = DEFAULT_CANVAS_PAN_Y;
    }

    function setZoomFromInput(value: string) {
        let percent = parseInt(value, 10);
        if (!isNaN(percent)) {
            applyZoomAtCenter(percent / 100.0);
        }
    }

    function applyZoomAtCenter(newZoom: number) {
        newZoom = Math.max(0.1, Math.min(newZoom, 10.0));

        const dpr = window.devicePixelRatio || 1;
        const viewportWidth = $canvasViewport.viewportWidth || window.innerWidth;
        const viewportHeight = $canvasViewport.viewportHeight || window.innerHeight;

        // Use the center of the canvas viewport as the relative zoom point
        const centerX = viewportWidth / 2;
        const centerY = viewportHeight / 2;

        const currentRenderScale = $canvasViewport.zoom / dpr;
        const newRenderScale = newZoom / dpr;

        const unscaledX = (centerX - $canvasViewport.panX) / currentRenderScale;
        const unscaledY = (centerY - $canvasViewport.panY) / currentRenderScale;

        $canvasViewport.zoom = newZoom;
        $canvasViewport.panX = centerX - unscaledX * newRenderScale;
        $canvasViewport.panY = centerY - unscaledY * newRenderScale;
    }

</script>

<div class="controlscolumn" id="viewColumnInfo">
    <span style="font-weight: bold">VIEW</span>
    <br />
    <div class="basiccontainer" style="padding-top: 1px;">
        <div class="basiccolumn" style="text-align: left;">Zoom</div>
        <div class="basiccolumn" style="text-align: right;">
            <input 
                type="number" 
                value={Math.round($canvasViewport.zoom * 100)} 
                min="10" 
                max="1000" 
                style="width: 45px; text-align: right;"
                onchange={(e) => setZoomFromInput(e.currentTarget.value)} 
            />%
        </div>
    </div>
    <div style="margin-top: 5px;">
        <button type="button" onclick={zoomOut}>-</button>
        <button type="button" onclick={fitToViewport}>FIT</button>
        <button type="button" onclick={resetZoomAndPan}>RESET</button>
        <button type="button" onclick={zoomIn}>+</button>
    </div>
</div>
