import type { HolisticLandmarkerResult } from '@mediapipe/tasks-vision';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mapResult } from './mapResult';

const point = (x: number) => ({ x, y: x, z: 0, visibility: 1 });

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
  };
}

const mockDetect = vi.fn();
const mockClose = vi.fn();
let mockFailGpu = false;

vi.mock('@mediapipe/tasks-vision', () => ({
  FilesetResolver: {
    forVisionTasks: vi.fn().mockResolvedValue({}),
  },
  HolisticLandmarker: {
    createFromOptions: vi.fn().mockImplementation((_fileset, options) => {
      if (options.baseOptions.delegate === 'GPU' && mockFailGpu) {
        return Promise.reject(new Error('WebGL not supported'));
      }
      return Promise.resolve({
        detectForVideo: mockDetect,
        close: mockClose,
      });
    }),
  },
}));

describe('mapResult', () => {
  it('maps a full result unpruned', () => {
    const face = Array.from({ length: 478 }, (_, i) => point(i));
    const pose = Array.from({ length: 33 }, (_, i) => point(i));
    const hand = Array.from({ length: 21 }, (_, i) => point(i));
    const categories = Array.from({ length: 52 }, (_, i) => ({
      index: i,
      score: i / 52,
      categoryName: `shape${i}`,
      displayName: '',
    }));

    const frame = mapResult(
      result({
        faceLandmarks: [face],
        faceBlendshapes: [{ categories, headIndex: 0, headName: '' }],
        poseLandmarks: [pose],
        leftHandLandmarks: [hand],
        rightHandLandmarks: [hand],
      }),
      42,
    );

    expect(frame.timestampMs).toBe(42);
    expect(frame.face).toHaveLength(478);
    expect(frame.blendshapes).toHaveLength(52);
    expect(frame.blendshapes[1]).toEqual({ name: 'shape1', score: 1 / 52 });
    expect(frame.pose).toHaveLength(33);
    expect(frame.leftHand).toHaveLength(21);
    expect(frame.rightHand).toHaveLength(21);
  });

  it('returns an empty hand set when no hands are visible', () => {
    const frame = mapResult(
      result({
        faceLandmarks: [[point(0)]],
        poseLandmarks: [[point(0)]],
      }),
      1,
    );

    expect(frame.face).toHaveLength(1);
    expect(frame.pose).toHaveLength(1);
    expect(frame.leftHand).toEqual([]);
    expect(frame.rightHand).toEqual([]);
  });

  it('returns empty arrays for every modality when nothing is detected', () => {
    const frame = mapResult(result(), 7);

    expect(frame).toEqual({
      timestampMs: 7,
      face: [],
      blendshapes: [],
      pose: [],
      leftHand: [],
      rightHand: [],
    });
  });
});

describe('createTracker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFailGpu = false;
  });

  it('initializes GPU tracker if supported and detects frames', async () => {
    mockDetect.mockReturnValue(result({ faceLandmarks: [[point(1)]] }));

    const { createTracker } = await import('./createTracker');
    const tracker = await createTracker();

    expect(tracker.delegate).toBe('GPU');

    const video = document.createElement('video');
    const frame = tracker.detect(video, 100);

    expect(mockDetect).toHaveBeenCalledWith(video, 100);
    expect(frame.timestampMs).toBe(100);
    expect(frame.face).toHaveLength(1);

    tracker.close();
    expect(mockClose).toHaveBeenCalled();
  });

  it('falls back to CPU delegate when GPU initialization fails', async () => {
    mockFailGpu = true;
    mockDetect.mockReturnValue(result());

    const { createTracker } = await import('./createTracker');
    const tracker = await createTracker();

    expect(tracker.delegate).toBe('CPU');

    const video = document.createElement('video');
    const frame = tracker.detect(video, 200);

    expect(mockDetect).toHaveBeenCalledWith(video, 200);
    expect(frame.timestampMs).toBe(200);

    tracker.close();
    expect(mockClose).toHaveBeenCalled();
  });
});
