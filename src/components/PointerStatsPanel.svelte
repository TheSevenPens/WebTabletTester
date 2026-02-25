<script>
    import { pointerLiveStats } from "../lib/stores.js";
</script>

<div class="controlscolumn" id="pointerColumn">
    <span style="font-weight: bold">POINTER</span>
    <br />
    Buttons:
    <span>
        <span class="monospace"
            >{$pointerLiveStats.buttons} ({$pointerLiveStats.buttonString})</span
        >
    </span>
    <br />
    <span>X:</span>
    <span>
        <span class="monospace">{$pointerLiveStats.canvasPosXProcessed}</span>
    </span>
    <br />
    <span>Y:</span>
    <span>
        <span class="monospace">{$pointerLiveStats.canvasPosYProcessed}</span>
    </span>

    <br />
    Velocity:
    <span>
        <span class="monospace">{$pointerLiveStats.velocity}</span> px/s</span
    >
    <br />
    Direction:
    <span>
        <span class="monospace">{$pointerLiveStats.direction}</span>
    </span>
    <br />
</div>
