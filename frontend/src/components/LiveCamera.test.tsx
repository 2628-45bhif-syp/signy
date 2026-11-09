import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LiveCamera } from './LiveCamera';

const mockUseTracker = vi.fn().mockReturnValue({
  tracker: {
    delegate: 'GPU',
    detect: vi.fn(),
    close: vi.fn(),
  },
  delegate: 'GPU',
  isLoading: false,
  error: null,
  lastFrame: null,
});

vi.mock('../hooks/useTracker', () => ({
  useTracker: (...args: unknown[]) => mockUseTracker(...args),
}));

describe('LiveCamera', () => {
  const stopMock = vi.fn();
  const mockStream = {
    getTracks: () => [{ stop: stopMock }],
  } as unknown as MediaStream;

  beforeEach(() => {
    stopMock.mockReset();
    mockUseTracker.mockReturnValue({
      tracker: {
        delegate: 'GPU',
        detect: vi.fn(),
        close: vi.fn(),
      },
      delegate: 'GPU',
      isLoading: false,
      error: null,
      lastFrame: null,
    });
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

  it('renders tracking overlay canvas and compute delegate badge', async () => {
    render(<LiveCamera />);

    const canvas = screen.getByLabelText('Tracking landmark overlay');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('width', '640');
    expect(canvas).toHaveAttribute('height', '480');

    expect(screen.getByText('GPU')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Starting camera...')).not.toBeInTheDocument();
    });
  });

  it('toggles skeleton overlay visibility on button click', async () => {
    render(<LiveCamera />);

    await waitFor(() => {
      expect(screen.queryByText('Starting camera...')).not.toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: /skeleton/i });
    expect(button).toHaveTextContent('Hide Skeleton');
    expect(button).toHaveAttribute('aria-pressed', 'true');

    act(() => {
      fireEvent.click(button);
    });

    expect(button).toHaveTextContent('Show Skeleton');
    expect(button).toHaveAttribute('aria-pressed', 'false');

    const canvas = screen.getByLabelText('Tracking landmark overlay');
    expect(canvas).toHaveStyle({ display: 'none' });
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
