# Tasks

## 1. Tracker & Skeleton Overlay Decoupling

- [x] 1.1 Update `useTracker` (`frontend/src/hooks/useTracker.ts`) and `LiveCamera` (`frontend/src/components/LiveCamera.tsx`) so that hiding the skeleton overlay clears/hides the canvas without stopping the MediaPipe detection loop (`lastFrame` continues updating), and verify `npm test -- useTracker` passes.
- [x] 1.2 Add unit tests in `frontend/src/hooks/useTracker.test.tsx` verifying that `lastFrame` updates while tracking is active and canvas drawing respects overlay visibility, and verify all hook tests pass via `npm test -- useTracker`.

## 2. Live Head Coordinate Display

- [x] 2.1 Render the `Head` live coordinate readout bar directly below the camera video in `frontend/src/components/LiveCamera.tsx` using `lastFrame.face[1]` (nose tip) formatted as `X: <x>, Y: <1 - y>` rounded to 2 decimal places, or `Not detected` when `lastFrame` is null or `face` has no nose-tip landmark, and style it in `frontend/src/styles.css`.
- [x] 2.2 Add unit tests in `frontend/src/components/LiveCamera.test.tsx` covering: `Head` label presence, live `X`/`Y` formatting with upward `Y` inversion (`1 - rawY`), `Not detected` fallback when `face` is empty or `lastFrame` is null, and continued coordinate display when the skeleton overlay is toggled off; verify `npm test -- LiveCamera` passes.

## 3. Integration Verification

- [x] 3.1 Run the full frontend test suite and TypeScript build (`npm test` and `npm run build` in `frontend/`) to verify zero regressions and clean compilation.
