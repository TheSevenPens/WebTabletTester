<script lang="ts">
    import { processingSettings } from '../lib/stores';
    import { PRESSURE_QUANT_OPTIONS } from '../lib/constants';
</script>

<section class="advanced-panel-section">
    <h4 class="advanced-panel-section-title">Quantization</h4>

    <label for="pressureQuantSelect">Pressure quantization: </label>
    <select id="pressureQuantSelect" bind:value={$processingSettings.pressureQuant}>
        {#each PRESSURE_QUANT_OPTIONS as { value, label }}
            <option {value}>{label}</option>
        {/each}
    </select>
    <br />
</section>
