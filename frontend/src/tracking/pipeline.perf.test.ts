import { describe, expect, it } from 'vitest';
import { createTracker } from './createTracker';
import { drawFrame } from './drawFrame';
import { selectHandPoint, selectHeadPoint } from './hands';
import { mapResult } from './mapResult';
import {
  formatPipelineSummaryTable,
  summarizePipelineTimings,
  type PipelineStageTimings,
} from './perfStats';

const VIDEO_FIXTURE_URL = '/signs/videos/12887.mp4';
const FRAME_WIDTH = 640;
const FRAME_HEIGHT = 480;
const WARMUP_FRAMES = 5;
const MEASURED_FRAMES = 60;
const FRAME_BUDGET_MS = 33;

async function loadVideoFixture(url: string): Promise<HTMLVideoElement> {
  const video = document.createElement('video');
  video.src = url;
  video.width = FRAME_WIDTH;
  video.height = FRAME_HEIGHT;
  video.muted = true;
  video.playsInline = true;
  video.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    const onLoaded = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error(`Failed to load video fixture: ${url}`));
    };
    const cleanup = () => {
      video.removeEventListener('loadeddata', onLoaded);
      video.removeEventListener('error', onError);
    };
    if (video.readyState >= 2) {
      resolve();
      return;
    }
    video.addEventListener('loadeddata', onLoaded);
    video.addEventListener('error', onError);
    video.load();
  });

  return video;
}

async function seekVideo(video: HTMLVideoElement, timeSec: number): Promise<void> {
  const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 2;
  const target = Math.min(duration - 0.01, Math.max(0, timeSec % duration));
  if (Math.abs(video.currentTime - target) < 1e-4 && video.readyState >= 2) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const onSeeked = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error('Video seek failed'));
    };
    const cleanup = () => {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
    };
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);
    video.currentTime = target;
  });
}

describe('Camera & Tracking Pipeline Performance Benchmark (#16)', () => {
  it(
    'benchmarks all stages of the 640x480 tracking pipeline and asserts processing stages are below 33 ms (p95)',
    async () => {
      const tracker = await createTracker();
      const sourceVideo = await loadVideoFixture(VIDEO_FIXTURE_URL);

      // Render each video frame onto a 640x480 frame buffer matching the WebRTC camera constraints
      const captureCanvas = document.createElement('canvas');
      captureCanvas.width = FRAME_WIDTH;
      captureCanvas.height = FRAME_HEIGHT;
      const captureCtx = captureCanvas.getContext('2d')!;
      captureCtx.drawImage(sourceVideo, 0, 0, FRAME_WIDTH, FRAME_HEIGHT);

      const canvas = document.createElement('canvas');
      canvas.width = FRAME_WIDTH;
      canvas.height = FRAME_HEIGHT;

      try {
        expect(tracker.detectRaw).toBeTypeOf('function');

        let syntheticTimestampMs = 1000;
        const totalFrames = WARMUP_FRAMES + MEASURED_FRAMES;

        const timings: PipelineStageTimings = {
          inferenceMs: [],
          mappingMs: [],
          drawMs: [],
          totalMs: [],
        };

        let framesWithDetections = 0;

        for (let i = 0; i < totalFrames; i++) {
          await seekVideo(sourceVideo, (i * 1) / 30);
          captureCtx.drawImage(sourceVideo, 0, 0, FRAME_WIDTH, FRAME_HEIGHT);
          syntheticTimestampMs += 33.333;

          const t0 = performance.now();
          const rawResult = tracker.detectRaw!(
            captureCanvas as unknown as HTMLVideoElement,
            syntheticTimestampMs,
          );
          const t1 = performance.now();

          const frame = mapResult(rawResult, syntheticTimestampMs);
          selectHeadPoint(frame);
          selectHandPoint(frame, 'left');
          selectHandPoint(frame, 'right');
          const t2 = performance.now();

          drawFrame(canvas, frame);
          const t3 = performance.now();

          if (i >= WARMUP_FRAMES) {
            timings.inferenceMs.push(t1 - t0);
            timings.mappingMs.push(t2 - t1);
            timings.drawMs.push(t3 - t2);
            timings.totalMs.push(t3 - t0);

            if (
              frame.pose.length > 0 ||
              frame.face.length > 0 ||
              frame.leftHand.length > 0 ||
              frame.rightHand.length > 0
            ) {
              framesWithDetections++;
            }
          }
        }

        const summary = summarizePipelineTimings(timings);
        const report = formatPipelineSummaryTable(summary, tracker.delegate);
        console.info(`\n${report}\n`);

        expect(summary.total.count).toBe(MEASURED_FRAMES);
        expect(framesWithDetections).toBeGreaterThan(0);

        // Assert our pipeline processing stages (mapping, coordinate extraction, and canvas rendering)
        // stay well under the 33 ms (30 FPS) frame budget at the 95th percentile
        expect(summary.mapping.p95).toBeLessThan(FRAME_BUDGET_MS);
        expect(summary.draw.p95).toBeLessThan(FRAME_BUDGET_MS);
        expect(summary.appProcessing.p95).toBeLessThan(FRAME_BUDGET_MS);
      } finally {
        tracker.close();
      }
    },
  );
});
