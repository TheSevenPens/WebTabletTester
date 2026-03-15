<script lang="ts">
    import { pointerLiveStats } from '../lib/stores';
    import StatsRow from './StatsRow.svelte';
</script>

<div class="controlscolumn" id="sensorsColumn">
    <span style="font-weight: bold">SENSORS</span> <br />
    <StatsRow label="Pressure" value={$pointerLiveStats.pressureProcessed} />
    <StatsRow label="TiltX" value={$pointerLiveStats.tiltXProcessed} />
    <StatsRow label="TiltY" value={$pointerLiveStats.tiltYProcessed} />
    <StatsRow label="TiltAzi" value={$pointerLiveStats.tiltAzimuthProcessed} />
    <StatsRow label="TiltAlt" value={$pointerLiveStats.tiltAltitudeProcessed} />
    <StatsRow label="Rotation" value={$pointerLiveStats.barrelRotation} />
</div>
