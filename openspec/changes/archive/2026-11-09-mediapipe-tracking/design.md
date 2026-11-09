# Design

## Context

See `proposal.md` for background and scope.

The frontend application in `frontend/` runs on Vite, React 19, and TypeScript. Camera capture is already implemented via `LiveCamera` and `useCamera`, yielding a 640x480 @ 30 FPS video element. The system specification (`docs/sys-spec.md`) requires client-side execution with no external network requests for GDPR compliance and offline capability.

## Goals / Non-Goals

**Goals:**
- Provide a modular tracker (`createTracker`) that accepts an HTML video element and monotonic timestamp, returning unpruned `TrackingFrame` data.
- Run inference locally using locally hosted WASM files and model weights (`holistic_landmarker.task`).
- Integrate overlay canvas and tracking lifecycle into `LiveCamera.tsx`.
- Support GPU delegate with automatic CPU fallback.

**Non-Goals:**
- Landmark pruning to 42 / 12 / 52 values or conversion to the system-spec `LandmarkFrame` (reserved for #14).
- Frame-rate budget assertions or performance benchmarking (reserved for #16).
- Sign token recognition or NLP sentence synthesis.

## Decisions

### 1. Use `HolisticLandmarker` instead of separate models
We use MediaPipe's unified `HolisticLandmarker` task with option `outputFaceBlendshapes: true`.
- *Rationale*: A single inference call produces pose, face mesh, 52 blendshape coefficients, and separated left/right hand landmarks. Running separate hand, pose, and face landmarkers would require three distinct models, three passes per frame, and complex handedness reconciliation.
- *Alternative*: Separate `HandLandmarker`, `PoseLandmarker`, and `FaceLandmarker`. Rejected to minimize memory overhead and multiple inference dispatches.

### 2. Local hosting of runtime WASM and model file
- Model: Commit `frontend/public/models/holistic_landmarker.task` (13.7 MB) directly to the repository.
- WASM: An npm pre-hook (`frontend/scripts/copy-mediapipe-wasm.mjs`) copies WASM binaries from `node_modules/@mediapipe/tasks-vision/wasm` to `frontend/public/mediapipe/wasm/` during `predev` and `prebuild`.
- *Rationale*: Guarantees zero external network requests and offline functionality.
- *Alternative*: Fetching from Google CDN. Rejected due to offline requirement and GDPR compliance rules.

### 3. Timestamp management via `performance.now()`
Timestamps provided to `detectForVideo(video, timestampMs)` will use `performance.now()`.
- *Rationale*: MediaPipe requires strictly monotonically increasing timestamps. `video.currentTime` resets on loop or seek and can throw errors in the landmarker.
- *Alternative*: `Date.now()` or `video.currentTime`. Rejected because `performance.now()` offers sub-millisecond precision and strict monotonicity.

### 4. Frame scheduling via `requestVideoFrameCallback`
The tracking loop in `useTracker` will prioritize `HTMLVideoElement.requestVideoFrameCallback`, with a fallback to `window.requestAnimationFrame`.
- *Rationale*: Aligns landmark inference with new camera frames decoded by the browser, preventing redundant processing of identical video frames.

### 5. Canvas overlay and mirroring alignment
`drawFrame.ts` renders landmarks using MediaPipe `DrawingUtils` on an overlay `<canvas>` absolute-positioned over `<video>`.
- *Rationale*: Provides immediate visual confirmation of tracking accuracy. Canvas dimensions mirror the video intrinsic resolution (`videoWidth`, `videoHeight`).

## Risks / Trade-offs

- **[Model file size in git (13.7 MB)]** → Single binary file, changes rarely. Committing avoids brittle download scripts.
- **[Hardware WebGL/GPU incompatibility]** → `createTracker` initializes with GPU delegate inside a `try...catch` block; if it fails, it falls back to CPU delegate and surfaces the mode.
- **[High CPU load on lower-end devices]** → Frame time optimization is deferred to Issue #16; CPU fallback ensures functionality even when frames take > 26 ms.
