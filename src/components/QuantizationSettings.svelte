<script lang="ts">
    import { processingSettings } from '../lib/stores';
    import { PRESSURE_QUANT_OPTIONS } from '../lib/constants';
    import CollapsibleSection from './CollapsibleSection.svelte';
</script>
<CollapsibleSection title="Quantization">
    <label class="control-row" for="pressureQuantSelect">Pressure levels
        <select id="pressureQuantSelect" bind:value={$processingSettings.pressureQuant}>
            {#each PRESSURE_QUANT_OPTIONS as option (option.value)}
                <option value={option.value}>{option.label}</option>
            {/each}
        </select>
    </label>
</CollapsibleSection>