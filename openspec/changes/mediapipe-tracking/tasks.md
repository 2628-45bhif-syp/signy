# Tasks

## 1. Dependencies and Local Assets

- [x] 1.1 Add `@mediapipe/tasks-vision` to `frontend/package.json` and install with `npm install`; verify `npm ls @mediapipe/tasks-vision` resolves in `frontend/`
- [x] 1.2 Create `frontend/scripts/copy-mediapipe-wasm.mjs` and configure `predev` and `prebuild` scripts in `frontend/package.json`; verify running `npm run build` in `frontend/` copies WASM files to `frontend/public/mediapipe/wasm/`
- [x] 1.3 Add `frontend/public/models/holistic_landmarker.task` with `frontend/public/models/README.md` documenting source URL and download date; verify the file size is ~13.7 MB
- [x] 1.4 Commit `chore(frontend): setup mediapipe dependencies and local assets`

## 2. Tracking Core Module

- [x] 2.1 Define `TrackingFrame` and landmarker interfaces in `frontend/src/tracking/types.ts`; verify `npm run build` passes TypeScript compilation
- [x] 2.2 Implement `createTracker` in `frontend/src/tracking/createTracker.ts` to load local WASM/model, attempt GPU delegate with CPU fallback, and return `detect(video, timestampMs)`; verify with unit tests in `frontend/src/tracking/createTracker.test.ts`
- [x] 2.3 Implement `drawFrame` in `frontend/src/tracking/drawFrame.ts` using MediaPipe `DrawingUtils` to draw pose, hands, and face connections on an overlay canvas; verify with unit tests in `frontend/src/tracking/drawFrame.test.ts`
- [x] 2.4 Commit `feat(tracking): implement holistic tracker and canvas overlay renderer`

## 3. React Integration and Live Camera Overlay

- [x] 3.1 Implement `useTracker` hook in `frontend/src/hooks/useTracker.ts` managing tracker initialization, cleanup, and frame loop (`requestVideoFrameCallback` with `requestAnimationFrame` fallback); verify with unit tests in `frontend/src/hooks/useTracker.test.tsx`
- [x] 3.2 Update `frontend/src/components/LiveCamera.tsx` and styles in `frontend/src/styles.css` to render an aligned overlay canvas, skeleton visibility toggle, and GPU/CPU indicator badge; verify tests in `frontend/src/components/LiveCamera.test.tsx` pass
- [x] 3.3 Commit `feat(frontend): integrate live tracking overlay into camera view`

## 4. Verification and Documentation

- [x] 4.1 Verify offline-only execution: run `npm run build && npm run preview` in `frontend/`, inspect network tab to confirm no outbound requests, and verify tracking runs while offline
- [x] 4.2 Document tracking architecture and downstream contract for issue #14 (pruning) and issue #16 (performance) in `frontend/README.md`
- [x] 4.3 Commit `docs(frontend): document tracking integration contract`
