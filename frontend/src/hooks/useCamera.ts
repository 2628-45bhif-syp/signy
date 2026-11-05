import { useEffect, useRef, useState } from 'react';

export const DEFAULT_CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    width: { ideal: 640 },
    height: { ideal: 480 },
    frameRate: { ideal: 30 },
  },
  audio: false,
};

export interface UseCameraResult {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  error: string | null;
  isLoading: boolean;
}

export function useCamera(
  constraints: MediaStreamConstraints = DEFAULT_CAMERA_CONSTRAINTS,
): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    let activeStream: MediaStream | null = null;

    async function startCamera() {
      setIsLoading(true);
      setError(null);

      if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
        if (!cancelled) {
          setError('Camera API is not available in this browser.');
          setIsLoading(false);
        }
        return;
      }

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (cancelled) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setIsLoading(false);
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Unable to access camera stream.';
          setError(message);
          setIsLoading(false);
        }
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [constraints]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return { videoRef, stream, error, isLoading };
}
