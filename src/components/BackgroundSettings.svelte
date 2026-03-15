<script lang="ts">
    import { appSettings } from '../lib/stores';

    let collapsed = false;

    function toggleCollapsed() {
        collapsed = !collapsed;
    }

    function onBackgroundColorInput(e: Event) {
        const target = e.currentTarget as HTMLInputElement;
        const color = target.value;
        appSettings.update((settings) => ({
            ...settings,
            canvasColor: color,
        }));
    }
</script>

<section class="advanced-panel-section">
    <div class="advanced-panel-section-header">
        <h4 class="advanced-panel-section-title">Background</h4>
        <button
            type="button"
            class="advanced-panel-section-toggle"
            onclick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand Background section' : 'Collapse Background section'}
        >
            {collapsed ? '▶' : '▼'}
        </button>
    </div>

    {#if !collapsed}
        <div class="advanced-panel-section-body">
            <label for="backgroundColorInput">Background color </label>
            <input
                id="backgroundColorInput"
                type="color"
                value={$appSettings.canvasColor}
                oninput={onBackgroundColorInput}
                title="Background layer color"
            />
        </div>
    {/if}
</section>
