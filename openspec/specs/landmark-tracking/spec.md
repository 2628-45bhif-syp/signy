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

### Requirement: Live Head Coordinate Readout
The system SHALL display the real-time normalized `x` and `y` coordinates of the primary head point (nose tip from the detected face mesh) directly below the live camera view, clearly labeled as `Head`, with the vertical axis inverted so `y` increases when the head moves upward and decreases when the head moves downward, and SHALL display `Not detected` whenever no face is visible.

#### Scenario: Live head coordinates displayed when face is visible
- **WHEN** a video frame is processed and face landmarks are detected
- **THEN** the display below the camera labeled `Head` shows the current normalized `x` and inverted `y` (`1 - rawY`) coordinates rounded to two decimal places

#### Scenario: Vertical head movement reflects natural up/down direction
- **WHEN** the signer moves their head upward in the camera frame (decreasing raw MediaPipe `y`)
- **THEN** the displayed `y` coordinate for `Head` increases, and when the signer moves their head downward (increasing raw MediaPipe `y`), the displayed `y` coordinate decreases

#### Scenario: No face visible in camera frame
- **WHEN** a video frame contains no detected face landmarks or tracking has not yet produced a frame
- **THEN** the `Head` readout displays `Not detected` instead of stale or invalid coordinate values

#### Scenario: Head coordinates continue updating when skeleton overlay is hidden
- **WHEN** the user toggles the skeleton overlay off while the camera stream is active
- **THEN** the visual skeleton canvas is hidden while the `Head` coordinate readout below the camera continues updating in real time

### Requirement: Live Hand Coordinate Readout
The system SHALL display, below the live camera image, the x and y coordinates of the wrist landmark of the left hand and of the right hand, each clearly labeled "Left hand" and "Right hand", and SHALL update them with every tracked frame.

#### Scenario: Both hands visible
- **WHEN** tracking produces landmarks for both the left and the right hand
- **THEN** the readout below the camera shows x and y wrist coordinates under the "Left hand" label and under the "Right hand" label

#### Scenario: Hand moves
- **WHEN** a visible hand moves between two tracked frames
- **THEN** the displayed coordinates for that hand change to reflect the new wrist position without user interaction

### Requirement: Upward-Positive Y Axis in Readout
The readout SHALL present y so that a higher hand position yields a higher value, by inverting the raw normalized image y coordinate (displayed y = 1 - raw y), keeping values in the range 0 to 1. The x coordinate SHALL be displayed as the raw normalized value.

#### Scenario: Hand moves up
- **WHEN** a visible hand moves upward in the camera image
- **THEN** its displayed y value increases

#### Scenario: Hand moves down
- **WHEN** a visible hand moves downward in the camera image
- **THEN** its displayed y value decreases

### Requirement: Undetected Hand Indication
For a hand without landmarks in the current frame, the readout SHALL show "Not detected" instead of coordinates and SHALL NOT show stale or invalid values.

#### Scenario: One hand out of view
- **WHEN** tracking produces landmarks for the right hand but none for the left hand
- **THEN** the "Left hand" entry shows "Not detected" and the "Right hand" entry shows its current coordinates

#### Scenario: Hand leaves the frame
- **WHEN** a hand that was previously detected is no longer detected in the latest frame
- **THEN** its entry shows "Not detected" instead of its last known coordinates

#### Scenario: Tracking switched off
- **WHEN** the user disables tracking via the skeleton toggle, or no frame has been tracked yet
- **THEN** both entries show "Not detected" and no previously tracked coordinates remain visible

### Requirement: Local-Only Coordinate Source
The coordinates shown in the readout SHALL come exclusively from the on-device landmark tracking, without sending video frames or landmark data to any external server.

#### Scenario: Readout during live tracking
- **WHEN** the readout updates during live tracking
- **THEN** no network request containing video frames or landmark data is made
