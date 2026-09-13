import React from 'react';

export const FooterBanner: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#040814] via-[#091533] to-[#040814] border-t-2 border-[#d4af37]/60 py-6 px-6 md:px-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
      
      {/* Golden Indian Floral Filigree Accent Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Left: Golden Dharmachakra Emblem & Peacock Feather Motif */}
      <div className="flex items-center space-x-5 relative z-10">
        
        {/* Ornate 24-Spoke Dharmachakra Ashoka Wheel */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-[#d4af37] bg-[#071129] flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.4)] group hover:rotate-180 transition-transform duration-1000">
          <svg viewBox="0 0 100 100" className="w-12 h-12 md:w-16 md:h-16 text-[#f5d77f]">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="50" cy="50" r="14" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="50" cy="50" r="5" fill="currentColor" />
            {Array.from({ length: 24 }).map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + 44 * Math.cos((i * 15 * Math.PI) / 180)}
                y2={50 + 44 * Math.sin((i * 15 * Math.PI) / 180)}
                stroke="currentColor"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>

        {/* Title & Tagline */}
        <div>
          <h2 className="font-cinzel text-xl md:text-3xl font-black tracking-widest text-[#fae596] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            NALANDA MYSTERY
          </h2>
          <div className="flex items-center space-x-2 text-[10px] md:text-xs font-mono tracking-[0.25em] text-[#d6c28f] uppercase my-1 font-semibold">
            <span>EXPLORE</span>
            <span className="text-[#f59e0b]">|</span>
            <span>INVESTIGATE</span>
            <span className="text-[#f59e0b]">|</span>
            <span>SOLVE</span>
            <span className="text-[#f59e0b]">|</span>
            <span>LEARN</span>
          </div>
          <p className="text-xs text-[#eed794]/80 font-serif italic">
            An Indian Legacy, A Global Story
          </p>
        </div>
      </div>

      {/* Right: Peacock Feather Motif & Heritage Seal */}
      <div className="relative z-10 flex items-center space-x-4">
        {/* Peacock feather art representation */}
        <div className="w-14 h-20 relative flex items-center justify-center">
          <svg viewBox="0 0 60 100" className="w-full h-full filter drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            {/* Peacock plume spine */}
            <path d="M30,95 Q35,50 30,5" stroke="#a78bfa" strokeWidth="1.5" fill="none" />
            {/* Feathery barbs */}
            <path d="M30,30 C15,20 10,40 30,55 C50,40 45,20 30,30 Z" fill="#047857" opacity="0.8" />
            <ellipse cx="30" cy="35" rx="12" ry="16" fill="#0284c7" />
            <ellipse cx="30" cy="36" rx="8" ry="11" fill="#4338ca" />
            <circle cx="30" cy="37" r="4.5" fill="#f59e0b" />
          </svg>
        </div>

        <div className="text-right border-l border-[#d4af37]/30 pl-4">
          <div className="text-[10px] font-mono tracking-widest text-amber-300 uppercase">
            AAA Game Design Sheet
          </div>
          <div className="font-cinzel text-xs text-[#faeccf] font-bold">
            11 Master Concept Screens
          </div>
          <div className="text-[10px] text-zinc-400 font-sans">
            Unreal Engine 5 Aesthetic
          </div>
        </div>
      </div>
    </div>
  );
};
