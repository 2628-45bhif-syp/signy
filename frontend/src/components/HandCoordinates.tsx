import { selectHandPoint, type HandSide } from '../tracking/hands';
import type { TrackingFrame } from '../tracking/types';

const HANDS: { side: HandSide; label: string }[] = [
  { side: 'left', label: 'Left hand' },
  { side: 'right', label: 'Right hand' },
];

/** Live wrist x/y of both hands (y: up = higher), or "Not detected". */
export function HandCoordinates({ frame }: { frame: TrackingFrame | null }) {
  return (
    <div className="hand-coordinates" aria-label="Hand coordinates">
      {HANDS.map(({ side, label }) => {
        const point = selectHandPoint(frame, side);
        return (
          <div key={side} className="hand-coordinates-entry" data-testid={`hand-${side}`}>
            <span className="panel-label">{label}</span>
            {point ? (
              <span className="hand-coordinates-values">
                x {point.x.toFixed(3)} &nbsp; y {point.y.toFixed(3)}
              </span>
            ) : (
              <span className="hand-coordinates-missing">Not detected</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
