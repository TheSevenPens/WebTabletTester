# Architecture

WebTabletTester is a real-time pen tablet input testing application built with Svelte 5, TypeScript, and Vite. It captures pointer events from tablet hardware, applies configurable signal processing, and renders strokes on a layered HTML5 canvas while displaying live sensor statistics.

## Tech Stack

- **Framework**: Svelte 5 (reactive UI)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Rendering**: HTML5 Canvas (2D context)
- **Deployment**: GitHub Pages

## High-Level Layout

```
 Top Row: Control Panels (info, brush, view, stats)
+---------------------------------------------------------+
| Left Sidebar   |   Canvas Area      | Right Sidebar     |
| (Processing)   |   (drawing surface) | (Options)         |
+---------------------------------------------------------+
```

The app is organized into three horizontal zones: a top row of control panels, a center canvas flanked by collapsible sidebars for processing settings (left) and options (right).

## Component Map

### Root

| Component | Role |
|-----------|------|
| `App.svelte` | Top-level layout. Arranges panels and canvas area. |

### Top Row Panels

| Component | Role |
|-----------|------|
| `InfoPanel` | App title, version, links to docs and GitHub. |
| `DocPanel` | Canvas dimension display. Clear, copy-to-clipboard, and save-as-PNG actions. |
| `BrushSettingsPanel` | Brush type (marker/eraser), size, size-control source, color-control source, min size. |
| `ViewPanel` | Zoom level display and controls (-, fit, +). Pan/zoom state management. |
| `ButtonsPanel` | Displays status of 6 hardware tablet buttons as disabled checkboxes. |
| `PointerStatsPanel` | Live pointer X/Y coordinates, velocity, and direction. |
| `SensorsPanel` | Live pressure, tilt X/Y, azimuth, altitude, and barrel rotation values. |
| `StrokeStatsPanel` | Stroke count, pointer event count, duration, and event rate. Toggleable. |

### Canvas Area

| Component | Role |
|-----------|------|
| `CanvasArea` | Main drawing surface. Manages pointer event capture, pan/zoom, layer composition, and clipboard export. Contains three HTML5 canvases: background, foreground, and composite output. |

### Left Sidebar (Processing)

| Component | Role |
|-----------|------|
| `ProcessingSettingsPanel` | Collapsible container for processing sub-panels. |
| `SmoothingSettings` | Controls for position, tilt, and pressure smoothing (exponential moving average). |
| `QuantizationSettings` | Pressure quantization level selector for testing device resolution. |
| `CurveSettings` | Pressure curve amount control with live curve preview graph. |

### Right Sidebar (Options)

| Component | Role |
|-----------|------|
| `OptionsPanel` | Collapsible container for option sub-panels. |
| `BackgroundSettings` | Canvas background color picker. |
| `GridSettings` | Grid visibility, size, and color. |
| `RenderingSettings` | Canvas sampling mode (nearest neighbor vs smooth). |
| `ConfigSettings` | Toggles: erase-on-stroke-start, show stroke stats. |

### Shared UI Components

| Component | Role |
|-----------|------|
| `SliderWithNumber` | Dual input control (range slider + number field) with right-click context menu for reset/min/max. |
| `CurveGraph` | Canvas-based preview of the pressure curve function. |
| `StatsRow` | Generic label + value + suffix row used across stats panels. |

## Core Logic Modules

### `app_pointer.ts` - Event Orchestration

Entry point for all pointer input. Receives raw pointer events from `CanvasArea`, creates a `PointerRecord`, applies processing, triggers painting, and updates stats. Manages stroke start/stop lifecycle.

### `paint.ts` - Stroke Rendering

Computes brush size and color from sensor data and settings, then draws strokes via quadratic curve interpolation on the foreground canvas. Handles eraser mode through canvas composite operations (`destination-out`).

### `pointer_record.ts` - Pointer Data Model

Encapsulates a single pointer event. Extracts coordinates, pressure, tilt, and rotation from the browser's `PointerEvent`. Applies coordinate transforms (screen to canvas, accounting for CSS scale and DPR). Computes velocity and direction from inter-event deltas.

### `stores.ts` - State Management

Central reactive state via Svelte writable/derived stores:

| Store | Contents |
|-------|----------|
| `appSettings` | Canvas color, grid config, render sampling mode |
| `paintSettings` | Brush type, size, color control, eraser state |
| `processingSettings` | Smoother and curve instances |
| `paintCurrentDabSettings` | Computed brush size and color for current pointer event |
| `paintState` | Drawing state (isDrawing, position tracking) |
| `paintStrokeStats` | Stroke count, event count, duration |
| `paintStrokeStatsWithRate` | Derived: adds computed events/sec |
| `uiState` | UI toggles (showStrokeStats) |
| `pointerLiveStats` | Formatted pointer data for display panels |
| `canvasViewport` | Canvas dimensions, zoom, pan offsets |

### `paint_data.ts` - Legacy State

Plain object state used by `paint.ts` and `app_pointer.ts`. Synced from stores. Exists as a bridge from the earlier architecture.

## Utility Classes

### `NumericSmoother` (`utils/numeric_smoother.ts`)

Exponential moving average filter. Formula: `output = (1 - alpha) * input + alpha * previous` where `alpha = 1 - amount`. Applied independently to position, tilt, and pressure channels. State resets on each stroke start.

### `NumericCurve` (`utils/numeric_curve.ts`)

Power function curve for pressure response shaping. Positive amount softens (lower pressures register higher), negative amount sharpens (requires more pressure). Maps input [0,1] to output [0,1].

### `RGBColor` (`utils/color.ts`)

Color interpolation. Supports angle-based color stop mapping (used for tilt azimuth to color) and pressure-to-hue interpolation via HSL.

### `Position` / `Size` (`utils/geometry.ts`)

Simple 2D vector and dimension classes used throughout for point and size operations.

## Data Flow: Pointer Event to Pixel

```
Hardware tablet → Browser PointerEvent
    ↓
CanvasArea.svelte (event listener)
    ↓
pointerEventHandler()          [app_pointer.ts]
    ├── new PointerRecord()    [pointer_record.ts]
    │   └── apply smoothing, quantization, curve
    ├── updateUxPointerStats() → pointerLiveStats store → stat panels
    ├── paintDab()             [paint.ts]
    │   ├── getDabSize()       (pressure/tilt → brush size)
    │   ├── getDabColor()      (pressure/tilt/rotation → color)
    │   └── drawLine()         (quadratic curve on foreground canvas)
    └── composeLayers()        (background + foreground → display)
```

## Canvas Layer System

The canvas uses a two-layer architecture:

1. **Background layer** - Solid color fill plus optional grid. Never modified by drawing.
2. **Foreground layer** - All user strokes. Cleared independently of background.
3. **Composite output** - Background drawn first, foreground drawn on top. This is what the user sees and what gets exported.

The canvas is fixed at 1920x1080 pixels. Pan and zoom are achieved via CSS transforms on the canvas container, not by modifying canvas content.

## Key Interactions

- **Pan**: Middle mouse button or spacebar + drag
- **Zoom**: Mouse wheel (0.1x to 10x range)
- **Erase**: Eraser brush type or hardware eraser button (button code 32)
- **Clear**: Delete/Backspace key or Clear button
- **Export**: Save as PNG, or copy foreground/composite to clipboard
