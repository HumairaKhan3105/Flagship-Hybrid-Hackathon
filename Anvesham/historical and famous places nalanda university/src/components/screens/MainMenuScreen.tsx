import React, { useState } from 'react';
import { Play, RotateCcw, Settings, Award, LogOut, Volume2, VolumeX, Sparkles, BookOpen } from 'lucide-react';
import { sounds } from '../../audio';

interface MainMenuScreenProps {
  onStartGame?: () => void;
  onOpenSettings?: () => void;
  onOpenCredits?: () => void;
  isCompact?: boolean;
}

export const MainMenuScreen: React.FC<MainMenuScreenProps> = ({
  onStartGame,
  onOpenSettings,
  onOpenCredits,
  isCompact = false,
}) => {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'settings' | 'credits' | 'chapter' | null>(null);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(!sounds.getMuted());

  const handleBtnClick = (action: string) => {
    sounds.playTempleBell(440);
    if (action === 'New Game' || action === 'Continue') {
      if (onStartGame) onStartGame();
    } else if (action === 'Settings') {
      setActiveModal('settings');
      if (onOpenSettings) onOpenSettings();
    } else if (action === 'Credits') {
      setActiveModal('credits');
      if (onOpenCredits) onOpenCredits();
    } else if (action === 'Exit') {
      alert('Nalanda awaits your return, seeker of truth.');
    }
  };

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsAudioActive(!muted);
    if (!muted) {
      sounds.startAmbient();
      sounds.playTempleBell(528);
    }
  };

  return (
    <div id="screen-main-menu" className="relative w-full h-full min-h-[360px] flex flex-col justify-between overflow-hidden bg-[#070d1e] text-[#f7ecd5] select-none">
      {/* Cinematic Nalanda Sunset & Architecture Backdrop */}
      <div className="absolute inset-0 z-0">
        {/* Sky gradient with golden warm dusk */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#101b38] via-[#43231a] to-[#d87b32]/40" />
        
        {/* Distant Nalanda Stupas and Towers Silhouette */}
        <div className="absolute bottom-0 inset-x-0 h-48 opacity-45 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#ffb454]/50 via-[#3a1d13]/90 to-[#070d1e]" />
        
        {/* Stylized Architectural Terracotta Layer */}
        <svg className="absolute bottom-0 w-full h-44 text-[#1a0f0d]/90 drop-shadow-2xl" viewBox="0 0 1000 300" preserveAspectRatio="none">
          {/* Terracotta temples, Sariputta stupa silhouette, monasteries */}
          <path d="M0,300 L0,220 Q60,190 120,230 L160,230 L160,150 L180,130 L200,150 L200,230 L270,230 Q330,120 400,230 L450,230 L450,110 L480,80 L510,110 L510,230 L600,230 Q670,140 730,230 L800,230 L830,160 L860,160 L890,230 L1000,220 L1000,300 Z" fill="currentColor" />
          {/* Nine-story Ratnasagara library tower silhouette */}
          <path d="M420,230 L420,110 L440,110 L440,70 L460,70 L460,40 L480,20 L500,40 L500,70 L520,70 L520,110 L540,110 L540,230 Z" fill="#130b0a" />
          {/* Flying birds in sunset */}
          <circle cx="340" cy="90" r="1.5" fill="#fcd34d" opacity="0.6" />
          <circle cx="355" cy="84" r="1.5" fill="#fcd34d" opacity="0.5" />
          <circle cx="370" cy="92" r="1.2" fill="#fcd34d" opacity="0.4" />
        </svg>

        {/* Scholar Protagonist Overlook Silhouette */}
        <div className="absolute bottom-0 right-12 md:right-24 z-10 w-28 md:w-36 h-48 opacity-95">
          <svg viewBox="0 0 120 200" className="w-full h-full text-[#0a0606] filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]">
            {/* Scholar in flowing Indian uttariya robe overlooking courtyard */}
            <path d="M60,25 C68,25 72,18 70,12 C68,5 58,5 54,12 C52,18 56,25 60,25 Z" fill="currentColor" />
            <path d="M50,26 C42,32 38,48 36,65 C32,80 30,105 32,130 C34,155 35,185 36,200 L84,200 C86,180 84,150 82,125 C88,110 86,75 80,48 C76,32 70,26 50,26 Z" fill="currentColor" />
            {/* Flowing Uttariya sash catch in wind */}
            <path d="M42,50 Q20,80 15,120 Q12,145 28,155 Q35,120 40,85 Z" fill="#0d0908" opacity="0.9" />
            {/* Palm-leaf manuscript scroll in hand */}
            <rect x="75" y="75" width="22" height="6" rx="2" transform="rotate(35 75 75)" fill="#e5c158" opacity="0.85" />
          </svg>
        </div>

        {/* Cinematic Vignette and Golden Mist */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050811]/90 via-[#070f24]/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(252,211,77,0.18),transparent_65%)]" />
      </div>

      {/* Top Header Bar inside Screen */}
      <div className="relative z-10 p-5 md:p-6 flex justify-between items-start">
        <div className="flex items-center space-x-3">
          {/* Dharmachakra 24-spoke golden seal */}
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#d4af37]/60 flex items-center justify-center bg-[#070e24]/80 shadow-[0_0_15px_rgba(212,175,55,0.3)] group hover:rotate-45 transition-transform duration-700">
            <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#f5d77f] animate-[spin_60s_linear_infinite]">
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

          <div>
            <h1 className="font-cinzel text-xl md:text-3xl font-extrabold tracking-wider text-[#fae596] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              NALANDA MYSTERY
            </h1>
            <p className="text-[10px] md:text-xs tracking-[0.25em] text-[#d6c28f] uppercase font-sans font-medium">
              An Indian Legacy, A Global Story
            </p>
          </div>
        </div>

        {/* Audio atmosphere toggle */}
        <button
          onClick={toggleSound}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#0a142e]/70 border border-[#d4af37]/40 text-xs text-[#eed794] hover:bg-[#13244e] transition-colors"
          title="Toggle Ambient Indian Sitar & Flute Synthesizer"
        >
          {isAudioActive ? <Volume2 className="w-3.5 h-3.5 text-[#fbbf24]" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-400" />}
          <span className="hidden sm:inline text-[11px] font-medium">{isAudioActive ? 'Sound On' : 'Muted'}</span>
        </button>
      </div>

      {/* Menu Options (AAA Styled Gold-Bordered Tabs) */}
      <div className="relative z-10 px-6 md:px-10 pb-8 max-w-sm">
        <div className="space-y-2.5">
          {[
            { label: 'Continue', icon: Play, desc: 'Chapter 2: The Scribe of Dharmaganja' },
            { label: 'New Game', icon: Sparkles, desc: 'Begin from Nalanda Western Gate' },
            { label: 'Settings', icon: Settings, desc: 'Audio, Subtitles & Graphics' },
            { label: 'Credits', icon: Award, desc: 'Historical Advisors & Legacy' },
            { label: 'Exit', icon: LogOut, desc: 'Quit to Desktop' },
          ].map((item, idx) => {
            const Icon = item.icon;
            const isHovered = hoveredBtn === item.label;
            const isContinue = item.label === 'Continue';

            return (
              <button
                key={item.label}
                id={`btn-menu-${item.label.toLowerCase().replace(' ', '-')}`}
                onMouseEnter={() => {
                  setHoveredBtn(item.label);
                  sounds.playStoneClick();
                }}
                onMouseLeave={() => setHoveredBtn(null)}
                onClick={() => handleBtnClick(item.label)}
                className={`w-full group text-left px-4 py-2.5 rounded-sm transition-all duration-300 relative overflow-hidden border ${
                  isContinue
                    ? 'bg-gradient-to-r from-[#d4af37]/35 via-[#91721e]/25 to-[#0b1633]/60 border-[#f6d77e] shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                    : 'bg-[#081126]/75 hover:bg-[#13234a]/85 border-[#d4af37]/30 hover:border-[#f6d77e]/80'
                }`}
              >
                {/* Subtle corner gold ornaments */}
                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 border-[#f6d77e]" />
                <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-2 border-r-2 border-[#f6d77e]" />
                <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-2 border-l-2 border-[#f6d77e]" />
                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 border-[#f6d77e]" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono text-[#c59b27]/80">0{idx + 1}</span>
                    <span className={`font-cinzel text-sm md:text-base font-bold tracking-wide ${
                      isContinue ? 'text-[#fff1be]' : 'text-[#e5d4aa] group-hover:text-[#fff1be]'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${
                    isHovered ? 'translate-x-1 text-[#fbbf24]' : 'text-[#c59b27]/60'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Screen Number Label Badge */}
      <div className="relative z-10 px-5 pb-3 flex items-center justify-between text-[11px] text-[#c59b27]/70 font-mono">
        <span className="bg-[#050b18]/80 px-2 py-0.5 border border-[#d4af37]/20 rounded">
          1. Main Menu
        </span>
        <span className="text-[10px] tracking-wider text-amber-200/50">
          AAA HISTORICAL ADVENTURE UI
        </span>
      </div>

      {/* Interactive Modal for Settings & Credits */}
      {activeModal && (
        <div className="absolute inset-0 z-50 bg-[#040813]/90 backdrop-blur-md p-6 flex items-center justify-center animate-fadeIn">
          <div className="w-full max-w-md bg-[#0a142e] border-2 border-[#d4af37]/60 rounded-md p-6 relative shadow-2xl">
            <h3 className="font-cinzel text-lg text-[#fbe192] border-b border-[#d4af37]/30 pb-2 mb-4 flex items-center justify-between">
              <span>{activeModal === 'settings' ? 'Game Settings & Audio' : 'Historical Legacy of Nalanda'}</span>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#d4af37] hover:text-white text-xs px-2 py-1 border border-[#d4af37]/30 rounded"
              >
                ✕ Close
              </button>
            </h3>

            {activeModal === 'settings' ? (
              <div className="space-y-4 text-xs text-[#e0cfab]">
                <div className="flex justify-between items-center py-1 border-b border-[#d4af37]/15">
                  <span>Traditional Bansuri / Tanpura Drone:</span>
                  <button onClick={toggleSound} className="px-2.5 py-1 rounded bg-[#13234a] border border-[#d4af37]/40 text-[#f6d77e]">
                    {isAudioActive ? 'Enabled' : 'Muted'}
                  </button>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#d4af37]/15">
                  <span>Language / Script:</span>
                  <span className="text-[#f6d77e]">English (Sanskrit Gloss)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#d4af37]/15">
                  <span>Visual HUD Layout:</span>
                  <span className="text-[#f6d77e]">AAA Immersive (Cinematic)</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#e0cfab] space-y-3 leading-relaxed">
                <p>
                  <strong className="text-[#fbe192]">Nalanda Mahavihara (5th – 12th Century CE)</strong> was the world’s foremost residential university, housing over 10,000 scholars and 2,000 master teachers from India, China, Tibet, Korea, and Persia.
                </p>
                <p>
                  Its nine-story library, <em>Dharmaganja</em>, held humanity’s greatest discoveries in mathematics (the zero and algebra of Aryabhata), astronomy, logic, and medicine.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
