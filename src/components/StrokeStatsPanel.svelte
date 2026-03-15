<script lang="ts">
    import { paintStrokeStatsWithRate } from '../lib/stores';
    import StatsRow from './StatsRow.svelte';
</script>

<div class="controlscolumn" id="strokeStatsPanel">
    <span style="font-weight: bold">STROKE STATS</span>
    <br />
    <StatsRow label="Count" value={$paintStrokeStatsWithRate.strokeCount} />
    <StatsRow label="Events" value={$paintStrokeStatsWithRate.ptreventCount} />
    <StatsRow label="Duration" value={$paintStrokeStatsWithRate.duration} suffix="ms" />
    <StatsRow label="Events/sec" value={$paintStrokeStatsWithRate.rate} suffix=" events/sec" />
</div>
