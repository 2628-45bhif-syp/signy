import { describe, expect, it } from 'vitest';
import { selectHandPoint } from './hands';
import type { Landmark, TrackingFrame } from './types';

const hand = (x: number, y: number): Landmark[] =>
  Array.from({ length: 21 }, (_, i) => ({ x: i === 0 ? x : 0.5, y: i === 0 ? y : 0.5, z: 0, visibility: 1 }));

const frame = (leftHand: Landmark[], rightHand: Landmark[]): TrackingFrame => ({
  timestampMs: 0,
  face: [],
  blendshapes: [],
  pose: [],
  leftHand,
  rightHand,
});

describe('selectHandPoint', () => {
  it('returns the wrist of each hand with inverted y', () => {
    const f = frame(hand(0.3, 0.2), hand(0.7, 0.9));
    const left = selectHandPoint(f, 'left');
    const right = selectHandPoint(f, 'right');
    expect(left?.x).toBeCloseTo(0.3);
    expect(left?.y).toBeCloseTo(0.8);
    expect(right?.x).toBeCloseTo(0.7);
    expect(right?.y).toBeCloseTo(0.1);
  });

  it('returns null for a hand without landmarks', () => {
    const f = frame([], hand(0.5, 0.5));
    expect(selectHandPoint(f, 'left')).toBeNull();
    expect(selectHandPoint(f, 'right')).not.toBeNull();
  });

  it('returns null for a null frame', () => {
    expect(selectHandPoint(null, 'left')).toBeNull();
    expect(selectHandPoint(null, 'right')).toBeNull();
  });

  it('gives a higher y for a hand higher in the image', () => {
    const high = selectHandPoint(frame(hand(0.5, 0.1), []), 'left')!;
    const low = selectHandPoint(frame(hand(0.5, 0.9), []), 'left')!;
    expect(high.y).toBeGreaterThan(low.y);
  });
});
