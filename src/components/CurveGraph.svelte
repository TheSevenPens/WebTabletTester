<script lang="ts">
    import { drawPressureCurve, getCanvas2DContext } from '../lib/utils/draw';

    /** @type {{ amount: number; apply: (v: number) => number } | undefined */
    let { curveAmount, id = 'curveCanvas', width = 40, height = 40 } = $props();

    /** @type {HTMLCanvasElement} */
    let canvas;

    $effect(() => {
        if (canvas && curveAmount) {
            const ctx = getCanvas2DContext(canvas);
            if (ctx) drawPressureCurve(ctx, canvas, curveAmount);
        }
    });
</script>

<canvas bind:this={canvas} {id} {width} {height}></canvas>
