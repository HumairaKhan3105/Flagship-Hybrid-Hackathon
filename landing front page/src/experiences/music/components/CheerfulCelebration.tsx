import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Music } from 'lucide-react';

interface CheerfulCelebrationProps {
  show: boolean;
  pointsEarned: number;
  streak: number;
  onComplete?: () => void;
}

const celebratoryTitles = [
  'Wah! Heritage Master! 🪕',
  'Shabaash! Spot On! 🎉',
  'Sangeet Genius! 🎶',
  'Flawless Heritage Answer! ✨',
  'Splendid Knowledge! 🪘',
];

export const CheerfulCelebration: React.FC<CheerfulCelebrationProps> = ({
  show,
  pointsEarned,
  streak,
}) => {
  useEffect(() => {
    if (!show) return;

    // 1. Play joyful sound chime
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 joyful arpeggio
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
          gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.07);
          osc.stop(ctx.currentTime + idx * 0.07 + 0.4);
        });
      }
    } catch (e) {
      // Audio context might be restricted
    }

    // 2. Multi-stage screen-wide confetti fireworks
    confetti({
      particleCount: 90,
      spread: 120,
      origin: { y: 0.55, x: 0.5 },
      colors: ['#D97706', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
    });

    const timeout1 = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 60,
        origin: { x: 0.05, y: 0.7 },
        colors: ['#F59E0B', '#10B981', '#D97706'],
      });
    }, 150);

    const timeout2 = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 60,
        origin: { x: 0.95, y: 0.7 },
        colors: ['#3B82F6', '#F59E0B', '#EC4899'],
      });
    }, 300);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [show]);

  if (!show) return null;

  const randomTitle = celebratoryTitles[Math.floor(Math.random() * celebratoryTitles.length)];

  return (
    <div
      id="cheerful-celebration-overlay"
      className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center overflow-hidden animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Radiant ambient glow */}
      <div className="absolute inset-0 bg-amber-500/10 backdrop-blur-[2px] transition-opacity" />

      {/* Floating cheerful musical symbols across screen */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute left-[10%] top-[20%] text-4xl animate-bounce text-amber-500/80 delay-75">
          🎵
        </span>
        <span className="absolute right-[12%] top-[25%] text-5xl animate-bounce text-emerald-500/80 delay-150">
          ✨
        </span>
        <span className="absolute left-[18%] bottom-[30%] text-4xl animate-bounce text-amber-600/80 delay-200">
          🪕
        </span>
        <span className="absolute right-[20%] bottom-[32%] text-5xl animate-bounce text-rose-500/80 delay-100">
          🪘
        </span>
        <span className="absolute left-[45%] top-[12%] text-3xl animate-pulse text-amber-400">
          🎶
        </span>
        <span className="absolute left-[30%] bottom-[15%] text-3xl animate-pulse text-emerald-400">
          ⭐
        </span>
        <span className="absolute right-[35%] top-[16%] text-4xl animate-bounce text-purple-500/70">
          🎉
        </span>
      </div>

      {/* Cheerful Centerpiece Card */}
      <div className="relative z-10 bg-gradient-to-br from-amber-900 via-amber-950 to-stone-900 text-white px-8 py-6 rounded-3xl shadow-2xl border-2 border-amber-400/50 flex flex-col items-center text-center max-w-sm mx-4 transform scale-105 transition-all">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-amber-950 shadow-lg mb-3 animate-pulse">
          <Sparkles className="w-7 h-7 fill-amber-950" />
        </div>

        <h3 className="font-serif text-2xl font-black text-amber-200 tracking-tight mb-1 drop-shadow-sm">
          {randomTitle}
        </h3>

        <div className="flex items-center gap-2 text-amber-300 font-semibold text-lg my-1">
          <span className="bg-amber-500/30 px-3 py-1 rounded-full border border-amber-400/40 text-amber-200 font-mono font-bold">
            +{pointsEarned} PTS
          </span>
          {streak > 1 && (
            <span className="bg-rose-500/30 px-2.5 py-1 rounded-full border border-rose-400/40 text-rose-200 text-sm font-bold flex items-center gap-1">
              🔥 {streak}x Streak!
            </span>
          )}
        </div>

        <p className="text-xs text-amber-100/80 mt-1">
          Sound heritage insight unlocked!
        </p>
      </div>
    </div>
  );
};
