<script lang="ts">
    import { pointerLiveStats } from '../lib/stores';
    import StatsRow from './StatsRow.svelte';
</script>

<div class="controlscolumn" id="pointerColumn">
    <span style="font-weight: bold">POINTER</span>
    <br />
    <StatsRow label="X" value={$pointerLiveStats.canvasPosXProcessed} />
    <StatsRow label="Y" value={$pointerLiveStats.canvasPosYProcessed} />
    <StatsRow label="Velocity" value={$pointerLiveStats.velocity} suffix=" px/s" />
    <StatsRow label="Direction" value={$pointerLiveStats.direction} />
</div>
