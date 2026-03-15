<script lang="ts">
    import { canvasViewport } from '../lib/stores';
    import StatsRow from './StatsRow.svelte';
</script>

<div class="controlscolumn" id="canvasColumnInfo">
    <span style="font-weight: bold">CANVAS</span>
    <br />
    <StatsRow
        label="Size"
        value={`${$canvasViewport.width}x${$canvasViewport.height} px`}
    />
    <StatsRow
        label="Zoom"
        value={`${Math.round($canvasViewport.zoom * 100)}%`}
    />
</div>
