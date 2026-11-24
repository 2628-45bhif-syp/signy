# Tasks

## 1. Vitest Browser Mode Setup

- [x] 1.1 Add `@vitest/browser` and `playwright` (and `@vitest/browser-playwright` if required by the installed Vitest version) to `frontend/package.json` `devDependencies`, install packages, and verify Chromium browser binaries are available for Playwright
- [x] 1.2 Create `frontend/vitest.perf.config.ts` targeting `src/**/*.perf.test.ts` with headless Chromium and WebGL/GPU launch flags, update `frontend/vite.config.ts` to exclude `*.perf.test.ts` from standard `jsdom` runs, add `"test:perf": "vitest run --config vitest.perf.config.ts"` to `frontend/package.json`, and verify `npm test` still passes in `jsdom`

## 2. Pipeline Stage Instrumentation Support & Timing Statistics

- [x] 2.1 Expose raw inference detection (`detectRaw` on `Tracker` or exported landmarker factory in `frontend/src/tracking/createTracker.ts`) alongside `detect` so stage-by-stage timing can measure `detectForVideo` separately from `mapResult`, and verify existing unit tests in `frontend/src/tracking/createTracker.test.ts` pass
- [x] 2.2 Implement a timing statistics utility (`frontend/src/tracking/perfStats.ts` with unit tests in `frontend/src/tracking/perfStats.test.ts`) that computes `min`, `mean`, `median`, `p95`, and `max` durations in milliseconds and formats a stage breakdown table, and verify `npm test` passes

## 3. Browser Pipeline Performance Benchmark Suite

- [x] 3.1 Create `frontend/src/tracking/pipeline.perf.test.ts` that loads the real MediaPipe Holistic landmarker and a 640x480 pre-recorded ÖGS video fixture from `/signs/videos/`, runs warm-up frames, measures 60 frames across each stage (`inference`, `mapping + coordinate selection`, `drawFrame`, and `total`), logs the stage breakdown report, and asserts that landmark detections occur and processing stages execute below 33 ms (`p95 < 33` ms); verify by running `npm run test:perf`
