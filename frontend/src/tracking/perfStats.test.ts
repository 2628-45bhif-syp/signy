import { describe, expect, it } from 'vitest';
import {
  computeTimingStats,
  formatPipelineSummaryTable,
  summarizePipelineTimings,
} from './perfStats';

describe('perfStats', () => {
  it('returns zeroed stats for empty samples', () => {
    expect(computeTimingStats([])).toEqual({
      count: 0,
      min: 0,
      mean: 0,
      median: 0,
      p95: 0,
      max: 0,
    });
  });

  it('computes min, mean, median, p95, and max accurately for sample durations', () => {
    // 20 samples: 1..20
    const samples = Array.from({ length: 20 }, (_, i) => i + 1);
    const stats = computeTimingStats(samples);

    expect(stats.count).toBe(20);
    expect(stats.min).toBe(1);
    expect(stats.max).toBe(20);
    expect(stats.mean).toBe(10.5);
    expect(stats.median).toBe(10.5);
    // 95th percentile of 1..20 (ceil(0.95 * 20) - 1 = index 18 -> value 19)
    expect(stats.p95).toBe(19);
  });

  it('summarizes pipeline stages and formats a readable report table', () => {
    const summary = summarizePipelineTimings({
      inferenceMs: [10, 12, 14],
      mappingMs: [0.2, 0.3, 0.4],
      drawMs: [1.5, 2.0, 2.5],
      totalMs: [11.7, 14.3, 16.9],
    });

    expect(summary.inference.median).toBe(12);
    expect(summary.mapping.median).toBe(0.3);
    expect(summary.draw.median).toBe(2.0);
    expect(summary.appProcessing.median).toBe(2.3);
    expect(summary.total.p95).toBe(16.9);

    const table = formatPipelineSummaryTable(summary, 'GPU');
    expect(table).toContain('Delegate: GPU');
    expect(table).toContain('1. MediaPipe Inference');
    expect(table).toContain('2. Mapping & Coordinates');
    expect(table).toContain('3. Skeleton Canvas Draw');
    expect(table).toContain('App Processing (Stage 2 + 3)');
    expect(table).toContain('Total Frame (Stage 1 + 2 + 3)');
    expect(table).toContain('16.90');
    expect(table).toContain('PASS');
  });
});
