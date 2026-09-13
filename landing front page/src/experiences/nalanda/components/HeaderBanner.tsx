import React from 'react';
import { LayoutGrid, PlayCircle, Volume2, VolumeX, Sparkles, BookOpen, Compass, Info } from 'lucide-react';
import { ScreenId } from '../types';
import { SCREENS_DATA } from '../data/gameData';
import { sounds } from '../audio';

interface HeaderBannerProps {
  viewMode: 'concept-sheet' | 'simulator';
  setViewMode: (mode: 'concept-sheet' | 'simulator') => void;
  activeScreenId: ScreenId;
  setActiveScreenId: (id: ScreenId) => void;
  isAudioOn: boolean;
  setIsAudioOn: (val: boolean) => void;
  onOpenInfoModal: () => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  viewMode,
  setViewMode,
  activeScreenId,
  setActiveScreenId,
  isAudioOn,
  setIsAudioOn,
  onOpenInfoModal,
}) => {
  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsAudioOn(!muted);
    if (!muted) {
      sounds.startAmbient();
      sounds.playTempleBell(528);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#060b18]/95 backdrop-blur-md border-b border-[#d4af37]/40 shadow-xl px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Title */}
        <div className="flex items-center space-x-3 self-start md:self-auto">
          <div className="w-9 h-9 rounded-full border border-[#d4af37] bg-[#0c183a] flex items-center justify-center text-[#f6d77e] shadow-[0_0_10px_rgba(212,175,55,0.3)]">
            <svg viewBox="0 0 100 100" className="w-6 h-6 animate-[spin_40s_linear_infinite]">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
              <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="4" />
              <circle cx="50" cy="50" r="4" fill="currentColor" />
              {Array.from({ length: 12 }).map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 44 * Math.cos((i * 30 * Math.PI) / 180)}
                  y2={50 + 44 * Math.sin((i * 30 * Math.PI) / 180)}
                  stroke="currentColor"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-cinzel text-base md:text-xl font-bold tracking-wider text-[#fae596]">
                NALANDA MYSTERY
              </h1>
              <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[10px] font-mono text-[#fde047]">
                AAA UI CONCEPT SHEET
              </span>
            </div>
            <p className="text-[10px] text-[#c59b27] tracking-wider uppercase font-medium">
              An Indian Legacy, A Global Story • 11 Interactive Screens
            </p>
          </div>
        </div>

        {/* View Mode Switcher & Tools */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto justify-between md:justify-end">
          
          {/* Mode Switch: Concept Sheet vs Full Simulator */}
          <div className="flex items-center bg-[#0a142e] border border-[#d4af37]/40 rounded-sm p-0.5">
            <button
              onClick={() => {
                sounds.playStoneClick();
                setViewMode('concept-sheet');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xs text-xs font-cinzel transition-all ${
                viewMode === 'concept-sheet'
                  ? 'bg-[#d4af37] text-[#1c0d05] font-bold shadow'
                  : 'text-[#cbd5e1] hover:text-[#fff1be]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Concept Sheet (11 Screens)</span>
            </button>

            <button
              onClick={() => {
                sounds.playStoneClick();
                setViewMode('simulator');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xs text-xs font-cinzel transition-all ${
                viewMode === 'simulator'
                  ? 'bg-[#d4af37] text-[#1c0d05] font-bold shadow'
                  : 'text-[#cbd5e1] hover:text-[#fff1be]'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Interactive Simulator</span>
            </button>
          </div>

          {/* Audio Atmosphere Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-sm border transition-colors ${
              isAudioOn
                ? 'bg-[#18366e] border-[#f6d77e] text-[#fde047]'
                : 'bg-[#0a142e] border-[#d4af37]/30 text-zinc-400 hover:text-[#fae596]'
            }`}
            title={isAudioOn ? 'Mute Ambient Soundscape' : 'Enable Ambient Tanpura/Bansuri Sound'}
          >
            {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Design Document Info Modal */}
          <button
            onClick={onOpenInfoModal}
            className="p-2 rounded-sm bg-[#0a142e] border border-[#d4af37]/30 text-[#cbd5e1] hover:text-[#fde047] transition-colors"
            title="Design Pillars & Historical Context"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Screen Quick Selector pills when in Simulator mode */}
      {viewMode === 'simulator' && (
        <div className="max-w-7xl mx-auto mt-2.5 pt-2 border-t border-[#d4af37]/20 flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] font-mono text-[#c59b27] uppercase whitespace-nowrap mr-1">
            Jump to Screen:
          </span>
          {SCREENS_DATA.map((screen) => (
            <button
              key={screen.id}
              onClick={() => {
                sounds.playStoneClick();
                setActiveScreenId(screen.id);
              }}
              className={`px-2.5 py-1 rounded-xs whitespace-nowrap font-cinzel transition-all ${
                activeScreenId === screen.id
                  ? 'bg-[#fcd34d] text-[#241205] font-bold shadow-md'
                  : 'bg-[#0c1836] border border-[#d4af37]/30 text-[#cbd5e1] hover:border-[#fcd34d] hover:text-[#fff1be]'
              }`}
            >
              {screen.number}. {screen.title.split('. ')[1] || screen.title}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
