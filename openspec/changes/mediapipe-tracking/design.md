# Design

## Context

See proposal.md for motivation and scope. Current state:

- The repository has no application code: no `package.json`, no Vite or React setup. Only `docs/`, `pitch/`, `openspec/`, and one Pages workflow for the pitch.
- Stack is fixed by `docs/sys-spec.md`: React, TypeScript, Vite, Tailwind, `@mediapipe/tasks-vision`, client-side inference (GDPR: no video leaves the device).
- Issue #13 (camera) is owned by another group, so there is no camera source yet. #14 (pruning) and #16 (frame-time budget) come later and consume the output of this change.
- Verified against `@mediapipe/tasks-vision` 1.2.0: it ships `HolisticLandmarker`, which returns face landmarks, face blendshapes (option `outputFaceBlendshapes`), pose landmarks, and separate `leftHandLandmarks` / `rightHandLandmarks`. The Holistic model file `holistic_landmarker.task` is about 13.7 MB.

## Goals / Non-Goals

**Goals:**
- One small tracking module that other code calls with a video element and gets raw landmarks back.
- A runnable dev page that shows tracking on a demo video with a skeleton overlay.
- Everything needed at runtime served from the app's own files.

**Non-Goals:**
- Camera capture, permissions, and device selection (#13).
- Pruning to 42 / 12 / 52 values and the `LandmarkFrame` structure from the system spec (#14).
- Measuring or optimizing frame time (#16). The code may log nothing about timing; no budget is asserted here.
- PWA manifest, service worker, routing, state management, UI design beyond the check page.
- Sign recognition, facial-grammar classification, segmentation.

## Decisions

### 1. Use `HolisticLandmarker`, not three separate landmarkers
One task, one inference call per frame, and it already outputs left and right hands separately plus face blendshapes. The alternative of running `HandLandmarker`, `PoseLandmarker`, and `FaceLandmarker` means three models, three calls per frame, and manual hand-to-handedness handling. That works against the frame budget the project later has to meet (#16) and adds code.
- Trade-off: Holistic is a newer task and less documented. Mitigation: the tracking module hides the choice behind its own result type, so swapping to three landmarkers later changes one file.
- Fallback if Holistic proves unusable in practice (accuracy, GPU errors): switch to the three-landmarker setup; no spec change needed.

### 2. Tracking module API: video element in, raw frame out
`web/src/tracking/` exposes a tracker created once (model load is async and slow) and a synchronous `detect(video, timestampMs)` that returns a `TrackingFrame`:
- `timestampMs`
- `face` landmarks, `blendshapes` (52 category scores), `pose` landmarks, `leftHand`, `rightHand` landmarks

`TrackingFrame` mirrors MediaPipe's normalized landmark shape and stays unpruned. It is deliberately not the `LandmarkFrame` of the system spec: that type belongs to #14 and will be built from `TrackingFrame`. The module does not start the camera and does not own a loop; the caller decides when to call `detect`. This keeps the camera story (#13) free to plug in.
- Alternative: module owns the render loop. Rejected, because #13 and later stages will want to control timing.

### 3. Frame loop lives in the check page, not in the module
The dev component runs the loop: `requestVideoFrameCallback` when available (one call per new video frame), otherwise `requestAnimationFrame`. It skips frames when the video is not ready. This is the only place a loop exists in this change.

### 4. Timestamps come from `performance.now()`, not `video.currentTime`
`detectForVideo` requires strictly increasing timestamps. The demo video loops and `currentTime` jumps back to 0, which would make MediaPipe throw. `performance.now()` is monotonic for both recorded files and later camera streams.

### 5. Run on GPU with CPU fallback
Create the landmarker with the GPU delegate and fall back to CPU if creation fails. The system spec asks for GPU-accelerated tracking, but support varies between browsers and machines, so a failed GPU init must not make the app unusable.

### 6. Local hosting of runtime files
- WASM runtime files are copied from `node_modules/@mediapipe/tasks-vision/wasm` into `web/public/mediapipe/wasm/` by an npm script (run before `dev` and `build`). They are git-ignored; they come from the locked dependency version, so they cannot drift from the library.
- The `holistic_landmarker.task` model is committed in `web/public/models/`. It is a fixed 13.7 MB binary that changes rarely; committing it avoids a download step that could break offline or reproducible setups. The model's source URL and download date are recorded in a short `README` next to it.
- Alternative: load from the Google CDN and storage URLs. Rejected: contradicts the local-only requirement and the GDPR statement in the system spec.

### 7. Demo video as the dev input
A short clip (target at most a few MB) of a team member signing, stored under `web/public/dev/`. A team-made recording avoids licensing questions with third-party footage. The check page also accepts a user-selected local file, so other clips can be tried without committing them. The video element is the only contract, so replacing it with the #13 camera element needs no change in the tracking module.

### 8. Overlay with MediaPipe `DrawingUtils` on a canvas
A canvas is stacked on the video and sized to the video's displayed size. Landmarks and the library's connection constants (`HAND_CONNECTIONS`, `POSE_CONNECTIONS`, face tesselation) are drawn with `DrawingUtils`. This gives the acceptance check without writing drawing code. Blendshapes are not drawn.
- Mirroring: the demo video is not mirrored. If #13 later mirrors the camera view, the same CSS transform must be applied to the canvas. Noted for the integration, not handled now.

### 9. Project layout and tooling
```
web/
  package.json  vite.config.ts  tsconfig*.json  index.html
  scripts/copy-mediapipe-wasm.mjs
  public/models/holistic_landmarker.task   (+ README)
  public/dev/demo-sign.mp4
  public/mediapipe/wasm/                   (git-ignored, generated)
  src/main.tsx  App.tsx  index.css
  src/tracking/   types.ts  createTracker.ts
  src/components/ TrackingCheck.tsx
```
Tailwind via its Vite plugin. npm as package manager. `web/` is self-contained so the existing `docs/`, `pitch/`, and the Pages workflow are untouched.

### 10. Spec boundary
A new capability `landmark-tracking` is added rather than modifying `sign-translation`. The existing "Multimodal Tracking and Pruning" requirement mixes capture, pruning, and the frame budget, which are three different stories (#13, #14, #16). Editing it now would force changes that those stories have not made yet. The overlap is accepted; reconcile once #13, #14, and #16 land.

## Risks / Trade-offs

- [Holistic accuracy or stability worse than separate landmarkers] → Result type hides the choice; fallback to three landmarkers is a one-file change. Verify early with the demo video.
- [13.7 MB model in git history] → Accepted; committed once. If it must change often, move to a download script.
- [GPU delegate fails on some machines] → CPU fallback; log which delegate is active in the check page.
- [Holistic hand labels may swap on mirrored input] → Check labels against the demo video during testing and record the convention (anatomical vs. image side) in the module's types.
- [Demo video not yet recorded] → Development can start with any short local clip via the file picker; committing the final clip is a separate task.
- [Overlap between `landmark-tracking` and `sign-translation`] → Documented above; reconcile later.

## Open Questions

- Who records the committed demo clip, and which signs does it show? Deferrable: any clip works until then.
- Branch protection or required PR target on `dev`: assumed PR into `dev` per Git-Flow in the system spec.
