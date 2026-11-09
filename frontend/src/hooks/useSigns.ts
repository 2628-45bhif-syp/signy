import { useEffect, useState } from 'react';

export interface Sign {
  id: string;
  gloss: string;
  category: string;
  video: string;
  poster: string;
  creator: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
}

export interface UseSignsResult {
  signs: Sign[];
  error: string | null;
  isLoading: boolean;
}

export function useSigns(): UseSignsResult {
  const [signs, setSigns] = useState<Sign[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSigns() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}signs/signs.json`);
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}.`);
        }
        const data: unknown = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('The sign list has an invalid format.');
        }
        if (!cancelled) {
          setSigns(data as Sign[]);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load the sign list.');
          setIsLoading(false);
        }
      }
    }

    loadSigns();

    return () => {
      cancelled = true;
    };
  }, []);

  return { signs, error, isLoading };
}
