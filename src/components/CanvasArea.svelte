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

    /** @type {HTMLCanvasElement} */
    export let canvas;

    /** @type {HTMLAnchorElement} */
    let downloadLink;

    const dispatch = createEventDispatcher();

    onMount(() => {
        if (canvas.width < window.innerWidth) {
            canvas.width = window.innerWidth - 50;
        }

        // Initialize with default color
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.fillStyle = $appSettings.canvasColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
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
<div class="canvasDiv" on:contextmenu|preventDefault>
    <canvas
        bind:this={canvas}
        id="myCanvas"
        height="800"
        style="border: 10px solid #d1d1d1"
        on:pointerdown={(e) =>
            pointerEventHandler(
                e,
                canvas,
                $appSettings,
                $processingSettings,
                $paintState,
                $paintStrokeStats,
            )}
        on:pointerup={onPointerUp}
        on:pointercancel={(e) =>
            pointerEventHandler(
                e,
                canvas,
                $appSettings,
                $processingSettings,
                $paintState,
                $paintStrokeStats,
            )}
        on:pointermove={(e) =>
            pointerEventHandler(
                e,
                canvas,
                $appSettings,
                $processingSettings,
                $paintState,
                $paintStrokeStats,
            )}
        on:pointerover={defaultPtrEventHandlerDoNothing}
        on:pointerout={defaultPtrEventHandlerDoNothing}
        on:pointerenter={onPointerEnter}
        on:pointerleave={onPointerLeave}
        on:gotpointercapture={defaultPtrEventHandlerDoNothing}
        on:lostpointercapture={defaultPtrEventHandlerDoNothing}
    >
    </canvas>
</div>

<!-- Hidden download link for saving the canvas -->
<a bind:this={downloadLink} href={"#"} style="display:none;">download</a>
