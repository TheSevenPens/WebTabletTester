<script lang="ts">
    import { paintSettings } from '../lib/stores';
    import {
        BRUSH_TYPE_OPTIONS,
        BRUSH_SIZES,
        SIZE_CONTROL_OPTIONS,
        COLOR_CONTROL_OPTIONS,
        MIN_STROKE_SIZES,
    } from '../lib/constants';
</script>

<section class="controlscolumn brush-panel" aria-label="Brush">
    <h2>BRUSH</h2>
    <label class="control-row" for="brushTypeSelect"
        >Type
        <select id="brushTypeSelect" bind:value={$paintSettings.brushType}>
            {#each BRUSH_TYPE_OPTIONS as option (option.value)}<option value={option.value}
                    >{option.label}</option
                >{/each}
        </select>
    </label>
    <label class="control-row" for="brushSizeSelect"
        >Size
        <select id="brushSizeSelect" bind:value={$paintSettings.brushSize}>
            {#each BRUSH_SIZES as option (option.value)}<option value={option.value}
                    >{option.label}</option
                >{/each}
        </select>
    </label>
    <label class="control-row" for="brushSizeControlSelect"
        >Scale size by
        <select id="brushSizeControlSelect" bind:value={$paintSettings.brushSizeControl}>
            {#each SIZE_CONTROL_OPTIONS as option (option.value)}<option value={option.value}
                    >{option.label}</option
                >{/each}
        </select>
    </label>
    <label class="control-row" for="brushColorControlSelect"
        >Color
        <select
            id="brushColorControlSelect"
            bind:value={$paintSettings.brushColorControl}
            disabled={$paintSettings.brushType === 'ERASER'}
        >
            {#each COLOR_CONTROL_OPTIONS as option (option.value)}<option value={option.value}
                    >{option.label}</option
                >{/each}
        </select>
    </label>
    <label class="control-row" for="minStrokeSizeSelect"
        >Min size
        <select id="minStrokeSizeSelect" bind:value={$paintSettings.minStrokeSize}>
            {#each MIN_STROKE_SIZES as option (option.value)}<option value={option.value}
                    >{option.label}</option
                >{/each}
        </select>
    </label>
</section>
