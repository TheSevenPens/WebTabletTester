<script lang="ts">
    import { processingSettings } from '../lib/stores';
    import { createProcessingSettings } from '../lib/initial_state';
    import SidebarPanel from './SidebarPanel.svelte';
    import SmoothingSettings from './SmoothingSettings.svelte';
    import QuantizationSettings from './QuantizationSettings.svelte';
    import CurveSettings from './CurveSettings.svelte';
</script>

<SidebarPanel title="Processing" side="left">
    <SmoothingSettings />
    <QuantizationSettings />
    <CurveSettings />
    <button onclick={() => processingSettings.set(createProcessingSettings())}
        >RESET PROCESSING</button
    >
</SidebarPanel>
