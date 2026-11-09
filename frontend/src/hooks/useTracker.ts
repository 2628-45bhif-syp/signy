import { useEffect, useState } from 'react';
import { createTracker } from '../tracking/createTracker';
import { drawFrame } from '../tracking/drawFrame';
import type { Tracker, TrackingDelegate, TrackingFrame } from '../tracking/types';

export interface UseTrackerOptions {
  enabled?: boolean;
}

export interface UseTrackerResult {
  tracker: Tracker | null;
  delegate: TrackingDelegate | null;
  isLoading: boolean;
  error: string | null;
  lastFrame: TrackingFrame | null;
}

export function useTracker(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: UseTrackerOptions = {},
): UseTrackerResult {
  const { enabled = true } = options;
  const [tracker, setTracker] = useState<Tracker | null>(null);
  const [delegate, setDelegate] = useState<TrackingDelegate | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFrame, setLastFrame] = useState<TrackingFrame | null>(null);

  useEffect(() => {
    let cancelled = false;
    let created: Tracker | null = null;

    setIsLoading(true);
    setError(null);

    createTracker().then(
      (t) => {
        if (cancelled) {
          t.close();
        } else {
          created = t;
          setTracker(t);
          setDelegate(t.delegate);
          setIsLoading(false);
        }
      },
      (err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setIsLoading(false);
        }
      },
    );

    return () => {
      cancelled = true;
      created?.close();
      setTracker(null);
      setDelegate(null);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!enabled || !tracker || !video || !canvas) {
      if (canvas) {
        drawFrame(canvas, null);
      }
      return;
    }

    let stopped = false;
    let handle = 0;
    let lastTimestamp = -1;
    const useVideoFrames =
      'requestVideoFrameCallback' in video &&
      typeof (video as HTMLVideoElement & { requestVideoFrameCallback?: unknown })
        .requestVideoFrameCallback === 'function';

    const tick = () => {
      if (stopped) return;

      const timestamp = performance.now();
      if (video.readyState >= 2 && video.videoWidth > 0 && timestamp > lastTimestamp) {
        lastTimestamp = timestamp;
        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth;
        }
        if (canvas.height !== video.videoHeight) {
          canvas.height = video.videoHeight;
        }

        const frame = tracker.detect(video, timestamp);
        setLastFrame(frame);
        drawFrame(canvas, frame);
      }

      schedule();
    };

    const schedule = () => {
      if (stopped) return;
      if (useVideoFrames) {
        handle = (
          video as HTMLVideoElement & {
            requestVideoFrameCallback: (callback: () => void) => number;
          }
        ).requestVideoFrameCallback(tick);
      } else {
        handle = requestAnimationFrame(tick);
      }
    };

    schedule();

    return () => {
      stopped = true;
      if (useVideoFrames) {
        (
          video as HTMLVideoElement & {
            cancelVideoFrameCallback: (id: number) => void;
          }
        ).cancelVideoFrameCallback(handle);
      } else {
        cancelAnimationFrame(handle);
      }
      drawFrame(canvas, null);
    };
  }, [enabled, tracker, videoRef, canvasRef]);

  return { tracker, delegate, isLoading, error, lastFrame };
}
