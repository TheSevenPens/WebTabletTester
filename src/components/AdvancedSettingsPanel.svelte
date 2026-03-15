<script lang="ts">
    import { writable } from 'svelte/store';
    import { uiState, processingSettings, paintSettings } from '../lib/stores';
    import { paintSettings as legacyPaintSettings } from '../lib/paint_data';
    import { processingSettings as legacyProcessingSettings } from '../lib/paint_data';
    import {
        syncPaintSettingsToLegacy,
        syncProcessingSettingsToLegacy,
    } from '../lib/syncStoresToLegacy';
    import { resetAllProcessingToDefault, setProcessingAndNotify } from '../lib/processing_helpers';
    import { PRESSURE_QUANT_OPTIONS } from '../lib/constants';
    import SliderWithNumber from './SliderWithNumber.svelte';
    import CurveGraph from './CurveGraph.svelte';

    const minimized = writable(true);
    function toggleMinimized() {
        minimized.update((v) => !v);
    }

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

<div class="advanced-panel" class:minimized={$minimized}>
    <div class="advanced-panel-header">
        <span class="advanced-panel-title">ADVANCED</span>
        <button
            type="button"
            class="advanced-panel-toggle"
            onclick={toggleMinimized}
            title={$minimized ? 'Restore Advanced panel' : 'Minimize Advanced panel'}
            aria-label={$minimized ? 'Restore Advanced panel' : 'Minimize Advanced panel'}
        >
            {$minimized ? '▶' : '◀'}
        </button>
    </div>

    {#if !$minimized}
        <div class="advanced-panel-content">
            <section class="advanced-panel-section">
                <h4 class="advanced-panel-section-title">Smoothing</h4>
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
            </section>

            <section class="advanced-panel-section">
                <h4 class="advanced-panel-section-title">Pressure</h4>

                <label for="pressureQuantSelect">Pressure quantization: </label>
                <select id="pressureQuantSelect" bind:value={$processingSettings.pressureQuant}>
                    {#each PRESSURE_QUANT_OPTIONS as { value, label }}
                        <option {value}>{label}</option>
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
                                $processingSettings = setProcessingAndNotify(
                                    $processingSettings,
                                    (p) => {
                                        p.pressureCurveAmount.setCurveAmount(v);
                                    }
                                );
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
            </section>

            <section class="advanced-panel-section">
                <h4 class="advanced-panel-section-title">Config</h4>
                <label>
                    <input type="checkbox" bind:checked={$paintSettings.eraseOnStrokeStart} />
                    Erase on stroke start
                </label>
                <br />
                <label>
                    <input type="checkbox" bind:checked={$uiState.showStrokeStats} />
                    Show stroke stats
                </label>
            </section>

            <div style="text-align: center; margin-top: 10px; margin-bottom: 10px;">
                <button type="button" onclick={resetAdvancedSettings}>RESET</button>
            </div>
        </div>
    {:else}
        <button
            type="button"
            class="advanced-panel-minimized-label"
            onclick={toggleMinimized}
            title="Restore Advanced panel"
        >
            <span>Advanced</span>
        </button>
    {/if}
</div>
