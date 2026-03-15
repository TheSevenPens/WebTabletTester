<script lang="ts">
    import { canvasViewport } from '../lib/stores';
    import StatsRow from './StatsRow.svelte';

    interface Props {
        onClear?: () => void;
        onSave?: () => void;
    }
    let { onClear = () => {}, onSave = () => {} }: Props = $props();
</script>

<div class="controlscolumn" id="docColumn">
    <span style="font-weight: bold">DOCUMENT</span>
    <br />
    <StatsRow
        label="Size"
        value={`${$canvasViewport.width}x${$canvasViewport.height} px`}
    />
    <div style="margin-top: 5px;">
        <button type="button" onclick={onClear}>CLEAR</button>
        <button type="button" onclick={onSave}>SAVE</button>
    </div>
</div>
