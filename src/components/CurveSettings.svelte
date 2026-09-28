<script lang="ts">
    import { processingSettings } from '../lib/stores';
    import CollapsibleSection from './CollapsibleSection.svelte';
    import SliderWithNumber from './SliderWithNumber.svelte';
    import CurveGraph from './CurveGraph.svelte';
</script>

<CollapsibleSection title="Curves">
    <SliderWithNumber
        id="pressureCurve"
        label="Pressure curve"
        min={-0.9}
        max={0.9}
        step={0.1}
        digits={2}
        value={$processingSettings.pressureCurve}
        onInput={(value) =>
            processingSettings.update((settings) => ({ ...settings, pressureCurve: value }))}
    />
    <CurveGraph amount={$processingSettings.pressureCurve} />
    <p class="help-text">Negative softens pressure; positive sharpens it.</p>
</CollapsibleSection>
