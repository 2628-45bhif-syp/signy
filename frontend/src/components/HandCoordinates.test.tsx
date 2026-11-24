import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Landmark, TrackingFrame } from '../tracking/types';
import { HandCoordinates } from './HandCoordinates';

const wrist = (x: number, y: number): Landmark[] => [{ x, y, z: 0, visibility: 1 }];
const nose = (x: number, y: number): Landmark[] => [
  { x: 0.5, y: 0.5, z: 0, visibility: 1 },
  { x, y, z: 0, visibility: 1 },
];

const frame = (
  leftHand: Landmark[],
  rightHand: Landmark[],
  face: Landmark[] = [],
): TrackingFrame => ({
  timestampMs: 0,
  face,
  blendshapes: [],
  pose: [],
  leftHand,
  rightHand,
});

describe('HandCoordinates', () => {
  it('labels head and both hands and shows x and inverted y in 3 panels', () => {
    render(
      <HandCoordinates
        frame={frame(wrist(0.25, 0.2), wrist(0.75, 0.6), nose(0.45, 0.35))}
      />,
    );

    const head = screen.getByTestId('head');
    const left = screen.getByTestId('hand-left');
    const right = screen.getByTestId('hand-right');
    expect(within(head).getByText('Head')).toBeInTheDocument();
    expect(within(left).getByText('Left hand')).toBeInTheDocument();
    expect(within(right).getByText('Right hand')).toBeInTheDocument();
    expect(head).toHaveTextContent(/x 0\.450\s+y 0\.650/);
    expect(left).toHaveTextContent(/x 0\.250\s+y 0\.800/);
    expect(right).toHaveTextContent(/x 0\.750\s+y 0\.400/);
  });

  it('shows "Not detected" for a missing hand or head', () => {
    render(<HandCoordinates frame={frame([], wrist(0.5, 0.5), [])} />);

    expect(screen.getByTestId('head')).toHaveTextContent('Not detected');
    expect(screen.getByTestId('hand-left')).toHaveTextContent('Not detected');
    expect(screen.getByTestId('hand-right')).not.toHaveTextContent('Not detected');
  });

  it('shows "Not detected" for all 3 panels without a frame', () => {
    render(<HandCoordinates frame={null} />);

    expect(screen.getAllByText('Not detected')).toHaveLength(3);
  });
});
