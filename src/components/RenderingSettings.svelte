<script lang="ts">
    import { appSettings } from '../lib/stores';
    import { RENDER_SAMPLING_OPTIONS } from '../lib/constants';

    let collapsed = false;

    function toggleCollapsed() {
        collapsed = !collapsed;
    }

    function onRenderSamplingChange(e: Event) {
        const target = e.currentTarget as HTMLSelectElement;
        appSettings.update((settings) => ({
            ...settings,
            renderSampling: target.value,
        }));
    }
</script>

<section class="advanced-panel-section">
    <div class="advanced-panel-section-header">
        <h4 class="advanced-panel-section-title">Rendering</h4>
        <button
            type="button"
            class="advanced-panel-section-toggle"
            onclick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand Rendering section' : 'Collapse Rendering section'}
        >
            {collapsed ? '▶' : '▼'}
        </button>
    </div>

    {#if !collapsed}
        <div class="advanced-panel-section-body">
            <label for="renderSamplingSelect">Sampling </label>
            <select
                id="renderSamplingSelect"
                value={$appSettings.renderSampling}
                onchange={onRenderSamplingChange}
            >
                {#each RENDER_SAMPLING_OPTIONS as { value, label }}
                    <option {value}>{label}</option>
                {/each}
            </select>
        </div>
    {/if}
</section>
