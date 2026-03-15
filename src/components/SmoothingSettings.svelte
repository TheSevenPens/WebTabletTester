<script lang="ts">
    import { processingSettings } from '../lib/stores';
    import { setProcessingAndNotify } from '../lib/processing_helpers';
    import SliderWithNumber from './SliderWithNumber.svelte';

    let collapsed = false;

    function toggleCollapsed() {
        collapsed = !collapsed;
    }
</script>

<section class="advanced-panel-section">
    <div class="advanced-panel-section-header">
        <h4 class="advanced-panel-section-title">Smoothing</h4>
        <button
            type="button"
            class="advanced-panel-section-toggle"
            onclick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand Smoothing section' : 'Collapse Smoothing section'}
        >
            {collapsed ? '▶' : '▼'}
        </button>
    </div>

    {#if !collapsed}
        <div class="advanced-panel-section-body">
            <SliderWithNumber
                id="positionSmoothingSlider"
                label="Position:"
                max="0.999"
                step="0.001"
                value={$processingSettings.posXSmoother.amount}
                onInput={(v) => {
                    $processingSettings = setProcessingAndNotify($processingSettings, (p) => {
                        p.posXSmoother.setSmoothingAmount(v);
                        p.posYSmoother.setSmoothingAmount(v);
                    });
                }}
            />
            <br />

            <SliderWithNumber
                id="tiltSmoothingSlider"
                label="Tilt:"
                max="0.999"
                step="0.001"
                value={$processingSettings.tiltXSmoother.amount}
                onInput={(v) => {
                    $processingSettings = setProcessingAndNotify($processingSettings, (p) => {
                        p.tiltXSmoother.setSmoothingAmount(v);
                        p.tiltYSmoother.setSmoothingAmount(v);
                    });
                }}
            />
            <br />

            <SliderWithNumber
                id="pressureSmoothingSlider"
                label="Pressure:"
                max="0.999"
                step="0.001"
                value={$processingSettings.pressureSmoother.amount}
                onInput={(v) => {
                    $processingSettings = setProcessingAndNotify($processingSettings, (p) => {
                        p.pressureSmoother.setSmoothingAmount(v);
                    });
                }}
            />
            <br />
        </div>
    {/if}
</section>
