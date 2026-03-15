<script lang="ts">
    import { canvasViewport } from '../lib/stores';
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
        const dpr = window.devicePixelRatio || 1;
        $canvasViewport.zoom = 1.0;
        $canvasViewport.panX = (window.innerWidth - ($canvasViewport.width / dpr)) / 2;
        $canvasViewport.panY = 50;
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

        // Use the center of the screen as the relative zoom point
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

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
        <button type="button" onclick={resetZoomAndPan}>RESET</button>
        <button type="button" onclick={zoomIn}>+</button>
    </div>
</div>
