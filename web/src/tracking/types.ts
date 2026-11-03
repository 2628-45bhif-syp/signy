import type { NormalizedLandmark } from '@mediapipe/tasks-vision'

export type Landmark = NormalizedLandmark

export interface Blendshape {
  name: string
  score: number
}

/**
 * Raw, unpruned tracking result for one video frame (issue #15).
 *
 * Landmark coordinates are normalized to the frame (x, y in 0..1, z relative).
 * A modality that was not detected is an empty array.
 *
 * Pruning to 42 / 12 / 52 values and the `LandmarkFrame` type from the system
 * spec belong to issue #14 and are built from this type.
 *
 * Hand convention: `leftHand` / `rightHand` are the labels reported by the
 * MediaPipe Holistic model for the image as it is submitted (no mirroring).
 */
export interface TrackingFrame {
  timestampMs: number
  /** 478 face landmarks, or empty. */
  face: Landmark[]
  /** 52 face blendshape scores, or empty. */
  blendshapes: Blendshape[]
  /** 33 pose landmarks, or empty. */
  pose: Landmark[]
  /** 21 hand landmarks, or empty. */
  leftHand: Landmark[]
  /** 21 hand landmarks, or empty. */
  rightHand: Landmark[]
}

export type TrackingDelegate = 'GPU' | 'CPU'

export interface Tracker {
  /** Delegate that is actually running inference. */
  readonly delegate: TrackingDelegate
  /**
   * Detect landmarks in one video frame. `timestampMs` must strictly increase
   * between calls (use `performance.now()`).
   */
  detect(video: HTMLVideoElement, timestampMs: number): TrackingFrame
  close(): void
}
