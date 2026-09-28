# Architecture

WebTabletTester separates serializable settings, transient input state, rendering, and Svelte presentation. There is no legacy state mirror or UI-owned synchronization layer.

## Ownership and data flow

```text
PointerEvent → pointer_input (raw document-space samples)
             → canvas_controller (capture, active pointer, draw/pan lifecycle)
             → StrokeEngine → SampleProcessor → evaluateBrush → CanvasRenderer
             → one scheduled frame: compose dirty layers + publish UI snapshots
```

| Module                 | Responsibility                                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| `types.ts`             | Settings, sample, brush, renderer, and viewport contracts                                       |
| `initial_state.ts`     | Factories for fresh plain settings/default snapshots                                            |
| `stores.ts`            | Authoritative user settings/viewport and UI projections of engine measurements                  |
| `pointer_input.ts`     | Browser event adaptation, coalesced-sample fallback, finite-value normalization                 |
| `stroke_engine.ts`     | One document's active drawing pointer, filter history, stroke counts, render commands           |
| `processing.ts`        | Ordered sample processing and timestamp-based velocity                                          |
| `paint.ts`             | Pure brush size/color/eraser evaluation from explicit settings and a processed sample           |
| `viewport.ts`          | Pure zoom-at-point, fit, reset, and screen/document transforms                                  |
| `canvas_controller.ts` | DOM event listeners, capture/release, idle/drawing/panning transitions, resize and blur cleanup |
| `canvas_renderer.ts`   | Cached 2D contexts, foreground/background layers, brush drawing, dirty composition              |
| `frame_scheduler.ts`   | At most one pending presentation frame; flush and disposal                                      |
| `canvas_export.ts`     | PNG Blob creation, clipboard capability/error handling, download URL lifetime                   |
| `shortcuts.ts`         | Focus/modifier/composition/repeat policy for canvas shortcuts                                   |

The engine imports no Svelte, DOM event APIs, or clocks. It takes settings and samples explicitly and draws through an injected renderer interface, so it can be tested without a browser. `CanvasArea` is the Svelte adapter: it subscribes to settings, creates/disposes one controller, and publishes numerical snapshots. Engine measurements flow one way into presentation stores; the engine never reads those snapshots back.

Processing settings contain numbers only. Each engine owns its smoother instances. A new stroke resets the active processor **before** its first sample; constructing a second engine creates independent history. Resetting processing does not alter brush or UI options.

## Pointer lifecycle

The controller has idle, drawing, and panning states with one active pointer ID. A drawing/panning start captures that pointer. Foreign pointer moves/up/cancel events cannot alter the active interaction.

Drawing starts with a dab. Moves draw segments in order. Pointer-up processes the final endpoint and uses the last contact brush when release pressure is zero, then reports released live status. Up is idempotent; a stray up never creates a stroke. Cancel, lost capture, blur, and teardown stop interactions and reset transient state. Cancelled strokes keep already-rendered marks and have a separate count.

Middle-button **bits** or Space + down start a pan. Space pressed during a drawing stroke does not switch its mode. Capture allows release outside the element. Modifier/composition/repeated keydown events are ignored by canvas shortcuts. Delete, Backspace, and Space handling applies only to the focused canvas, preserving form editing and button keyboard activation.

## Numerical contracts

- Coordinates are document pixels. The input adapter uses the canvas's explicit document dimensions and bounding rectangle, reversing pan/CSS scale and DPR. Events do not need a canvas `target`.
- Timestamps are the browser event's monotonic milliseconds, not the time at which a handler happens to run.
- Pressure is finite and clamped to [0,1]. Quantization (off or integer levels ≥2) maps to evenly spaced values including both endpoints.
- Pressure order is quantization → power curve → EMA smoothing.
- Curve amount is clamped to [-0.9,0.9]. Negative amount `a` uses exponent `1+a`; nonnegative amount uses `1/(1-a)`. Both pressure endpoints are preserved. Positive amounts sharpen; negative amounts soften.
- EMA output is `(1-amount)*input + amount*previous`. Amount is clamped to [0,0.999]. The first input after reset passes through.
- Azimuth smoothing follows the shortest angular arc, avoiding a jump across 359°/0°. Angles are degrees within the core; browser radians are converted at the input boundary.
- Velocity is processed-position distance divided by event-time seconds, followed by its configured EMA. Equal timestamps yield zero velocity instead of division by zero.
- `lerp(a,b,t)` returns `a` at 0 and `b` at 1. Pressure-to-hue runs 150° → 360°, preserving the previous application's direction.
- Brush size is limited to [0.1,300] document pixels and the configured minimum. Signed X/Y tilt scaling retains the historical 60° calibration: negative tilt falls to the minimum size. This is a deliberate compatibility contract, not an absolute-tilt mapping.
- Contact means the tip or eraser button bit for any pointer type, or a pen reporting pressure above 0. Wacom pens in Chromium report a held barrel switch as `buttons = 2` with no tip bit, so pressure is the authoritative contact signal for pens. Mice are excluded because they report pressure 0.5 for any button. Hardware eraser detection uses the eraser bit; foreground erasing uses `destination-out`.

## Measurements and presentation

Raw samples remain attached to processed samples. Stores retain numbers; `StatsRow` formats them for display. Stroke statistics are collected regardless of panel visibility.

Sample count includes the accepted down event, every accepted movement sample, and up. Duration is the nonnegative interval from down to the latest accepted sample. Rate uses `(count - 1) * 1000 / duration`, or zero for zero duration. Cancel/lost-capture events are lifecycle signals, not measurement samples. Completed and cancelled stroke counts are separate.

For a movement event, process its coalesced list if nonempty; otherwise process the parent event. Never count both. Every input sample is processed immediately. Composition and UI publication are batched to one animation frame. Hover can update measurements without recompositing unchanged image layers. Export flushes pending work before creating a PNG.

## Canvas and viewport

The fixed document is 1920×1080. Background contains the fill/grid; foreground contains strokes; the visible canvas composites the two. Background redraw only happens when background settings change. Canvas contexts are cached; composition only runs when a layer is dirty.

At zoom 1, CSS scale is `1 / devicePixelRatio`; document pixels map to device pixels. Wheel zoom and toolbar zoom share the same anchor calculation. Fit and Reset retain 16px padding. Nearest/smooth display sampling is a CSS property of the visible canvas. Changes to document size are a future feature; the renderer is initialized with its document dimensions.

## UI components

`App` composes the toolbar, canvas, and sidebars. `CanvasArea` manages lifecycle and export status. Brush, View, Document, Buttons, Pointer, Sensors, and StrokeStats panels retain feature-specific logic. `SidebarPanel` and `CollapsibleSection` own repeated collapse markup/ARIA relationships. `SliderWithNumber` provides labeled range/number inputs and a native keyboard-operable actions disclosure. `CurveGraph` reacts to a primitive curve amount, avoiding mutable-object reactivity ambiguity.

Toolbar overflow is scrollable; sidebars and canvas remain reachable on narrow screens. Component styling uses shared layout classes and a small set of tokens rather than global ID selectors.

## Extending the app

Add new settings to plain typed configuration and its default factory. Add numerical behavior to the processor or pure brush evaluation functions, with unit tests for its units/endpoints/reset behavior. Keep DOM access in adapters/renderers. New input lifecycle branches require both engine regression coverage and a browser capture/termination test. Run `npm run verify` before submitting changes.

Independent brushes and saved presets can build on serializable settings without serializing filter history. Recording/playback can reuse raw samples and the injected renderer boundary.
