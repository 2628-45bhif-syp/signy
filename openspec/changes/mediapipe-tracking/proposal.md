# Proposal

## Why

Signy needs hand, pose, and face landmarks from video before any sign or facial-grammar recognition can happen (GitHub issue #15, "MediaPipe tracks hands, pose and face"). The repository has no application code yet, so the web frontend foundation and the tracking module have to be created together, otherwise #15 cannot be run or verified.

## What Changes

- Create the web app foundation in `web/` (Vite, React, TypeScript, Tailwind) as the home for all frontend work.
- Add a tracking module that accepts a video source and a timestamp and returns the raw MediaPipe result per frame: hand landmarks, pose landmarks, face landmarks, and 52 face blendshape scores.
- Host MediaPipe WASM files and model files locally in the app, with no CDN request at runtime.
- Add a dev-only demo video as the tracking input, so the work does not depend on the camera story (#13, owned by another group).
- Add a skeleton overlay on top of the video as the visual acceptance check for tracking.
- Define the input contract (video element plus timestamp) that the camera story (#13) will feed later.
- Out of scope: camera capture (#13), landmark pruning (#14), frame-time measurement and optimization (#16).

## Capabilities

### New Capabilities
- `landmark-tracking`: Per-frame detection of hand, pose, and face landmarks plus face blendshapes from a video source, returned unpruned. Pruning and performance budgets stay with the existing `sign-translation` requirements and later changes.

### Modified Capabilities
<!-- None. The existing "Multimodal Tracking and Pruning" requirement in sign-translation also covers capture, pruning, and the frame budget, which belong to #13, #14, and #16. It is left unchanged here and should be reconciled with landmark-tracking once those stories are done. -->

## Impact

- New directory `web/` with `package.json`, Vite and TypeScript config, `src/`, and `public/` assets (WASM and model files).
- New dependency: `@mediapipe/tasks-vision` (verified: version 1.2.0 ships `HolisticLandmarker`, `HandLandmarker`, `PoseLandmarker`, `FaceLandmarker`).
- New dev asset: a short demo video of signing, with an unresolved question about licensing and repo size (see design).
- Git workflow: work happens on branch `feat/15-mediapipe-tracking` cut from `origin/dev`, with conventional commits pushed per task group.
- No change to `docs/`, `pitch/`, or the existing Pages workflow.
