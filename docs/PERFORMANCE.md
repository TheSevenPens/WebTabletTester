# Rendering profile

Measured on 2026-09-28 using Node 24.14.1, Playwright Chromium 153 headless on Windows, a 1440×900 viewport, DPR 1, and the default 1920×1080 document. Both inputs were production builds: the original commit `4369302` and the foundation revision.

| Trace                                                    | Original | Foundation revision |
| -------------------------------------------------------- | -------: | ------------------: |
| Full compositions for a synchronous 240-move burst       |      240 |                   1 |
| Median burst handler time (5 runs)                       |   4.1 ms |              1.3 ms |
| Full compositions for 240 moves over 60 animation frames |      240 |                  60 |
| Total handler time for the paced trace                   |  17.3 ms |             16.3 ms |

All movement samples still reach the engine and draw their foreground segments. The scheduler reduces full background/foreground composition and UI publication, rather than discarding input samples. The unit regression also asserts that 240 moves produce 240 segment calls and 241 accepted samples including down.

The script counts the visible canvas's layer `drawImage` calls (two per composition). Down/up setup lies outside the measured move trace. The paced trace submits four synthetic movement samples per animation frame. This is a repeatable workload, not a physical tablet polling-rate measurement. Handler timings include synchronous event dispatch and are environment-sensitive; they do not include all deferred GPU work or measure pen-to-pixel latency. The small difference in paced handler time should not be interpreted as a robust latency improvement.

## Reproducing

Build each revision and serve it with `npm run preview` on separate ports. With both servers running:

```sh
node scripts/profile.mjs http://127.0.0.1:4175/WebTabletTester/ http://127.0.0.1:4174/WebTabletTester/
```

The script prints JSON for five burst runs and one paced run per URL, and writes screenshots to ignored `test-results/profile-*.png`. Keep browser, machine, document dimensions, viewport, and settings the same when comparing changes. Use a clean page/context for each build. No performance threshold is enforced in CI because hardware/timing varies; functional scheduler tests enforce sample retention and frame batching.
