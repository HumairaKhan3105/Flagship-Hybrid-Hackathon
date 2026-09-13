import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { MONUMENTS } from '../../data/monuments';
import { Map, BookOpen, Sparkles, Volume2, VolumeX, Lightbulb, Compass, Award, Shield } from 'lucide-react';

interface GameHUDProps {
  onOpenGuide: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ onOpenGuide }) => {
  const {
    currentLocation,
    quests,
    currentQuestIndex,
    xp,
    level,
    score,
    hintsRemaining,
    useHint,
    isMuted,
    toggleMute,
    setActiveModal,
    activeModal
  } = useGameStore();

  const monument = MONUMENTS[currentLocation] || MONUMENTS.bazaar;
  const currentQuest = quests[currentQuestIndex] || quests[0];

  // Calculate level progress (300 XP per level)
  const currentLevelXP = xp % 300;
  const xpPercentage = Math.min(100, Math.round((currentLevelXP / 300) * 100));

  const handleHintClick = () => {
    if (hintsRemaining > 0) {
      useHint();
      onOpenGuide();
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 md:p-6 select-none">
      {/* TOP ROW */}
      <header className="flex items-start justify-between w-full gap-4">
        {/* Top Left: Explorer Stats */}
        <div className="pointer-events-auto flex items-center gap-3.5 bg-stone-950/80 backdrop-blur-md border border-amber-900/40 rounded-2xl px-4 py-2.5 shadow-xl box-stone">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 to-amber-900 border border-amber-400/40 shadow-inner">
            <Shield className="w-6 h-6 text-amber-100" />
            <span className="absolute -bottom-1 -right-1 bg-amber-400 text-stone-950 font-serif font-black text-xs px-1.5 py-0.2 rounded-md shadow-sm">
              L{level}
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm font-semibold text-amber-200 tracking-wide">
                Heritage Explorer
              </span>
              <span className="text-xs text-amber-400/80 font-mono">
                {score} PTS
              </span>
            </div>

            {/* XP Bar */}
            <div className="flex items-center gap-2 mt-1">
              <div className="w-24 sm:w-32 h-2 bg-stone-800 rounded-full overflow-hidden border border-amber-950">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-300"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-amber-300/70">
                {currentLevelXP}/300 XP
              </span>
            </div>
          </div>
        </div>

        {/* Center Top: Monument Location Title */}
        <div className="hidden md:flex flex-col items-center justify-center pointer-events-auto bg-stone-950/70 backdrop-blur-md border border-amber-900/30 rounded-2xl px-6 py-2 shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 text-xs tracking-widest font-serif uppercase">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            <span>{monument.kannadaName}</span>
          </div>
          <h2 className="font-serif font-bold text-lg text-amber-100 gold-glow">
            {monument.name}
          </h2>
          <p className="text-[11px] text-stone-400 max-w-xs text-center truncate">
            {monument.tagline}
          </p>
        </div>

        {/* Top Right: Nav Buttons */}
        <nav aria-label="Game navigation" className="pointer-events-auto flex items-center gap-2">
          {/* Map Button */}
          <button
            onClick={() => setActiveModal(activeModal === 'map' ? null : 'map')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all text-xs font-serif font-semibold shadow-md cursor-pointer ${
              activeModal === 'map'
                ? 'bg-amber-600 text-stone-950 border-amber-300 box-gold-glow'
                : 'bg-stone-950/80 hover:bg-stone-900 text-amber-200 border-amber-900/50 hover:border-amber-500/60'
            }`}
            title="Open Hampi Map [M]"
          >
            <Map className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">MAP</span>
            <kbd className="hidden lg:inline text-[9px] bg-stone-800 text-amber-400/80 px-1 rounded">M</kbd>
          </button>

          {/* Journal Button */}
          <button
            onClick={() => setActiveModal(activeModal === 'journal' ? null : 'journal')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all text-xs font-serif font-semibold shadow-md cursor-pointer ${
              activeModal === 'journal'
                ? 'bg-amber-600 text-stone-950 border-amber-300 box-gold-glow'
                : 'bg-stone-950/80 hover:bg-stone-900 text-amber-200 border-amber-900/50 hover:border-amber-500/60'
            }`}
            title="Open Historical Journal [I]"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">JOURNAL</span>
            <kbd className="hidden lg:inline text-[9px] bg-stone-800 text-amber-400/80 px-1 rounded">I</kbd>
          </button>

          {/* Hint Button */}
          <button
            onClick={handleHintClick}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-950/80 hover:bg-amber-950/70 border border-amber-900/50 hover:border-amber-500/60 text-amber-200 text-xs font-serif font-semibold shadow-md transition-all cursor-pointer"
            title="Ask Historian for a Hint [H]"
          >
            <Lightbulb className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="hidden sm:inline">HINT</span>
            <span className="bg-amber-900/80 text-amber-300 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
              {hintsRemaining}
            </span>
          </button>

          {/* Mute Toggle */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl bg-stone-950/80 hover:bg-stone-900 border border-amber-900/50 text-amber-400 shadow-md transition-all cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </nav>
      </header>

      {/* BOTTOM ROW */}
      <footer className="flex items-end justify-between w-full gap-4">
        {/* Bottom Left: Floating AI Historian Guide Avatar Trigger */}
        <div className="pointer-events-auto">
          <button
            onClick={onOpenGuide}
            className="group flex items-center gap-3 px-4 py-2.5 bg-stone-950/85 hover:bg-amber-950/90 border border-amber-500/40 hover:border-amber-400 rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer box-gold-glow"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-amber-700 to-amber-400 border border-amber-200 flex items-center justify-center shadow-md">
              <span className="text-xl">🧑🏽‍🏫</span>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-stone-900" />
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-serif font-bold">
                <span>ACHARYA VIDYADHAR</span>
                <Sparkles className="w-3 h-3 text-amber-300 group-hover:rotate-45 transition-transform" />
              </div>
              <p className="text-[11px] text-stone-300 font-sans truncate max-w-[180px] sm:max-w-[240px]">
                Click to consult the AI Historian...
              </p>
            </div>
          </button>
        </div>

        {/* Bottom Center / Right: Current Quest Card */}
        <div className="pointer-events-auto max-w-sm sm:max-w-md w-full bg-stone-950/85 backdrop-blur-md border border-amber-700/40 rounded-2xl p-3.5 shadow-2xl box-stone">
          <div className="flex items-center justify-between border-b border-amber-900/40 pb-1.5 mb-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-serif font-bold px-2 py-0.5 rounded-md">
                QUEST 0{currentQuest.number}
              </span>
              <h4 className="font-serif font-bold text-sm text-amber-100 truncate">
                {currentQuest.title}
              </h4>
            </div>
            <span className="text-[11px] font-mono text-amber-400 font-semibold flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-yellow-400" />
              +{currentQuest.rewardXP} XP
            </span>
          </div>

          <p className="text-xs text-stone-300 mb-2 font-medium">
            {currentQuest.objective}
          </p>

          {/* Quest Steps Checklist */}
          <div className="space-y-1">
            {currentQuest.steps.map(step => (
              <div key={step.id} className="flex items-center gap-2 text-[11px]">
                <div
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] font-bold ${
                    step.isCompleted
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'border border-stone-600 bg-stone-900 text-transparent'
                  }`}
                >
                  ✓
                </div>
                <span
                  className={
                    step.isCompleted
                      ? 'line-through text-stone-500'
                      : 'text-amber-200/90'
                  }
                >
                  {step.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
