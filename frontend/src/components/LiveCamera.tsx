import { useCamera } from '../hooks/useCamera';

export function LiveCamera() {
  const { videoRef, error, isLoading } = useCamera();

  if (error) {
    return (
      <p role="alert" className="camera-alert">
        Camera error: {error}
      </p>
    );
  }

  return (
    <div className="camera-video-wrapper">
      {isLoading && <p className="camera-status-overlay">Starting camera...</p>}
      <video
        ref={videoRef}
        className="camera-video"
        width={640}
        height={480}
        autoPlay
        playsInline
        muted
        aria-label="Live camera feed"
      />
    </div>
  );
}
