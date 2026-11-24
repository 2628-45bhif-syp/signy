import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Landmark, TrackingFrame } from '../tracking/types';
import { HandCoordinates } from './HandCoordinates';

const wrist = (x: number, y: number): Landmark[] => [{ x, y, z: 0, visibility: 1 }];

const frame = (leftHand: Landmark[], rightHand: Landmark[]): TrackingFrame => ({
  timestampMs: 0,
  face: [],
  blendshapes: [],
  pose: [],
  leftHand,
  rightHand,
});

describe('HandCoordinates', () => {
  it('labels both hands and shows wrist x and inverted y', () => {
    render(<HandCoordinates frame={frame(wrist(0.25, 0.2), wrist(0.75, 0.6))} />);

    const left = screen.getByTestId('hand-left');
    const right = screen.getByTestId('hand-right');
    expect(within(left).getByText('Left hand')).toBeInTheDocument();
    expect(within(right).getByText('Right hand')).toBeInTheDocument();
    expect(left).toHaveTextContent(/x 0\.250\s+y 0\.800/);
    expect(right).toHaveTextContent(/x 0\.750\s+y 0\.400/);
  });

  it('shows "Not detected" for a missing hand', () => {
    render(<HandCoordinates frame={frame([], wrist(0.5, 0.5))} />);

    expect(screen.getByTestId('hand-left')).toHaveTextContent('Not detected');
    expect(screen.getByTestId('hand-right')).not.toHaveTextContent('Not detected');
  });

  it('shows "Not detected" for both hands without a frame', () => {
    render(<HandCoordinates frame={null} />);

    expect(screen.getAllByText('Not detected')).toHaveLength(2);
  });
});
