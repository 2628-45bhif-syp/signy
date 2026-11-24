import { selectHandPoint, selectHeadPoint, type HandPoint } from '../tracking/hands';
import type { TrackingFrame } from '../tracking/types';

const PANELS: {
  id: string;
  label: string;
  select: (frame: TrackingFrame | null) => HandPoint | null;
}[] = [
  { id: 'head', label: 'Head', select: selectHeadPoint },
  { id: 'hand-left', label: 'Left hand', select: (f) => selectHandPoint(f, 'left') },
  { id: 'hand-right', label: 'Right hand', select: (f) => selectHandPoint(f, 'right') },
];

/** Live x/y of head and both hands (y: up = higher), or "Not detected". */
export function HandCoordinates({ frame }: { frame: TrackingFrame | null }) {
  return (
    <div className="hand-coordinates" aria-label="Live tracking coordinates">
      {PANELS.map(({ id, label, select }) => {
        const point = select(frame);
        return (
          <div key={id} className="hand-coordinates-entry" data-testid={id}>
            <span className="panel-label">{label}</span>
            {point ? (
              <span className="hand-coordinates-values" aria-live="polite">
                x {point.x.toFixed(3)} &nbsp; y {point.y.toFixed(3)}
              </span>
            ) : (
              <span className="hand-coordinates-missing" aria-live="polite">
                Not detected
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
