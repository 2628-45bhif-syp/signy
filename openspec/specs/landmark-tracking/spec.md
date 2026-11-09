# landmark-tracking Specification

## Purpose

Enables local, client-side extraction of multimodal landmarks (hands, pose, and face) and facial blendshapes from video feeds in real time, providing visual feedback via an aligned canvas overlay.

## Requirements

### Requirement: Multimodal Landmark Extraction
The system SHALL process incoming video frames and extract normalized coordinates for left hand (21 landmarks), right hand (21 landmarks), pose landmarks, face mesh, and 52 facial blendshape coefficients using a locally hosted MediaPipe Holistic landmarker model without making any external network requests.

#### Scenario: Full landmark detection from video frame
- **WHEN** a video frame containing a visible signer is passed to the tracker
- **THEN** the system returns a tracking frame containing timestamps, 52 blendshape scores, pose landmarks, and separated left and right hand landmarks

#### Scenario: Partial person in frame with hands occluded
- **WHEN** a video frame contains a signer whose hands are out of the camera view
- **THEN** the system returns empty collections for the occluded hands while continuing to extract face blendshapes and visible pose landmarks without throwing an error

#### Scenario: No person in frame
- **WHEN** a video frame contains no human subject
- **THEN** the system returns empty landmark collections for face, pose, and hands without crashing

### Requirement: Local Inference and Execution Fallback
The system SHALL execute landmark tracking entirely on the client device using locally served WASM binaries and model assets, attempting GPU acceleration first and falling back to CPU execution if GPU initialization fails, exposing the active execution delegate.

#### Scenario: GPU acceleration initialization
- **WHEN** the browser and hardware support WebGL or WebGPU acceleration for MediaPipe
- **THEN** the tracker initializes with the GPU delegate and indicates active GPU execution

#### Scenario: Fallback to CPU when GPU unavailable
- **WHEN** GPU initialization fails or WebGL/WebGPU is unsupported
- **THEN** the tracker falls back gracefully to the CPU delegate and indicates CPU execution

### Requirement: Visual Skeleton Overlay
The system SHALL render detected hand connections, upper-body pose lines, and face landmarks onto an HTML canvas element matched in dimensions to the video source.

#### Scenario: Render skeleton overlay on active video stream
- **WHEN** landmark tracking produces valid landmarks for an active video frame
- **THEN** the system renders the connected skeleton overlay onto the aligned canvas in synchronization with the video

#### Scenario: Clear overlay when no landmarks are detected
- **WHEN** tracking produces no detected landmarks or the video stream stops
- **THEN** the system clears the overlay canvas so no stale skeleton artifacts remain
