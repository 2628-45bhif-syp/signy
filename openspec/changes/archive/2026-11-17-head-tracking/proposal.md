# Proposal

## Why

Developers and users need live, human-readable verification that client-side face tracking accurately follows head movement in real time. Exposing the primary head landmark coordinates directly below the live camera feed enables immediate visual validation of head tracking and vertical orientation (`y` increasing upward) without requiring external debugging tools.

## What Changes

- Display a live coordinate readout directly below the camera video stream labeled `Head`.
- Extract the primary head landmark from the MediaPipe face mesh (`face[1]`, nose tip) and display its normalized `x` and `y` coordinates rounded to 2 decimal places (`X: 0.50, Y: 0.62`).
- Invert the raw MediaPipe vertical coordinate (`displayY = 1 - rawY`) so moving the head upward increases `y` and moving it downward decreases `y`.
- Display `Not detected` whenever no face is visible in the current frame instead of showing stale or invalid values.
- Decouple skeleton canvas visibility from the underlying `useTracker` inference loop so head coordinates continue updating in real time even when the skeleton overlay is hidden.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `landmark-tracking`: Add a requirement for displaying live normalized head coordinates (with inverted `y`-axis and `"Not detected"` fallback) below the camera feed, independent of skeleton overlay visibility.

## Impact

- `frontend/src/components/LiveCamera.tsx`: Render the `Head` coordinate readout panel below the video wrapper and keep `useTracker` running while toggling canvas overlay rendering.
- `frontend/src/hooks/useTracker.ts`: Support toggling canvas drawing independently or ensure `lastFrame` updates continuously while tracking is active.
- `frontend/src/styles.css`: Add styling for the live coordinate readout bar below the camera video.
- `frontend/src/components/LiveCamera.test.tsx`: Add unit tests verifying live `Head` coordinate rendering, upward `y`-axis inversion, `"Not detected"` state when `face` is empty, and continued updates when the skeleton overlay is hidden.
