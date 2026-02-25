<script>
    import { paintStrokeStats } from "../lib/stores.js";
</script>

<div class="controlscolumn" id="strokeStatsPanel">
    <span style="font-weight: bold">STROKE STATS</span>
    <br />
    Count:
    <span>
        <span class="monospace">{$paintStrokeStats.strokeCount}</span>
    </span>
    <br />
    Events:
    <span>
        <span class="monospace">{$paintStrokeStats.ptreventCount}</span>
    </span>
    <br />
    Duration:
    <span>
        <span class="monospace">{$paintStrokeStats.duration}</span>ms
    </span>
    <br />
    Events/sec:
    <span>
        <span class="monospace">{$paintStrokeStats.rate}</span> events/sec
    </span>
</div>
