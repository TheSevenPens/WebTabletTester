<script lang="ts">
    import { processingSettings } from '../lib/stores';
    import { setProcessingAndNotify } from '../lib/processing_helpers';
    import type { ProcessingSettings } from '../lib/types';
    import { PRESSURE_QUANT_OPTIONS } from '../lib/constants';
    import SliderWithNumber from './SliderWithNumber.svelte';
    import CurveGraph from './CurveGraph.svelte';
</script>

<section class="advanced-panel-section">
    <h4 class="advanced-panel-section-title">Pressure</h4>

    <label for="pressureQuantSelect">Pressure quantization: </label>
    <select id="pressureQuantSelect" bind:value={$processingSettings.pressureQuant}>
        {#each PRESSURE_QUANT_OPTIONS as { value, label }}
            <option {value}>{label}</option>
        {/each}
    </select>
    <br />

    <div>
        <SliderWithNumber
            id="pressureCurveAmountSlider"
            label="Pressure curve:"
            min="-0.90"
            max="0.90"
            step="0.1"
            list="pressureCurveTickmarks"
            value={$processingSettings.pressureCurveAmount.amount}
            onInput={(v: number) => {
                $processingSettings = setProcessingAndNotify(
                    $processingSettings,
                    (p: ProcessingSettings) => {
                        p.pressureCurveAmount.setCurveAmount(v);
                    }
                );
            }}
        />
        <datalist id="pressureCurveTickmarks">
            <option value="0.0"></option>
        </datalist>
    </div>
    <div style="margin-top: 8px;">
        <CurveGraph
            id="curveCanvas"
            width={40}
            height={40}
            curveAmount={$processingSettings.pressureCurveAmount}
        />
    </div>
</section>
