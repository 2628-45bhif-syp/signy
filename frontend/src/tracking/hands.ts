import type { TrackingFrame } from './types';

/** MediaPipe face landmark index of the nose tip. */
export const NOSE_TIP = 1;

/** MediaPipe hand landmark index of the wrist. */
export const WRIST = 0;

export type HandSide = 'left' | 'right';

/** 2D point with x as reported (0..1) and y inverted so that up = higher (0..1). */
export interface HandPoint {
  x: number;
  y: number;
}

/**
 * Nose-tip position of the head, or null if the frame or face is missing.
 * Raw MediaPipe y grows downward; it is inverted here (1 - y).
 */
export function selectHeadPoint(frame: TrackingFrame | null): HandPoint | null {
  const point = frame?.face?.[NOSE_TIP];
  if (!point) return null;
  return { x: point.x, y: 1 - point.y };
}

/**
 * Wrist position of one hand, or null if the frame or hand is missing.
 * Raw MediaPipe y grows downward; it is inverted here (1 - y).
 */
export function selectHandPoint(frame: TrackingFrame | null, side: HandSide): HandPoint | null {
  const hand = side === 'left' ? frame?.leftHand : frame?.rightHand;
  const point = hand?.[WRIST];
  if (!point) return null;
  return { x: point.x, y: 1 - point.y };
}
