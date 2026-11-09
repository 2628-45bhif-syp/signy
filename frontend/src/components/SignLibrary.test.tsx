import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SignLibrary } from './SignLibrary';

function sign(id: string, gloss: string, category: string) {
  return {
    id,
    gloss,
    category,
    video: `signs/videos/${id}.mp4`,
    poster: `signs/posters/${id}.webp`,
    creator: 'equalizent ST GmbH',
    sourceUrl: `https://kulturpool.at/en/objects/${id}`,
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  };
}

describe('SignLibrary', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('lists every sign under its category', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          sign('1', 'Was', 'Fragen'),
          sign('2', 'Polizei', 'Notfall'),
          sign('3', 'Wer', 'Fragen'),
        ],
      }),
    );

    render(<SignLibrary />);

    expect(screen.getByRole('heading', { name: 'Sign Library' })).toBeInTheDocument();
    expect(screen.getByText('Loading signs...')).toBeInTheDocument();

    const questions = within(await screen.findByRole('region', { name: 'Fragen' }));
    expect(questions.getByRole('heading', { name: 'Was' })).toBeInTheDocument();
    expect(questions.getByRole('heading', { name: 'Wer' })).toBeInTheDocument();
    expect(questions.queryByRole('heading', { name: 'Polizei' })).not.toBeInTheDocument();

    const emergency = within(screen.getByRole('region', { name: 'Notfall' }));
    expect(emergency.getByRole('heading', { name: 'Polizei' })).toBeInTheDocument();
    expect(screen.queryByText('Loading signs...')).not.toBeInTheDocument();
  });

  it('shows an error when the manifest cannot be loaded', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network down')));

    render(<SignLibrary />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Network down');
    expect(screen.getByRole('heading', { name: 'Sign Library' })).toBeInTheDocument();
  });
});
