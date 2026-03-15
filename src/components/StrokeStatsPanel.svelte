<script>
    import { paintStrokeStats } from "../lib/stores.js";
    import StatsRow from "./StatsRow.svelte";
</script>

<div class="controlscolumn" id="strokeStatsPanel">
    <span style="font-weight: bold">STROKE STATS</span>
    <br />
    <StatsRow label="Count" value={$paintStrokeStats.strokeCount} />
    <StatsRow label="Events" value={$paintStrokeStats.ptreventCount} />
    <StatsRow label="Duration" value={$paintStrokeStats.duration} suffix="ms" />
    <StatsRow label="Events/sec" value={$paintStrokeStats.rate} suffix=" events/sec" />
</div>
