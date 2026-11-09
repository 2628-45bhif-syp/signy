# Proposal

## Why

Signy requires client-side tracking of hand landmarks, pose, and facial blendshapes from video input before gesture recognition or grammatical analysis can take place (Issue #15). With the live camera feed already integrated into the frontend, the tracking engine must now be implemented directly within `frontend/` to extract unpruned landmarks locally and render an interactive skeleton overlay on the camera feed.

## What Changes

- Add `@mediapipe/tasks-vision` to `frontend/package.json`.
- Add `frontend/scripts/copy-mediapipe-wasm.mjs` script to copy MediaPipe WASM runtime files locally into `frontend/public/mediapipe/wasm/` during `predev` and `prebuild`.
- Store the official `holistic_landmarker.task` binary (~13.7 MB) directly in `frontend/public/models/` for offline-first inference.
- Create tracking module in `frontend/src/tracking/`:
  - `types.ts`: Define `TrackingFrame` data structures (timestamps, 52 blendshapes, pose, left/right hand landmarks).
  - `createTracker.ts`: Async loader and detector wrapper with GPU delegate initialization and CPU fallback.
  - `drawFrame.ts`: Skeleton and landmark renderer using MediaPipe `DrawingUtils` on an overlay canvas.
- Implement `useTracker` React hook in `frontend/src/hooks/useTracker.ts` managing the tracker lifecycle and frame processing loop via `requestVideoFrameCallback` (fallback `requestAnimationFrame`).
- Update `frontend/src/components/LiveCamera.tsx` to mount an aligned overlay canvas over the live feed, displaying tracking landmarks and active execution delegate status (GPU vs CPU).

## Capabilities

### New Capabilities
- `landmark-tracking`: Client-side extraction of hand, pose, and face landmarks with 52 facial blendshapes from video feeds using locally served MediaPipe Holistic assets and canvas overlay rendering.

### Modified Capabilities
<!-- None. Requirements in sign-translation will consume landmark-tracking once landmark pruning (#14) is implemented. -->

## Impact

- **Dependencies**: Adds `@mediapipe/tasks-vision` to `frontend/`.
- **Assets**: Adds 13.7 MB model to `frontend/public/models/` and build-time WASM assets to `frontend/public/mediapipe/wasm/`.
- **Frontend Code**: `frontend/src/tracking/`, `frontend/src/hooks/useTracker.ts`, and updates to `frontend/src/components/LiveCamera.tsx`.
- **Build / Tooling**: Adds `predev` and `prebuild` scripts to ensure WASM binaries are present.
