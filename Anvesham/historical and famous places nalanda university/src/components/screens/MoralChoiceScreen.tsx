import React, { useState } from 'react';
import { Shield, Share2, Send, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { sounds } from '../../audio';

interface MoralChoiceScreenProps {
  onSelectEnding?: (choice: 'A' | 'B' | 'C') => void;
}

export const MoralChoiceScreen: React.FC<MoralChoiceScreenProps> = ({ onSelectEnding }) => {
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | 'C' | null>(null);
  const [hoveredChoice, setHoveredChoice] = useState<'A' | 'B' | 'C' | null>(null);

  const choices = [
    {
      id: 'A' as const,
      title: 'A. Protect the manuscript',
      subtitle: '(Keep it safe within Nalanda)',
      icon: Shield,
      philosophy: 'Preservation in the Sacred Vaults',
      consequence: 'The original Aryabhata treatise is sealed deep inside the subterranean granite vaults beneath Ratnasagara, safe from immediate thievery.',
      color: 'from-amber-700/80 to-amber-950/90',
    },
    {
      id: 'B' as const,
      title: 'B. Copy and share the knowledge',
      subtitle: '(Spread it to other scholars)',
      icon: Share2,
      philosophy: 'Democratic Enlightenment of the Sangha',
      consequence: 'Hundreds of scribes work through the night creating copies of the astronomical calculations, dispersing them through 10,000 university students.',
      color: 'from-blue-800/80 to-indigo-950/90',
    },
    {
      id: 'C' as const,
      title: 'C. Send the knowledge to another scholar',
      subtitle: '(Take it beyond Nalanda)',
      icon: Send,
      philosophy: 'The Global Journey across the Silk Road',
      consequence: 'The sacred text is entrusted to Chinese pilgrim Xuanzang and Tibetan panditas to carry across the Himalayas and Silk Road, ensuring its survival across global civilizations.',
      color: 'from-emerald-800/80 to-teal-950/90',
    },
  ];

  const handleChoose = (id: 'A' | 'B' | 'C') => {
    sounds.playTempleBell(440);
    setSelectedChoice(id);
    if (onSelectEnding) {
      setTimeout(() => onSelectEnding(id), 1200);
    }
  };

  return (
    <div id="screen-moral-choice" className="relative w-full h-full min-h-[360px] flex flex-col justify-between overflow-hidden bg-[#0a0505] text-[#faeccf] select-none p-4 md:p-6">
      {/* High Drama Cinematic Nalanda Twilight Sunset Backdrop */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#160d24] via-[#632219] to-[#bf4c15]/50" />
        
        {/* Distant Nalanda silhouette against crimson sky */}
        <svg className="absolute bottom-0 w-full h-44 text-[#120707] opacity-80" viewBox="0 0 1000 300" preserveAspectRatio="none">
          <path d="M0,300 L0,220 Q120,180 250,220 L320,160 L380,160 L450,220 L520,80 L560,80 L620,220 L750,150 L820,150 L900,220 L1000,220 L1000,300 Z" fill="currentColor" />
        </svg>

        {/* Scholar silhouette standing at the edge of the terrace */}
        <div className="absolute bottom-0 right-10 md:right-24 z-10 w-28 md:w-36 h-52">
          <svg viewBox="0 0 120 200" className="w-full h-full text-[#080404]">
            <circle cx="60" cy="30" r="14" fill="currentColor" />
            <path d="M45,45 C35,70 32,120 30,190 L90,190 C88,120 85,70 75,45 Z" fill="currentColor" />
            {/* Extended arm holding glowing manuscript */}
            <path d="M70,70 L95,50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <rect x="92" y="38" width="18" height="26" rx="2" fill="#fcd34d" className="animate-pulse" />
          </svg>
        </div>

        {/* Ambient Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-[#070b16]/60 to-transparent" />
      </div>

      {/* Screen Header */}
      <div className="relative z-10 pb-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#fcd34d] uppercase tracking-widest mb-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Climax of the Investigation</span>
        </div>
        <h3 className="font-cinzel text-xl md:text-2xl font-black text-[#fff1be] tracking-wider drop-shadow-md">
          Final Choice
        </h3>
        <p className="text-xs md:text-sm text-[#f6d77e] font-sans font-medium mt-0.5">
          What should be done with the manuscript and its knowledge?
        </p>
      </div>

      {/* 3 Moral Dilemma Choices (matching screenshot layout) */}
      <div className="relative z-10 max-w-xl space-y-2.5 my-auto">
        {choices.map((choice) => {
          const Icon = choice.icon;
          const isSelected = selectedChoice === choice.id;
          const isHovered = hoveredChoice === choice.id;

          return (
            <button
              key={choice.id}
              onClick={() => handleChoose(choice.id)}
              onMouseEnter={() => {
                setHoveredChoice(choice.id);
                sounds.playStoneClick();
              }}
              onMouseLeave={() => setHoveredChoice(null)}
              className={`w-full text-left p-3.5 rounded-sm border transition-all relative overflow-hidden group shadow-lg ${
                isSelected
                  ? 'border-[#fcd34d] bg-[#1a3363] text-[#fff1be] scale-[1.02] shadow-[0_0_25px_rgba(252,211,77,0.4)]'
                  : 'border-[#d4af37]/40 bg-[#081329]/80 hover:bg-[#11244d]/90 hover:border-[#fcd34d]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded border border-[#d4af37]/60 bg-[#050b18] flex items-center justify-center text-[#fcd34d] group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-cinzel text-sm md:text-base font-bold text-[#fae596] tracking-wide">
                      {choice.title}
                    </div>
                    <div className="text-xs text-[#cbd5e1] font-sans">
                      {choice.subtitle}
                    </div>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Dynamic Consequence Preview when Hovered or Selected */}
              {(isHovered || isSelected) && (
                <div className="mt-2.5 pt-2 border-t border-[#d4af37]/30 text-[11px] text-[#faeccf] font-serif leading-snug animate-fadeIn">
                  <strong className="text-[#fcd34d] block font-mono text-[10px] uppercase">
                    Destiny Foreseen:
                  </strong>
                  {choice.consequence}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Screen Label Badge */}
      <div className="relative z-10 px-2 pt-2 flex items-center justify-between text-[11px] text-[#c59b27]/80 font-mono">
        <span className="bg-[#050b18]/80 px-2 py-0.5 border border-[#d4af37]/20 rounded">
          10. Final Choice
        </span>
        <span className="text-[10px] tracking-wider text-amber-200/50">
          PHILOSOPHICAL RESOLUTION • 3 MORAL PATHS
        </span>
      </div>
    </div>
  );
};
