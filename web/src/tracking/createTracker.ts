import { FilesetResolver, HolisticLandmarker } from '@mediapipe/tasks-vision'
import { mapResult } from './mapResult'
import type { Tracker, TrackingDelegate } from './types'

const base = import.meta.env.BASE_URL
const WASM_PATH = `${base}mediapipe/wasm`
const MODEL_PATH = `${base}models/holistic_landmarker.task`

async function createLandmarker(delegate: TrackingDelegate) {
  const fileset = await FilesetResolver.forVisionTasks(WASM_PATH)
  return HolisticLandmarker.createFromOptions(fileset, {
    baseOptions: { modelAssetPath: MODEL_PATH, delegate },
    runningMode: 'VIDEO',
    outputFaceBlendshapes: true,
  })
}

/**
 * Load the Holistic model from the app's own files and return a tracker.
 * Tries the GPU delegate first and falls back to CPU if it cannot start.
 */
export async function createTracker(): Promise<Tracker> {
  let delegate: TrackingDelegate = 'GPU'
  let landmarker: HolisticLandmarker
  try {
    landmarker = await createLandmarker('GPU')
  } catch (error) {
    console.warn('GPU delegate unavailable, falling back to CPU', error)
    delegate = 'CPU'
    landmarker = await createLandmarker('CPU')
  }

  return {
    delegate,
    detect: (video, timestampMs) =>
      mapResult(landmarker.detectForVideo(video, timestampMs), timestampMs),
    close: () => landmarker.close(),
  }
}
