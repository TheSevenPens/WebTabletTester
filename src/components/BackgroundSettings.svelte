<script lang="ts">
    import { appSettings } from '../lib/stores';
    import CollapsibleSection from './CollapsibleSection.svelte';
</script>
<CollapsibleSection title="Background">
    <label class="control-row" for="backgroundColorInput">Background color
        <input id="backgroundColorInput" type="color" bind:value={$appSettings.canvasColor} />
    </label>
</CollapsibleSection>