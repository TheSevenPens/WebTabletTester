<script>
    import { pointerLiveStats } from "../lib/stores.js";
</script>

<div class="controlscolumn" id="sensorsColumn">
    <span style="font-weight: bold">SENSORS</span> <br />

    <span>Pressure:</span>
    <span>
        <span class="monospace">{$pointerLiveStats.pressureProcessed}</span>
    </span>
    <br />
    <span>Tilt x:</span>
    <span>
        <span class="monospace">{$pointerLiveStats.tiltXProcessed}</span>
    </span>
    <br />
    <span>Tilt y:</span>
    <span>
        <span class="monospace">{$pointerLiveStats.tiltYProcessed}</span>
    </span>
    <br />
    <span>Tilt azimuth:</span>
    <span>
        <span class="monospace">{$pointerLiveStats.tiltAzimuthProcessed}</span>
    </span>

    <br />
    <span>Tilt altitude:</span>
    <span>
        <span class="monospace">{$pointerLiveStats.tiltAltitudeProcessed}</span>
    </span>

    <br />
    Barrel rotation:
    <span>
        <span class="monospace">{$pointerLiveStats.barrelRotation}</span>
    </span>
</div>
