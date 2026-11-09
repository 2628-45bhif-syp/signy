import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('App UI navigation', () => {
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
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('shows the Camera / Translator view by default and switches to the Library view via navigation buttons', async () => {
    render(<App />);

    const translatorBtn = screen.getByRole('button', { name: /translator/i });
    const libraryBtn = screen.getByRole('button', { name: /library/i });

    expect(translatorBtn).toHaveAttribute('aria-pressed', 'true');
    expect(libraryBtn).toHaveAttribute('aria-pressed', 'false');

    const video = screen.getByLabelText('Live camera feed') as HTMLVideoElement;
    await waitFor(() => {
      expect(video.srcObject).toBe(mockStream);
    });

    fireEvent.click(libraryBtn);

    expect(libraryBtn).toHaveAttribute('aria-pressed', 'true');
    expect(translatorBtn).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('heading', { name: 'Sign Library' })).toBeInTheDocument();

    fireEvent.click(translatorBtn);

    expect(translatorBtn).toHaveAttribute('aria-pressed', 'true');
    const remountedVideo = screen.getByLabelText('Live camera feed') as HTMLVideoElement;
    await waitFor(() => {
      expect(remountedVideo.srcObject).toBe(mockStream);
    });
  });
});
