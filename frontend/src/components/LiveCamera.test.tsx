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
    expect(screen.getAllByText('Not detected')).toHaveLength(3);

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

  it('displays "Not detected" for Head when lastFrame is null or face landmarks are empty', async () => {
    const { rerender } = render(<LiveCamera />);

    await waitFor(() => {
      expect(screen.queryByText('Starting camera...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Head')).toBeInTheDocument();
    expect(screen.getAllByText('Not detected')).toHaveLength(3);

    mockUseTracker.mockReturnValue({
      tracker: { delegate: 'GPU', detect: vi.fn(), close: vi.fn() },
      delegate: 'GPU',
      isLoading: false,
      error: null,
      lastFrame: {
        timestampMs: 100,
        face: [],
        blendshapes: [],
        pose: [],
        leftHand: [],
        rightHand: [],
      },
    });

    rerender(<LiveCamera />);
    expect(screen.getAllByText('Not detected')).toHaveLength(3);
  });

  it('displays live Head coordinates with inverted Y axis (moving up increases Y)', async () => {
    mockUseTracker.mockReturnValue({
      tracker: { delegate: 'GPU', detect: vi.fn(), close: vi.fn() },
      delegate: 'GPU',
      isLoading: false,
      error: null,
      lastFrame: {
        timestampMs: 100,
        face: [
          { x: 0.5, y: 0.5, z: 0, visibility: 1 },
          { x: 0.45, y: 0.6, z: 0, visibility: 1 }, // raw y = 0.60 -> inverted Y = 0.40
        ],
        blendshapes: [],
        pose: [],
        leftHand: [],
        rightHand: [],
      },
    });

    const { rerender } = render(<LiveCamera />);

    await waitFor(() => {
      expect(screen.queryByText('Starting camera...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Head')).toBeInTheDocument();
    expect(screen.getByText('X: 0.45, Y: 0.40')).toBeInTheDocument();

    // Move head upward in camera frame (raw y decreases from 0.60 to 0.25 -> displayed Y increases to 0.75)
    mockUseTracker.mockReturnValue({
      tracker: { delegate: 'GPU', detect: vi.fn(), close: vi.fn() },
      delegate: 'GPU',
      isLoading: false,
      error: null,
      lastFrame: {
        timestampMs: 133,
        face: [
          { x: 0.5, y: 0.5, z: 0, visibility: 1 },
          { x: 0.48, y: 0.25, z: 0, visibility: 1 },
        ],
        blendshapes: [],
        pose: [],
        leftHand: [],
        rightHand: [],
      },
    });

    rerender(<LiveCamera />);
    expect(screen.getByText('X: 0.48, Y: 0.75')).toBeInTheDocument();
  });

  it('keeps Head coordinates visible and updating when skeleton overlay is hidden', async () => {
    mockUseTracker.mockReturnValue({
      tracker: { delegate: 'GPU', detect: vi.fn(), close: vi.fn() },
      delegate: 'GPU',
      isLoading: false,
      error: null,
      lastFrame: {
        timestampMs: 200,
        face: [
          { x: 0.5, y: 0.5, z: 0, visibility: 1 },
          { x: 0.52, y: 0.38, z: 0, visibility: 1 },
        ],
        blendshapes: [],
        pose: [],
        leftHand: [],
        rightHand: [],
      },
    });

    render(<LiveCamera />);

    await waitFor(() => {
      expect(screen.queryByText('Starting camera...')).not.toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: /skeleton/i });
    act(() => {
      fireEvent.click(button);
    });

    expect(mockUseTracker).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.anything(),
      { drawSkeleton: false },
    );
    expect(screen.getByText('X: 0.52, Y: 0.62')).toBeInTheDocument();
  });
});
