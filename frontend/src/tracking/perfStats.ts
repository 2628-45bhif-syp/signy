export interface TimingStats {
  count: number;
  min: number;
  mean: number;
  median: number;
  p95: number;
  max: number;
}

export interface PipelineStageTimings {
  inferenceMs: number[];
  mappingMs: number[];
  drawMs: number[];
  totalMs: number[];
}

export interface PipelineStageSummary {
  inference: TimingStats;
  mapping: TimingStats;
  draw: TimingStats;
  appProcessing: TimingStats;
  total: TimingStats;
}

/**
 * Compute descriptive timing statistics (in milliseconds) for a list of frame durations.
 */
export function computeTimingStats(samples: readonly number[]): TimingStats {
  if (samples.length === 0) {
    return { count: 0, min: 0, mean: 0, median: 0, p95: 0, max: 0 };
  }

  const sorted = [...samples].sort((a, b) => a - b);
  const count = sorted.length;
  const min = sorted[0];
  const max = sorted[count - 1];
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / count;

  const mid = Math.floor(count / 2);
  const median =
    count % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  const p95Index = Math.min(count - 1, Math.ceil(0.95 * count) - 1);
  const p95 = sorted[p95Index];

  return { count, min, mean, median, p95, max };
}

/**
 * Summarize all stages of the camera tracking pipeline.
 */
export function summarizePipelineTimings(
  timings: PipelineStageTimings,
): PipelineStageSummary {
  const appProcessingMs = timings.mappingMs.map(
    (m, i) => m + (timings.drawMs[i] ?? 0),
  );
  return {
    inference: computeTimingStats(timings.inferenceMs),
    mapping: computeTimingStats(timings.mappingMs),
    draw: computeTimingStats(timings.drawMs),
    appProcessing: computeTimingStats(appProcessingMs),
    total: computeTimingStats(timings.totalMs),
  };
}

/**
 * Format a human-readable ASCII summary table of stage timing statistics.
 */
export function formatPipelineSummaryTable(
  summary: PipelineStageSummary,
  delegate: string,
): string {
  const fmt = (n: number) => n.toFixed(2).padStart(7);
  const row = (label: string, s: TimingStats, budgetMs?: number) => {
    const status =
      budgetMs === undefined
        ? '   info'
        : s.p95 < budgetMs
          ? '   PASS'
          : '   WARN';
    return `| ${label.padEnd(28)} | ${String(s.count).padStart(5)} | ${fmt(s.min)} | ${fmt(s.mean)} | ${fmt(s.median)} | ${fmt(s.p95)} | ${fmt(s.max)} | ${status} |`;
  };

  const sep =
    '+------------------------------+-------+---------+---------+---------+---------+---------+---------+';
  return [
    `Pipeline Performance Benchmark (Delegate: ${delegate}, Frame Budget: p95 < 33.00 ms)`,
    sep,
    '| Stage                        | Count |  Min ms | Mean ms |  Med ms |  P95 ms |  Max ms | < 33 ms |',
    sep,
    row('1. MediaPipe Inference', summary.inference, 33),
    row('2. Mapping & Coordinates', summary.mapping, 33),
    row('3. Skeleton Canvas Draw', summary.draw, 33),
    sep,
    row('App Processing (Stage 2 + 3)', summary.appProcessing, 33),
    row('Total Frame (Stage 1 + 2 + 3)', summary.total, 33),
    sep,
  ].join('\n');
}
