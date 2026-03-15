<script lang="ts">
    import { canvasViewport } from '../lib/stores';
    import StatsRow from './StatsRow.svelte';

    interface Props {
        onClear?: () => void;
        onSave?: () => void;
        onCopy?: () => void;
        onCopyWithBackground?: () => void;
    }
    let {
        onClear = () => {},
        onSave = () => {},
        onCopy = () => {},
        onCopyWithBackground = () => {},
    }: Props = $props();
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
        <button type="button" onclick={onCopy}>COPY</button>
        <button type="button" onclick={onCopyWithBackground}>COPY w/ BK</button>
        <button type="button" onclick={onSave}>SAVE</button>
    </div>
</div>
