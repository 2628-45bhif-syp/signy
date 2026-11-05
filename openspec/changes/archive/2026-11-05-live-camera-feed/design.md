# Design

## Context

The repository currently contains specification documents (`docs/`, `openspec/`) and the pitch presentation (`pitch/`), with no application source code yet. See `proposal.md` for motivation around Sub-Issue #13 (WebRTC live image in the web app).

## Goals / Non-Goals

**Goals:**
- Establish a clean, modular subfolder layout (`frontend/`) suitable for a 1.5-year project where frontend PWA code and future offline Python ML pipelines (`ml/`) coexist cleanly.
- Acquire and display a low-latency 640x480 @ 30 FPS camera stream in the browser using native WebRTC media capture (`getUserMedia`).
- Keep video rendering outside React's render cycle via `useRef<HTMLVideoElement>` so downstream MediaPipe frame processing (Sub-Issue #15) can read frames directly without React re-render overhead.

**Non-Goals:**
- MediaPipe landmark extraction and pruning (deferred to Sub-Issue #15).
- Camera switching UI, FPS overlay widgets, or full layout chrome (deferred to subsequent UI sessions).
- Peer-to-peer network streaming (`RTCPeerConnection`), as all computer vision runs client-side on the edge for GDPR compliance and sub-33 ms frame latency.

## Decisions

### 1. Subfolder Architecture (`frontend/`)
- **Decision**: Place the Vite + React + TypeScript application inside `/frontend`.
- **Rationale**: Keeps root-level configuration minimal and isolates Node/TypeScript dependencies from upcoming Python dataset recording and training scripts (Milestone 4).
- **Alternatives Considered**: Root-level `package.json` — rejected because mixing Python virtual environments, dataset tooling, and frontend build configs in the repository root creates clutter over a multi-semester project.

### 2. Native `navigator.mediaDevices.getUserMedia` over Wrapper Libraries
- **Decision**: Use a lightweight custom React hook (`useCamera`) calling `navigator.mediaDevices.getUserMedia` directly and binding `srcObject` to a `HTMLVideoElement` ref.
- **Rationale**: Zero third-party webcam wrapper overhead, full control over `MediaStreamConstraints` (`width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30 }, audio: false`), deterministic track cleanup on unmount, and direct access to the underlying `HTMLVideoElement` needed by `@mediapipe/tasks-vision`.
- **Alternatives Considered**: `react-webcam` — rejected because it adds an unnecessary dependency for a straightforward DOM API and complicates direct video element lifecycle handoff to MediaPipe.

### 3. Resolution and Frame Rate (`640x480 @ 30 FPS`)
- **Decision**: Constrain video capture to `640x480` (4:3 VGA) at `30 FPS`.
- **Rationale**:
  - MediaPipe's internal landmark models downsample inputs to `256x256` / `192x192`; capturing 1080p processes 6.75x more pixels per frame with zero accuracy benefit while risking GPU/thermal throttling on mobile devices.
  - 4:3 aspect ratio provides taller vertical framing than 16:9, capturing both the signer's face (eyebrows/head movement for non-manual grammar markers) and upper-body signing space.
  - 30 FPS provides a 33.3 ms frame window, aligning with the system specification's ~26 ms processing target (~2 ms capture, ~13 ms MediaPipe tracking, ~1 ms pruning, ~4 ms inference, ~6 ms UI).

## Risks / Trade-offs

- **[Browser Constraint Negotiation]** Some hardware webcams may not support exact `640x480` or `30 FPS` if specified with `exact` constraints → **Mitigation**: Use `{ ideal: 640 }`, `{ ideal: 480 }`, and `{ ideal: 30 }` in `MediaTrackConstraints` so the browser selects the closest supported mode without throwing `OverconstrainedError`.
- **[Autoplay Policy Blocking Video Playback]** Mobile browsers (iOS Safari, Android Chrome) block unmuted or non-inline `<video>` autoplay → **Mitigation**: Always set `autoPlay`, `playsInline`, and `muted` attributes on the `<video>` element and request `audio: false` in `getUserMedia`.
- **[React StrictMode Double Mount]** React 19 StrictMode mounts, unmounts, and remounts components in development, which can race async `getUserMedia` calls → **Mitigation**: Track a `cancelled` flag inside the `useEffect` cleanup function and immediately stop tracks if `getUserMedia` resolves after unmount.
