import { useRef, useState } from 'react';
import { useCamera } from '../hooks/useCamera';
import { useTracker } from '../hooks/useTracker';

export function LiveCamera() {
  const { videoRef, error: cameraError, isLoading: isCameraLoading } = useCamera();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const { delegate, isLoading: isTrackerLoading, error: trackerError } = useTracker(
    videoRef,
    canvasRef,
    { enabled: showSkeleton },
  );

  if (cameraError) {
    return (
      <p role="alert" className="camera-alert">
        Camera error: {cameraError}
      </p>
    );
  }

  return (
    <div className="camera-video-wrapper">
      {isCameraLoading && <p className="camera-status-overlay">Starting camera...</p>}

      <div className="camera-controls-bar">
        <div className="camera-badge-group">
          {delegate && (
            <span className="camera-delegate-badge" aria-label="Active compute delegate">
              {delegate}
            </span>
          )}
          {isTrackerLoading && (
            <span className="camera-delegate-badge" aria-label="Tracker status">
              Loading tracker...
            </span>
          )}
          {trackerError && (
            <span className="camera-alert" style={{ margin: 0, padding: '2px 6px' }} role="status">
              Tracker: {trackerError}
            </span>
          )}
        </div>

        <button
          type="button"
          className={`camera-toggle-btn ${showSkeleton ? 'active' : ''}`}
          aria-pressed={showSkeleton}
          onClick={() => setShowSkeleton((prev) => !prev)}
        >
          {showSkeleton ? 'Hide Skeleton' : 'Show Skeleton'}
        </button>
      </div>

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

      <canvas
        ref={canvasRef}
        className="camera-overlay-canvas"
        width={640}
        height={480}
        aria-label="Tracking landmark overlay"
        style={{ display: showSkeleton ? 'block' : 'none' }}
      />
    </div>
  );
}
