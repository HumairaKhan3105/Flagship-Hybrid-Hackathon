import { useState, useEffect } from 'react';
import { WeaverLevel, WeaverPatternOption, PlayerProfile } from '../../types';
import { GAME_ASSETS } from '../../data/gameData';
import { 
  Sparkles, 
  HelpCircle, 
  Check, 
  Clock, 
  Heart, 
  Star, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface WeaversChallengeScreenProps {
  level: WeaverLevel;
  player: PlayerProfile;
  onSuccess: () => void;
  onFailLife: () => void;
}

export default function WeaversChallengeScreen({
  level,
  player,
  onSuccess,
  onFailLife,
}: WeaversChallengeScreenProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(level.timeLimitSeconds);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          soundManager.playWrong();
          onFailLife();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onFailLife]);

  const handleSubmit = () => {
    if (!selectedOptionId) return;

    const chosen = level.options.find(o => o.id === selectedOptionId);
    if (chosen?.isCorrect) {
      soundManager.playLoomShuttle();
      soundManager.playCorrectFanfare();
      setFeedbackState('correct');
      setTimeout(() => {
        onSuccess();
      }, 700);
    } else {
      soundManager.playWrong();
      setFeedbackState('wrong');
      onFailLife();
      setTimeout(() => {
        setFeedbackState('idle');
      }, 1200);
    }
  };

  // Render SVG pattern graphics for the 4 swatches (A, B, C, D)
  const renderPatternGraphics = (opt: WeaverPatternOption) => {
    switch (opt.svgMotif) {
      case 'floral_jal': // Banarasi Brocade
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full opacity-90">
            <defs>
              <pattern id="brocadeGrid" width="25" height="25" patternUnits="userSpaceOnUse">
                <circle cx="12.5" cy="12.5" r="4.5" fill="#f5c042" stroke="#fff3b0" strokeWidth="0.8" />
                <path d="M 0 12.5 Q 12.5 0 25 12.5 Q 12.5 25 0 12.5" fill="none" stroke="#f5c042" strokeWidth="1.2" />
                <path d="M 12.5 0 Q 25 12.5 12.5 25 Q 0 12.5 12.5 0" fill="none" stroke="#ffd700" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#brocadeGrid)" />
          </svg>
        );
      case 'bandhani_dots': // Bandhani dots
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full opacity-90">
            <defs>
              <pattern id="bandhaniGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="3.2" fill="#fff" />
                <circle cx="10" cy="10" r="1.8" fill="#facc15" />
                <circle cx="2" cy="2" r="1.8" fill="#fff" />
                <circle cx="18" cy="18" r="1.8" fill="#fff" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#bandhaniGrid)" />
          </svg>
        );
      case 'peacock': // Paithani Peacock
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full opacity-90">
            <defs>
              <pattern id="peacockGrid" width="33" height="33" patternUnits="userSpaceOnUse">
                <circle cx="16.5" cy="16.5" r="9" fill="none" stroke="#f5c042" strokeWidth="1.5" />
                <path d="M 12 16 Q 16.5 8 21 16 Q 16.5 24 12 16 Z" fill="#047857" stroke="#fde047" strokeWidth="0.8" />
                <circle cx="16.5" cy="14" r="2" fill="#3b82f6" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#peacockGrid)" />
          </svg>
        );
      case 'ikat_geometry': // Sambalpuri / Patola Ikat
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full opacity-90">
            <defs>
              <pattern id="ikatGrid" width="25" height="25" patternUnits="userSpaceOnUse">
                <path d="M 12.5 0 L 25 12.5 L 12.5 25 L 0 12.5 Z" fill="none" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="1.5 1.5" />
                <circle cx="12.5" cy="12.5" r="3.5" fill="#c084fc" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#ikatGrid)" />
          </svg>
        );
    }
  };

  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-between p-4 sm:p-6 overflow-y-auto select-none">
      {/* Background: Palace Weaver Pit Loom Workshop */}
      <div className="absolute inset-0 z-0">
        <img
          src={GAME_ASSETS.weaverWorkshop}
          alt="Weaver Pit Loom Workshop"
          className="w-full h-full object-cover filter brightness-45"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-[#0b1322]/75 to-[#070d18]/90" />
      </div>

      {/* Top Banner: Level Title & Progress Bar (Matching Middle-Left Screen) */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-amber-500/30 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950/90 border border-amber-400 flex items-center justify-center text-amber-300 shadow">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-amber-200 uppercase tracking-wider">
              {level.title}
            </h2>
            <p className="text-xs font-marcellus text-stone-300">
              Region: <span className="text-amber-300 font-semibold">{level.regionName}</span>
            </p>
          </div>
        </div>

        {/* Level Progress Indicator */}
        <div className="flex items-center gap-3 w-full sm:w-64">
          <div className="flex-1 bg-stone-900/90 h-3 rounded-full border border-amber-500/30 overflow-hidden p-0.5 shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 shadow-[0_0_8px_#f5c042]"
              style={{ width: '65%' }}
            />
          </div>
          <span className="text-xs font-cinzel font-bold text-amber-300">
            65%
          </span>
        </div>
      </div>

      {/* Main Challenge Layout: Left Loom Scene Callout + Right 4-Pattern Swatch Board */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-3">
        {/* Left Side: Weaver's Loom Artisan Preview */}
        <div className="md:col-span-4 royal-glass-card rounded-2xl p-4 border border-amber-500/40 shadow-xl flex flex-col items-center text-center">
          <div className="w-full h-52 sm:h-64 rounded-xl overflow-hidden border border-amber-500/30 relative shadow-inner group">
            <img
              src={GAME_ASSETS.weaverWorkshop}
              alt="Artisan Pit Loom"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <span className="absolute bottom-2 left-3 text-[11px] font-cinzel font-bold text-amber-300">
              Pit-Loom Jacquard Silk Shuttle
            </span>
          </div>

          <div className="mt-3 text-left w-full">
            <p className="text-xs font-marcellus text-stone-300 leading-relaxed">
              Master weavers operate foot pedals and hand shuttles, weaving up to 10,000 warp threads with pure zari.
            </p>
          </div>
        </div>

        {/* Right Side: Parchment Puzzle Board & 4 Pattern Swatches */}
        <div className="md:col-span-8 parchment-bg rounded-2xl p-5 sm:p-7 border-2 border-amber-600/40 shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-amber-900/20 pb-2 mb-3">
            <h3 className="text-base sm:text-lg font-cinzel font-bold text-amber-950 tracking-wide uppercase">
              {level.prompt}
            </h3>
            <span className="text-xs font-cinzel font-semibold text-amber-800">
              Reward: +{level.pointsReward} Pts
            </span>
          </div>

          {/* 4 Swatch Tiles: A, B, C, D (Matching Reference Middle-Left Screen) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 my-3">
            {level.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedOptionId(opt.id);
                  }}
                  className={`relative p-3 rounded-xl border-2 transition-all duration-200 text-left flex flex-col group ${
                    isSelected
                      ? 'border-amber-600 bg-amber-100/95 shadow-[0_0_20px_rgba(212,154,35,0.45)] ring-2 ring-amber-500 scale-[1.02]'
                      : 'border-amber-800/30 bg-white/70 hover:bg-white/90 hover:border-amber-600/60'
                  }`}
                >
                  {/* Swatch Header: Letter Circle */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-amber-900 text-amber-200 text-xs font-cinzel font-bold flex items-center justify-center shadow">
                      {opt.letter}
                    </span>
                    <span className="text-[10px] font-cinzel font-semibold text-amber-800">
                      {opt.region}
                    </span>
                  </div>

                  {/* Swatch Pattern Visual Display */}
                  <div 
                    className="w-full h-24 sm:h-28 rounded-lg overflow-hidden border border-amber-900/30 shadow-inner relative flex items-center justify-center"
                    style={{ backgroundColor: opt.bgColor }}
                  >
                    {renderPatternGraphics(opt)}
                    {/* Selected Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-amber-900/30 backdrop-blur-[1px] flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Motif Title */}
                  <div className="mt-2">
                    <h4 className="text-xs sm:text-sm font-cinzel font-bold text-stone-900 group-hover:text-amber-900">
                      {opt.name}
                    </h4>
                    <p className="text-[11px] font-marcellus text-stone-700 leading-tight mt-0.5 line-clamp-1">
                      {opt.motifName}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sahana Companion Hint Speech Bubble */}
          <div className="mt-4 p-3 rounded-xl bg-amber-900/10 border border-amber-800/30 flex items-center gap-3">
            <img
              src={GAME_ASSETS.sahanaAvatar}
              alt="Sahana Guide"
              className="w-10 h-10 rounded-full object-cover border border-amber-700 flex-shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 text-left text-xs font-marcellus text-stone-800 italic">
              {showHint ? (
                <span className="font-semibold text-amber-950">{level.companionHint}</span>
              ) : (
                <span>"Look carefully at the motifs. The pattern can reveal where the textile comes from." — Sahana</span>
              )}
            </div>
            {!showHint && (
              <button
                onClick={() => {
                  soundManager.playChime();
                  setShowHint(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-amber-100 font-cinzel font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 flex-shrink-0 shadow"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>HINT</span>
              </button>
            )}
          </div>

          {/* Submit Button (Matching Reference Screen) */}
          <div className="mt-4 flex items-center justify-end gap-3">
            {feedbackState === 'wrong' && (
              <span className="text-xs font-cinzel font-bold text-rose-700 flex items-center gap-1 animate-bounce">
                <AlertCircle className="w-4 h-4" />
                Incorrect weave! Lost 1 life. Try again!
              </span>
            )}
            <button
              disabled={!selectedOptionId}
              onClick={handleSubmit}
              className={`py-3 px-8 rounded-xl font-cinzel font-bold text-sm tracking-widest uppercase shadow-xl transition-all flex items-center justify-center gap-2 ${
                selectedOptionId
                  ? 'text-stone-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 border border-amber-200 active:scale-95 cursor-pointer'
                  : 'bg-stone-400/50 text-stone-600 border border-stone-400/30 cursor-not-allowed'
              }`}
            >
              <span>SUBMIT ANSWER</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
