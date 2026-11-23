# Proposal

## Why

Hand landmarks are already tracked (Issue #15), but developers can only check them visually via the skeleton overlay. Issue #24 asks for live numeric coordinates of both hands below the camera so developers can verify that hand tracking follows their movements correctly before sign recognition is built on top of it.

## What Changes

- Show the live x and y coordinates of one main point (the wrist) of the left and the right hand below the live camera image, updated with every tracked frame.
- Label the display clearly as "Left hand" and "Right hand" (UI language is English, matching the rest of the app).
- Present y as "up = higher" by inverting the raw MediaPipe y axis (`1 - y`), so raising a hand increases its value.
- Show "Not detected" for a hand that is not visible, and never show stale values: when the overlay/tracking is switched off, the previous frame is cleared.
- No change to how landmarks are extracted, stored, or drawn; tracking stays fully in the browser.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `landmark-tracking`: adds a requirement for a live hand coordinate readout (wrist x/y per hand, inverted y, "Not detected" state, no stale values).

## Impact

- `frontend/src/tracking/`: new pure helper that selects the wrist point of a hand from a `TrackingFrame` and inverts y.
- `frontend/src/components/`: new hand coordinate component, rendered by `LiveCamera` below the video.
- `frontend/src/hooks/useTracker.ts`: clear `lastFrame` when tracking stops (prevents stale values).
- `frontend/src/styles.css`: styling for the readout.
- No new dependencies. `TrackingFrame`, `mapResult`, `drawFrame`, and the Holistic model setup are unchanged, so face, pose, and blendshape tracking are unaffected.
