# Design

## Context

Tracking already runs end to end (archived change `mediapipe-tracking`, Issue #15):

```
useCamera --> <video> --> useTracker (rVFC/rAF loop)
                             |
                             v
               createTracker().detect()  -- HolisticLandmarker, local WASM + model
                             |
                             v
               mapResult --> TrackingFrame { face, blendshapes, pose, leftHand[21], rightHand[21] }
                             |
                 +-----------+------------+
                 v                        v
           drawFrame(canvas)        lastFrame (React state, returned but unused)
```

- `TrackingFrame.leftHand` / `rightHand` are 21 normalized landmarks, or an empty array when the hand is not detected. Index 0 is the wrist.
- `useTracker` returns `lastFrame`, updated on every processed frame. `LiveCamera` currently ignores it.
- When `enabled` becomes false (skeleton toggle), the loop stops and the canvas is cleared, but `lastFrame` keeps its last value.
- The video is not mirrored in CSS.

## Goals / Non-Goals

**Goals:**
- Read hand coordinates from the existing `lastFrame`; no second model, no second `detect()` per frame.
- Keep hand-specific logic in its own module so later readouts for pose or face can be added as siblings without touching it.

**Non-Goals:**
- Landmark pruning / `LandmarkFrame` (`handPoints[42][3]` etc.) — Issue #14.
- Showing all 21 landmarks, z values, or pixel coordinates.
- Mirroring the video or changing x direction.
- Throttling or changing the tracking loop.

## Decisions

### 1. Pure selector in `tracking/hands.ts`
`selectHandPoint(frame: TrackingFrame | null, side: 'left' | 'right'): { x: number; y: number } | null` returns the wrist (`hand[0]`) with `y = 1 - rawY`, or `null` when the frame is null or the hand array is empty. A `WRIST = 0` constant names the landmark index.

- Why: framework-free, unit-testable without camera/model, and reusable by Issue #14. Coordinate conventions (y inversion) live in one place instead of in JSX.
- Alternative: compute inline in the component. Rejected: mixes conventions with rendering and is harder to test.

### 2. Presentational `HandCoordinates` component
`components/HandCoordinates.tsx` takes `frame: TrackingFrame | null` and renders two labeled entries ("Left hand", "Right hand"). Each shows `x` and `y` with 3 decimals, or "Not detected". Rendered by `LiveCamera` directly below the video wrapper and fed `lastFrame` from `useTracker`.

- Why: keeps `LiveCamera` thin; the component has no hooks, so tests pass a fake frame.
- Alternative: place it in the `translator-panel` in `App.tsx`. Rejected: the story says "below the camera", and `lastFrame` is owned by `LiveCamera`.
- Fixed-width number formatting (`toFixed(3)`, tabular numerals in CSS) avoids layout jitter at ~30 updates/s.

### 3. Clear `lastFrame` when tracking stops
In the second effect of `useTracker`, call `setLastFrame(null)` in the cleanup and in the disabled branch.

- Why: required by the "no stale values" acceptance criterion; turning the skeleton off otherwise freezes old coordinates on screen.
- Alternative: hide the readout when disabled. Rejected: it would still hold stale state, and "Not detected" is the behavior the spec names.

### 4. Left/right labels taken from the Holistic model as-is
Holistic assigns hands via the pose wrists, so `leftHand` is expected to be the signer's anatomical left hand on an unmirrored image. The display uses `leftHand` for "Left hand" unchanged. Verified manually during implementation (task 4.2); if wrong, the swap happens only in the selector.

### Extension pattern for other body parts
```
TrackingFrame --> selectHandPoint  --> HandCoordinates     (this change)
              --> selectPosePoint  --> PoseCoordinates     (future, sibling files)
              --> selectFace...    --> ...
```
`TrackingFrame`, `mapResult`, and `drawFrame` are not modified, so existing face, pose, and blendshape behavior and tests remain untouched.

## Risks / Trade-offs

- [~30 React re-renders/s of `LiveCamera` subtree] → Readout is tiny (two entries); `lastFrame` state already triggers these re-renders today. Throttle display only if profiling shows a problem.
- [Left/right could appear swapped to the user because the video is not mirrored] → Manual check in task 4.2; label fix contained in the selector.
- [x decreases when the user moves their hand to their own right (unmirrored image)] → Accepted; acceptance criteria only define y direction. Document in the component test/README note if it confuses reviewers.
- [Existing `useTracker` / `LiveCamera` tests mock `lastFrame: null`] → Still valid; new test asserts reset to `null` on disable.
