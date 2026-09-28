# SevenPens Web Tablet Tester

A browser-based tool for inspecting pen, mouse, and touch input. Draw on a 1920×1080 document, inspect pressure/tilt/rotation and stroke statistics, and compare smoothing, quantization, and pressure curves.

[Open the app](https://thesevenpens.github.io/WebTabletTester/) · [Architecture](docs/ARCHITECTURE.md) · [Development ideas](docs/FUTURES.md) · [Foundation work](https://github.com/TheSevenPens/WebTabletTester/issues/17)

## Development

Use Node.js **24.x** (also declared in `.nvmrc` and `package.json`) and npm.

```sh
npm ci
npx playwright install chromium
npm run dev
```

Open the local URL printed by Vite, including the `/WebTabletTester/` base path. The app uses Svelte 5, TypeScript, Vite, and Canvas 2D. Product version metadata comes from `package.json`.

## Verification

```sh
npm run verify
```

This runs ESLint for TypeScript/Svelte, Svelte and TypeScript checks, Prettier, Vitest unit tests, Chromium integration tests, and the production build. On Linux, use `npx playwright install --with-deps chromium` when installing the test browser.

Individual commands:

| Command                | Purpose                                                                           |
| ---------------------- | --------------------------------------------------------------------------------- |
| `npm run lint`         | Lint source, tests, and tool configuration                                        |
| `npm run check`        | Check Svelte components and TypeScript                                            |
| `npm run format:check` | Check formatting without changing files                                           |
| `npm run format`       | Apply formatting                                                                  |
| `npm test`             | Numerical, engine, viewport, input, and scheduler regression tests                |
| `npm run test:browser` | Drawing, capture/cancellation, keyboard, settings, export, and layout smoke tests |
| `npm run build`        | Build `dist/`                                                                     |
| `npm run preview`      | Serve the production build locally                                                |

Pull requests run the complete verification suite. The GitHub Pages deployment workflow also verifies before uploading/deploying the build. Browser tests write traces for failures to `test-results/`. These generated files are ignored by Git.

## Controls

- Draw with the primary mouse button, pen tip, or touch; a tap creates a dab.
- Choose Marker or Eraser in Brush. Hardware erasers are recognized through the eraser button bit. Pen strokes draw whenever the pen reports pressure, including with a barrel switch held.
- Pan with the middle mouse button, or focus the canvas and hold Space while dragging.
- Zoom with the wheel over the drawing viewport, the percentage field, or the −/+/Fit/Reset controls.
- Clear with the Clear button, or press Delete or Backspace. The keys are ignored while a text, number, select, or other editable field has focus, so editing settings never clears the document; they work after clicking toolbar buttons or the canvas.
- Expand Processing or Options using their sidebar buttons. Section headings are keyboard-accessible collapse controls.
- Each slider has a labeled numeric input and an actions disclosure for Reset/Minimum/Maximum.
- Reset Processing resets only processing configuration.
- Copy exports transparent foreground strokes. Copy w/ BK and Save include the background/grid. Copy requires browser clipboard support/permission in a secure context; failures are shown in the Document panel.
- The toolbar and expanded sidebars scroll when space is limited.

## Input and measurement expectations

Samples use document pixels and the browser event timestamp. Pressure processing is **quantization → curve → smoothing**. Positive curve amounts sharpen pressure; negative amounts soften it. Settings are in-memory and reset when the page reloads.

Stroke statistics count accepted down/move/up **samples**, including coalesced movement samples where supported. Rate is `(samples - 1) × 1000 / durationMs`. It measures the received sample intervals; it is **not a claim about the tablet's hardware polling rate**. Completed and cancelled strokes are reported separately. Statistics are collected whether the panel is visible or hidden.

The browser/OS/driver controls which pressure, tilt, and rotation values are available. Missing orientation angles are derived from tilt; mouse/touch values may reflect browser defaults. Only one drawing or pan interaction is active at a time; other pointers cannot modify that stroke.

Automated tests use Chromium and synthetic input. Before a release, manually check a physical pen (pressure, tilt, barrel/eraser), touch, and mouse, including release outside the canvas, focus loss, DPR/browser zoom changes, and clipboard permissions in the target browsers. Automated coverage does not replace device compatibility testing.

See [architecture and numerical contracts](docs/ARCHITECTURE.md) and [profiling instructions/results](docs/PERFORMANCE.md) before changing the input pipeline.
