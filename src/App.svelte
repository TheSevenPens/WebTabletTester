<script>
    import { clearCanvas, getCanvas2DContext } from "./lib/utils/draw.js";
    import { keydown } from "./lib/actions/keydown.js";
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
<div class="parent" on:contextmenu|preventDefault use:keydown={clearKeys}>
    <div class="controlscontainer">
        <div class="controlscolumn" id="headerColumn">
            <h3>SevenPens <br /> Tablet Tester <br /> v0.910</h3>
            <p>
                <a
                    href="https://thesevenpens.github.io/HtmlTabletTester/"
                    target="_blank"
                    rel="noopener noreferrer">DOCS</a
                >
                |
                <a
                    href="https://github.com/TheSevenPens/HtmlTabletTester"
                    target="_blank"
                    rel="noopener noreferrer">CODE</a
                >
                <br />
                <button
                    type="button"
                    onclick={clearMainCanvas}>CLEAR</button
                >
                <button
                    type="button"
                    onclick={() => canvasAreaRef.saveCanvas()}>SAVE</button
                >
            </p>
        </div>
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
