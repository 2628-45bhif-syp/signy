import type { HolisticLandmarkerResult } from '@mediapipe/tasks-vision';
import type { TrackingFrame } from './types';

/** Convert a raw Holistic result into a TrackingFrame. */
export function mapResult(
  result: HolisticLandmarkerResult,
  timestampMs: number,
): TrackingFrame {
  return {
    timestampMs,
    face: result.faceLandmarks[0] ?? [],
    blendshapes: (result.faceBlendshapes[0]?.categories ?? []).map((c) => ({
      name: c.categoryName,
      score: c.score,
    })),
    pose: result.poseLandmarks[0] ?? [],
    leftHand: result.leftHandLandmarks[0] ?? [],
    rightHand: result.rightHandLandmarks[0] ?? [],
  };
}
