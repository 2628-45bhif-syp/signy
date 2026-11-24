# Design

## Context

See `proposal.md` - Why.

The tracking pipeline in `frontend/src/tracking/` currently consists of:
1. **Inference**: `HolisticLandmarker.detectForVideo(video, timestampMs)` inside `createTracker.ts` (using locally served `/mediapipe/wasm` and `/models/holistic_landmarker.task`).
2. **Mapping & Coordinate Selection**: `mapResult(rawResult, timestampMs)` in `mapResult.ts` and `selectHeadPoint` / `selectHandPoint` in `hands.ts`.
3. **Overlay Rendering**: `drawFrame(canvas, frame)` in `drawFrame.ts` using MediaPipe `DrawingUtils` on a 640x480 2D canvas.

Existing unit tests run under Vitest's `jsdom` environment (`frontend/vite.config.ts`) and mock `@mediapipe/tasks-vision` because `jsdom` lacks WebGL, WebAssembly vision runtime support, hardware video decoding, and a real Canvas 2D backing store.

## Goals / Non-Goals

**Goals:**
- Provide an on-demand CLI test command (`npm run test:perf`) that executes the real tracking pipeline inside headless Chromium using Vitest Browser Mode.
- Benchmark each algorithm stage (`detectForVideo`, `mapResult` + coordinate extraction, `drawFrame`) individually and combined across real 640x480 video frames from `frontend/public/signs/videos/`.
- Compute descriptive statistics (`min`, `mean`, `median`, `p95`, `max`) per stage and assert `total.p95 < 33` ms.
- Keep all benchmark logic in test/tooling files with zero UI components or benchmark code added to the production React app.

**Non-Goals:**
- Adding an in-app FPS counter, telemetry HUD, or benchmark screen to `LiveCamera.tsx` or `App.tsx`.
- Replacing or slowing down existing `jsdom` unit tests (`npm test`).
- Modifying MediaPipe model weights or WASM binaries.

## Decisions

### 1. Vitest Browser Mode (`@vitest/browser` + Playwright Chromium) with Separate Config
- **Choice**: Use a dedicated `frontend/vitest.perf.config.ts` configured with `@vitest/browser` (Playwright provider, `chromium`, headless) matching `src/**/*.perf.test.ts` (or `src/**/*.perf.ts`), invoked via `npm run test:perf`. Keep `frontend/vite.config.ts` for `jsdom` unit tests (`src/**/*.test.{ts,tsx}` excluding `*.perf.*`).
- **Rationale**: Same test runner and assertion syntax (`describe`, `it`, `expect`) already used across `frontend/src/`, direct ES module imports of `src/tracking/*`, and automatic static asset serving of `frontend/public/` (`/mediapipe/wasm`, `/models/holistic_landmarker.task`, `/signs/videos/*.mp4`).
- **Alternatives Considered**:
  - *Standalone `@playwright/test` E2E runner*: Requires booting the full React app dev server and exposing internal pipeline functions on `window` to time individual stages (`detectForVideo` vs `mapResult` vs `drawFrame`).
  - *Node.js benchmark*: Impossible for `@mediapipe/tasks-vision` because it depends on browser WebGL/Canvas/DOM Video APIs.

### 2. Granular Stage Timing via Optional Raw Detection Hook or Direct Landmarker Access
- **Choice**: In `createTracker.ts`, `tracker.detect(video, timestampMs)` currently couples `landmarker.detectForVideo(video, timestampMs)` and `mapResult(..., timestampMs)`. Export `createLandmarker` (or add a thin `detectRaw` method / helper in `createTracker.ts`) so the performance test can measure:
  1. `inferenceMs`: `landmarker.detectForVideo(video, timestampMs)`
  2. `mappingMs`: `mapResult(rawResult, timestampMs)` + `selectHeadPoint(frame)` + `selectHandPoint(frame, 'left')` + `selectHandPoint(frame, 'right')`
  3. `drawMs`: `drawFrame(canvas, frame)`
  4. `totalMs`: `inferenceMs + mappingMs + drawMs`
  while keeping `tracker.detect()` backward-compatible for `useTracker` and existing unit tests.
- **Rationale**: Allows accurate stage-by-stage timing without duplicating WASM/model path resolution or GPU-to-CPU fallback logic.

### 3. Deterministic Video Frame Feeding & Warm-Up
- **Choice**: Load a local pre-recorded ÖGS video fixture from `/signs/videos/` (e.g., `/signs/videos/12887.mp4`) into an offscreen `<video width="640" height="480" muted playsInline>` element (or draw decoded video frames onto a 640x480 `<video>` / frame buffer), run 5 warm-up iterations to absorb initial WebGL shader compilation and WASM JIT overhead, then measure 60 consecutive frames with strictly increasing timestamps (`performance.now()`).
- **Rationale**: First-frame MediaPipe initialization spikes (often 40–100 ms) are one-time setup costs, not steady-state frame processing times. Stepping through 60 frames (~2 seconds at 30 FPS) gives a statistically stable 95th percentile (`p95`).

### 4. Statistical Aggregation & Console Breakdown Table
- **Choice**: Implement a small pure statistics helper (tested via unit tests as well) that computes `min`, `mean`, `median` (`p50`), `p95`, and `max` for an array of frame timings in milliseconds, prints a structured summary table (`console.table` / formatted ASCII table), and asserts `stats.total.p95 < 33`.
- **Rationale**: `p95 < 33` ms enforces the 30 FPS frame budget reliably while tolerating an isolated single-frame browser GC pause.

## Risks / Trade-offs

- **[Risk] Headless Chromium software WebGL fallback on machines without GPU** → Mitigation: Pass Chromium launch flags enabling GPU/WebGL (`--enable-webgl`, `--ignore-gpu-blocklist`, `--use-gl=angle`) in `vitest.perf.config.ts`, and log the active MediaPipe delegate (`GPU` vs `CPU`) in the benchmark output so any environment fallback is immediately visible.
- **[Risk] Video element playback timing variability in headless browsers** → Mitigation: Wait for video `loadeddata` (`readyState >= 2`), and step through frames deterministically (either during active playback via `requestVideoFrameCallback` / frame ticks or by seeking/advancing frames with strictly monotonic timestamps passed to `detectForVideo`).
