import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Tracker, TrackingFrame } from '../tracking/types';
import { useTracker } from './useTracker';

const mockClose = vi.fn();
const mockDetect = vi.fn();
const mockDrawFrame = vi.fn();

let mockTrackerInstance: Tracker = {
  delegate: 'GPU',
  detect: mockDetect,
  close: mockClose,
};

let shouldFailCreate = false;

vi.mock('../tracking/createTracker', () => ({
  createTracker: vi.fn().mockImplementation(() => {
    if (shouldFailCreate) {
      return Promise.reject(new Error('Tracker creation failed'));
    }
    return Promise.resolve(mockTrackerInstance);
  }),
}));

vi.mock('../tracking/drawFrame', () => ({
  drawFrame: vi.fn((canvas, frame) => mockDrawFrame(canvas, frame)),
}));

describe('useTracker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    shouldFailCreate = false;
    mockTrackerInstance = {
      delegate: 'GPU',
      detect: mockDetect,
      close: mockClose,
    };
  });

  it('initializes tracker and provides delegate information', async () => {
    const videoRef = { current: document.createElement('video') };
    const canvasRef = { current: document.createElement('canvas') };

    const { result } = renderHook(() => useTracker(videoRef, canvasRef));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.tracker).toBeNull();

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.delegate).toBe('GPU');
    expect(result.current.tracker).toBe(mockTrackerInstance);
    expect(result.current.error).toBeNull();
  });

  it('handles creation errors gracefully', async () => {
    shouldFailCreate = true;
    const videoRef = { current: null };
    const canvasRef = { current: null };

    const { result } = renderHook(() => useTracker(videoRef, canvasRef));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Tracker creation failed');
    expect(result.current.tracker).toBeNull();
  });

  it('runs detection and renders frames when video is ready', async () => {
    const video = document.createElement('video');
    Object.defineProperty(video, 'readyState', { value: 4, configurable: true });
    Object.defineProperty(video, 'videoWidth', { value: 640, configurable: true });
    Object.defineProperty(video, 'videoHeight', { value: 480, configurable: true });

    const canvas = document.createElement('canvas');
    const videoRef = { current: video };
    const canvasRef = { current: canvas };

    const fakeFrame: TrackingFrame = {
      timestampMs: 123,
      face: [],
      blendshapes: [],
      pose: [],
      leftHand: [],
      rightHand: [],
    };
    mockDetect.mockReturnValue(fakeFrame);

    let frameCallback: FrameRequestCallback | null = null;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      frameCallback = cb;
      return 1;
    });

    const { result } = renderHook(() => useTracker(videoRef, canvasRef));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.tracker).toBe(mockTrackerInstance);

    act(() => {
      frameCallback?.(100);
    });

    expect(mockDetect).toHaveBeenCalledWith(video, expect.any(Number));
    expect(mockDrawFrame).toHaveBeenCalledWith(canvas, fakeFrame);
    expect(result.current.lastFrame).toBe(fakeFrame);
  });

  it('closes tracker on unmount', async () => {
    const videoRef = { current: null };
    const canvasRef = { current: null };

    const { unmount } = renderHook(() => useTracker(videoRef, canvasRef));

    await act(async () => {
      await Promise.resolve();
    });

    unmount();
    expect(mockClose).toHaveBeenCalled();
  });
});
