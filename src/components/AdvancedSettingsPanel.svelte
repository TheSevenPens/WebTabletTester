<script>
    import {
        uiState,
        processingSettings,
        paintSettings,
    } from "../lib/stores.js";
    import { paintSettings as legacyPaintSettings } from "../lib/paint_data.js";
    import { processingSettings as legacyProcessingSettings } from "../lib/paint_data.js";
    import { syncPaintSettingsToLegacy, syncProcessingSettingsToLegacy } from "../lib/syncStoresToLegacy.js";
    import { resetAllProcessingToDefault, setProcessingAndNotify } from "../lib/processing_helpers.js";
    import { PRESSURE_QUANT_OPTIONS } from "../lib/constants.js";
    import SliderWithNumber from "./SliderWithNumber.svelte";
    import CurveGraph from "./CurveGraph.svelte";

    let showSmoothing = $state(false);

    function resetAdvancedSettings() {
        $paintSettings.eraseOnStrokeStart = false;
        $uiState.showStrokeStats = false;
        resetAllProcessingToDefault($processingSettings);
        $processingSettings = $processingSettings;
        $paintSettings = $paintSettings;
        $uiState = $uiState;
    }

    $effect(() => syncPaintSettingsToLegacy($paintSettings, legacyPaintSettings));
    $effect(() => syncProcessingSettingsToLegacy($processingSettings, legacyProcessingSettings));
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
        onclick={() => (showSmoothing = !showSmoothing)}
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
                onInput={(v) => {
                    $processingSettings = setProcessingAndNotify($processingSettings, (p) => {
                        p.posXSmoother.setSmoothingAmount(v);
                        p.posYSmoother.setSmoothingAmount(v);
                    });
                }}
            />
            <br />

            <SliderWithNumber
                id="pressureSmoothingSlider"
                label="Pressure smoothing:"
                value={$processingSettings.pressureSmoother.amount}
                onInput={(v) => {
                    $processingSettings = setProcessingAndNotify($processingSettings, (p) => {
                        p.pressureSmoother.setSmoothingAmount(v);
                    });
                }}
            />
            <br />

            <SliderWithNumber
                id="tiltSmoothingSlider"
                label="Tilt smoothing:"
                value={$processingSettings.tiltXSmoother.amount}
                onInput={(v) => {
                    $processingSettings = setProcessingAndNotify($processingSettings, (p) => {
                        p.tiltXSmoother.setSmoothingAmount(v);
                        p.tiltYSmoother.setSmoothingAmount(v);
                    });
                }}
            />
            <br />
            <label for="pressureQuantSelect">Pressure quantization: </label>
            <select
                id="pressureQuantSelect"
                bind:value={$processingSettings.pressureQuant}
            >
                {#each PRESSURE_QUANT_OPTIONS as { value, label }}
                    <option value={value}>{label}</option>
                {/each}
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
                        onInput={(v) => {
                            $processingSettings = setProcessingAndNotify($processingSettings, (p) => {
                                p.pressureCurveAmount.setCurveAmount(v);
                            });
                        }}
                    />
                    <datalist id="pressureCurveTickmarks">
                        <option value="0.0"></option>
                    </datalist>
                </div>
                <div class="basiccolumn">
                    <CurveGraph
                        id="curveCanvas"
                        width={40}
                        height={40}
                        curveAmount={$processingSettings.pressureCurveAmount}
                    />
                </div>
            </div>
            <br />
            <button type="button" onclick={resetAdvancedSettings}>RESET</button
            >
        </div>
    {/if}
</div>
