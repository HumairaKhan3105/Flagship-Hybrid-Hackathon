import React, { useState } from 'react';
import { Compass, Scroll, Key, Sparkles, Footprints, MessageSquare, AlertCircle } from 'lucide-react';
import { sounds } from '../../audio';

interface ExplorationScreenProps {
  onInteractNPC?: () => void;
  onOpenJournal?: () => void;
}

export const ExplorationScreen: React.FC<ExplorationScreenProps> = ({
  onInteractNPC,
  onOpenJournal,
}) => {
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [messageToast, setMessageToast] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number>(1);

  const showToast = (msg: string) => {
    sounds.playTempleBell(600);
    setMessageToast(msg);
    setTimeout(() => setMessageToast(null), 3000);
  };

  return (
    <div id="screen-exploration" className="relative w-full h-full min-h-[360px] flex flex-col justify-between overflow-hidden bg-[#0c0a09] text-[#fbf0d9] select-none">
      {/* 3D In-Engine Scene Render Simulation */}
      <div className="absolute inset-0 z-0">
        {/* Sky with warm golden Indian afternoon haze */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#183059] via-[#854d27] to-[#e08e45]/80" />

        {/* Terracotta Nalanda Mahavihara Stupas & Monasteries Layer */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <defs>
              <linearGradient id="terracottaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9a3412" />
                <stop offset="60%" stopColor="#7c2d12" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>
              <linearGradient id="pillarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c2d12" />
                <stop offset="50%" stopColor="#c2410c" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>
            </defs>

            {/* Distant Sariputta Grand Chaitya Stupa */}
            <path d="M120,400 L160,260 L200,210 L240,260 L280,400 Z" fill="url(#terracottaGrad)" opacity="0.8" />
            <path d="M185,210 L195,140 L205,140 L215,210 Z" fill="#b45309" opacity="0.8" />
            {/* Nine Story Ratnasagara Tower */}
            <rect x="720" y="160" width="160" height="240" fill="#431407" opacity="0.9" />
            <rect x="740" y="120" width="120" height="40" fill="#78350f" opacity="0.9" />
            <rect x="760" y="80" width="80" height="40" fill="#9a3412" opacity="0.9" />
            <polygon points="800,40 780,80 820,80" fill="#f59e0b" opacity="0.8" />

            {/* Foreground Courtyard Stone Floor & Perspective Lines */}
            <polygon points="0,380 1000,380 1000,600 0,600" fill="#2d170d" />
            <polygon points="0,420 1000,420 1000,600 0,600" fill="#3b1d11" />
            
            {/* Perspective paving stones */}
            <line x1="500" y1="380" x2="100" y2="600" stroke="#78350f" strokeWidth="2" strokeOpacity="0.4" />
            <line x1="500" y1="380" x2="350" y2="600" stroke="#78350f" strokeWidth="2" strokeOpacity="0.4" />
            <line x1="500" y1="380" x2="650" y2="600" stroke="#78350f" strokeWidth="2" strokeOpacity="0.4" />
            <line x1="500" y1="380" x2="900" y2="600" stroke="#78350f" strokeWidth="2" strokeOpacity="0.4" />

            {/* Grand Left & Right Carved Terracotta Pillars */}
            <rect x="40" y="160" width="65" height="380" fill="url(#pillarGrad)" />
            <rect x="30" y="140" width="85" height="25" fill="#f59e0b" opacity="0.7" />
            <rect x="25" y="510" width="95" height="40" fill="#451a03" />

            <rect x="890" y="160" width="70" height="380" fill="url(#pillarGrad)" />
            <rect x="880" y="140" width="90" height="25" fill="#f59e0b" opacity="0.7" />

            {/* Walking Buddhist Monks in Saffron Robes */}
            {/* Monk 1 (Midground left) */}
            <g transform="translate(380, 290) scale(0.65)">
              <ellipse cx="30" cy="18" rx="8" ry="10" fill="#fcd34d" />
              <path d="M22,28 C18,45 15,80 18,120 L42,120 C45,80 42,45 38,28 Z" fill="#d97706" />
              <path d="M18,34 Q45,55 38,100" stroke="#b45309" strokeWidth="3" fill="none" />
            </g>
            {/* Monk 2 (Midground right) */}
            <g transform="translate(630, 310) scale(0.6)">
              <ellipse cx="30" cy="18" rx="8" ry="10" fill="#fcd34d" />
              <path d="M22,28 C18,45 15,80 18,120 L42,120 C45,80 42,45 38,28 Z" fill="#b45309" />
            </g>
          </svg>
        </div>

        {/* 3rd Person Scholar Protagonist Back View (Standing in Center-Left Foreground) */}
        <div className="absolute bottom-2 left-1/3 md:left-[42%] -translate-x-1/2 z-10 w-36 md:w-44 h-64 pointer-events-none">
          <svg viewBox="0 0 160 260" className="w-full h-full filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)]">
            {/* Hair bun with antique gold pin */}
            <circle cx="80" cy="30" r="14" fill="#1c1917" />
            <circle cx="80" cy="16" r="8" fill="#1c1917" />
            <line x1="70" y1="18" x2="90" y2="18" stroke="#f59e0b" strokeWidth="2.5" />

            {/* Broad shoulders and antique Indian scholar attire */}
            <path d="M52,48 C42,75 40,110 38,160 C36,200 40,240 44,260 L116,260 C120,240 124,200 122,160 C120,110 118,75 108,48 Z" fill="#1e293b" />
            
            {/* Golden Ochre Scribe Sash / Uttariya draped diagonally across back */}
            <path d="M50,52 Q75,90 122,160 L108,180 Q65,110 44,70 Z" fill="#d97706" />
            <path d="M48,68 Q75,105 116,168" stroke="#fcd34d" strokeWidth="2" fill="none" opacity="0.8" />

            {/* Leather satchel for manuscripts at the hip */}
            <rect x="100" y="130" width="34" height="42" rx="4" fill="#78350f" stroke="#451a03" strokeWidth="2" />
            <circle cx="117" cy="150" r="3" fill="#fbbf24" />
          </svg>
        </div>

        {/* Atmospheric Dust particles & God-rays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* TOP HUD: Objectives (Top-Left) & Ancient Compass (Top-Right) */}
      <div className="relative z-20 p-4 md:p-5 flex justify-between items-start">
        {/* Top-Left: Current Objective */}
        <div
          onClick={onOpenJournal}
          className="cursor-pointer bg-[#070f22]/85 backdrop-blur-md border border-[#d4af37]/60 rounded-sm p-3 max-w-xs shadow-[0_4px_16px_rgba(0,0,0,0.6)] group hover:border-[#f6d77e] transition-all"
        >
          <div className="flex items-center space-x-2 pb-1.5 border-b border-[#d4af37]/25 mb-1.5">
            <span className="text-[#f59e0b] text-xs animate-pulse">✦</span>
            <span className="font-cinzel text-xs md:text-sm font-bold tracking-wider text-[#fae596] uppercase">
              Current Objective
            </span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-start space-x-2 text-[#fff1be]">
              <span className="text-[#fcd34d] font-bold">›</span>
              <span>Find the missing manuscript</span>
            </div>
            <div className="flex items-start space-x-2 text-[#e2d4b7]/80">
              <span className="text-amber-500 font-bold">›</span>
              <span>Talk to the Librarian</span>
            </div>
          </div>
          <p className="text-[10px] text-[#c59b27]/80 mt-1.5 font-mono italic">
            [J] Open Quest Journal
          </p>
        </div>

        {/* Top-Right: Ancient Nalanda Sun-Compass */}
        <div className="bg-[#070f22]/85 backdrop-blur-md border border-[#d4af37]/60 rounded-sm px-3.5 py-2 flex items-center space-x-3 shadow-lg">
          <div className="relative w-8 h-8 rounded-full border-2 border-[#d4af37]/70 flex items-center justify-center bg-[#0d1c3d]">
            <Compass className="w-5 h-5 text-[#f6d77e] animate-[spin_40s_linear_infinite]" />
            <div className="absolute -top-1 text-[8px] font-bold text-[#fcd34d]">N</div>
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#c59b27] uppercase">Location</div>
            <div className="font-cinzel text-xs md:text-sm font-bold text-[#fff1be]">
              Nalanda Courtyard
            </div>
          </div>
        </div>
      </div>

      {/* Interactive World Hotspots Floating Prompts */}
      <div className="relative z-20 flex-1 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              sounds.playStoneClick();
              showToast('Discovered footprint rubbed with brick dust! Added to journal.');
            }}
            className="flex items-center space-x-2 px-3.5 py-2 bg-[#09142c]/90 hover:bg-[#152a5c] border border-[#d4af37]/70 rounded text-xs text-[#fae596] transition-all shadow-xl hover:scale-105"
          >
            <span className="w-5 h-5 rounded bg-[#f59e0b]/20 border border-[#f59e0b] flex items-center justify-center text-[10px] font-bold text-[#fcd34d]">
              E
            </span>
            <Footprints className="w-3.5 h-3.5 text-amber-400" />
            <span>Examine Intruder Footprints</span>
          </button>

          <button
            onClick={() => {
              sounds.playTempleBell(480);
              if (onInteractNPC) onInteractNPC();
            }}
            className="flex items-center space-x-2 px-3.5 py-2 bg-[#09142c]/90 hover:bg-[#152a5c] border border-[#d4af37]/70 rounded text-xs text-[#fae596] transition-all shadow-xl hover:scale-105"
          >
            <span className="w-5 h-5 rounded bg-[#f59e0b]/20 border border-[#f59e0b] flex items-center justify-center text-[10px] font-bold text-[#fcd34d]">
              E
            </span>
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>Speak with Head Librarian</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {messageToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-[#0d1c3f] border border-[#f59e0b] px-4 py-2 rounded-sm text-xs text-[#fae596] shadow-2xl flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{messageToast}</span>
        </div>
      )}

      {/* BOTTOM HUD: Player Status Orb (Left) & Quick Item Belt (Right) */}
      <div className="relative z-20 p-4 md:p-5 flex justify-between items-end">
        {/* Bottom-Left: Scholar Health & Focus Orb */}
        <div className="flex items-center space-x-3 bg-[#070f22]/85 backdrop-blur-md border border-[#d4af37]/60 rounded-sm p-2 shadow-lg">
          <div className="relative w-11 h-11 rounded-full border-2 border-[#d4af37] bg-[#1a0f07] flex items-center justify-center overflow-hidden">
            {/* Scholar portrait mini */}
            <span className="text-lg">🧘</span>
            <div className="absolute inset-0 rounded-full border border-[#fbbf24]/50 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] text-[#e0cfab] font-medium">
              <span>Mental Focus (स्मृति)</span>
              <span className="text-[#f6d77e] font-mono">100%</span>
            </div>
            {/* Focus Bar */}
            <div className="w-24 h-1.5 bg-[#172554] rounded-full overflow-hidden border border-[#d4af37]/40">
              <div className="w-full h-full bg-gradient-to-r from-[#d97706] to-[#fde047]" />
            </div>
          </div>
        </div>

        {/* Bottom-Right: Quick Item Belt */}
        <div className="bg-[#070f22]/85 backdrop-blur-md border border-[#d4af37]/60 rounded-sm p-1.5 shadow-lg flex items-center space-x-2">
          {[
            { id: 1, name: 'Key', icon: Key, label: 'Vault Key' },
            { id: 2, name: 'Scroll', icon: Scroll, label: 'Brahmi Note' },
            { id: 3, name: 'Coin', icon: Sparkles, label: 'Gupta Dinar' },
            { id: 4, name: 'Herb', icon: Footprints, label: 'Tulsi Herb' },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = selectedSlot === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedSlot(item.id);
                  sounds.playStoneClick();
                  showToast(`Selected quick item: ${item.label}`);
                }}
                className={`w-9 h-9 rounded-sm flex flex-col items-center justify-center relative border transition-all ${
                  isSelected
                    ? 'border-[#f6d77e] bg-[#1e3a7a]/90 text-[#fde047] shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                    : 'border-[#d4af37]/30 bg-[#0c1630] text-[#c59b27] hover:border-[#f6d77e]/60'
                }`}
                title={item.label}
              >
                <Icon className="w-4 h-4" />
                <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-zinc-400">
                  {item.id}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Screen Label Badge */}
      <div className="relative z-10 px-5 pb-2.5 flex items-center justify-between text-[11px] text-[#c59b27]/70 font-mono">
        <span className="bg-[#050b18]/80 px-2 py-0.5 border border-[#d4af37]/20 rounded">
          2. In-Game Exploration (3rd Person View)
        </span>
        <span className="text-[10px] tracking-wider text-amber-200/50">
          NURTURED IN MAGADHA RED BRICK
        </span>
      </div>
    </div>
  );
};
