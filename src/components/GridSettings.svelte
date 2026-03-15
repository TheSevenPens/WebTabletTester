<script lang="ts">
    import { appSettings } from '../lib/stores';

    let collapsed = false;

    function toggleCollapsed() {
        collapsed = !collapsed;
    }

    function onShowGridChange(e: Event) {
        const target = e.currentTarget as HTMLInputElement;
        appSettings.update((settings) => ({
            ...settings,
            showGrid: target.checked,
        }));
    }

    function onGridSizeInput(e: Event) {
        const target = e.currentTarget as HTMLInputElement;
        const parsed = Number.parseInt(target.value, 10);
        if (Number.isNaN(parsed)) {
            return;
        }

        const clamped = Math.max(5, parsed);
        appSettings.update((settings) => ({
            ...settings,
            gridSize: clamped,
        }));
    }

    function onGridColorInput(e: Event) {
        const target = e.currentTarget as HTMLInputElement;
        appSettings.update((settings) => ({
            ...settings,
            gridColor: target.value,
        }));
    }
</script>

<section class="advanced-panel-section">
    <div class="advanced-panel-section-header">
        <h4 class="advanced-panel-section-title">Grid</h4>
        <button
            type="button"
            class="advanced-panel-section-toggle"
            onclick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand Grid section' : 'Collapse Grid section'}
        >
            {collapsed ? '▶' : '▼'}
        </button>
    </div>

    {#if !collapsed}
        <div class="advanced-panel-section-body">
            <label>
                <input
                    type="checkbox"
                    checked={$appSettings.showGrid}
                    onchange={onShowGridChange}
                />
                Show grid
            </label>
            <br />
            <label for="gridSizeInput">Grid size (px) </label>
            <input
                id="gridSizeInput"
                type="number"
                min="5"
                step="1"
                style="width: 65px;"
                value={$appSettings.gridSize}
                oninput={onGridSizeInput}
                title="Grid cell size in pixels"
            />
            <br />
            <label for="gridColorInput">Grid color </label>
            <input
                id="gridColorInput"
                type="color"
                value={$appSettings.gridColor}
                oninput={onGridColorInput}
                title="Background grid line color"
            />
        </div>
    {/if}
</section>
