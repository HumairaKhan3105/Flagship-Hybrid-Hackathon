import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

export const CinematicModal: React.FC = () => {
  const { cinematicData, closeCinematic } = useGameStore();

  if (!cinematicData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#22160d] via-[#140e09] to-[#0a0705] border border-amber-500/60 rounded-3xl p-6 sm:p-10 shadow-2xl box-gold-glow flex flex-col items-center text-center">
        {/* Decorative Top Sun Motif */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 text-stone-950 shadow-xl mb-4 border border-amber-200">
          <span className="text-3xl animate-spin-slow">☸️</span>
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-200 animate-pulse" />
        </div>

        {/* Historical Era Badge */}
        <div className="flex items-center gap-2 text-xs font-serif text-amber-400 tracking-widest uppercase mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>{cinematicData.historicalEra}</span>
        </div>

        {/* Main Title & Subtitle */}
        <h2 className="font-serif font-black text-2xl sm:text-3xl text-amber-100 gold-glow tracking-wide mb-1">
          {cinematicData.title}
        </h2>
        <h4 className="font-serif text-sm sm:text-base text-amber-300/90 italic mb-6">
          "{cinematicData.subtitle}"
        </h4>

        {/* Parchment Narration Box */}
        <div className="relative w-full bg-[#1b140c] border border-amber-900/60 rounded-2xl p-6 mb-6 shadow-inner text-left">
          <span className="absolute top-2 left-4 text-4xl text-amber-700/30 font-serif leading-none">“</span>
          <p className="font-serif text-sm sm:text-base text-amber-100/90 leading-relaxed indent-4">
            {cinematicData.narration}
          </p>
          <span className="absolute bottom-2 right-4 text-4xl text-amber-700/30 font-serif leading-none">”</span>
        </div>

        {/* Action Button */}
        <button
          onClick={closeCinematic}
          className="flex items-center gap-2 px-8 py-3 rounded-full font-serif font-bold text-sm bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 box-gold-glow transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>CONTINUE EXPLORATION</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
