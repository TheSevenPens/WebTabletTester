<script lang="ts">
    import { writable } from 'svelte/store';
    import BackgroundSettings from './BackgroundSettings.svelte';
    import ConfigSettings from './ConfigSettings.svelte';

    const minimized = writable(true);

    function toggleMinimized() {
        minimized.update((v) => !v);
    }
</script>

<div class="advanced-panel advanced-panel--right" class:minimized={$minimized}>
    <div class="advanced-panel-header">
        <span class="advanced-panel-title">RIGHT</span>
        <button
            type="button"
            class="advanced-panel-toggle"
            onclick={toggleMinimized}
            title={$minimized ? 'Restore Right panel' : 'Minimize Right panel'}
            aria-label={$minimized ? 'Restore Right panel' : 'Minimize Right panel'}
        >
            {$minimized ? '◀' : '▶'}
        </button>
    </div>

    {#if !$minimized}
        <div class="advanced-panel-content">
            <BackgroundSettings />
            <ConfigSettings />
        </div>
    {:else}
        <button
            type="button"
            class="advanced-panel-minimized-label advanced-panel-minimized-label--right"
            onclick={toggleMinimized}
            title="Restore Right panel"
        >
            <span>Right</span>
        </button>
    {/if}
</div>
