# Design

## Context

`useTracker` already runs MediaPipe Holistic inference on each video frame and exposes `lastFrame: TrackingFrame | null` containing `face: Landmark[]` (478 face landmarks), `pose`, `leftHand`, `rightHand`, and `blendshapes`. Currently, `LiveCamera` ignores `lastFrame` and passes `{ enabled: showSkeleton }` to `useTracker`, which stops the entire detection loop when the user clicks "Hide Skeleton". See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Display live `Head` coordinates (`X` and inverted `Y`) directly below the live video feed in `LiveCamera`.
- Ensure `"Not detected"` is shown immediately when `lastFrame` is `null` or `lastFrame.face` is empty.
- Keep landmark detection active even when the skeleton overlay canvas is toggled off so coordinate telemetry remains live.
- Structure the coordinate readout bar cleanly so sibling hand-tracking coordinates (Issue #24) can be added alongside `Head` without layout rework.

**Non-Goals:**
- Modifying the MediaPipe model configuration or adding external network requests.
- Implementing hand coordinate display (covered separately in Issue #24).
- Changing how `drawFrame` draws face, pose, or hand connectors when the skeleton overlay is visible.

## Decisions

1. **Primary Head Landmark Selection (`face[1]`)**
   - **Decision**: Use `lastFrame.face[1]` (MediaPipe Face Mesh nose tip) as the primary head point, requiring `lastFrame !== null && lastFrame.face.length > 1`.
   - **Rationale**: The acceptance criteria require showing `"Not detected"` when no face is visible. `frame.face` is populated only when the face detector finds a visible face, whereas `frame.pose[0]` (pose nose) can be estimated from body posture even when the face is occluded or off-screen.
   - **Alternatives considered**: Using `pose[0]` or averaging all 478 face landmarks. `face[1]` is O(1), stable on the nose tip, and strictly tied to face visibility.

2. **Coordinate Transformation and Formatting**
   - **Decision**: Compute `x = point.x` and `y = 1 - point.y`, formatted to two decimal places via `.toFixed(2)` as `X: 0.50, Y: 0.62`.
   - **Rationale**: MediaPipe normalized coordinates use top-left origin (`y = 0` at top, `y = 1` at bottom). Inverting `y` to `1 - point.y` satisfies the requirement that moving the head up increases `y` and moving down decreases `y`, while keeping normalized `0.00–1.00` range consistent across camera aspect scaling.

3. **Decoupling Skeleton Visibility from Tracker Execution**
   - **Decision**: Keep `useTracker` enabled while the camera is active, and control skeleton rendering via the `showSkeleton` toggle in `LiveCamera` (or a dedicated `drawSkeleton` option / canvas visibility).
   - **Rationale**: Hiding the visual skeleton overlay should only hide the canvas overlay, not disable tracking telemetry below the camera.

## Risks / Trade-offs

- **[Risk] React re-render frequency at 30 FPS** → `useTracker` already calls `setLastFrame(frame)` on every detected video frame. Rendering a lightweight text readout inside `LiveCamera` adds negligible DOM work (< 0.2 ms per frame), well within the 33 ms frame budget.
