# Futures

Ideas, improvements, and directions for WebTabletTester.

## Architecture Improvements

### Remove Legacy State Duplication

`paint_data.ts` duplicates state that already lives in Svelte stores. Migrate `paint.ts` and `app_pointer.ts` to read from stores directly and remove the sync layer. This eliminates a class of bugs where the two systems drift out of sync.

### Add Tests

No test coverage exists today. Add Vitest for unit tests covering:
- `NumericSmoother` output correctness
- `NumericCurve` edge cases (0, 1, negative amounts)
- `PointerRecord` coordinate transforms
- `getDabSize` / `getDabColor` mapping logic

Add Playwright or similar for integration tests covering the drawing flow end to end.

### Stricter TypeScript

Tighten component prop types (currently loose `$props` usage in some components). Add explicit interfaces for store shapes. Enable stricter compiler options where practical.

### Extract Constants

Magic numbers like `1920x1080`, tilt limits (`maxTiltX: 60`), and brush size range `[0.1, 300]` are scattered across modules. Centralize into a config or constants file.

## Canvas and Rendering

### Dynamic Canvas Size

The canvas is fixed at 1920x1080. Allow the user to choose dimensions or have the canvas fill the available viewport. This matters for testing at different resolutions.

### Undo / Redo

Implement a history stack. Options range from storing full canvas snapshots (simple, memory-heavy) to recording stroke data as a list of point arrays (lighter, enables replay). Even a single-level undo would be a significant UX improvement.

### Additional Layer Support

Expand beyond the current two-layer (background/foreground) system. A layer manager would allow testing overlay scenarios and keeping reference marks separate from test strokes.

### WebGL Rendering Path

For large canvases or high-DPI displays, a WebGL rendering path could improve performance. The current 2D canvas approach works well at 1920x1080 but would benefit from GPU acceleration at higher resolutions.

### Interpolation Modes

Currently strokes use quadratic curve interpolation. Offer linear, cubic, and Catmull-Rom as alternatives. Different interpolation visually reveals different tablet sampling characteristics.

## Input and Device Features

### Device Info Display

On first pointer contact, display detected device capabilities: max pressure levels, tilt support, barrel rotation support, pointer type. This helps users understand what their hardware reports.

### Recording and Playback

Record a sequence of pointer events (timestamps, coordinates, pressure, tilt) and replay them. Useful for:
- Comparing the same stroke with different processing settings
- Sharing test data between users
- Automated regression testing of the rendering pipeline

### Metrics Export

Export stroke statistics and raw pointer data to CSV or JSON. Enables external analysis for device validation and comparison.

### Guided Test Patterns

Structured tests that prompt the user to perform specific actions:
- Draw a stroke at maximum pressure
- Draw a slow diagonal line (tests jitter)
- Tap lightly (tests activation pressure threshold)
- Draw a circle (tests tilt azimuth reporting)

Results could be scored or compared against expected ranges.

### Latency Measurement

Measure the time delta from hardware input to rendered pixel. Display an ongoing latency metric. Even an approximate measurement (pointer event timestamp vs requestAnimationFrame) would be useful for comparing configurations.

### Multi-Pointer Support

Handle simultaneous pen + touch inputs. Display separate stats for each pointer type. Useful for testing palm rejection and multi-touch tablet behavior.

### Pressure Stability Test

At constant contact pressure, measure and display variance over time. Generates a stability score. Useful for evaluating sensor noise in different tablet hardware.

## UI and UX

### Dark Mode

Add a theme toggle. The current light UI can be harsh when testing for long sessions. Use CSS custom properties for easy theming.

### Keyboard Shortcut Help

Add a help overlay (triggered by `?` or `Shift+?`) that lists all available shortcuts. Current shortcuts (Delete to clear, Spacebar to pan, scroll to zoom) are not discoverable.

### Touch Gesture Support

Add pinch-to-zoom and two-finger pan for use on tablet devices without a mouse. The current zoom/pan requires mouse wheel and middle button.

### Responsive Layout

The current layout assumes a wide viewport. Add breakpoints or a simplified layout for narrower screens and mobile devices.

### Brush Presets

Let users save and load named brush configurations (type, size, color control, min size). Quick switching between presets speeds up testing workflows.

### Color Palette

Add a quick-access color palette alongside the current color control modes. Useful when using the tool for freehand drawing rather than pure testing.

## Project Direction

### Comparison Mode

Open two canvases side by side with different processing settings but the same input. Lets users directly see the effect of smoothing, quantization, or curve changes.

### Device Profiles

Store named configurations (processing settings, brush settings) per device. Automatically apply a profile when a known device type is detected. Share profiles as importable JSON.

### Plugin Architecture

Allow users to provide custom processing functions (smoothing algorithms, curve shapes) via a plugin API. Load plugins from local files or URLs.

### Tablet Calibration Wizard

An interactive flow that guides the user through establishing their device's pressure range, tilt range, and optimal processing settings. Outputs a device profile.

### Performance Dashboard

Real-time display of FPS, pointer event rate, render time per frame, and input-to-display latency. Useful for diagnosing performance issues on different hardware and browser combinations.
