<script lang="ts">
    import { writable } from 'svelte/store';
    import BackgroundSettings from './BackgroundSettings.svelte';
    import GridSettings from './GridSettings.svelte';
    import ConfigSettings from './ConfigSettings.svelte';

    const minimized = writable(true);

    function toggleMinimized() {
        minimized.update((v) => !v);
    }
</script>

<div class="advanced-panel advanced-panel--right" class:minimized={$minimized}>
    <div class="advanced-panel-header">
        <span class="advanced-panel-title">TOOLS</span>
        <button
            type="button"
            class="advanced-panel-toggle"
            onclick={toggleMinimized}
            title={$minimized ? 'Restore Tools panel' : 'Minimize Tools panel'}
            aria-label={$minimized ? 'Restore Tools panel' : 'Minimize Tools panel'}
        >
            {$minimized ? '◀' : '▶'}
        </button>
    </div>

    {#if !$minimized}
        <div class="advanced-panel-content">
            <BackgroundSettings />
            <GridSettings />
            <ConfigSettings />
        </div>
    {:else}
        <button
            type="button"
            class="advanced-panel-minimized-label advanced-panel-minimized-label--right"
            onclick={toggleMinimized}
            title="Restore Tools panel"
        >
            <span>Tools</span>
        </button>
    {/if}
</div>
