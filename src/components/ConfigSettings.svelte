<script lang="ts">
    import { paintSettings, uiState } from '../lib/stores';
    import CollapsibleSection from './CollapsibleSection.svelte';
</script>
<CollapsibleSection title="Config">
    <label class="check-row"><input type="checkbox" bind:checked={$paintSettings.eraseOnStrokeStart} />Erase on stroke start</label>
    <label class="check-row"><input type="checkbox" bind:checked={$uiState.showStrokeStats} />Show stroke stats</label>
</CollapsibleSection>