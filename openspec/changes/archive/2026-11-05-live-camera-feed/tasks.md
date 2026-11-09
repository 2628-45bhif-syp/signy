# Tasks

## 1. Frontend Subfolder Scaffolding

- [x] 1.1 Scaffold the Vite + React + TypeScript project inside `frontend/` (with `.gitignore` and test runner setup) and verify `npm install` and `npm run build` succeed in `frontend/`

## 2. WebRTC Camera Hook & Live Video Component

- [x] 2.1 Implement `frontend/src/hooks/useCamera.ts` requesting `navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30 } }, audio: false })` with StrictMode-safe track cleanup, and verify unit tests cover stream initialization, error state, and track stop on unmount
- [x] 2.2 Implement `frontend/src/components/LiveCamera.tsx` and mount it in `frontend/src/App.tsx` with `<video autoPlay playsInline muted />` bound to `useCamera`, and verify component tests and `npm run build` pass without errors
