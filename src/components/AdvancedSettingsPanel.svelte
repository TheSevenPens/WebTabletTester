<script lang="ts">
    import { writable } from 'svelte/store';
    import { uiState, processingSettings, paintSettings } from '../lib/stores';
    import { paintSettings as legacyPaintSettings } from '../lib/paint_data';
    import { processingSettings as legacyProcessingSettings } from '../lib/paint_data';
    import {
        syncPaintSettingsToLegacy,
        syncProcessingSettingsToLegacy,
    } from '../lib/syncStoresToLegacy';
    import { resetAllProcessingToDefault } from '../lib/processing_helpers';
    
    import SmoothingSettings from './SmoothingSettings.svelte';
    import QuantizationSettings from './QuantizationSettings.svelte';
    import CurveSettings from './CurveSettings.svelte';
    import ConfigSettings from './ConfigSettings.svelte';

    const minimized = writable(true);
    function toggleMinimized() {
        minimized.update((v) => !v);
    }

    function resetAdvancedSettings() {
        $paintSettings.eraseOnStrokeStart = false;
        $uiState.showStrokeStats = false;
        resetAllProcessingToDefault($processingSettings);
        $processingSettings = $processingSettings;
        $paintSettings = $paintSettings;
        $uiState = $uiState;
    }

    $effect(() => syncPaintSettingsToLegacy($paintSettings, legacyPaintSettings));
    $effect(() => syncProcessingSettingsToLegacy($processingSettings, legacyProcessingSettings));
</script>

<div class="advanced-panel" class:minimized={$minimized}>
    <div class="advanced-panel-header">
        <span class="advanced-panel-title">ADVANCED</span>
        <button
            type="button"
            class="advanced-panel-toggle"
            onclick={toggleMinimized}
            title={$minimized ? 'Restore Advanced panel' : 'Minimize Advanced panel'}
            aria-label={$minimized ? 'Restore Advanced panel' : 'Minimize Advanced panel'}
        >
            {$minimized ? '▶' : '◀'}
        </button>
    </div>

    {#if !$minimized}
        <div class="advanced-panel-content">
            <SmoothingSettings />
            <QuantizationSettings />
            <CurveSettings />
            <ConfigSettings />

            <div style="text-align: center; margin-top: 10px; margin-bottom: 10px;">
                <button type="button" onclick={resetAdvancedSettings}>RESET</button>
            </div>
        </div>
    {:else}
        <button
            type="button"
            class="advanced-panel-minimized-label"
            onclick={toggleMinimized}
            title="Restore Advanced panel"
        >
            <span>Advanced</span>
        </button>
    {/if}
</div>
