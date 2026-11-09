import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Sign } from '../hooks/useSigns';
import { SignCard } from './SignCard';

const sign: Sign = {
  id: '14806',
  gloss: 'Schule',
  category: 'Alltag',
  video: 'signs/videos/14806.mp4',
  poster: 'signs/posters/14806.webp',
  creator: 'equalizent ST GmbH',
  sourceUrl: 'https://kulturpool.at/en/objects/abc',
  license: 'CC BY-SA 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
};

describe('SignCard', () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(async function (
      this: HTMLMediaElement,
    ) {
      this.dispatchEvent(new Event('play'));
    });
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function (
      this: HTMLMediaElement,
    ) {
      this.dispatchEvent(new Event('pause'));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the word, a lazily loaded video and the attribution links', () => {
    render(<SignCard sign={sign} />);

    expect(screen.getByRole('heading', { name: 'Schule' })).toBeInTheDocument();

    const video = screen.getByLabelText('Video of the sign for Schule');
    expect(video).toHaveAttribute('src', '/signs/videos/14806.mp4');
    expect(video).toHaveAttribute('poster', '/signs/posters/14806.webp');
    expect(video).toHaveAttribute('preload', 'none');

    expect(screen.getByRole('link', { name: 'Source' })).toHaveAttribute('href', sign.sourceUrl);
    expect(screen.getByRole('link', { name: 'CC BY-SA 4.0' })).toHaveAttribute(
      'href',
      sign.licenseUrl,
    );
    expect(screen.getByText(/equalizent ST GmbH/)).toBeInTheDocument();
  });

  it('toggles between play and pause', async () => {
    render(<SignCard sign={sign} />);

    fireEvent.click(screen.getByRole('button', { name: 'Play sign for Schule' }));
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);

    fireEvent.click(await screen.findByRole('button', { name: 'Pause sign for Schule' }));
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(1);

    expect(await screen.findByRole('button', { name: 'Play sign for Schule' })).toBeInTheDocument();
  });

  it('shows a message when the video cannot be played', async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValue(new Error('load failed'));
    render(<SignCard sign={sign} />);

    fireEvent.click(screen.getByRole('button', { name: 'Play sign for Schule' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Video unavailable.');
    });
  });
});
