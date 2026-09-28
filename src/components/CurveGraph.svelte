<script lang="ts">
    import { drawPressureCurve } from '../lib/utils/draw';
    interface Props { amount: number; width?: number; height?: number; }
    let { amount, width = 80, height = 60 }: Props = $props();
    let canvas = $state<HTMLCanvasElement>();
    $effect(() => {
        if (canvas) drawPressureCurve(canvas, amount);
    });
</script>
<canvas bind:this={canvas} {width} {height} class="curve-graph"
    aria-label={`Pressure response curve, amount ${amount}`}></canvas>
