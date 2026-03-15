<script lang="ts">
    import { pointerLiveStats } from '../lib/stores';
    import StatsRow from './StatsRow.svelte';
</script>

<div class="controlscolumn" id="pointerColumn">
    <span style="font-weight: bold">POINTER</span>
    <br />
    <StatsRow label="X" value={$pointerLiveStats.canvasPosXProcessed} />
    <StatsRow label="Y" value={$pointerLiveStats.canvasPosYProcessed} />
    <StatsRow label="Vel" value={$pointerLiveStats.velocity} />
    <StatsRow label="Dir" value={$pointerLiveStats.direction} />
</div>
