# Spec Delta

## ADDED Requirements

### Requirement: Live WebRTC Camera Feed
The system SHALL capture a live local video stream in the browser via the WebRTC Media Capture and Streams API (`navigator.mediaDevices.getUserMedia`) requested at 640x480 resolution and 30 frames per second without audio, render the live feed continuously on screen, and release active media tracks when the camera view is unmounted.

#### Scenario: Successful live camera stream initialization
- **WHEN** the user opens the camera view and grants browser camera permission
- **THEN** the system acquires a 640x480 @ 30 FPS video stream and displays the live camera feed continuously in the browser without uploading video frames to an external server

#### Scenario: Camera permission denied or device unavailable
- **WHEN** camera permission is denied or no compatible video input device is available
- **THEN** the system handles the error gracefully and surfaces a clear status message without crashing the application

#### Scenario: Stream cleanup on component unmount
- **WHEN** the camera view is unmounted or closed
- **THEN** the system stops all active `MediaStreamTrack` instances to release the hardware camera indicator
