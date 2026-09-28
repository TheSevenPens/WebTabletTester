<script lang="ts">
    import { paintStrokeStatsWithRate } from '../lib/stores';
    import StatsRow from './StatsRow.svelte';
</script>

<section class="controlscolumn" aria-label="Stroke statistics">
    <h2>STROKE STATS</h2>
    <StatsRow label="Completed" value={$paintStrokeStatsWithRate.strokeCount} digits={0} />
    <StatsRow label="Cancelled" value={$paintStrokeStatsWithRate.cancelledStrokeCount} digits={0} />
    <StatsRow label="Samples" value={$paintStrokeStatsWithRate.sampleCount} digits={0} />
    <StatsRow label="Duration" value={$paintStrokeStatsWithRate.duration} suffix=" ms" />
    <StatsRow label="Samples/sec" value={$paintStrokeStatsWithRate.rate} />
</section>
