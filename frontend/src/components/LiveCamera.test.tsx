import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LiveCamera } from './LiveCamera';

describe('LiveCamera', () => {
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

  it('renders a 640x480 video element and binds the camera stream', async () => {
    render(<LiveCamera />);

    const video = screen.getByLabelText('Live camera feed') as HTMLVideoElement;
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('width', '640');
    expect(video).toHaveAttribute('height', '480');
    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('playsinline');

    await waitFor(() => {
      expect(video.srcObject).toBe(mockStream);
    });
  });

  it('renders an alert when camera permission fails', async () => {
    vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValueOnce(
      new Error('Permission denied'),
    );

    render(<LiveCamera />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Camera error: Permission denied');
  });
});
