<script lang="ts">
    import { pointerLiveStats } from '../lib/stores';
    import StatsRow from './StatsRow.svelte';
</script>

<section class="controlscolumn" aria-label="Sensors">
    <h2>SENSORS</h2>
    <StatsRow label="Pressure" value={$pointerLiveStats?.pressure} digits={4} />
    <StatsRow label="Tilt X" value={$pointerLiveStats?.tiltX} suffix="°" />
    <StatsRow label="Tilt Y" value={$pointerLiveStats?.tiltY} suffix="°" />
    <StatsRow label="Azimuth" value={$pointerLiveStats?.azimuth} suffix="°" />
    <StatsRow label="Altitude" value={$pointerLiveStats?.altitude} suffix="°" />
    <StatsRow label="Rotation" value={$pointerLiveStats?.twist} suffix="°" />
</section>
