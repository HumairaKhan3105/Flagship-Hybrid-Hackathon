import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Garment } from '../../types';
import { GAME_ASSETS } from '../../data/gameData';
import ClothViewer3D from './ClothViewer3D';
import { Sparkles, Trophy, CheckCircle, ArrowRight, BookmarkPlus } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface UnlockAnimation3DProps {
  garment: Garment;
  onContinue: () => void;
  onAddToCollection: () => void;
}

export default function UnlockAnimation3D({
  garment,
  onContinue,
  onAddToCollection,
}: UnlockAnimation3DProps) {
  useEffect(() => {
    // Sound & fireworks
    soundManager.playUnlockCelebration();

    // Golden sparks & confetti
    const end = Date.now() + 1200;
    const colors = ['#f5c042', '#ffd700', '#d4422e', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      {/* Volumetric Gold Rays Background Aura */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-transparent blur-3xl animate-pulse" />
        {/* Rotating Sacred Mandala Sunburst */}
        <div 
          className="absolute w-[600px] h-[600px] border border-amber-400/20 rounded-full animate-spin"
          style={{ animationDuration: '45s' }}
        />
        <div 
          className="absolute w-[450px] h-[450px] border border-dashed border-amber-300/30 rounded-full animate-spin"
          style={{ animationDuration: '30s', animationDirection: 'reverse' }}
        />
      </div>

      {/* Main Unlock Card Modal */}
      <div className="relative z-10 w-full max-w-4xl royal-glass-card rounded-2xl border-2 border-amber-400 p-6 sm:p-8 shadow-[0_0_60px_rgba(245,192,66,0.35)] flex flex-col items-center text-center">
        {/* Top Header: CORRECT! + Points */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border border-amber-400 text-amber-300 font-cinzel font-bold text-sm tracking-widest uppercase mb-2 shadow-lg animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>CORRECT! +100 Heritage Points</span>
          <Trophy className="w-4 h-4 text-amber-300" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-cinzel font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 drop-shadow">
          CLOTHING UNLOCKED!
        </h2>
        <p className="text-xs sm:text-sm font-cinzel text-amber-200/90 tracking-widest uppercase mt-0.5">
          {garment.name} • {garment.regionName}
        </p>

        {/* Center 3D Interactive Cloth Viewer */}
        <div className="w-full max-w-md h-[260px] sm:h-[300px] my-4 rounded-xl border border-amber-500/40 bg-gradient-to-b from-stone-950/80 to-amber-950/40 shadow-inner relative overflow-hidden flex items-center justify-center">
          <ClothViewer3D
            colorHex={garment.colorHex}
            accentGold={garment.accentGold}
            garmentName={garment.name}
            rarity={garment.rarity}
            isInteractive={true}
          />
        </div>

        {/* DID YOU KNOW? AI Culture Guide Sahana Lore Card (Matching Middle-Right Screen) */}
        <div className="w-full parchment-bg rounded-xl p-4 sm:p-5 border border-amber-600/40 text-left shadow-lg relative flex flex-col sm:flex-row items-center sm:items-start gap-4 my-2">
          {/* Sahana Companion Portrait */}
          <div className="relative flex-shrink-0">
            <img
              src={GAME_ASSETS.sahanaAvatar}
              alt="Sahana Culture Guide"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-amber-700 shadow-md ring-2 ring-amber-400/50"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 p-1 bg-amber-700 rounded-full text-white">
              <Sparkles className="w-3 h-3 text-amber-300" />
            </div>
          </div>

          <div className="flex-1 text-stone-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-cinzel font-bold text-amber-900 tracking-wider uppercase">
                DID YOU KNOW? • Cultural Lore
              </span>
              <span className="text-[11px] font-marcellus text-amber-800 italic">
                — Sahana, AI Culture Guide
              </span>
            </div>
            <p className="text-sm font-marcellus text-stone-800 leading-relaxed mt-1">
              {garment.culturalSignificance}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-cinzel font-semibold text-amber-950">
              <span className="px-2 py-0.5 rounded bg-amber-200/80 border border-amber-400/60">
                Material: {garment.fabricDetails.baseMaterial}
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-200/80 border border-amber-400/60">
                Technique: {garment.fabricDetails.weaveTechnique}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-4">
          <button
            onClick={() => {
              soundManager.playChime();
              onAddToCollection();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-cinzel font-bold text-sm tracking-wider uppercase text-amber-300 bg-amber-950/80 hover:bg-amber-900/90 border border-amber-400/60 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <BookmarkPlus className="w-4 h-4 text-amber-400" />
            <span>Add to Wardrobe</span>
          </button>

          <button
            onClick={() => {
              soundManager.playCorrectFanfare();
              onContinue();
            }}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-cinzel font-bold text-sm tracking-wider uppercase text-stone-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 border border-amber-200 shadow-[0_0_25px_rgba(245,192,66,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Continue Journey</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
