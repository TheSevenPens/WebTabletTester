<script>
    import { paintSettings } from "../lib/stores.js";
    import { paintSettings as legacyPaintSettings } from "../lib/paint_data.js";
    import { syncPaintSettingsToLegacy } from "../lib/syncStoresToLegacy.js";
    import {
        BRUSH_SIZES,
        SIZE_CONTROL_OPTIONS,
        COLOR_CONTROL_OPTIONS,
        MIN_STROKE_SIZES,
    } from "../lib/constants.js";

    $effect(() => syncPaintSettingsToLegacy($paintSettings, legacyPaintSettings));
</script>

<div class="controlscolumn" id="strokeFormatColumn">
    <span style="font-weight: bold">STROKE FORMAT</span>
    <br />
    <label for="brushSizeSelect">Size </label>
    <select id="brushSizeSelect" bind:value={$paintSettings.brushSize}>
        {#each BRUSH_SIZES as { value, label }}
            <option value={value}>{label}</option>
        {/each}
    </select>
    <br />
    <label for="brushSizeControlSelect">Scale size by </label>
    <select
        id="brushSizeControlSelect"
        bind:value={$paintSettings.brushSizeControl}
    >
        {#each SIZE_CONTROL_OPTIONS as { value, label }}
            <option value={value}>{label}</option>
        {/each}
    </select>
    <br />
    <label for="brushColorControlSelect">Color </label>
    <select
        id="brushColorControlSelect"
        bind:value={$paintSettings.brushColorControl}
    >
        {#each COLOR_CONTROL_OPTIONS as { value, label }}
            <option value={value}>{label}</option>
        {/each}
    </select>
    <br />
    <label for="minStrokeSizeSelect">Min size </label>
    <select id="minStrokeSizeSelect" bind:value={$paintSettings.minStrokeSize}>
        {#each MIN_STROKE_SIZES as { value, label }}
            <option value={value}>{label}</option>
        {/each}
    </select>
</div>
