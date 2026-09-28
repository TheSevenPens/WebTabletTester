<script lang="ts">
    import { appSettings } from '../lib/stores';
    import CollapsibleSection from './CollapsibleSection.svelte';
    function setSize(event: Event & { currentTarget: HTMLInputElement }) {
        const size = event.currentTarget.valueAsNumber;
        if (Number.isFinite(size)) $appSettings.gridSize = Math.max(5, Math.round(size));
        else event.currentTarget.value = String($appSettings.gridSize);
    }
</script>

<CollapsibleSection title="Grid">
    <label class="check-row"
        ><input type="checkbox" bind:checked={$appSettings.showGrid} />Show grid</label
    >
    <label class="control-row" for="gridSizeInput"
        >Grid size (px)
        <input
            id="gridSizeInput"
            type="number"
            min="5"
            step="1"
            value={$appSettings.gridSize}
            onchange={setSize}
        />
    </label>
    <label class="control-row" for="gridColorInput"
        >Grid color
        <input id="gridColorInput" type="color" bind:value={$appSettings.gridColor} />
    </label>
</CollapsibleSection>
