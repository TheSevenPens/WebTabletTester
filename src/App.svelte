<script lang="ts">
    import InfoPanel from './components/InfoPanel.svelte';
    import DocPanel from './components/DocPanel.svelte';
    import BrushSettingsPanel from './components/BrushSettingsPanel.svelte';
    import ButtonsPanel from './components/ButtonsPanel.svelte';
    import PointerStatsPanel from './components/PointerStatsPanel.svelte';
    import SensorsPanel from './components/SensorsPanel.svelte';
    import ProcessingSettingsPanel from './components/ProcessingSettingsPanel.svelte';
    import OptionsPanel from './components/OptionsPanel.svelte';
    import StrokeStatsPanel from './components/StrokeStatsPanel.svelte';
    import CanvasArea from './components/CanvasArea.svelte';
    import ViewPanel from './components/ViewPanel.svelte';
    import { uiState } from './lib/stores';

    let canvasArea: {
        clearForeground: () => void;
        saveCanvas: () => Promise<void>;
        copyForegroundToClipboard: () => Promise<void>;
        copyWithBackgroundToClipboard: () => Promise<void>;
    } | undefined;
</script>
<main class="parent">
    <div class="top-row">
        <div class="controlscontainer">
            <InfoPanel />
            <DocPanel
                onClear={() => canvasArea?.clearForeground()}
                onCopy={() => { void canvasArea?.copyForegroundToClipboard(); }}
                onCopyWithBackground={() => { void canvasArea?.copyWithBackgroundToClipboard(); }}
                onSave={() => { void canvasArea?.saveCanvas(); }} />
            <BrushSettingsPanel />
            <ViewPanel />
            <ButtonsPanel />
            <PointerStatsPanel />
            <SensorsPanel />
            {#if $uiState.showStrokeStats}<StrokeStatsPanel />{/if}
        </div>
    </div>
    <div class="bottom-row">
        <ProcessingSettingsPanel />
        <div class="canvas-column"><CanvasArea bind:this={canvasArea} /></div>
        <OptionsPanel />
    </div>
</main>