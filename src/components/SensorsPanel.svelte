<script>
    import { pointerLiveStats } from "../lib/stores.js";
    import StatsRow from "./StatsRow.svelte";
</script>

<div class="controlscolumn" id="sensorsColumn">
    <span style="font-weight: bold">SENSORS</span> <br />
    <StatsRow label="Pressure" value={$pointerLiveStats.pressureProcessed} />
    <StatsRow label="Tilt x" value={$pointerLiveStats.tiltXProcessed} />
    <StatsRow label="Tilt y" value={$pointerLiveStats.tiltYProcessed} />
    <StatsRow label="Tilt azimuth" value={$pointerLiveStats.tiltAzimuthProcessed} />
    <StatsRow label="Tilt altitude" value={$pointerLiveStats.tiltAltitudeProcessed} />
    <StatsRow label="Barrel rotation" value={$pointerLiveStats.barrelRotation} />
</div>
