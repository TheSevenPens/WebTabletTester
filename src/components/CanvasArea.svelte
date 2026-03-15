<script>
    import { onMount, createEventDispatcher } from "svelte";
    import {
        appSettings,
        processingSettings,
        paintState,
        paintStrokeStats,
    } from "../lib/stores.js";
    import {
        pointerEventHandler,
        onPointerUp,
        onPointerEnter,
        onPointerLeave,
        defaultPtrEventHandlerDoNothing,
    } from "../lib/app_pointer.js";
    import { clearCanvas, getCanvas2DContext } from "../lib/utils/draw.js";

    /** @type {HTMLCanvasElement} */
    export let canvas;

    /** @type {HTMLAnchorElement} */
    let downloadLink;

    const dispatch = createEventDispatcher();

    function handlePointer(e) {
        pointerEventHandler(e, canvas, $appSettings, $processingSettings, $paintState, $paintStrokeStats);
    }

    onMount(() => {
        if (canvas.width < window.innerWidth) {
            canvas.width = window.innerWidth - 50;
        }
        const ctx = getCanvas2DContext(canvas);
        if (ctx) clearCanvas(ctx, canvas, $appSettings.canvasColor);
    });

    export function saveCanvas() {
        if (!canvas || !downloadLink) return;

        const now = new Date();
        const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
        const filename = `${$appSettings.downloadFilename}_${timestamp}.png`;

        const url = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");

        downloadLink.download = filename;
        downloadLink.href = url;
        downloadLink.click();
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="canvasDiv" oncontextmenu={(e) => e.preventDefault()}>
    <canvas
        bind:this={canvas}
        id="myCanvas"
        height="800"
        style="border: 10px solid #d1d1d1"
        onpointerdown={handlePointer}
        onpointerup={onPointerUp}
        onpointercancel={handlePointer}
        onpointermove={handlePointer}
        onpointerover={defaultPtrEventHandlerDoNothing}
        onpointerout={defaultPtrEventHandlerDoNothing}
        onpointerenter={onPointerEnter}
        onpointerleave={onPointerLeave}
        ongotpointercapture={defaultPtrEventHandlerDoNothing}
        onlostpointercapture={defaultPtrEventHandlerDoNothing}
    >
    </canvas>
</div>

<!-- Hidden download link for saving the canvas -->
<a bind:this={downloadLink} href={"#"} style="display:none;">download</a>
