<script lang="ts">
    import { writable } from 'svelte/store';
    import BackgroundSettings from './BackgroundSettings.svelte';
    import GridSettings from './GridSettings.svelte';
    import RenderingSettings from './RenderingSettings.svelte';
    import ConfigSettings from './ConfigSettings.svelte';

    const minimized = writable(true);

    function toggleMinimized() {
        minimized.update((v) => !v);
    }
</script>

<div class="advanced-panel advanced-panel--right" class:minimized={$minimized}>
    <div class="advanced-panel-header">
        <span class="advanced-panel-title">OPTIONS</span>
        <button
            type="button"
            class="advanced-panel-toggle"
            onclick={toggleMinimized}
            title={$minimized ? 'Restore Options panel' : 'Minimize Options panel'}
            aria-label={$minimized ? 'Restore Options panel' : 'Minimize Options panel'}
        >
            {$minimized ? '◀' : '▶'}
        </button>
    </div>

    {#if !$minimized}
        <div class="advanced-panel-content">
            <BackgroundSettings />
            <GridSettings />
            <RenderingSettings />
            <ConfigSettings />
        </div>
    {:else}
        <button
            type="button"
            class="advanced-panel-minimized-label advanced-panel-minimized-label--right"
            onclick={toggleMinimized}
            title="Restore Options panel"
        >
            <span>Options</span>
        </button>
    {/if}
</div>
