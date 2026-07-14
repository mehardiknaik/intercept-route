import { useEffect, useRef, useState } from 'react';
import play from '../../assets/play.svg';
import pause from '../../assets/pause.svg';
import volumeImg from '../../assets/volume.svg';
import mute from '../../assets/mute.svg';
import fullscreen from '../../assets/full.svg';
import style from './WatchPage.module.css';

const DUMMY_VIDEO_SRC =
  // 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4';
  'https://lorem.video/cat_720p';

const CONTROL_HIDE_DELAY = 2000; // milliseconds
const PLAYER_ACTIVITY_DEBOUNCE_MS = 120;
const BG_REDRAW_DEBOUNCE_MS = 80;
const BG_TARGET_FPS = 10;

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '00:00';
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60);
  const remainder = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
};

const WatchPage = () => {
  const ref = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const hideControlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playerActivityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const redrawTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [volumeControlsVisible, setVolumeControlsVisible] = useState(false);

  const clearHideControlsTimeout = () => {
    if (!hideControlsTimeoutRef.current) return;
    clearTimeout(hideControlsTimeoutRef.current);
    hideControlsTimeoutRef.current = null;
  };

  const clearPlayerActivityTimeout = () => {
    if (!playerActivityTimeoutRef.current) return;
    clearTimeout(playerActivityTimeoutRef.current);
    playerActivityTimeoutRef.current = null;
  };

  const scheduleHideControls = () => {
    clearHideControlsTimeout();
    if (!isPlaying) return;
    hideControlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, CONTROL_HIDE_DELAY);
  };

  const handlePlayerActivity = () => {
    clearPlayerActivityTimeout();
    playerActivityTimeoutRef.current = setTimeout(() => {
      setShowControls((prev) => (prev ? prev : true));
      scheduleHideControls();
    }, PLAYER_ACTIVITY_DEBOUNCE_MS);
  };

  const handleVolumeControlsActivity = () => {
    setVolumeControlsVisible((prev) => !prev);
  };

  useEffect(() => {
    if (!isPlaying) {
      clearHideControlsTimeout();
      setShowControls(true);
      return;
    }

    scheduleHideControls();

    return () => {
      clearHideControlsTimeout();
      clearPlayerActivityTimeout();
    };
  }, [isPlaying]);

  useEffect(() => {
    const videoElement = ref.current;
    const bgCanvas = bgCanvasRef.current;
    if (!videoElement || !bgCanvas) return;

    const ctx = bgCanvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let lastRenderAt = 0;
    const frameDuration = 1000 / BG_TARGET_FPS;

    const syncCanvasSize = () => {
      const width = bgCanvas.clientWidth;
      const height = bgCanvas.clientHeight;
      if (width === 0 || height === 0) return;
      if (bgCanvas.width !== width || bgCanvas.height !== height) {
        bgCanvas.width = width;
        bgCanvas.height = height;
      }
    };

    const drawFrame = () => {
      syncCanvasSize();
      if (videoElement.readyState >= 2 && bgCanvas.width > 0 && bgCanvas.height > 0) {
        ctx.drawImage(videoElement, 0, 0, bgCanvas.width, bgCanvas.height);
      }
    };

    const scheduleDebouncedDraw = () => {
      if (redrawTimeoutRef.current) {
        clearTimeout(redrawTimeoutRef.current);
      }
      redrawTimeoutRef.current = setTimeout(() => {
        drawFrame();
        redrawTimeoutRef.current = null;
      }, BG_REDRAW_DEBOUNCE_MS);
    };

    const stopRenderLoop = () => {
      if (animationFrameId === null) return;
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    };

    const startRenderLoop = () => {
      if (animationFrameId !== null) return;

      const render = (timestamp: number) => {
        if (timestamp - lastRenderAt >= frameDuration) {
          drawFrame();
          lastRenderAt = timestamp;
        }
        animationFrameId = requestAnimationFrame(render);
      };

      animationFrameId = requestAnimationFrame(render);
    };

    const syncTime = () => {
      drawFrame();
    };

    const syncRate = () => {
      // Canvas draw speed follows requestAnimationFrame; no playback rate sync is needed.
    };

    const handlePlay = () => {
      syncTime();
      syncRate();
      startRenderLoop();
    };

    const handlePause = () => {
      syncTime();
      stopRenderLoop();
    };

    const handleSeeked = () => {
      scheduleDebouncedDraw();
    };

    const handleResize = () => {
      scheduleDebouncedDraw();
    };

    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('seeking', handleSeeked);
    videoElement.addEventListener('seeked', handleSeeked);
    videoElement.addEventListener('timeupdate', handleSeeked);
    videoElement.addEventListener('ratechange', syncRate);
    videoElement.addEventListener('loadeddata', handleSeeked);
    videoElement.addEventListener('loadedmetadata', handleSeeked);
    window.addEventListener('resize', handleResize);

    syncRate();
    drawFrame();
    if (!videoElement.paused) {
      handlePlay();
    }

    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('seeking', handleSeeked);
      videoElement.removeEventListener('seeked', handleSeeked);
      videoElement.removeEventListener('timeupdate', handleSeeked);
      videoElement.removeEventListener('ratechange', syncRate);
      videoElement.removeEventListener('loadeddata', handleSeeked);
      videoElement.removeEventListener('loadedmetadata', handleSeeked);
      window.removeEventListener('resize', handleResize);
      if (redrawTimeoutRef.current) {
        clearTimeout(redrawTimeoutRef.current);
        redrawTimeoutRef.current = null;
      }
      stopRenderLoop();
    };
  }, []);

  useEffect(() => {
    const videoElement = ref.current;
    if (!videoElement) return;

    const attemptAutoPlay = async () => {
      // Autoplay is typically blocked unless muted.
      videoElement.muted = true;
      setIsMuted(true);
      try {
        await videoElement.play();
      } catch {
        setIsPlaying(false);
      }
    };

    videoElement.addEventListener('loadeddata', attemptAutoPlay, { once: true });
    void attemptAutoPlay();

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration || 0);
      setCurrentTime(videoElement.currentTime || 0);
      setVolume(videoElement.volume);
      setIsMuted(videoElement.muted);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('loadeddata', attemptAutoPlay);
    };
  }, []);

  const togglePlay = async () => {
    const videoElement = ref.current;
    if (!videoElement) return;

    if (videoElement.paused) {
      try {
        await videoElement.play();
      } catch {
        setIsPlaying(false);
      }
    } else {
      videoElement.pause();
    }
  };

  const handleSeek = (value: number) => {
    const videoElement = ref.current;
    if (!videoElement) return;
    videoElement.currentTime = value;
    setCurrentTime(value);
  };

  const handleVolume = (value: number) => {
    const videoElement = ref.current;
    if (!videoElement) return;
    const normalized = Math.min(1, Math.max(0, value));
    videoElement.volume = normalized;
    videoElement.muted = normalized === 0;
    setVolume(normalized);
    setIsMuted(videoElement.muted);
  };

  const toggleMute = () => {
    const videoElement = ref.current;
    if (!videoElement) return;
    videoElement.muted = !videoElement.muted;
    setIsMuted(videoElement.muted);
  };

  const toggleFullscreen = async () => {
    const player = playerRef.current;
    if (!player) return;

    if (!document.fullscreenElement) {
      await player.requestFullscreen();
      return;
    }

    await document.exitFullscreen();
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = Math.round(volume * 100);

  return (
    <section className={style.page}>
      <header className={style.header}>
        <p className={style.kicker}>Now Playing</p>
        <h1 className={style.title}>Big Buck Bunny</h1>
        <p className={style.subtitle}>Dummy streaming page with a sample MP4 source.</p>
      </header>
      {/* Player Ui */}
      <div
        className={style.playerWrap}
        ref={playerRef}
        onMouseMove={handlePlayerActivity}
        onTouchStart={handlePlayerActivity}>
        <video
          className={style.video}
          preload="metadata"
          src={DUMMY_VIDEO_SRC}
          ref={ref}
          playsInline
          muted={isMuted}
          autoPlay>
          Your browser does not support the video tag.
        </video>

        <div
          className={`${style.controls} ${showControls ? style.controlsVisible : style.controlsHidden}`}>
          <div className={style.timeRow}>
            <span className={style.timeText}>{formatTime(currentTime)}</span>
            <input
              className={style.seek}
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              aria-label="Seek video"
              style={{ ['--progress' as string]: `${progress}%` }}
            />
            <span className={style.timeText}>{formatTime(duration)}</span>
          </div>

          <div className={style.secondaryControls}>
            <button className={style.controlBtn} onClick={togglePlay} type="button">
              <img
                height={20}
                width={20}
                src={isPlaying ? pause : play}
                alt={isPlaying ? 'Pause video' : 'Play video'}
              />
            </button>
            <div
              onMouseEnter={handleVolumeControlsActivity}
              onMouseLeave={handleVolumeControlsActivity}
              className={`${style.volumeControls} ${volumeControlsVisible ? style.volumeControlsVisible : style.volumeControlsHidden}`}>
              {/* <button className={style.controlBtn} onClick={toggleMute} type="button"> */}
              <img
                onClick={toggleMute}
                height={20}
                width={20}
                src={isMuted ? mute : volumeImg}
                alt={isMuted ? 'Unmute video' : 'Mute video'}
              />
              {/* </button> */}
              <input
                className={style.volume}
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolume(Number(e.target.value))}
                aria-label="Set volume"
                style={{ ['--progress' as string]: `${isMuted ? 0 : volumePercent}%` }}
              />
            </div>
            <button className={style.controlBtn} onClick={toggleFullscreen} type="button">
              <img height={20} width={20} src={fullscreen} alt="Toggle fullscreen" />
            </button>
          </div>
        </div>
      </div>
      {/* Background Canvas */}
      <canvas className={style.bgCanvas} ref={bgCanvasRef} aria-hidden="true" />
      <p className={style.note}>Source: test-videos.co.uk sample media</p>
    </section>
  );
};

export default WatchPage;
