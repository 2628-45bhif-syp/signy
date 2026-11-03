import { DrawingUtils, HolisticLandmarker } from '@mediapipe/tasks-vision'
import type { TrackingFrame } from './types'

/** Draw all landmarks of a frame onto the canvas, replacing its previous content. */
export function drawFrame(canvas: HTMLCanvasElement, frame: TrackingFrame | null) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (!frame) return

  const utils = new DrawingUtils(ctx)
  const line = (color: string, width: number) => ({ color, lineWidth: width })

  utils.drawConnectors(
    frame.face,
    HolisticLandmarker.FACE_LANDMARKS_CONTOURS,
    line('#38bdf8', 1),
  )
  utils.drawConnectors(frame.pose, HolisticLandmarker.POSE_CONNECTIONS, line('#a3e635', 3))
  utils.drawLandmarks(frame.pose, { color: '#a3e635', radius: 3 })

  for (const [hand, color] of [
    [frame.leftHand, '#f472b6'],
    [frame.rightHand, '#fb923c'],
  ] as const) {
    utils.drawConnectors(hand, HolisticLandmarker.HAND_CONNECTIONS, line(color, 3))
    utils.drawLandmarks(hand, { color, radius: 3 })
  }
}
