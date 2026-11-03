# Tasks

Each group ends with a commit (Conventional Commits, see `AGENTS.md`) and a push of the feature branch. Never push to `main` or `dev`.

## 1. Branch and web app scaffold

- [x] 1.1 Fetch and create branch `feat/15-mediapipe-tracking` from `origin/dev`; verify with `git branch --show-current` and that `git merge-base HEAD origin/dev` equals `origin/dev`
- [x] 1.2 Create `web/` with Vite, React, TypeScript, and Tailwind (npm); verify `npm install` and `npm run build` succeed in `web/`
- [x] 1.3 Add `web/.gitignore` (node_modules, dist, `public/mediapipe/wasm/`) and a short `web/README.md` with install, dev, and build commands; verify `git status` shows no generated files and the README commands run as written
- [ ] 1.4 Commit `chore(web): scaffold vite react typescript app` and push the branch; verify the branch is visible on `origin`

## 2. Tracking module

- [ ] 2.1 Add `@mediapipe/tasks-vision` and a `web/scripts/copy-mediapipe-wasm.mjs` script, wired to run before `dev` and `build`; verify `public/mediapipe/wasm/` contains the `vision_wasm_*` files after `npm run dev` starts
- [ ] 2.2 Add `holistic_landmarker.task` to `web/public/models/` with a `README` noting source URL and download date; verify the file is about 13.7 MB and loads at `/models/holistic_landmarker.task` in the dev server
- [ ] 2.3 Define `TrackingFrame` in `web/src/tracking/types.ts` (timestamp, face, 52 blendshapes, pose, leftHand, rightHand; unpruned) and document the hand-label convention; verify `npm run build` type-checks
- [ ] 2.4 Implement `createTracker` in `web/src/tracking/createTracker.ts`: load from local files, GPU delegate with CPU fallback, `outputFaceBlendshapes` on, `detect(video, timestampMs)` returning a `TrackingFrame`; verify with a Vitest unit test that maps fake Holistic results (full, no hands, empty) to the expected `TrackingFrame` with no errors
- [ ] 2.5 Commit `feat(tracking): add holistic landmark tracker` and push; verify tests and build pass before pushing

## 3. Check page with skeleton overlay

- [ ] 3.1 Add a dev clip to `web/public/dev/` (any short signing clip until the team clip exists); verify it plays in the dev server
- [ ] 3.2 Build `TrackingCheck` component: looped `<video>` with a file picker for other clips, frame loop via `requestVideoFrameCallback` (fallback `requestAnimationFrame`), timestamps from `performance.now()`; verify the page runs for at least 60 seconds across several loop restarts without a timestamp error in the console
- [ ] 3.3 Draw hand, pose, and face landmarks on an aligned canvas with `DrawingUtils`; show the active delegate (GPU or CPU) on the page; verify visually that the skeleton follows the signer and disappears when no person is in frame
- [ ] 3.4 Verify Holistic left/right hand labels against the clip and update the convention note in `types.ts`; verify the note matches what the overlay shows
- [ ] 3.5 Commit `feat(web): add tracking check page with skeleton overlay` and push

## 4. Local-only verification and integration notes

- [ ] 4.1 Verify no third-party requests: open browser dev tools network tab with a production build (`npm run build && npm run preview`) and confirm all requests go to the local host; then go offline and confirm tracking keeps running
- [ ] 4.2 Add a short "Integration" section to `web/README.md` describing the contract for #13 (pass a video element and a timestamp to `detect`), the mirroring note, and what #14 and #16 will consume; verify the described call works by reading the section against `TrackingCheck`
- [ ] 4.3 Commit `docs(web): document tracking integration contract` and push; open a PR from `feat/15-mediapipe-tracking` into `dev` that references issue #15

## Workflow follow-up

- Record the demo clip owner and replace the placeholder clip when the team clip exists.
- Archive the change after the PR is merged and review requirements are satisfied.
- Reconcile `landmark-tracking` with the "Multimodal Tracking and Pruning" requirement in `sign-translation` once #13, #14, and #16 are done.
