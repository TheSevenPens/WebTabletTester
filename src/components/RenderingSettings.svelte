<script lang="ts">
    import { appSettings } from '../lib/stores';
    import { RENDER_SAMPLING_OPTIONS } from '../lib/constants';
    import CollapsibleSection from './CollapsibleSection.svelte';
</script>

<CollapsibleSection title="Rendering">
    <label class="control-row" for="renderSamplingSelect"
        >Sampling
        <select id="renderSamplingSelect" bind:value={$appSettings.renderSampling}>
            {#each RENDER_SAMPLING_OPTIONS as option (option.value)}
                <option value={option.value}>{option.label}</option>
            {/each}
        </select>
    </label>
</CollapsibleSection>
