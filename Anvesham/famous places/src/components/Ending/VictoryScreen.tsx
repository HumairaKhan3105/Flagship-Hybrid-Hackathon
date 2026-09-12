import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Award, Compass, RotateCcw, ArrowLeft, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundService } from '../../services/soundService';

export const VictoryScreen: React.FC = () => {
  const { score, xp, level, clues, artifacts, solvedPuzzles, returnToMenu, resetProgress } = useGameStore();

  const discoveredClues = clues.filter(c => c.status === 'discovered').length;
  const unlockedArtifacts = artifacts.filter(a => a.unlocked).length;

  const handleFreeRoam = () => {
    soundService.playDiscovery();
    useGameStore.setState({ screen: 'playing', activeModal: null });
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 bg-stone-950 text-stone-100 select-none overflow-y-auto parchment-scroll">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 30%, #92400e 0%, #1c1007 70%, #0c0704 100%)`
        }}
      />

      <div className="relative z-10 w-full max-w-3xl bg-gradient-to-b from-[#25180f] via-[#160f0a] to-[#0a0705] border-2 border-amber-400 rounded-3xl p-6 sm:p-10 shadow-2xl box-gold-glow flex flex-col items-center text-center my-auto">
        {/* Victory Emblem */}
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-stone-950 shadow-2xl mb-4 border-2 border-amber-200 animate-bounce">
          <Trophy className="w-10 h-10" />
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-300 animate-pulse" />
        </div>

        <span className="font-serif text-xs font-bold text-amber-400 tracking-widest uppercase mb-1">
          EXPEDITION ACCOMPLISHED • VIJAYANAGARA ZENITH
        </span>

        <h1 className="font-serif font-black text-2xl sm:text-4xl text-amber-100 gold-glow tracking-tight mb-2">
          THE STONE CHARIOT SECRET UNVEILED
        </h1>

        <p className="font-serif text-xs sm:text-sm text-amber-300/80 max-w-lg mb-6">
          You have unlocked the inner mechanical compartment of the Garuda Stone Chariot and revealed the sacred imperial decree of Emperor Krishnadevaraya!
        </p>

        {/* The Imperial Decree Box */}
        <div className="w-full bg-[#1e150d] border border-amber-600/50 rounded-2xl p-6 mb-6 text-left shadow-inner">
          <div className="flex items-center justify-between border-b border-amber-800/40 pb-2 mb-3">
            <span className="font-serif font-bold text-xs text-amber-400 uppercase tracking-wider">
              IMPERIAL DECREE OF 1516 CE (ŚRĪ KRISHNADEVARAYA)
            </span>
            <span className="text-[10px] font-mono text-amber-500">
              TAMRA-SHASANA CHARTER
            </span>
          </div>

          <p className="font-serif text-xs sm:text-sm text-amber-100/90 leading-relaxed italic mb-3 indent-4">
            “Let all people of Jambudvipa know: As long as the waters of the Tungabhadra flow past the feet of Lord Virupaksha, so long shall knowledge, harmony of faiths, and sacred art endure within this blessed realm. In this stone chariot dedicated to Garuda, let truth remain immortal across centuries.”
          </p>

          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-amber-900/30">
            <span>Seal of the Royal Boar (Varaha Lanchana)</span>
            <span className="text-amber-400 font-serif">Vitthala Devalaya, Hampi</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-6">
          <div className="bg-stone-900/80 border border-amber-900/50 rounded-2xl p-3">
            <span className="text-[10px] font-serif text-stone-400 block">TOTAL SCORE</span>
            <span className="font-mono font-bold text-lg text-amber-300">{score}</span>
          </div>

          <div className="bg-stone-900/80 border border-amber-900/50 rounded-2xl p-3">
            <span className="text-[10px] font-serif text-stone-400 block">EXPLORER LEVEL</span>
            <span className="font-mono font-bold text-lg text-amber-300">L{level} ({xp} XP)</span>
          </div>

          <div className="bg-stone-900/80 border border-amber-900/50 rounded-2xl p-3">
            <span className="text-[10px] font-serif text-stone-400 block">CLUES FOUND</span>
            <span className="font-mono font-bold text-lg text-amber-300">{discoveredClues}/{clues.length}</span>
          </div>

          <div className="bg-stone-900/80 border border-amber-900/50 rounded-2xl p-3">
            <span className="text-[10px] font-serif text-stone-400 block">PUZZLES SOLVED</span>
            <span className="font-mono font-bold text-lg text-amber-300">{solvedPuzzles.length}/4</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <button
            onClick={handleFreeRoam}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full font-serif font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 box-gold-glow shadow-xl transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>CONTINUE IN FREE ROAM</span>
          </button>

          <button
            onClick={returnToMenu}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full font-serif font-semibold text-xs sm:text-sm bg-stone-900 hover:bg-stone-800 text-amber-200 border border-amber-800/60 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO MENU</span>
          </button>

          <button
            onClick={resetProgress}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-full font-serif text-xs text-stone-400 hover:text-amber-300 hover:bg-stone-900 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>NEW EXPEDITION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
