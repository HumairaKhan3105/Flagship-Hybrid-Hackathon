import { PlayerProfile, GameScreen } from '../../types';
import { GAME_ASSETS } from '../../data/gameData';
import { Star, Heart, Volume2, VolumeX, Settings, Clock, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface GameHUDProps {
  player: PlayerProfile;
  currentScreen: GameScreen;
  screenTitle?: string;
  timerSeconds?: number;
  onOpenSettings: () => void;
  onToggleSound: () => void;
}

export default function GameHUD({
  player,
  currentScreen,
  screenTitle,
  timerSeconds,
  onOpenSettings,
  onToggleSound,
}: GameHUDProps) {
  // Format seconds to MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="relative z-30 w-full px-4 py-2.5 bg-gradient-to-b from-[#090d16]/95 via-[#0b1220]/90 to-transparent border-b border-amber-500/25 backdrop-blur-md flex items-center justify-between gap-2 select-none shadow-xl">
      {/* Left: Player Profile & Level */}
      <div className="flex items-center gap-3">
        {/* Ornate Gold Medallion Avatar Frame */}
        <div className="relative group cursor-pointer" onClick={onOpenSettings}>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full p-[2px] bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-100 shadow-[0_0_12px_rgba(245,192,66,0.5)]">
            <img
              src={GAME_ASSETS.sahanaAvatar}
              alt={player.name}
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-950 border border-amber-400 text-[10px] font-cinzel font-bold text-amber-300 shadow">
            Lv.{player.level}
          </span>
        </div>

        <div className="hidden sm:block text-left">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-cinzel font-bold text-amber-200 tracking-wider">
              {player.name}
            </h4>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-400 font-cinzel">
              {player.rankTitle}
            </span>
          </div>
          <p className="text-[11px] font-marcellus text-stone-400">
            {player.unlockedGarments.length}/40 Heritage Garments
          </p>
        </div>
      </div>

      {/* Center: Title or Screen Name with Royal Embellishments */}
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-base sm:text-xl font-cinzel font-bold tracking-widest uppercase gold-gradient-text drop-shadow">
          {screenTitle || 'VASTRA YATRA'}
        </h1>
        <div className="hidden md:flex items-center gap-2 text-[10px] font-cinzel tracking-widest text-amber-400/80">
          <span className="w-4 h-[1px] bg-amber-500/40" />
          <span>JOURNEY THROUGH INDIA'S HERITAGE</span>
          <span className="w-4 h-[1px] bg-amber-500/40" />
        </div>
      </div>

      {/* Right: Heritage Points, Lives, Timer, Audio & Settings */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Timer if challenge active */}
        {timerSeconds !== undefined && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-950/80 border border-amber-500/30 text-amber-300 font-cinzel text-xs sm:text-sm font-semibold shadow-inner">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{formatTime(timerSeconds)}</span>
          </div>
        )}

        {/* Heritage Points Counter with Star */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-950/80 to-amber-900/60 border border-amber-400/50 shadow-md">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-xs sm:text-sm font-cinzel font-bold text-amber-200">
            {player.points.toLocaleString()}
          </span>
        </div>

        {/* Lives Counter with Ruby Hearts */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-950/80 border border-rose-900/60 shadow-md">
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
          <span className="text-xs sm:text-sm font-cinzel font-bold text-rose-200">
            {player.lives}/{player.maxLives}
          </span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={() => {
            onToggleSound();
            soundManager.playClick();
          }}
          className="p-2 rounded-lg bg-stone-900/80 border border-amber-500/30 text-amber-300 hover:text-amber-200 hover:border-amber-400 transition-all active:scale-95 shadow"
          title={player.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        >
          {player.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenSettings();
          }}
          className="p-2 rounded-lg bg-stone-900/80 border border-amber-500/30 text-amber-300 hover:text-amber-200 hover:border-amber-400 transition-all active:scale-95 shadow"
          title="Game Settings & Profile"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
