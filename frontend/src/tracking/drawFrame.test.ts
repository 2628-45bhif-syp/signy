import { beforeEach, describe, expect, it, vi } from 'vitest';
import { drawFrame } from './drawFrame';
import type { TrackingFrame } from './types';

const mockDrawConnectors = vi.fn();
const mockDrawLandmarks = vi.fn();

vi.mock('@mediapipe/tasks-vision', () => {
  return {
    DrawingUtils: class {
      drawConnectors = mockDrawConnectors;
      drawLandmarks = mockDrawLandmarks;
    },
    HolisticLandmarker: {
      FACE_LANDMARKS_CONTOURS: [{ start: 0, end: 1 }],
      POSE_CONNECTIONS: [{ start: 1, end: 2 }],
      HAND_CONNECTIONS: [{ start: 2, end: 3 }],
    },
  };
});

describe('drawFrame', () => {
  let canvas: HTMLCanvasElement;
  let mockClearRect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClearRect = vi.fn();
    canvas = {
      width: 640,
      height: 480,
      getContext: vi.fn().mockReturnValue({
        clearRect: mockClearRect,
      }),
    } as unknown as HTMLCanvasElement;
  });

  it('clears canvas when frame is null', () => {
    drawFrame(canvas, null);
    expect(mockClearRect).toHaveBeenCalledWith(0, 0, 640, 480);
    expect(mockDrawConnectors).not.toHaveBeenCalled();
    expect(mockDrawLandmarks).not.toHaveBeenCalled();
  });

  it('renders face, pose, and hand landmarks onto canvas', () => {
    const frame: TrackingFrame = {
      timestampMs: 1234,
      face: [{ x: 0.5, y: 0.5, z: 0, visibility: 1 }],
      blendshapes: [],
      pose: [{ x: 0.4, y: 0.4, z: 0, visibility: 1 }],
      leftHand: [{ x: 0.2, y: 0.2, z: 0, visibility: 1 }],
      rightHand: [{ x: 0.8, y: 0.8, z: 0, visibility: 1 }],
    };

    drawFrame(canvas, frame);

    expect(mockClearRect).toHaveBeenCalledWith(0, 0, 640, 480);
    // Face contours, pose connectors, left hand connectors, right hand connectors = 4 calls
    expect(mockDrawConnectors).toHaveBeenCalledTimes(4);
    // Pose landmarks, left hand landmarks, right hand landmarks = 3 calls
    expect(mockDrawLandmarks).toHaveBeenCalledTimes(3);
  });
});
