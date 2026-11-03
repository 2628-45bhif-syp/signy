import type { HolisticLandmarkerResult } from '@mediapipe/tasks-vision'
import { describe, expect, it } from 'vitest'
import { mapResult } from './mapResult'

const point = (x: number) => ({ x, y: x, z: 0, visibility: 1 })

function result(
  overrides: Partial<HolisticLandmarkerResult> = {},
): HolisticLandmarkerResult {
  return {
    faceLandmarks: [],
    faceBlendshapes: [],
    poseLandmarks: [],
    poseWorldLandmarks: [],
    poseSegmentationMasks: [],
    leftHandLandmarks: [],
    leftHandWorldLandmarks: [],
    rightHandLandmarks: [],
    rightHandWorldLandmarks: [],
    ...overrides,
  }
}

describe('mapResult', () => {
  it('maps a full result unpruned', () => {
    const face = Array.from({ length: 478 }, (_, i) => point(i))
    const pose = Array.from({ length: 33 }, (_, i) => point(i))
    const hand = Array.from({ length: 21 }, (_, i) => point(i))
    const categories = Array.from({ length: 52 }, (_, i) => ({
      index: i,
      score: i / 52,
      categoryName: `shape${i}`,
      displayName: '',
    }))

    const frame = mapResult(
      result({
        faceLandmarks: [face],
        faceBlendshapes: [{ categories, headIndex: 0, headName: '' }],
        poseLandmarks: [pose],
        leftHandLandmarks: [hand],
        rightHandLandmarks: [hand],
      }),
      42,
    )

    expect(frame.timestampMs).toBe(42)
    expect(frame.face).toHaveLength(478)
    expect(frame.blendshapes).toHaveLength(52)
    expect(frame.blendshapes[1]).toEqual({ name: 'shape1', score: 1 / 52 })
    expect(frame.pose).toHaveLength(33)
    expect(frame.leftHand).toHaveLength(21)
    expect(frame.rightHand).toHaveLength(21)
  })

  it('returns an empty hand set when no hands are visible', () => {
    const frame = mapResult(
      result({
        faceLandmarks: [[point(0)]],
        poseLandmarks: [[point(0)]],
      }),
      1,
    )

    expect(frame.face).toHaveLength(1)
    expect(frame.pose).toHaveLength(1)
    expect(frame.leftHand).toEqual([])
    expect(frame.rightHand).toEqual([])
  })

  it('returns empty arrays for every modality when nothing is detected', () => {
    const frame = mapResult(result(), 7)

    expect(frame).toEqual({
      timestampMs: 7,
      face: [],
      blendshapes: [],
      pose: [],
      leftHand: [],
      rightHand: [],
    })
  })
})
