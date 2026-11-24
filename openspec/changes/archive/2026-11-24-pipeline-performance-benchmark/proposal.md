# Proposal

## Why

Issue #16 requires verifying that per-frame processing time across the camera tracking pipeline stays below 33 ms (30 FPS). Currently, unit tests run in `jsdom` with mocked MediaPipe instances, leaving no repeatable, automated way to benchmark the real WASM/WebGL inference, result mapping, coordinate extraction, and canvas overlay rendering stages or enforce the 33 ms frame budget outside the application UI.

## What Changes

- Add an automated browser performance benchmark suite (executed via Vitest Browser Mode in headless Chromium) that runs outside the application UI and feeds deterministic 640x480 pre-recorded ÖGS sign video frames through the real tracking pipeline.
- Measure and report stage-by-stage frame durations (MediaPipe Holistic inference, result mapping and head/hand coordinate selection, skeleton overlay canvas rendering, and total end-to-end frame processing time) across multiple frames after an initial warm-up pass.
- Assert that the 95th percentile (`p95`) of total per-frame processing duration is strictly below 33 ms.
- Expose a dedicated CLI command (`npm run test:perf`) in `frontend/package.json` backed by a separate Vitest browser configuration so standard unit tests (`npm test`) remain fast in `jsdom`.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `landmark-tracking`: Add a frame processing performance requirement ensuring the complete per-frame landmark tracking and rendering pipeline executes within a 33 ms 95th-percentile frame budget (30 FPS) when benchmarked against 640x480 video frames.

## Impact

- **Specs**: `openspec/specs/landmark-tracking/spec.md`
- **Dependencies**: Adds `@vitest/browser` and `playwright` (or `@vitest/browser-playwright`) to `frontend/package.json` `devDependencies`.
- **Configuration & Scripts**: Adds a dedicated Vitest browser benchmark config (`frontend/vitest.perf.config.ts`) and `test:perf` script in `frontend/package.json`.
- **Tests**: Adds a browser benchmark test file under `frontend/src/tracking/` that exercises `createTracker` / `HolisticLandmarker`, `mapResult`, `selectHeadPoint`, `selectHandPoint`, and `drawFrame` against local `.mp4` sign fixtures without modifying the production React UI.
