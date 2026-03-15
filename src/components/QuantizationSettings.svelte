<script lang="ts">
    import { processingSettings } from '../lib/stores';
    import { PRESSURE_QUANT_OPTIONS } from '../lib/constants';

    let collapsed = false;

    function toggleCollapsed() {
        collapsed = !collapsed;
    }
</script>

<section class="advanced-panel-section">
    <div class="advanced-panel-section-header">
        <h4 class="advanced-panel-section-title">Quantization</h4>
        <button
            type="button"
            class="advanced-panel-section-toggle"
            onclick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand Quantization section' : 'Collapse Quantization section'}
        >
            {collapsed ? '▶' : '▼'}
        </button>
    </div>

    {#if !collapsed}
        <div class="advanced-panel-section-body">
            <label for="pressureQuantSelect">Pressure quantization: </label>
            <select id="pressureQuantSelect" bind:value={$processingSettings.pressureQuant}>
                {#each PRESSURE_QUANT_OPTIONS as { value, label }}
                    <option {value}>{label}</option>
                {/each}
            </select>
            <br />
        </div>
    {/if}
</section>
