# Tasks

## 1. Hand point selector

- [x] 1.1 Create `frontend/src/tracking/hands.ts` with `WRIST = 0` and `selectHandPoint(frame, side)` returning `{ x, y: 1 - rawY }` for the wrist or `null` for a null frame / empty hand; verify by `npm test` in `frontend/`
- [x] 1.2 Add `frontend/src/tracking/hands.test.ts` covering: both hands present, one hand empty, null frame, y inversion (raw y 0.2 -> 0.8, higher raw y -> lower value); verify `npm test` passes

## 2. Stale value prevention

- [x] 2.1 In `frontend/src/hooks/useTracker.ts`, reset `lastFrame` to `null` in the tracking-loop effect cleanup and in the disabled branch; verify `npm test` passes
- [x] 2.2 Extend `frontend/src/hooks/useTracker.test.tsx` with a test that `lastFrame` becomes `null` after rerendering with `enabled: false`; verify the new test passes

## 3. Coordinate readout UI

- [x] 3.1 Create `frontend/src/components/HandCoordinates.tsx` rendering "Left hand" and "Right hand" entries with `x` / `y` to 3 decimals or "Not detected", using `selectHandPoint`; verify by component test in 3.3
- [x] 3.2 Render `<HandCoordinates frame={lastFrame} />` in `frontend/src/components/LiveCamera.tsx` directly below the video wrapper, and add styles (tabular numerals, two columns) in `frontend/src/styles.css`; verify existing `LiveCamera.test.tsx` still passes and shows "Not detected" twice with `lastFrame: null`
- [x] 3.3 Add `frontend/src/components/HandCoordinates.test.tsx` covering labels, formatted values with inverted y, "Not detected" for a missing hand, and "Not detected" for both hands with `frame = null`; verify `npm test` passes

## 4. Integration check

- [x] 4.1 Run `npm run build` in `frontend/` and verify type-check and build succeed
- [ ] 4.2 Run `npm run dev`, open the app, and manually verify: values update live, raising a hand increases y, lowering decreases y, hiding a hand shows "Not detected", "Hide Skeleton" shows "Not detected" for both, the "Left hand" entry follows the user's own left hand, and the browser network tab shows no requests carrying frame or landmark data

## Workflow follow-up

- Archive the change after review and sync the `landmark-tracking` delta into the main spec.
