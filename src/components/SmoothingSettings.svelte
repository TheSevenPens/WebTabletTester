<script lang="ts">
    import { processingSettings } from '../lib/stores';
    import { setProcessingAndNotify } from '../lib/processing_helpers';
    import SliderWithNumber from './SliderWithNumber.svelte';
</script>

<section class="advanced-panel-section">
    <h4 class="advanced-panel-section-title">Smoothing</h4>
    <SliderWithNumber
        id="positionSmoothingSlider"
        label="Position smoothing:"
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
        label="Tilt smoothing:"
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
        label="Pressure smoothing:"
        value={$processingSettings.pressureSmoother.amount}
        onInput={(v) => {
            $processingSettings = setProcessingAndNotify($processingSettings, (p) => {
                p.pressureSmoother.setSmoothingAmount(v);
            });
        }}
    />
    <br />
</section>
