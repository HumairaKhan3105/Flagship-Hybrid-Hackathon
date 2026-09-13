import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Volume2,
  Lightbulb,
} from 'lucide-react';
import { MUSIC_RIDDLES, MusicRiddle } from '../data/riddlesData.ts';

interface MusicRiddleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MusicRiddleModal: React.FC<MusicRiddleModalProps> = ({ isOpen, onClose }) => {
  const [currentRiddle, setCurrentRiddle] = useState<MusicRiddle>(MUSIC_RIDDLES[0]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [usedIds, setUsedIds] = useState<string[]>([]);

  // Pick a new random riddle
  const pickRandomRiddle = () => {
    setSelectedIndex(null);
    setIsSubmitted(false);

    const remaining = MUSIC_RIDDLES.filter((r) => !usedIds.includes(r.id));
    const pool = remaining.length > 0 ? remaining : MUSIC_RIDDLES;
    const chosen = pool[Math.floor(Math.random() * pool.length)];

    setCurrentRiddle(chosen);
    setUsedIds((prev) => (remaining.length > 0 ? [...prev, chosen.id] : [chosen.id]));
  };

  useEffect(() => {
    if (isOpen) {
      pickRandomRiddle();
    }
  }, [isOpen]);

  // Audio Chime on correct answer (same as Quiz celebration)
  const playCelebrationAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 joyful arpeggio
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.45);
        });
      }
    } catch {
      // Audio context might be restricted
    }
  };

  // Trigger same animation as quiz celebration
  const triggerQuizCelebrationAnimation = () => {
    playCelebrationAudio();

    // Multi-stage confetti fireworks matching quiz celebration
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5, x: 0.5 },
      colors: ['#D97706', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.65 },
        colors: ['#F59E0B', '#10B981', '#D97706'],
      });
    }, 120);

    setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.65 },
        colors: ['#3B82F6', '#F59E0B', '#EC4899'],
      });
    }, 240);
  };

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedIndex(idx);
    setIsSubmitted(true);

    if (idx === currentRiddle.correctIndex) {
      setStreak((prev) => prev + 1);
      triggerQuizCelebrationAnimation();
    } else {
      setStreak(0);
    }
  };

  if (!isOpen) return null;

  const isCorrect = selectedIndex === currentRiddle.correctIndex;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative z-10 w-full max-w-xl bg-stone-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold text-white tracking-wide">
                  Musical Riddle & Fact
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {currentRiddle.category}
                </span>
              </div>
              <p className="text-xs text-stone-400">Can you deduce the mystery instrument?</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Riddle Body */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-stone-950/70 border border-amber-500/20 relative overflow-hidden">
            <div className="absolute top-2 right-3 opacity-15">
              <HelpCircle className="w-16 h-16 text-amber-400" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400/90 block mb-2">
              Ancient Acoustic Riddle
            </span>
            <p className="font-serif text-lg sm:text-xl text-amber-100 font-medium leading-relaxed italic">
              “{currentRiddle.riddle}”
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentRiddle.options.map((option, idx) => {
              const isSelected = selectedIndex === idx;
              const isOptionCorrect = idx === currentRiddle.correctIndex;

              let btnStyle =
                'bg-stone-800/80 border-stone-700/80 hover:bg-stone-800 text-stone-200 hover:border-amber-400/50';

              if (isSubmitted) {
                if (isOptionCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold ring-1 ring-emerald-500/50';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 font-semibold';
                } else {
                  btnStyle = 'bg-stone-900/40 border-stone-800 text-stone-500 opacity-60';
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isSubmitted}
                  className={`flex items-center justify-between p-4 rounded-xl border text-left text-sm font-medium transition-all duration-200 active:scale-[0.98] ${btnStyle}`}
                >
                  <span>{option}</span>
                  {isSubmitted && isOptionCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                  )}
                  {isSubmitted && isSelected && !isOptionCorrect && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Outcome & Explanation Reveal */}
          {isSubmitted && (
            <div
              className={`p-5 rounded-2xl border animate-in fade-in duration-300 ${
                isCorrect
                  ? 'bg-gradient-to-br from-emerald-950/70 to-amber-950/40 border-emerald-500/40'
                  : 'bg-stone-950/80 border-rose-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <>
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                      <span className="font-serif font-bold text-base text-emerald-300">
                        Shabaash! You identified the {currentRiddle.instrumentName}!
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6 rounded-full bg-rose-500 text-stone-950 flex items-center justify-center font-bold text-xs">
                        ✕
                      </div>
                      <span className="font-serif font-bold text-base text-rose-300">
                        The answer is {currentRiddle.instrumentName} ({currentRiddle.instrumentHindi})
                      </span>
                    </>
                  )}
                </div>

                {streak > 1 && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/30 border border-amber-400/40 text-amber-200">
                    🔥 {streak} in a row
                  </span>
                )}
              </div>

              <div className="flex items-start gap-2.5 mt-3 pt-3 border-t border-stone-800 text-xs text-stone-300 leading-relaxed">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-amber-200 font-semibold">Living Heritage Fact: </strong>
                  {currentRiddle.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-800">
            <span className="text-xs text-stone-400">
              {isSubmitted ? 'Ready for another musical mystery?' : 'Select your answer above'}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={pickRandomRiddle}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition-all active:scale-95 shadow-md shadow-amber-500/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Next Riddle</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
