import React from 'react';
import { 
  Trophy, 
  Flame, 
  Coins, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Award, 
  MapPin, 
  Compass, 
  Settings,
  Sparkles
} from 'lucide-react';
import { UserProgress } from '../types';
import { soundEngine } from '../utils/audio';

interface HeaderProps {
  progress: UserProgress;
  activeScreen: string;
  onNavigate: (screen: 'home' | 'map' | 'badges' | 'facts' | 'leaderboard' | 'profile') => void;
  onOpenSettings: () => void;
  onOpenDaily: () => void;
  dailyAvailable?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  activeScreen,
  onNavigate,
  onOpenSettings,
  onOpenDaily,
  dailyAvailable = true,
}) => {
  const [muted, setMuted] = React.useState(soundEngine.isMutedState());

  const handleToggleSound = () => {
    const isNowMuted = soundEngine.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      soundEngine.playClick();
    }
  };

  const navItem = (screen: 'home' | 'map' | 'badges' | 'facts' | 'leaderboard', label: string, Icon: any) => {
    const isActive = activeScreen === screen;
    return (
      <button
        id={`nav-btn-${screen}`}
        onClick={() => {
          soundEngine.playClick();
          onNavigate(screen);
        }}
        className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
          isActive 
            ? 'bg-[#D4AF37] text-[#5D4037] font-black shadow-md' 
            : 'text-[#FDF5E6] hover:bg-white/10 hover:text-white'
        }`}
      >
        <Icon className={`w-4 h-4 ${isActive ? 'text-[#5D4037]' : 'text-[#D4AF37]'}`} />
        <span className="hidden md:inline">{label}</span>
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#5D4037] border-b-4 border-[#D4AF37] shadow-xl px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Detective Profile Badge & Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="brand-home-btn"
            onClick={() => {
              soundEngine.playClick();
              onNavigate('home');
            }}
            className="flex items-center gap-2.5 sm:gap-3 group text-left"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D4AF37] rounded-full border-2 border-[#FDF5E6] flex items-center justify-center shadow-inner overflow-hidden text-xl sm:text-2xl transform group-hover:scale-105 transition-transform">
              🕵️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[#FDF5E6] font-extrabold text-sm sm:text-base leading-tight uppercase tracking-wider">
                  {progress.displayName}
                </span>
                <div className="bg-[#2E7D32] px-2 py-0.5 rounded text-[10px] text-white font-black uppercase">
                  Lvl {progress.level}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-20 sm:w-28 h-1.5 bg-[#4A3728] rounded-full overflow-hidden border border-[#D4AF37]/40">
                  <div 
                    className="bg-[#8BC34A] h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (progress.xp % 500) / 5)}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#D4AF37] font-bold tracking-wide">
                  {progress.rankTitle}
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Center: Main Navigation Tabs (Natural Tones Pill Bar) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#4A3728] p-1 rounded-2xl border border-[#D4AF37]/50 shadow-md">
          {navItem('home', 'Home', Compass)}
          {navItem('map', 'Adventures', MapPin)}
          {navItem('facts', 'Discoveries', BookOpen)}
          {navItem('badges', 'Medals', Award)}
          {navItem('leaderboard', 'Hall of Fame', Trophy)}
        </nav>

        {/* Right: Natural Tones Economy & Utility Counters */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Daily Challenge button in Forest Green */}
          <button
            id="daily-challenge-btn"
            onClick={() => {
              soundEngine.playClick();
              onOpenDaily();
            }}
            className={`relative px-2.5 sm:px-3 py-1.5 rounded-full border-2 border-[#D4AF37] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all duration-200 ${
              dailyAvailable
                ? 'bg-[#2E7D32] text-white hover:bg-[#388E3C] animate-pulse'
                : 'bg-[#4A3728] text-stone-300'
            }`}
            title="Daily Detective Case"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="hidden sm:inline">Daily Case</span>
            {dailyAvailable && (
              <span className="w-2 h-2 rounded-full bg-[#8BC34A] animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </button>

          {/* Daily Streak */}
          <div 
            className="flex items-center gap-1.5 bg-[#4A3728] border-2 border-[#D4AF37] rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-lg text-[#FDF5E6] text-xs sm:text-sm font-mono font-bold"
            title={`${progress.streak} Day Cultural Streak`}
          >
            <Flame className="w-4 h-4 text-[#FF9933] fill-[#FF9933]" />
            <span>{progress.streak}d</span>
          </div>

          {/* Coins balance pill */}
          <div 
            className="flex items-center gap-1.5 bg-[#4A3728] border-2 border-[#D4AF37] rounded-full px-3 sm:px-4 py-1 sm:py-1.5 shadow-lg text-[#FDF5E6] text-xs sm:text-sm font-mono font-bold"
            title={`${progress.coins} Cultural Coins`}
          >
            <span className="text-[#FFD700] text-sm sm:text-base">🪙</span>
            <span>{progress.coins.toLocaleString()}</span>
          </div>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={handleToggleSound}
            aria-label={muted ? 'Unmute game sounds' : 'Mute game sounds'}
            className="p-1.5 rounded-lg bg-[#4A3728] hover:bg-[#382618] border-2 border-[#D4AF37] text-[#FDF5E6] transition-colors"
            title={muted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#8BC34A]" />}
          </button>

          {/* Settings button in Natural Tones Crimson */}
          <button
            id="settings-open-btn"
            onClick={() => {
              soundEngine.playClick();
              onOpenSettings();
            }}
            aria-label="Open Game Settings"
            className="bg-[#8B0000] border-2 border-[#D4AF37] w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-white font-bold hover:scale-105 transition-transform shadow"
            title="Game Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around mt-2 pt-2 border-t border-[#D4AF37]/30 text-[11px] font-bold text-[#FDF5E6]">
        <button
          onClick={() => { soundEngine.playClick(); onNavigate('home'); }}
          className={`flex flex-col items-center gap-0.5 ${activeScreen === 'home' ? 'text-[#D4AF37] font-black' : 'opacity-85'}`}
        >
          <Compass className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => { soundEngine.playClick(); onNavigate('map'); }}
          className={`flex flex-col items-center gap-0.5 ${activeScreen === 'map' ? 'text-[#D4AF37] font-black' : 'opacity-85'}`}
        >
          <MapPin className="w-4 h-4" />
          <span>Adventures</span>
        </button>
        <button
          onClick={() => { soundEngine.playClick(); onNavigate('facts'); }}
          className={`flex flex-col items-center gap-0.5 ${activeScreen === 'facts' ? 'text-[#D4AF37] font-black' : 'opacity-85'}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Discoveries</span>
        </button>
        <button
          onClick={() => { soundEngine.playClick(); onNavigate('badges'); }}
          className={`flex flex-col items-center gap-0.5 ${activeScreen === 'badges' ? 'text-[#D4AF37] font-black' : 'opacity-85'}`}
        >
          <Award className="w-4 h-4" />
          <span>Medals</span>
        </button>
        <button
          onClick={() => { soundEngine.playClick(); onNavigate('leaderboard'); }}
          className={`flex flex-col items-center gap-0.5 ${activeScreen === 'leaderboard' ? 'text-[#D4AF37] font-black' : 'opacity-85'}`}
        >
          <Trophy className="w-4 h-4" />
          <span>Ranks</span>
        </button>
      </div>
    </header>
  );
};
