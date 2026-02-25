<script>
    import {
        uiState,
        processingSettings,
        paintSettings,
    } from "../lib/stores.js";
    import { paintSettings as legacyPaintSettings } from "../lib/paint_data.js";
    import { processingSettings as legacyProcessingSettings } from "../lib/paint_data.js";
    import { drawPressureCurve } from "../lib/utils/draw.js";
    import SliderWithNumber from "./SliderWithNumber.svelte";

    let curveCanvas;
    let showSmoothing = false;

    $: {
        if (curveCanvas && $processingSettings.pressureCurveAmount) {
            drawPressureCurve(
                curveCanvas.getContext("2d"),
                curveCanvas,
                $processingSettings.pressureCurveAmount,
            );
        }
    }

    function resetAdvancedSettings() {
        $paintSettings.eraseOnStrokeStart = false;
        $uiState.showStrokeStats = false;

        $processingSettings.posXSmoother.setSmoothingAmount(0.0);
        $processingSettings.posYSmoother.setSmoothingAmount(0.0);
        $processingSettings.pressureSmoother.setSmoothingAmount(0.0);
        $processingSettings.tiltXSmoother.setSmoothingAmount(0.0);
        $processingSettings.tiltYSmoother.setSmoothingAmount(0.0);
        $processingSettings.tiltAzimuthSmoother.setSmoothingAmount(0.0);
        $processingSettings.tiltAltitudeSmoother.setSmoothingAmount(0.0);
        $processingSettings.pressureCurveAmount.setCurveAmount(0.0);
        $processingSettings.pressureQuant = 0;

        // Force Svelte store update
        $processingSettings = $processingSettings;
        $paintSettings = $paintSettings;
        $uiState = $uiState;
    }

    $: {
        legacyPaintSettings.eraseOnStrokeStart =
            $paintSettings.eraseOnStrokeStart;
        legacyProcessingSettings.posXSmoother.setSmoothingAmount(
            $processingSettings.posXSmoother.amount,
        );
        legacyProcessingSettings.posYSmoother.setSmoothingAmount(
            $processingSettings.posYSmoother.amount,
        );
        legacyProcessingSettings.pressureSmoother.setSmoothingAmount(
            $processingSettings.pressureSmoother.amount,
        );
        legacyProcessingSettings.tiltXSmoother.setSmoothingAmount(
            $processingSettings.tiltXSmoother.amount,
        );
        legacyProcessingSettings.tiltYSmoother.setSmoothingAmount(
            $processingSettings.tiltYSmoother.amount,
        );
        legacyProcessingSettings.pressureCurveAmount.setCurveAmount(
            $processingSettings.pressureCurveAmount.amount,
        );
        legacyProcessingSettings.pressureQuant = parseInt(
            $processingSettings.pressureQuant.toString() || "0",
        );
    }
</script>

<div class="controlscolumn" id="advancedColumn" style="position: relative;">
    <span style="font-weight: bold">ADVANCED</span>
    <br />
    Live size:
    <span> <span class="monospace">---</span></span>
    <br />
    <label>
        <input
            type="checkbox"
            bind:checked={$paintSettings.eraseOnStrokeStart}
        />
        Erase on stroke start
    </label>
    <br />
    <label>
        <input type="checkbox" bind:checked={$uiState.showStrokeStats} />
        Show stroke stats
    </label>
    <br />

    <button
        type="button"
        id="smoothingButton"
        on:click={() => (showSmoothing = !showSmoothing)}
    >
        {showSmoothing ? "HIDE PROCESSING" : "SHOW PROCESSING"}
    </button>

    <!-- Smoothing Flyout Element -->
    {#if showSmoothing}
        <div id="smoothingFlyout" class="smoothing-flyout">
            <SliderWithNumber
                id="positionSmoothingSlider"
                label="Position smoothing:"
                value={$processingSettings.posXSmoother.amount}
                on:input={(e) => {
                    $processingSettings.posXSmoother.setSmoothingAmount(
                        e.detail.value,
                    );
                    $processingSettings.posYSmoother.setSmoothingAmount(
                        e.detail.value,
                    );
                    $processingSettings = $processingSettings;
                }}
            />
            <br />

            <SliderWithNumber
                id="pressureSmoothingSlider"
                label="Pressure smoothing:"
                value={$processingSettings.pressureSmoother.amount}
                on:input={(e) => {
                    $processingSettings.pressureSmoother.setSmoothingAmount(
                        e.detail.value,
                    );
                    $processingSettings = $processingSettings;
                }}
            />
            <br />

            <SliderWithNumber
                id="tiltSmoothingSlider"
                label="Tilt smoothing:"
                value={$processingSettings.tiltXSmoother.amount}
                on:input={(e) => {
                    $processingSettings.tiltXSmoother.setSmoothingAmount(
                        e.detail.value,
                    );
                    $processingSettings.tiltYSmoother.setSmoothingAmount(
                        e.detail.value,
                    );
                    $processingSettings = $processingSettings;
                }}
            />
            <br />
            <label for="pressureQuantSelect">Pressure quantization: </label>
            <select
                id="pressureQuantSelect"
                bind:value={$processingSettings.pressureQuant}
            >
                <option value={0} selected>OFF</option>
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={16}>16</option>
                <option value={32}>32</option>
                <option value={64}>64</option>
                <option value={128}>128</option>
                <option value={256}>256</option>
                <option value={1024}>1024</option>
                <option value={2048}>2048</option>
                <option value={4096}>4096</option>
                <option value={8192}>8192</option>
            </select>
            <br />

            <div class="basiccontainer" id="advancedcontrols2">
                <div class="basiccolumn">
                    <SliderWithNumber
                        id="pressureCurveAmountSlider"
                        label="Pressure curve:"
                        min="-0.90"
                        max="0.90"
                        step="0.1"
                        list="pressureCurveTickmarks"
                        value={$processingSettings.pressureCurveAmount.amount}
                        on:input={(e) => {
                            $processingSettings.pressureCurveAmount.setCurveAmount(
                                e.detail.value,
                            );
                            $processingSettings = $processingSettings;
                        }}
                    />
                    <datalist id="pressureCurveTickmarks">
                        <option value="0.0"></option>
                    </datalist>
                </div>
                <div class="basiccolumn">
                    <canvas
                        bind:this={curveCanvas}
                        id="curveCanvas"
                        width="40"
                        height="40"
                    ></canvas>
                </div>
            </div>
            <br />
            <button type="button" on:click={resetAdvancedSettings}>RESET</button
            >
        </div>
    {/if}
</div>
