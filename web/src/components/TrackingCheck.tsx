import { useEffect, useRef, useState } from 'react'
import { createTracker } from '../tracking/createTracker'
import { drawFrame } from '../tracking/drawFrame'
import type { Tracker } from '../tracking/types'

const DEFAULT_CLIP = `${import.meta.env.BASE_URL}dev/demo-sign.mp4`

/** Dev page: plays a recorded clip and overlays the tracked landmarks. */
export function TrackingCheck() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tracker, setTracker] = useState<Tracker | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [src, setSrc] = useState(DEFAULT_CLIP)

  useEffect(() => {
    let cancelled = false
    let created: Tracker | null = null
    createTracker().then(
      (t) => {
        if (cancelled) t.close()
        else {
          created = t
          setTracker(t)
        }
      },
      (e: unknown) => setError(e instanceof Error ? e.message : String(e)),
    )
    return () => {
      cancelled = true
      created?.close()
      setTracker(null)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!tracker || !video || !canvas) return

    let stopped = false
    let handle = 0
    let lastTimestamp = -1
    const useVideoFrames = 'requestVideoFrameCallback' in video

    const tick = () => {
      if (stopped) return
      // video.currentTime jumps back when the clip loops, so use a clock that
      // only moves forward: detectForVideo needs strictly increasing timestamps.
      const timestamp = performance.now()
      if (video.readyState >= 2 && video.videoWidth > 0 && timestamp > lastTimestamp) {
        lastTimestamp = timestamp
        if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth
        if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight
        drawFrame(canvas, tracker.detect(video, timestamp))
      }
      schedule()
    }
    const schedule = () => {
      handle = useVideoFrames
        ? video.requestVideoFrameCallback(tick)
        : requestAnimationFrame(tick)
    }
    schedule()

    return () => {
      stopped = true
      if (useVideoFrames) video.cancelVideoFrameCallback(handle)
      else cancelAnimationFrame(handle)
      drawFrame(canvas, null)
    }
  }, [tracker, src])

  useEffect(() => {
    return () => {
      if (src.startsWith('blob:')) URL.revokeObjectURL(src)
    }
  }, [src])

  const status = error
    ? `Tracking failed: ${error}`
    : tracker
      ? `Tracking active (${tracker.delegate})`
      : 'Loading model…'

  return (
    <section className="space-y-3">
      <div className="relative w-full overflow-hidden rounded bg-black">
        <video
          ref={videoRef}
          src={src}
          className="block w-full"
          autoPlay
          loop
          muted
          playsInline
          controls
        />
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      </div>
      <p role="status" className="text-sm">
        {status}
      </p>
      <label className="block text-sm">
        Other clip:{' '}
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) setSrc(URL.createObjectURL(file))
          }}
        />
      </label>
    </section>
  )
}
