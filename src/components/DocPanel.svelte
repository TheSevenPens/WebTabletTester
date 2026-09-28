<script lang="ts">
    import { canvasViewport, exportStatus } from '../lib/stores';
    import StatsRow from './StatsRow.svelte';
    interface Props {
        onClear: () => void;
        onSave: () => void;
        onCopy: () => void;
        onCopyWithBackground: () => void;
    }
    let { onClear, onSave, onCopy, onCopyWithBackground }: Props = $props();
</script>

<section class="controlscolumn document-panel" aria-label="Document">
    <h2>DOCUMENT</h2>
    <StatsRow
        label="Size"
        value={`${$canvasViewport.width}×${$canvasViewport.height}`}
        suffix=" px"
    />
    <div class="button-row">
        <button onclick={onClear}>CLEAR</button><button onclick={onCopy}>COPY</button>
        <button onclick={onCopyWithBackground}>COPY w/ BK</button><button onclick={onSave}
            >SAVE</button
        >
    </div>
    <p class="export-status" role="status">{$exportStatus}</p>
</section>
