<script lang="ts">
    import { paintSettings, uiState } from '../lib/stores';

    let collapsed = false;

    function toggleCollapsed() {
        collapsed = !collapsed;
    }
</script>

<section class="advanced-panel-section">
    <div class="advanced-panel-section-header">
        <h4 class="advanced-panel-section-title">Config</h4>
        <button
            type="button"
            class="advanced-panel-section-toggle"
            onclick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand Config section' : 'Collapse Config section'}
        >
            {collapsed ? '▶' : '▼'}
        </button>
    </div>

    {#if !collapsed}
        <div class="advanced-panel-section-body">
            <label>
                <input type="checkbox" bind:checked={$paintSettings.eraseOnStrokeStart} />
                Erase on stroke start
            </label>
            <br />
            <label>
                <input type="checkbox" bind:checked={$uiState.showStrokeStats} />
                Show stroke stats
            </label>
        </div>
    {/if}
</section>
