# Spec Delta

## ADDED Requirements

### Requirement: Frame Processing Budget Under 33 ms
The system SHALL benchmark single-frame landmark tracking and rendering across 640x480 video input — measuring MediaPipe Holistic inference, result mapping, head and hand coordinate extraction, and skeleton overlay drawing — and SHALL complete application frame processing (result mapping, coordinate extraction, and skeleton overlay rendering) with a 95th-percentile (`p95`) duration strictly below 33 ms per frame (30 FPS) after initial model warm-up.

#### Scenario: Pipeline benchmark against 640x480 sign video frames
- **WHEN** a sequence of 640x480 video frames containing a visible signer is processed through the full tracking pipeline after warm-up frames
- **THEN** each pipeline stage (inference, result mapping and coordinate selection, and canvas overlay drawing) is measured and the 95th-percentile frame processing duration of the mapping, coordinate extraction, and rendering stages is strictly less than 33 ms

#### Scenario: Stage-by-stage timing breakdown
- **WHEN** the frame processing performance benchmark runs
- **THEN** the benchmark records and outputs separate timing metrics (including minimum, average, median, 95th-percentile, and maximum duration in milliseconds, plus `< 33 ms` pass/warn status) for landmark inference, result mapping/coordinate extraction, skeleton canvas rendering, combined application processing, and total per-frame execution
