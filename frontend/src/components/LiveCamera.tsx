import { useCamera } from '../hooks/useCamera';

export function LiveCamera() {
  const { videoRef, error, isLoading } = useCamera();

  if (error) {
    return <p role="alert">Camera error: {error}</p>;
  }

  return (
    <div>
      {isLoading && <p>Starting camera...</p>}
      <video
        ref={videoRef}
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
