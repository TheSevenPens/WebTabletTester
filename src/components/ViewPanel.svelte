<script lang="ts">
    import { canvasViewport } from '../lib/stores';
    import { fitViewport, resetViewport, zoomAtCenter } from '../lib/viewport';

    function zoom(value: number) {
        canvasViewport.update((view) => zoomAtCenter(view, value));
    }
    function fromInput(event: Event & { currentTarget: HTMLInputElement }) {
        const value = event.currentTarget.valueAsNumber;
        if (Number.isFinite(value)) zoom(value / 100);
    }
</script>

<section class="controlscolumn" aria-label="View">
    <h2>VIEW</h2>
    <label class="control-row" for="zoom-percent">
        Zoom
        <span
            ><input
                id="zoom-percent"
                type="number"
                value={Math.round($canvasViewport.zoom * 100)}
                min="10"
                max="1000"
                onchange={fromInput}
            />%</span
        >
    </label>
    <div class="button-row">
        <button onclick={() => zoom($canvasViewport.zoom * 0.8)} aria-label="Zoom out">−</button>
        <button onclick={() => canvasViewport.update(fitViewport)}>FIT</button>
        <button onclick={() => canvasViewport.update(resetViewport)}>RESET</button>
        <button onclick={() => zoom($canvasViewport.zoom * 1.25)} aria-label="Zoom in">+</button>
    </div>
</section>
