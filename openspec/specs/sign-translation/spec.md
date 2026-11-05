# sign-translation Specification

## Purpose

Enables real-time bidirectional translation between Austrian Sign Language (ÖGS) and written/spoken German using simultaneous gesture tracking, non-manual facial marker analysis, pause-based sentence segmentation, and constrained sentence synthesis.

## Requirements

### Requirement: Multimodal Tracking and Pruning
The system SHALL capture video input at a minimum of 30 frames per second at 640x480 resolution and extract essential tracking landmarks while pruning redundant points to reduce compute load by at least 80 percent (retaining 42 hand points, 12 upper-body pose points, and 52 facial blendshape parameters).

#### Scenario: Real-time landmark extraction
- **WHEN** the camera feed provides frames at 30 FPS
- **THEN** the system extracts pruned hand, pose, and blendshape coordinates within 26 ms per frame without dropping frames

### Requirement: Non-Manual Marker Grammatical Classification
The system SHALL evaluate facial blendshapes and head movement to classify grammatical sentence modifiers including affirmative statements, questions (e.g. raised eyebrows), negations (e.g. head shake), and emotional emphasis.

#### Scenario: Question classification via eyebrow movement
- **WHEN** gestures are performed with raised eyebrows
- **THEN** the system tags the active sentence context as an interrogative sentence

#### Scenario: Negation classification via head shake
- **WHEN** gestures are performed accompanied by head shaking
- **THEN** the system tags the active sentence context as a negated sentence

### Requirement: Gesture Activity Detection and Segmentation
The system SHALL buffer recognized sign tokens while gestures are actively performed and trigger sentence completion when a resting pause threshold of approximately 0.8 seconds is detected.

#### Scenario: Sentence completion trigger
- **WHEN** hand movements remain at rest exceeding 0.8 seconds after a sign sequence
- **THEN** the system triggers sentence construction for the buffered token sequence

### Requirement: Constrained German Sentence Synthesis
The system SHALL convert the buffered sign token sequence and grammatical modifiers into a grammatically correct German sentence using constrained decoding (temperature <= 0.2) to prevent invented or hallucinated words.

#### Scenario: Synthesis of question sentence
- **WHEN** token sequence `[DU, MITKOMMEN]` with interrogative modifier is submitted to synthesis
- **THEN** the system outputs the grammatically formatted German question "Kommst du mit?" without hallucinating additional terms

### Requirement: Bidirectional Communication
The system SHALL provide bidirectional exchange by synthesizing spoken audio (TTS) and text display for hearing recipients, while transcribing spoken partner responses via microphone (STT) into readable on-screen text for deaf users.

#### Scenario: Spoken response transcription
- **WHEN** a hearing conversation partner speaks into the microphone
- **THEN** the speech is transcribed into German text and displayed in the user interface for the deaf user

### Requirement: Counter and Partner Form Factors
The system SHALL support both stationary counter mode (hands-free desktop or kiosk mount) and mobile partner mode (device held by hearing conversation partner).

#### Scenario: Mode switching
- **WHEN** the user selects partner mode or counter mode
- **THEN** the user interface and camera orientation adapt to the selected operating layout

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
