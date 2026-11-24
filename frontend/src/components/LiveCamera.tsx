import { useRef, useState } from 'react';
import { Cpu, Layers, Loader2, AlertCircle } from 'lucide-react';
import { useCamera } from '../hooks/useCamera';
import { useTracker } from '../hooks/useTracker';
import { HandCoordinates } from './HandCoordinates';

export function LiveCamera() {
  const { videoRef, error: cameraError, isLoading: isCameraLoading } = useCamera();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const {
    delegate,
    isLoading: isTrackerLoading,
    error: trackerError,
    lastFrame,
  } = useTracker(videoRef, canvasRef, { drawSkeleton: showSkeleton });

  const headPoint =
    lastFrame && lastFrame.face.length > 1 ? lastFrame.face[1] : null;
  const headCoordinateText = headPoint
    ? `X: ${headPoint.x.toFixed(2)}, Y: ${(1 - headPoint.y).toFixed(2)}`
    : 'Not detected';

  if (cameraError) {
    return (
      <p role="alert" className="camera-alert">
        <AlertCircle size={16} aria-hidden="true" />
        <span>Camera error: {cameraError}</span>
      </p>
    );
  }

  return (
    <div className="camera-stage">
      <div className="camera-video-wrapper">
        {isCameraLoading && (
          <div className="camera-status-overlay">
            <Loader2 size={24} className="spin-icon" aria-hidden="true" />
            <p>Starting camera...</p>
          </div>
        )}

        <div className="camera-controls-bar">
          <div className="camera-badge-group">
            {delegate && (
              <span className="camera-delegate-badge" aria-label="Active compute delegate">
                <Cpu size={12} strokeWidth={2.2} aria-hidden="true" />
                <span>{delegate}</span>
              </span>
            )}
            {isTrackerLoading && (
              <span className="camera-delegate-badge" aria-label="Tracker status">
                <Loader2 size={12} className="spin-icon" aria-hidden="true" />
                <span>Loading tracker...</span>
              </span>
            )}
            {trackerError && (
              <span className="camera-alert camera-alert-compact" role="status">
                <AlertCircle size={12} aria-hidden="true" />
                <span>Tracker: {trackerError}</span>
              </span>
            )}
          </div>

          <button
            type="button"
            className={`camera-toggle-btn ${showSkeleton ? 'active' : ''}`}
            aria-pressed={showSkeleton}
            onClick={() => setShowSkeleton((prev) => !prev)}
          >
            <Layers size={13} strokeWidth={2.2} aria-hidden="true" />
            <span>{showSkeleton ? 'Hide Skeleton' : 'Show Skeleton'}</span>
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

      <div className="camera-coords-bar" aria-label="Live tracking coordinates">
        <div className="camera-coord-item">
          <span className="camera-coord-label">Head</span>
          <span
            className={`camera-coord-value ${headPoint ? 'detected' : 'not-detected'}`}
            aria-live="polite"
          >
            {headCoordinateText}
          </span>
        </div>
      </div>

      <HandCoordinates frame={lastFrame} />
    </div>
  );
}
