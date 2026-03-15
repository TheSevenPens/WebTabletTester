<script lang="ts">
    import { clearCanvas, getCanvas2DContext } from './lib/utils/draw';
    import { keydown } from './lib/actions/keydown';
    import InfoPanel from './components/InfoPanel.svelte';
    import DocPanel from './components/DocPanel.svelte';
    import FormatSettingsPanel from './components/FormatSettingsPanel.svelte';
    import PointerStatsPanel from './components/PointerStatsPanel.svelte';
    import SensorsPanel from './components/SensorsPanel.svelte';
    import AdvancedSettingsPanel from './components/AdvancedSettingsPanel.svelte';
    import StrokeStatsPanel from './components/StrokeStatsPanel.svelte';
    import CanvasArea from './components/CanvasArea.svelte';
    import ViewPanel from './components/ViewPanel.svelte';
    import { uiState, appSettings } from './lib/stores';
    import './app.css';

    /** @type {HTMLCanvasElement} */
    let mainCanvas;
    let canvasAreaRef;

    function clearMainCanvas() {
        const ctx = getCanvas2DContext(mainCanvas);
        if (ctx && mainCanvas) clearCanvas(ctx, mainCanvas, $appSettings.canvasColor);
    }

    const clearKeys = { Delete: clearMainCanvas, Backspace: clearMainCanvas };
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="parent" oncontextmenu={(e) => e.preventDefault()} use:keydown={clearKeys}>
    <!-- Top row: Info, Format, Canvas, Pointer, Sensors, (Stroke stats) -->
    <div class="top-row">
        <div class="controlscontainer">
            <InfoPanel />
            <DocPanel onClear={clearMainCanvas} onSave={() => canvasAreaRef?.saveCanvas()} />
            <FormatSettingsPanel />
            <ViewPanel />
            <PointerStatsPanel />

            <SensorsPanel />

            {#if $uiState.showStrokeStats}
                <StrokeStatsPanel />
            {/if}
        </div>
    </div>

    <!-- Bottom row: Advanced panel + Canvas -->
    <div class="bottom-row">
        <AdvancedSettingsPanel />

        <div class="controlscolumn" id="canvasColumn">
            <CanvasArea bind:this={canvasAreaRef} bind:canvas={mainCanvas} />
        </div>
    </div>
</div>
