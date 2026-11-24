# Spec Delta

## ADDED Requirements

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
