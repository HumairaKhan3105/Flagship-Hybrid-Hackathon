import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  HelpCircle, 
  Sparkles, 
  Star, 
  Coins, 
  Flame, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  X, 
  BookOpen, 
  Volume2,
  Lightbulb,
  Hourglass,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { LevelData, GameCategory, UserProgress } from '../types';
import { CHARACTERS } from '../data/characters';
import { CATEGORIES } from '../data/categories';
import { soundEngine } from '../utils/audio';

interface GameplayEngineProps {
  level: LevelData;
  progress: UserProgress;
  onCompleteLevel: (stars: number, xpGained: number, coinsGained: number) => void;
  onNextLevel: () => void;
  onExit: () => void;
}

export const GameplayEngine: React.FC<GameplayEngineProps> = ({
  level,
  progress,
  onCompleteLevel,
  onNextLevel,
  onExit,
}) => {
  const initialTime = level.timeLimit || 30;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Gameplay state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Power-up states
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [used5050, setUsed5050] = useState(false);
  const [usedExtraTime, setUsedExtraTime] = useState(false);

  // Match-pairs specific state (if level is match-pairs)
  const [selectedPairLeft, setSelectedPairLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  // Result state
  const [showCelebration, setShowCelebration] = useState(false);
  const [showTimeOut, setShowTimeOut] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);

  // Character guide for this level
  const character = CHARACTERS.find((c) => c.id === level.characterId) || CHARACTERS[0];
  const categoryMeta = CATEGORIES.find((c) => c.id === level.category);

  // Audio tone preview if instrument level
  useEffect(() => {
    if (level.category === 'instruments' && level.soundType) {
      const timer = setTimeout(() => {
        soundEngine.playInstrument(level.soundType as any);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [level]);

  // Timer loop
  useEffect(() => {
    if (!isTimerRunning || isSubmitted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          handleTimeOut();
          return 0;
        }
        if (prev === 6) {
          soundEngine.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, isSubmitted]);

  // Handle Timeout
  const handleTimeOut = () => {
    soundEngine.playWrong();
    setIsSubmitted(true);
    setIsCorrect(false);
    setShowTimeOut(true);
  };

  // Handle multiple-choice option click
  const handleOptionClick = (option: string) => {
    if (isSubmitted) return;
    soundEngine.playClick();
    setSelectedOption(option);
    checkAnswer(option);
  };

  // Verify answer
  const checkAnswer = (answer: string) => {
    setIsSubmitted(true);
    setIsTimerRunning(false);

    const correct = answer === level.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      soundEngine.playCorrect();

      // Calculate stars (3 stars if fast & no hint, 2 stars if hint or medium time, 1 star otherwise)
      let stars = 3;
      if (showHint || used5050) stars = 2;
      if (timeLeft < 8) stars = Math.min(stars, 2);

      setEarnedStars(stars);

      // Trigger Confetti
      try {
        confetti({
          particleCount: stars === 3 ? 80 : 40,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899'],
        });
      } catch (e) {
        // Fallback gracefully
      }

      // Small delay then show celebratory screen
      setTimeout(() => {
        soundEngine.playLevelComplete();
        setShowCelebration(true);
        const xp = stars * 40 + (timeLeft > 15 ? 30 : 10);
        const coins = stars * 10 + (timeLeft > 20 ? 15 : 5);
        onCompleteLevel(stars, xp, coins);
      }, 1200);
    } else {
      soundEngine.playWrong();
    }
  };

  // Match-pairs logic
  const handlePairClick = (side: 'left' | 'right', text: string, pairId: string) => {
    if (isSubmitted) return;
    soundEngine.playClick();

    if (side === 'left') {
      setSelectedPairLeft(pairId);
    } else if (side === 'right' && selectedPairLeft) {
      if (selectedPairLeft === pairId) {
        soundEngine.playCorrect();
        const nextMatched = [...matchedPairs, pairId];
        setMatchedPairs(nextMatched);
        setSelectedPairLeft(null);

        if (level.pairs && nextMatched.length === level.pairs.length) {
          // All pairs matched!
          setIsSubmitted(true);
          setIsCorrect(true);
          setEarnedStars(3);
          setTimeout(() => {
            soundEngine.playLevelComplete();
            setShowCelebration(true);
            onCompleteLevel(3, 150, 40);
          }, 800);
        }
      } else {
        soundEngine.playWrong();
        setSelectedPairLeft(null);
      }
    }
  };

  // Power-up: 50-50
  const handleUse5050 = () => {
    if (used5050 || isSubmitted || level.gameType !== 'multiple-choice') return;
    soundEngine.playClick();
    setUsed5050(true);

    const wrongOptions = (level.options || []).filter((opt) => opt !== level.correctAnswer);
    const toEliminate = wrongOptions.slice(0, 2);
    setEliminatedOptions(toEliminate);
  };

  // Power-up: Extra Time (+15s)
  const handleUseExtraTime = () => {
    if (usedExtraTime || isSubmitted) return;
    soundEngine.playClick();
    setUsedExtraTime(true);
    setTimeLeft((prev) => prev + 15);
  };

  // Power-up: Reveal Clue / Hint
  const handleRevealHint = () => {
    soundEngine.playClick();
    setShowHint(true);
  };

  // Restart current level
  const handleRetry = () => {
    soundEngine.playLevelStart();
    setTimeLeft(initialTime);
    setIsTimerRunning(true);
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setShowHint(false);
    setEliminatedOptions([]);
    setUsed5050(false);
    setUsedExtraTime(false);
    setShowCelebration(false);
    setShowTimeOut(false);
    setMatchedPairs([]);
    setSelectedPairLeft(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Top Header Bar: Level Title, Progress, Exit & Timer in Natural Tones */}
      <div className="bg-white border-b-4 border-r-4 border-[#5D4037] border-t-2 border-l-2 border-[#5D4037] rounded-2xl p-3 sm:p-4 shadow-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <button
            id="gameplay-exit-btn"
            onClick={() => {
              soundEngine.playClick();
              onExit();
            }}
            className="px-3 py-1.5 rounded-xl bg-[#FDF5E6] hover:bg-[#5D4037] hover:text-white border-2 border-[#5D4037] text-[#5D4037] text-xs font-black uppercase tracking-wider transition-colors"
          >
            ← Exit
          </button>
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase text-[#8D6E63] tracking-wider">
              {categoryMeta?.name} • Level {level.level}
            </span>
            <h2 className="font-heading text-sm sm:text-lg font-black text-[#5D4037] uppercase leading-tight">
              {level.title}
            </h2>
          </div>
        </div>

        {/* Timer & Lifelines */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-mono font-bold text-sm sm:text-base shadow-sm ${
              timeLeft <= 5
                ? 'bg-[#8B0000] text-white border-red-400 animate-pulse'
                : 'bg-[#4A3728] text-[#FFD700] border-[#D4AF37]'
            }`}
          >
            <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-white animate-spin' : 'text-[#FFD700]'}`} />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Main Question Card with Detective Companion Dialogue in Natural Tones */}
      <div className="bg-white border-b-8 border-r-8 border-[#5D4037] border-t-2 border-l-2 border-[#5D4037] rounded-3xl p-5 sm:p-7 shadow-sm space-y-4 relative overflow-hidden text-[#4A3728]">
        {/* Region Tag */}
        {level.region && (
          <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#FDF5E6] border border-[#8D6E63]/40 text-[#5D4037] text-xs font-bold uppercase">
            <MapPin className="w-3 h-3 text-[#D4AF37]" />
            <span>Region: {level.region}</span>
          </div>
        )}

        {/* Detective Dialogue & Question */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="relative shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FF9933] border-4 border-white shadow-md flex items-center justify-center text-3xl">
              {character.avatar}
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-[#5D4037] text-[#FDF5E6] text-[9px] font-black uppercase">
              Guide
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-[#5D4037] text-sm sm:text-base uppercase">
                {character.name} ({character.state})
              </span>
            </div>
            <p className="font-heading text-base sm:text-xl font-bold text-[#4A3728] mt-1 leading-snug">
              {level.question}
            </p>
          </div>
        </div>

        {/* Audio Listen Button if Instrument */}
        {level.category === 'instruments' && level.soundType && (
          <div className="pt-1">
            <button
              onClick={() => soundEngine.playInstrument(level.soundType as any)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FDF5E6] hover:bg-[#D4AF37] text-[#5D4037] text-xs font-bold border-2 border-[#5D4037] shadow-sm transition-colors uppercase tracking-wider"
            >
              <Volume2 className="w-4 h-4 text-[#5D4037]" />
              <span>Listen to {level.title} Acoustic Tone</span>
            </button>
          </div>
        )}

        {/* Clue / Hint Box if revealed */}
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl bg-[#FDF5E6] border-2 border-[#D4AF37] text-xs text-[#4A3728] flex items-start gap-2 shadow-sm"
          >
            <Lightbulb className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <strong className="font-black text-[#5D4037] uppercase">Detective Clue:</strong> {level.hint}
            </div>
          </motion.div>
        )}

        {/* Power-ups / Lifeline Toolbar */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs">
          <span className="text-[#8D6E63] font-black uppercase tracking-wider hidden sm:inline">Detective Toolkit:</span>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-around sm:justify-end">
            <button
              id="powerup-5050-btn"
              onClick={handleUse5050}
              disabled={used5050 || isSubmitted || level.gameType !== 'multiple-choice'}
              className={`px-3 py-1.5 rounded-lg border-2 font-black uppercase text-xs flex items-center gap-1 transition-all ${
                used5050 || level.gameType !== 'multiple-choice'
                  ? 'bg-stone-100 text-stone-400 border-stone-300 cursor-not-allowed'
                  : 'bg-[#FDF5E6] hover:bg-[#D4AF37] text-[#5D4037] border-[#5D4037] shadow-sm'
              }`}
            >
              <span>50:50</span>
            </button>

            <button
              id="powerup-hint-btn"
              onClick={handleRevealHint}
              disabled={showHint || isSubmitted}
              className={`px-3 py-1.5 rounded-lg border-2 font-black uppercase text-xs flex items-center gap-1 transition-all ${
                showHint
                  ? 'bg-[#D4AF37] text-[#5D4037] border-[#5D4037]'
                  : 'bg-[#FDF5E6] hover:bg-[#D4AF37] text-[#5D4037] border-[#5D4037] shadow-sm'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-[#5D4037]" />
              <span>Clue</span>
            </button>

            <button
              id="powerup-time-btn"
              onClick={handleUseExtraTime}
              disabled={usedExtraTime || isSubmitted}
              className={`px-3 py-1.5 rounded-lg border-2 font-black uppercase text-xs flex items-center gap-1 transition-all ${
                usedExtraTime
                  ? 'bg-stone-100 text-stone-400 border-stone-300 cursor-not-allowed'
                  : 'bg-[#FDF5E6] hover:bg-[#D4AF37] text-[#5D4037] border-[#5D4037] shadow-sm'
              }`}
            >
              <Hourglass className="w-3.5 h-3.5 text-[#5D4037]" />
              <span>+15s</span>
            </button>
          </div>
        </div>
      </div>

      {/* Answer Area */}
      {level.gameType === 'match-pairs' && level.pairs ? (
        /* Match Pairs UI */
        <div className="parchment-card rounded-2xl p-4 sm:p-6 border-2 border-amber-800/40 shadow-xl space-y-4">
          <p className="text-xs text-amber-900 font-bold text-center">
            Tap a craft on the left, then tap its origin state on the right!
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            {/* Left side */}
            <div className="space-y-2">
              {level.pairs.map((p) => {
                const isMatched = matchedPairs.includes(p.id);
                const isSelected = selectedPairLeft === p.id;
                return (
                  <button
                    key={`l-${p.id}`}
                    onClick={() => handlePairClick('left', p.left, p.id)}
                    disabled={isMatched || isSubmitted}
                    className={`w-full p-3 rounded-xl font-bold text-xs sm:text-sm border-2 text-left transition-all ${
                      isMatched
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-500 opacity-80'
                        : isSelected
                        ? 'bg-amber-300 text-amber-950 border-amber-600 scale-102 shadow-md'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
                    }`}
                  >
                    {p.left} {isMatched && '✓'}
                  </button>
                );
              })}
            </div>

            {/* Right side */}
            <div className="space-y-2">
              {level.pairs.map((p) => {
                const isMatched = matchedPairs.includes(p.id);
                return (
                  <button
                    key={`r-${p.id}`}
                    onClick={() => handlePairClick('right', p.right, p.id)}
                    disabled={isMatched || isSubmitted}
                    className={`w-full p-3 rounded-xl font-bold text-xs sm:text-sm border-2 text-left transition-all ${
                      isMatched
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-500 opacity-80'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
                    }`}
                  >
                    {p.right} {isMatched && '✓'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Multiple Choice UI in Natural Tones */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {(level.options || []).map((option, idx) => {
            const isEliminated = eliminatedOptions.includes(option);
            const isChosen = selectedOption === option;
            const isTheCorrectOne = option === level.correctAnswer;

            let cardStyles = 'bg-white hover:bg-[#FDF5E6] text-[#4A3728] border-b-4 border-r-4 border-[#5D4037] border-t-2 border-l-2 border-[#5D4037] shadow-sm';

            if (isSubmitted) {
              if (isTheCorrectOne) {
                cardStyles = 'bg-[#2E7D32] text-white border-b-4 border-r-4 border-[#1B5E20] border-t-2 border-l-2 border-[#1B5E20] shadow-lg scale-102';
              } else if (isChosen && !isCorrect) {
                cardStyles = 'bg-[#8B0000] text-white border-b-4 border-r-4 border-[#450000] border-t-2 border-l-2 border-[#450000] shadow-md animate-shake';
              } else {
                cardStyles = 'bg-stone-100 text-stone-400 border-2 border-stone-200 opacity-60';
              }
            } else if (isEliminated) {
              cardStyles = 'bg-stone-100 text-stone-400 border-2 border-stone-200 line-through opacity-40 cursor-not-allowed';
            }

            return (
              <motion.button
                key={idx}
                whileHover={!isSubmitted && !isEliminated ? { scale: 1.02 } : {}}
                whileTap={!isSubmitted && !isEliminated ? { scale: 0.98 } : {}}
                onClick={() => !isEliminated && handleOptionClick(option)}
                disabled={isSubmitted || isEliminated}
                className={`p-4 rounded-2xl font-bold text-left transition-all flex items-center justify-between group cursor-pointer ${cardStyles}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0 border ${
                    isSubmitted && isTheCorrectOne 
                      ? 'bg-white text-[#2E7D32] border-white'
                      : isSubmitted && isChosen && !isCorrect
                      ? 'bg-white text-[#8B0000] border-white'
                      : 'bg-[#D4AF37] text-[#5D4037] border-[#5D4037]'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm sm:text-base font-bold leading-snug">{option}</span>
                </div>

                {isSubmitted && isTheCorrectOne && (
                  <div className="w-7 h-7 rounded-full bg-white text-[#2E7D32] flex items-center justify-center shrink-0 shadow">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
                {isSubmitted && isChosen && !isCorrect && (
                  <div className="w-7 h-7 rounded-full bg-white text-[#8B0000] flex items-center justify-center shrink-0 shadow">
                    <X className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Answer Feedback / Explanation Banner when submitted */}
      {isSubmitted && !showCelebration && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 sm:p-5 rounded-2xl border-b-4 border-r-4 border-t-2 border-l-2 shadow-lg ${
            isCorrect
              ? 'bg-[#E8F5E9] border-[#2E7D32] text-[#1B5E20]'
              : 'bg-[#FFEBEE] border-[#8B0000] text-[#8B0000]'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow ${
                isCorrect ? 'bg-[#2E7D32] text-white' : 'bg-[#8B0000] text-white'
              }`}
            >
              {isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <h4 className="font-black text-sm sm:text-base uppercase">
                {isCorrect ? 'Splendid Deduction, Detective!' : 'Not Quite Right!'}
              </h4>
              <p className="text-xs sm:text-sm mt-1 leading-relaxed font-medium">
                {level.explanation}
              </p>
              {!isCorrect && (
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={handleRetry}
                    className="px-4 py-1.5 rounded-xl bg-[#FF9933] hover:bg-[#E65100] text-white font-black uppercase text-xs flex items-center gap-1.5 shadow"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                  <button
                    onClick={onExit}
                    className="px-3.5 py-1.5 rounded-xl bg-white border-2 border-[#5D4037] text-[#5D4037] font-black uppercase text-xs hover:bg-[#5D4037] hover:text-white transition-colors"
                  >
                    Back to Map
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Celebration Screen Modal in Natural Tones */}
      <AnimatePresence>
        {showCelebration && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[#FDF5E6] w-full max-w-lg rounded-3xl p-6 sm:p-8 border-4 border-[#5D4037] shadow-2xl space-y-6 text-center text-[#4A3728]"
            >
              {/* Stars Animation */}
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#8D6E63]">
                  MYSTERY SOLVED!
                </span>
                <h2 className="font-heading text-2xl sm:text-4xl font-black uppercase text-[#5D4037] mt-1">
                  Level {level.level} Mastered!
                </h2>

                <div className="flex items-center justify-center gap-2 my-4">
                  {[1, 2, 3].map((starIdx) => (
                    <motion.div
                      key={starIdx}
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2 + starIdx * 0.15, type: 'spring' }}
                    >
                      <Star
                        className={`w-10 h-10 sm:w-12 sm:h-12 ${
                          starIdx <= earnedStars
                            ? 'fill-[#FFD700] text-[#D4AF37] drop-shadow-md'
                            : 'text-stone-300'
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Rewards Box */}
              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                <div className="bg-white p-3 rounded-2xl border-2 border-[#5D4037]/20 shadow-sm">
                  <span className="text-xs text-[#8D6E63] font-bold uppercase block">XP Earned</span>
                  <span className="text-lg font-black text-[#5D4037]">
                    +{earnedStars * 40} XP
                  </span>
                </div>
                <div className="bg-white p-3 rounded-2xl border-2 border-[#5D4037]/20 shadow-sm">
                  <span className="text-xs text-[#8D6E63] font-bold uppercase block">Coins Awarded</span>
                  <div className="flex items-center justify-center gap-1 text-lg font-black text-[#D4AF37]">
                    <Coins className="w-5 h-5 fill-yellow-400" />
                    <span>+{earnedStars * 10}</span>
                  </div>
                </div>
              </div>

              {/* Cultural Did You Know Fact */}
              {level.fact && (
                <div className="bg-white p-4 rounded-2xl border-2 border-[#5D4037]/20 text-left space-y-1 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#5D4037]">
                    <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                    <span>Cultural Discovery Unlocked:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4A3728] leading-relaxed font-medium">
                    "{level.fact}"
                  </p>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  id="celebration-replay-btn"
                  onClick={handleRetry}
                  className="w-full sm:w-1/3 py-3 rounded-xl bg-white hover:bg-stone-100 border-2 border-[#5D4037] text-[#5D4037] font-black uppercase text-sm transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Replay</span>
                </button>

                <button
                  id="celebration-next-btn"
                  onClick={() => {
                    soundEngine.playLevelStart();
                    onNextLevel();
                  }}
                  className="w-full sm:w-2/3 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] border-2 border-[#8BC34A] text-white font-black uppercase text-base shadow-xl flex items-center justify-center gap-2 hover:scale-102 transition-transform"
                >
                  <span>Next Case</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
