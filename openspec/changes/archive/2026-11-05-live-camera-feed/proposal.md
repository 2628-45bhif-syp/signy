# Proposal

## Why

Issue #1 (Sub-Issue #13) requires capturing and displaying a real-time camera feed in the web application as the foundational step of the Signy media pipeline. Without a low-latency, locally processed 640x480 @ 30 FPS WebRTC camera stream in the browser, downstream MediaPipe landmark tracking (Sub-Issue #15) and real-time Austrian Sign Language (ÖGS) translation cannot operate within the 33 ms frame budget.

## What Changes

- Scaffold a dedicated `frontend/` subfolder containing a Vite + React + TypeScript application to keep the repository organized for long-term multi-component development.
- Implement a WebRTC media capture hook (`useCamera`) using `navigator.mediaDevices.getUserMedia` configured for `640x480` resolution at `30 FPS` (`audio: false`).
- Create a minimal `LiveCamera` component that binds the `MediaStream` to an HTML5 `<video autoPlay playsInline muted />` element with proper stream lifecycle cleanup on unmount.
- Exclude extra UI controls, overlays, or MediaPipe inference in this change to stay strictly focused on Sub-Issue #13.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `sign-translation`: Add explicit requirement and scenario for browser-based WebRTC (`getUserMedia`) live video capture and rendering at 640x480 @ 30 FPS with local stream lifecycle management.

## Impact

- **New Directory**: `frontend/` (Vite, React, TypeScript project configuration and source files).
- **APIs Used**: Browser WebRTC Media Capture and Streams API (`navigator.mediaDevices.getUserMedia`).
- **Downstream Readiness**: Exposes the live `HTMLVideoElement` reference required by Sub-Issue #15 (MediaPipe Tasks Vision landmark tracking).
