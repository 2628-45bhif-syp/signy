# Spec Delta

## ADDED Requirements

### Requirement: Live Head Coordinate Readout
The system SHALL display the real-time normalized `x` and `y` coordinates of the primary head point (nose tip from the detected face mesh) directly below the live camera view, clearly labeled as `Head`, with the vertical axis inverted so `y` increases when the head moves upward and decreases when the head moves downward, and SHALL display `Not detected` whenever no face is visible.

#### Scenario: Live head coordinates displayed when face is visible
- **WHEN** a video frame is processed and face landmarks are detected
- **THEN** the display below the camera labeled `Head` shows the current normalized `x` and inverted `y` (`1 - rawY`) coordinates rounded to two decimal places (e.g., `X: 0.50, Y: 0.62`)

#### Scenario: Vertical head movement reflects natural up/down direction
- **WHEN** the signer moves their head upward in the camera frame (decreasing raw MediaPipe `y`)
- **THEN** the displayed `y` coordinate for `Head` increases, and when the signer moves their head downward (increasing raw MediaPipe `y`), the displayed `y` coordinate decreases

#### Scenario: No face visible in camera frame
- **WHEN** a video frame contains no detected face landmarks or tracking has not yet produced a frame
- **THEN** the `Head` readout displays `Not detected` instead of stale or invalid coordinate values

#### Scenario: Head coordinates continue updating when skeleton overlay is hidden
- **WHEN** the user toggles the skeleton overlay off while the camera stream is active
- **THEN** the visual skeleton canvas is hidden while the `Head` coordinate readout below the camera continues updating in real time
