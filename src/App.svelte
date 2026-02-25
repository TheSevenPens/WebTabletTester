<script>
    import { onMount } from "svelte";
    import { clearCanvas } from "./lib/utils/draw.js";
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
</script>

<svelte:window
    on:keydown={(e) => {
        if (e.key === "Delete" || e.key === "Backspace") {
            clearCanvas(
                mainCanvas.getContext("2d"),
                mainCanvas,
                $appSettings.canvasColor,
            );
        }
    }}
/>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="parent" on:contextmenu|preventDefault>
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
                    on:click={() =>
                        clearCanvas(
                            mainCanvas.getContext("2d"),
                            mainCanvas,
                            $appSettings.canvasColor,
                        )}>CLEAR</button
                >
                <button
                    type="button"
                    on:click={() => canvasAreaRef.saveCanvas()}>SAVE</button
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
