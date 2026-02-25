<script>
    import { drawPressureCurve } from "../lib/utils/draw.js";

    export let curveAmount;
    export let id = "curveCanvas";
    export let width = 40;
    export let height = 40;

    /** @type {HTMLCanvasElement} */
    let canvas;

    // Use a reactive block to re-draw whenever the curveAmount or canvas elements change
    $: {
        if (canvas && curveAmount) {
            drawPressureCurve(canvas.getContext("2d"), canvas, curveAmount);
        }
    }
</script>

<canvas bind:this={canvas} {id} {width} {height}></canvas>
