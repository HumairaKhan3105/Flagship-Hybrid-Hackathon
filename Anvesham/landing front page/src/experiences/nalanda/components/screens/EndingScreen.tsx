import React, { useState } from 'react';
import { Home, Sparkles, BookOpen, Globe, Award, RefreshCw } from 'lucide-react';
import { sounds } from '../../audio';

interface EndingScreenProps {
  onReturnToMainMenu?: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({ onReturnToMainMenu }) => {
  const [showGlobalImpact, setShowGlobalImpact] = useState<boolean>(false);

  const handleReturn = () => {
    sounds.playTempleBell(440);
    if (onReturnToMainMenu) onReturnToMainMenu();
  };

  return (
    <div id="screen-ending" className="relative w-full h-full min-h-[360px] flex flex-col justify-between overflow-hidden bg-[#0a0505] text-[#faeccf] select-none p-5 md:p-8">
      {/* Cinematic Golden Sunset & Dusk Panorama over Nalanda */}
      <div className="absolute inset-0 z-0">
        {/* Amber Sunset Radiant Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#24133b] via-[#85321f] to-[#e6833b]/60" />

        {/* Silhouette of Nalanda Towers, Stupas, and Chaityas */}
        <div className="absolute bottom-0 inset-x-0 h-52">
          <svg className="w-full h-full text-[#140807] opacity-90" viewBox="0 0 1000 300" preserveAspectRatio="none">
            {/* Nine-story tower of Ratnasagara, Sariputta stupa, prayer spires */}
            <path d="M0,300 L0,200 Q80,160 160,200 L210,130 L250,130 L300,200 L380,80 L420,50 L460,80 L520,200 Q620,110 720,200 L780,120 L840,120 L900,200 L1000,180 L1000,300 Z" fill="currentColor" />
            {/* Flying birds / doves flock returning to the monasteries */}
            <circle cx="280" cy="70" r="1.5" fill="#fcd34d" opacity="0.8" />
            <circle cx="295" cy="62" r="1.5" fill="#fcd34d" opacity="0.7" />
            <circle cx="310" cy="74" r="1.2" fill="#fcd34d" opacity="0.6" />
            <circle cx="325" cy="65" r="1.5" fill="#fcd34d" opacity="0.5" />
            <circle cx="340" cy="72" r="1.2" fill="#fcd34d" opacity="0.4" />
          </svg>
        </div>

        {/* Deep Cinematic Letterbox Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60 pointer-events-none" />
      </div>

      {/* Screen Sub-Header */}
      <div className="relative z-10 flex justify-between items-center">
        <div className="text-[11px] font-mono tracking-widest text-[#fcd34d] uppercase flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Epilogue • An Indian Legacy, A Global Story</span>
        </div>

        <button
          onClick={() => setShowGlobalImpact(!showGlobalImpact)}
          className="px-2.5 py-1 rounded bg-[#160d26]/80 border border-[#d4af37]/40 text-xs text-[#fae596] hover:bg-[#281545] transition-colors"
        >
          {showGlobalImpact ? 'Show Reflection' : 'View Global Impact'}
        </button>
      </div>

      {/* Central Emotional Poetry / Narration (matching screenshot exactly) */}
      <div className="relative z-10 max-w-xl mx-auto my-auto text-center space-y-4 py-4">
        {!showGlobalImpact ? (
          <>
            <div className="font-cinzel text-xs md:text-sm font-bold tracking-[0.3em] text-[#fcd34d] uppercase">
              ENDING
            </div>

            <h2 className="font-cinzel text-2xl md:text-4xl font-extrabold text-[#fff4cf] tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              Knowledge lives on...
            </h2>

            <p className="font-serif text-sm md:text-base leading-relaxed text-[#fcedcc] max-w-lg mx-auto italic drop-shadow-md">
              “The manuscript may be lost, but the knowledge it carried has reached new hands. And so, its light continues to guide the future.”
            </p>

            <div className="pt-2">
              <button
                id="btn-return-main-menu"
                onClick={handleReturn}
                className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#c59b27] text-[#241205] font-cinzel font-bold text-sm md:text-base tracking-wider shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-110 transition-all hover:scale-105 inline-flex items-center space-x-2 border border-[#fff2c2]"
              >
                <Home className="w-4 h-4 text-[#241205]" />
                <span>Main Menu</span>
              </button>
            </div>
          </>
        ) : (
          <div className="bg-[#0b0612]/90 border border-[#d4af37]/60 rounded-md p-5 text-left text-xs space-y-3 shadow-2xl animate-fadeIn">
            <h4 className="font-cinzel text-sm md:text-base font-bold text-[#fde047] border-b border-[#d4af37]/30 pb-1.5 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>How Nalanda Shaped World Civilizations</span>
              </span>
              <span className="text-[10px] font-mono text-[#cbd5e1]">HISTORICAL RECORD</span>
            </h4>
            <p className="text-[#e2d5b6] leading-relaxed">
              <strong>The Concept of Zero & Decimal Numerals:</strong> Nalanda mathematicians expanded the seminal works of Aryabhata and Brahmagupta. These manuscripts traveled along the Silk Road to Baghdad (the House of Wisdom / Bayt al-Hikma), where Al-Khwarizmi formulated algebra, eventually reaching Fibonacci in medieval Europe.
            </p>
            <p className="text-[#e2d5b6] leading-relaxed">
              <strong>The Silk Road Transmission:</strong> Scholars like Xuanzang (Hiuen Tsang) carried 657 sacred Sanskrit manuscripts back to China on twenty horses, translating them at the Giant Wild Goose Pagoda.
            </p>
            <div className="pt-2 text-center">
              <button
                onClick={() => setShowGlobalImpact(false)}
                className="text-[#fcd34d] underline text-xs hover:text-white"
              >
                ← Back to Ending Vista
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Screen Label Badge */}
      <div className="relative z-10 px-2 pt-2 flex items-center justify-between text-[11px] text-[#c59b27]/80 font-mono">
        <span className="bg-[#050b18]/80 px-2 py-0.5 border border-[#d4af37]/20 rounded">
          11. Ending
        </span>
        <span className="text-[10px] tracking-wider text-amber-200/50">
          IMMORTAL WISDOM OF MAHAVIHARA
        </span>
      </div>
    </div>
  );
};
