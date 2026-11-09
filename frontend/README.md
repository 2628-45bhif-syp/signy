# Signy Frontend

Client-side Progressive Web Application for Austrian Sign Language (ÖGS) translation and multimodal gesture tracking.

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Before starting the Vite dev server, `predev` runs `npm run copy-wasm` to populate `public/mediapipe/wasm/` with the MediaPipe runtime binaries.

### Build & Preview
```bash
npm run build
npm run preview
```

### Running Tests
```bash
npm test
```

---

## Landmark Tracking Architecture (Issue #15)

Signy performs client-side multimodal landmark extraction using MediaPipe Holistic (`@mediapipe/tasks-vision`) with 100% local assets to guarantee GDPR compliance and offline functionality.

### Local Assets
- **Model**: `public/models/holistic_landmarker.task` (~13.7 MB float16 model).
- **WASM**: `public/mediapipe/wasm/` (copied automatically by `scripts/copy-mediapipe-wasm.mjs` during `predev` / `prebuild`).

### Core Modules (`src/tracking/`)
- **`types.ts`**:
  - `TrackingFrame`: Unpruned normalized landmark collections for `face` (478 points), `pose` (33 points), `leftHand` (21 points), `rightHand` (21 points), and 52 facial `blendshapes`.
  - `Tracker`: Interface with `delegate` ('GPU' | 'CPU'), `detect(video, timestampMs)`, and `close()`.
- **`createTracker.ts`**:
  - Asynchronously initializes `HolisticLandmarker` in `VIDEO` mode with `outputFaceBlendshapes: true`.
  - Attempts `GPU` delegate (WebGL/WebGPU) first and automatically falls back to `CPU` if GPU acceleration is unsupported.
- **`drawFrame.ts`**:
  - Renders skeleton lines and landmark points on an HTML `<canvas>` element using MediaPipe's `DrawingUtils`.

### React Integration (`src/hooks/useTracker.ts`)
- Manages tracker lifecycle and frame processing loop via `requestVideoFrameCallback` (with fallback to `requestAnimationFrame`).
- Integrated into `src/components/LiveCamera.tsx` with an aligned overlay canvas, active delegate status badge (`GPU`/`CPU`), and skeleton toggle.

### Downstream Integration Contract
- **Issue #14 (Landmark Pruning)**:
  - Downstream consumers take `TrackingFrame` and prune coordinates down to 42 hand points, 12 upper-body pose points, and 52 blendshapes to produce the system spec's `LandmarkFrame`.
- **Issue #16 (Frame Budget & Performance)**:
  - Measures execution latency of `detect(video, timestampMs)` to optimize towards the <= 26 ms per frame budget at 30 FPS.
