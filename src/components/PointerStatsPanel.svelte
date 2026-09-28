<script lang="ts">
    import { pointerLiveStats } from '../lib/stores';
    import StatsRow from './StatsRow.svelte';
</script>
<section class="controlscolumn" aria-label="Pointer">
    <h2>POINTER</h2>
    <StatsRow label="X" value={$pointerLiveStats?.x} />
    <StatsRow label="Y" value={$pointerLiveStats?.y} />
    <StatsRow label="Velocity" value={$pointerLiveStats?.velocity} suffix=" px/s" />
    <StatsRow label="Direction" value={$pointerLiveStats?.direction} suffix="°" />
</section>