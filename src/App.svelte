<script>
    import { clearCanvas, getCanvas2DContext } from "./lib/utils/draw.js";
    import { keydown } from "./lib/actions/keydown.js";
    import InfoPanel from "./components/InfoPanel.svelte";
    import FormatSettingsPanel from "./components/FormatSettingsPanel.svelte";
    import PointerStatsPanel from "./components/PointerStatsPanel.svelte";
    import SensorsPanel from "./components/SensorsPanel.svelte";
    import AdvancedSettingsPanel from "./components/AdvancedSettingsPanel.svelte";
    import StrokeStatsPanel from "./components/StrokeStatsPanel.svelte";
    import CanvasArea from "./components/CanvasArea.svelte";
    import { uiState, appSettings } from "./lib/stores.js";
    import "./app.css";

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
    <div class="controlscontainer">
        <InfoPanel
            onClear={clearMainCanvas}
            onSave={() => canvasAreaRef?.saveCanvas()}
        />
        <FormatSettingsPanel />

        <PointerStatsPanel />

        <SensorsPanel />

        <AdvancedSettingsPanel />

        {#if $uiState.showStrokeStats}
            <StrokeStatsPanel />
        {/if}
    </div>

    <!-- The actual canvas is now a component -->
    <div class="controlscolumn" id="canvasColumn">
        <CanvasArea bind:this={canvasAreaRef} bind:canvas={mainCanvas} />
    </div>
</div>
