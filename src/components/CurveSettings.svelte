<script lang="ts">
    import { processingSettings } from '../lib/stores';
    import { setProcessingAndNotify } from '../lib/processing_helpers';
    import type { ProcessingSettings } from '../lib/types';
    import SliderWithNumber from './SliderWithNumber.svelte';
    import CurveGraph from './CurveGraph.svelte';

    let collapsed = false;

    function toggleCollapsed() {
        collapsed = !collapsed;
    }
</script>

<section class="advanced-panel-section">
    <div class="advanced-panel-section-header">
        <h4 class="advanced-panel-section-title">Curves</h4>
        <button
            type="button"
            class="advanced-panel-section-toggle"
            onclick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand Curves section' : 'Collapse Curves section'}
        >
            {collapsed ? '▶' : '▼'}
        </button>
    </div>

    {#if !collapsed}
        <div class="advanced-panel-section-body">
            <div>
                <SliderWithNumber
                    id="pressureCurveAmountSlider"
                    label="Pressure curve:"
                    min="-0.90"
                    max="0.90"
                    step="0.1"
                    digits={2}
                    list="pressureCurveTickmarks"
                    value={$processingSettings.pressureCurveAmount.amount}
                    onInput={(v: number) => {
                        $processingSettings = setProcessingAndNotify(
                            $processingSettings,
                            (p: ProcessingSettings) => {
                                p.pressureCurveAmount.setCurveAmount(v);
                            }
                        );
                    }}
                />
                <datalist id="pressureCurveTickmarks">
                    <option value="0.0"></option>
                </datalist>
            </div>
            <div style="margin-top: 8px;">
                <CurveGraph
                    id="curveCanvas"
                    width={40}
                    height={40}
                    curveAmount={$processingSettings.pressureCurveAmount}
                />
            </div>
        </div>
    {/if}
</section>
