# Spec Delta

## Purpose

Detects hand, pose, and face landmarks with face blendshape scores from a video source on the user's device. It provides the raw per-frame input for sign recognition and facial-grammar classification.

## ADDED Requirements

### Requirement: Per-frame multimodal landmark detection
The system SHALL accept a video frame with a timestamp and return, for that frame, the detected hand landmarks, pose landmarks, face landmarks, and 52 face blendshape scores. The system SHALL return the unpruned result.

#### Scenario: Person visible in frame
- **WHEN** a frame showing a person's upper body, both hands, and face is submitted
- **THEN** the result contains landmarks for both hands, the pose, and the face, plus 52 blendshape scores

#### Scenario: No hands visible
- **WHEN** a frame showing a face but no hands is submitted
- **THEN** the result contains pose and face data, an empty hand set, and no error

#### Scenario: No person visible
- **WHEN** a frame showing no person is submitted
- **THEN** the result is empty for every modality and no error is raised

### Requirement: Hand identification
The system SHALL identify each detected hand as left or right in its result, so that downstream consumers can tell the signer's hands apart.

#### Scenario: Both hands detected
- **WHEN** both hands are visible in a frame
- **THEN** the result labels one hand as left and the other as right

### Requirement: Source-agnostic input
The system SHALL accept any video element as input, regardless of whether it plays a camera stream or a recorded file, and SHALL NOT start or manage camera capture itself.

#### Scenario: Recorded video as input
- **WHEN** the tracking input is a video element playing a recorded file
- **THEN** the system returns landmarks for each submitted frame as it would for a camera stream

### Requirement: Local-only processing
The system SHALL run landmark detection on the user's device and SHALL load its detection models from the application's own files, with no network request to third-party hosts during operation.

#### Scenario: Offline tracking
- **WHEN** the application files are already loaded and the network connection is disabled
- **THEN** landmark detection continues to work

#### Scenario: No third-party requests
- **WHEN** the application starts tracking
- **THEN** no request is sent to a third-party host to fetch models or runtime files

### Requirement: Visual tracking check
The system SHALL display detected landmarks as an overlay aligned with the video image, so that a developer can verify tracking by eye.

#### Scenario: Overlay follows movement
- **WHEN** a hand moves in the video
- **THEN** the overlay for that hand moves with it on the same frame

#### Scenario: Overlay when nothing is detected
- **WHEN** no landmarks are detected for a frame
- **THEN** the overlay shows no landmarks for that frame
