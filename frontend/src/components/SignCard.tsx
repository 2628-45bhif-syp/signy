import { useRef, useState } from 'react';
import type { Sign } from '../hooks/useSigns';

interface SignCardProps {
  sign: Sign;
}

export function SignCard({ sign }: SignCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    if (isPlaying) {
      video.pause();
      return;
    }
    setHasFailed(false);
    video.play().catch((err: unknown) => {
      // AbortError only means the user paused before playback started.
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        setHasFailed(true);
      }
    });
  }

  return (
    <li className="sign-card">
      <div className="sign-media">
        <video
          ref={videoRef}
          className="sign-video"
          src={`${import.meta.env.BASE_URL}${sign.video}`}
          poster={`${import.meta.env.BASE_URL}${sign.poster}`}
          preload="none"
          muted
          loop
          playsInline
          aria-label={`Video of the sign for ${sign.gloss}`}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        <button
          type="button"
          className={`sign-toggle ${isPlaying ? 'playing' : ''}`}
          aria-label={`${isPlaying ? 'Pause' : 'Play'} sign for ${sign.gloss}`}
          onClick={togglePlayback}
        >
          <span aria-hidden="true">{isPlaying ? '❚❚' : '▶'}</span>
        </button>
      </div>
      <div className="sign-info">
        <h3 className="sign-gloss">{sign.gloss}</h3>
        {hasFailed && (
          <p role="alert" className="sign-error">
            Video unavailable.
          </p>
        )}
        <p className="sign-attribution">
          {sign.creator} ·{' '}
          <a href={sign.sourceUrl} target="_blank" rel="noopener noreferrer">
            Source
          </a>{' '}
          ·{' '}
          <a href={sign.licenseUrl} target="_blank" rel="noopener noreferrer">
            {sign.license}
          </a>
        </p>
      </div>
    </li>
  );
}
