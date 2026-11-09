import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useSigns } from './useSigns';

function stubFetch(response: Partial<Response>) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
}

describe('useSigns', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the signs from the manifest', async () => {
    const signs = [{ id: '1', gloss: 'Schule' }];
    stubFetch({ ok: true, json: async () => signs });

    const { result } = renderHook(() => useSigns());

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.signs).toEqual(signs);
    expect(result.current.error).toBeNull();
    expect(fetch).toHaveBeenCalledWith('/signs/signs.json');
  });

  it('reports an error for a non-OK response', async () => {
    stubFetch({ ok: false, status: 404 });

    const { result } = renderHook(() => useSigns());

    await waitFor(() => expect(result.current.error).toMatch(/404/));
    expect(result.current.signs).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('reports an error for a non-array body', async () => {
    stubFetch({ ok: true, json: async () => ({ signs: [] }) });

    const { result } = renderHook(() => useSigns());

    await waitFor(() => expect(result.current.error).toMatch(/invalid format/));
    expect(result.current.signs).toEqual([]);
  });
});
