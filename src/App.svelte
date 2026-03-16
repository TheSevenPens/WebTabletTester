<script lang="ts">
    import { keydown } from './lib/actions/keydown';
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
    import './app.css';

    let mainCanvas: HTMLCanvasElement | undefined;
    let canvasAreaRef:
        | {
              saveCanvas: () => void;
              clearForeground: () => void;
                            copyForegroundToClipboard: () => Promise<void>;
                            copyWithBackgroundToClipboard: () => Promise<void>;
          }
        | null = null;

    function clearMainCanvas() {
        canvasAreaRef?.clearForeground();
    }

    function copyForegroundToClipboard() {
        void canvasAreaRef?.copyForegroundToClipboard();
    }

    function copyWithBackgroundToClipboard() {
        void canvasAreaRef?.copyWithBackgroundToClipboard();
    }

    const clearKeys = { Delete: clearMainCanvas, Backspace: clearMainCanvas };
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="parent" oncontextmenu={(e) => e.preventDefault()} use:keydown={clearKeys}>
    <!-- Top row: Info, Format, Canvas, Pointer, Sensors, (Stroke stats) -->
    <div class="top-row">
        <div class="controlscontainer">
            <InfoPanel />
            <DocPanel
                onClear={clearMainCanvas}
                onCopy={copyForegroundToClipboard}
                onCopyWithBackground={copyWithBackgroundToClipboard}
                onSave={() => canvasAreaRef?.saveCanvas()}
            />
            <BrushSettingsPanel />
            <ViewPanel />
            <ButtonsPanel />
            <PointerStatsPanel />

            <SensorsPanel />

            {#if $uiState.showStrokeStats}
                <StrokeStatsPanel />
            {/if}
        </div>
    </div>

    <!-- Bottom row: Processing panel + Canvas -->
    <div class="bottom-row">
        <ProcessingSettingsPanel />

        <div class="controlscolumn" id="canvasColumn">
            <CanvasArea bind:this={canvasAreaRef} bind:canvas={mainCanvas} />
        </div>

        <OptionsPanel />
    </div>
</div>
