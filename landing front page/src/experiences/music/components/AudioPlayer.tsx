import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundSynthesizer } from '../services/soundSynthesizer.ts';

interface AudioPlayerProps {
  audioUrl?: string | null;
  instrumentName: string;
  family?: string;
  audioNote?: string;
  compact?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  instrumentName,
  family = 'Classical',
  audioNote = 'C4',
  compact = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [hasAudioError, setHasAudioError] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopSynthRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Reset when URL changes
    setIsPlaying(false);
    setCurrentTime(0);
    setHasAudioError(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioUrl && !hasAudioError && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((e) => {
            console.warn('Playback error, falling back to acoustic preview tone:', e);
            setHasAudioError(true);
            playSynthTone();
          });
      }
    } else {
      // Fallback synthetic acoustic preview
      playSynthTone();
    }
  };

  const playSynthTone = () => {
    if (stopSynthRef.current) {
      stopSynthRef.current();
      stopSynthRef.current = null;
    }
    setIsSynthesizing(true);
    setIsPlaying(true);
    stopSynthRef.current = soundSynthesizer.playCulturalRagaPreview(family, audioNote);

    setTimeout(() => {
      setIsSynthesizing(false);
      setIsPlaying(false);
    }, 2800);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleReplay = () => {
    if (audioRef.current && audioUrl && !hasAudioError) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      playSynthTone();
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return '0:00';
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = Math.floor(secs % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-amber-50/90 border border-amber-200/80 px-3 py-1.5 rounded-full shadow-xs">
        {audioUrl && !hasAudioError && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            onError={() => setHasAudioError(true)}
            preload="metadata"
          />
        )}
        <button
          onClick={togglePlay}
          className="w-7 h-7 rounded-full bg-amber-800 hover:bg-amber-900 text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-xs"
          title={isPlaying ? 'Pause Sample' : `Listen to ${instrumentName}`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>
        <span className="text-xs font-medium text-amber-900 truncate max-w-[120px]">
          {isPlaying ? 'Playing Sound' : 'Listen'}
        </span>
        {isPlaying && (
          <span className="flex gap-0.5 items-end h-3">
            <span className="w-0.5 h-3 bg-amber-700 animate-pulse"></span>
            <span className="w-0.5 h-2 bg-amber-600 animate-pulse delay-75"></span>
            <span className="w-0.5 h-3.5 bg-amber-800 animate-pulse delay-150"></span>
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 via-stone-50 to-amber-50/60 border border-amber-200/90 rounded-2xl p-5 shadow-sm">
      {audioUrl && !hasAudioError && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          onError={() => setHasAudioError(true)}
          preload="metadata"
        />
      )}

      {/* Header with playing status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-700 animate-pulse"></div>
          <span className="text-xs uppercase tracking-wider font-semibold text-amber-900">
            {isPlaying ? 'Now Playing Heritage Sound' : 'Instrument Sound Preview'}
          </span>
        </div>
        <span className="text-xs font-serif font-bold text-amber-950 truncate max-w-[200px]">
          {instrumentName}
        </span>
      </div>

      {/* Progress Bar & Timestamps */}
      <div className="space-y-1 mb-4">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          disabled={!audioUrl || hasAudioError}
          className="w-full h-1.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-800"
        />
        <div className="flex justify-between text-[11px] text-stone-500 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{duration ? formatTime(duration) : isSynthesizing ? 'Acoustic Tone' : '0:30'}</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Main Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-amber-800 hover:bg-amber-900 text-white flex items-center justify-center transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play Sound'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          {/* Replay */}
          <button
            onClick={handleReplay}
            className="p-2 rounded-full text-stone-600 hover:text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer"
            title="Replay from start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Acoustic synthesize preview button */}
          <button
            onClick={playSynthTone}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100/80 hover:bg-amber-200 text-amber-900 text-xs font-medium transition-colors cursor-pointer"
            title="Listen to synthesized microtonal acoustic tone"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Acoustic Tone</span>
          </button>
        </div>

        {/* Volume controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-stone-600 hover:text-amber-900 transition-colors cursor-pointer"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-16 sm:w-20 h-1.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-800"
          />
        </div>
      </div>

      {/* Fallback Notice if no live URL */}
      {(!audioUrl || hasAudioError) && (
        <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-800/80">
          <span>Recorded archive sample coming soon</span>
          <span className="italic">Interactive acoustic raga synthesizer active</span>
        </div>
      )}
    </div>
  );
};
