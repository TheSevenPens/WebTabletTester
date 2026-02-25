<script>
    import { paintSettings } from "../lib/stores.js";

    // We import the legacy settings object just to sync it for now until phase 3 (logic rewrite)
    import { paintSettings as legacyPaintSettings } from "../lib/paint_data.js";

    // Keep legacy logic synced when our Svelte store updates
    $: {
        legacyPaintSettings.brushSize = $paintSettings.brushSize;
        legacyPaintSettings.brushSizeControl = $paintSettings.brushSizeControl;
        legacyPaintSettings.brushColorControl =
            $paintSettings.brushColorControl;
        legacyPaintSettings.minStrokeSize = $paintSettings.minStrokeSize;
    }
</script>

<div class="controlscolumn" id="strokeFormatColumn">
    <span style="font-weight: bold">STROKE FORMAT</span>
    <br />
    <label for="brushSizeSelect">Size </label>
    <select id="brushSizeSelect" bind:value={$paintSettings.brushSize}>
        <option value={1}>1px</option>
        <option value={5}>5px</option>
        <option value={10}>10px</option>
        <option value={50}>50px</option>
        <option value={100}>100px</option>
        <option value={300}>300px</option>
    </select>
    <br />
    <label for="brushSizeControlSelect">Scale size by </label>
    <select
        id="brushSizeControlSelect"
        bind:value={$paintSettings.brushSizeControl}
    >
        <option value="USER">Don't scale</option>
        <option value="PRESSURE">Pressure</option>
        <option value="TILTX">Tilt X</option>
        <option value="TILTY">Tilt Y</option>
        <option value="TILTAZ">Tilt Azimuth</option>
        <option value="TILTALT">Tilt Altitude</option>
    </select>
    <br />
    <label for="brushColorControlSelect">Color </label>
    <select
        id="brushColorControlSelect"
        bind:value={$paintSettings.brushColorControl}
    >
        <option value="DEFAULT">Black</option>
        <option value="RED">Red</option>
        <option value="PRESSURE">Pressure</option>
        <option value="TILTX">Tilt X</option>
        <option value="TILTY">Tilt Y</option>
        <option value="TILTAZ">Tilt Azimuth</option>
        <option value="TILTALT">Tilt Altitude</option>
        <option value="BARRELROTATION">Barrel rotation</option>
        <option value="ERASER">Eraser</option>
    </select>
    <br />
    <label for="minStrokeSizeSelect">Min size </label>
    <select id="minStrokeSizeSelect" bind:value={$paintSettings.minStrokeSize}>
        <option value={0.25}>0.25px</option>
        <option value={0.5}>0.5px</option>
        <option value={1}>1px</option>
        <option value={2}>2px</option>
        <option value={3}>3px</option>
        <option value={4}>4px</option>
        <option value={5}>5px</option>
        <option value={6}>6px</option>
        <option value={7}>7px</option>
        <option value={8}>8px</option>
        <option value={9}>9px</option>
        <option value={10}>10px</option>
    </select>
</div>
