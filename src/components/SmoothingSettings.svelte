<script lang="ts">
    import { processingSettings } from '../lib/stores';
    import type { ProcessingSettings } from '../lib/types';
    import CollapsibleSection from './CollapsibleSection.svelte';
    import SliderWithNumber from './SliderWithNumber.svelte';
    const fields: { key: keyof Pick<ProcessingSettings, 'positionSmoothing' | 'tiltSmoothing' | 'pressureSmoothing'>; label: string }[] = [
        { key: 'positionSmoothing', label: 'Position smoothing' },
        { key: 'tiltSmoothing', label: 'Tilt smoothing' },
        { key: 'pressureSmoothing', label: 'Pressure smoothing' },
    ];
</script>
<CollapsibleSection title="Smoothing">
    {#each fields as field (field.key)}
        <SliderWithNumber id={field.key} label={field.label} max={0.999} step={0.001}
            value={$processingSettings[field.key]}
            onInput={(value) => processingSettings.update((settings) => ({ ...settings, [field.key]: value }))} />
    {/each}
</CollapsibleSection>