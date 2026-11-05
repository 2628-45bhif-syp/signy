import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_CAMERA_CONSTRAINTS, useCamera } from './useCamera';

describe('useCamera', () => {
  const stopMock = vi.fn();
  const mockStream = {
    getTracks: () => [{ stop: stopMock }],
  } as unknown as MediaStream;

  beforeEach(() => {
    stopMock.mockReset();
    Object.defineProperty(navigator, 'mediaDevices', {
      writable: true,
      configurable: true,
      value: {
        getUserMedia: vi.fn().mockResolvedValue(mockStream),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('requests 640x480 @ 30fps video without audio and exposes the stream', async () => {
    const { result } = renderHook(() => useCamera());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith(
      DEFAULT_CAMERA_CONSTRAINTS,
    );
    expect(result.current.stream).toBe(mockStream);
    expect(result.current.error).toBeNull();
  });

  it('handles permission denied or unavailable device errors gracefully', async () => {
    vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValueOnce(
      new Error('Permission denied'),
    );

    const { result } = renderHook(() => useCamera());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stream).toBeNull();
    expect(result.current.error).toBe('Permission denied');
  });

  it('stops all active media tracks on unmount', async () => {
    const { result, unmount } = renderHook(() => useCamera());

    await waitFor(() => {
      expect(result.current.stream).toBe(mockStream);
    });

    unmount();

    expect(stopMock).toHaveBeenCalledTimes(1);
  });
});
