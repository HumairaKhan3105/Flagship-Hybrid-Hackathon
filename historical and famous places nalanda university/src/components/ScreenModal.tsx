import React from 'react';
import { X, Maximize2, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScreenId } from '../types';
import { SCREENS_DATA } from '../data/gameData';
import { sounds } from '../audio';

interface ScreenModalProps {
  screenId: ScreenId | null;
  onClose: () => void;
  onSelectScreen: (id: ScreenId) => void;
  renderScreenContent: (id: ScreenId) => React.ReactNode;
}

export const ScreenModal: React.FC<ScreenModalProps> = ({
  screenId,
  onClose,
  onSelectScreen,
  renderScreenContent,
}) => {
  if (!screenId) return null;

  const currentIdx = SCREENS_DATA.findIndex((s) => s.id === screenId);
  const currentMeta = SCREENS_DATA[currentIdx];

  const handlePrev = () => {
    sounds.playStoneClick();
    const prevIdx = (currentIdx - 1 + SCREENS_DATA.length) % SCREENS_DATA.length;
    onSelectScreen(SCREENS_DATA[prevIdx].id);
  };

  const handleNext = () => {
    sounds.playStoneClick();
    const nextIdx = (currentIdx + 1) % SCREENS_DATA.length;
    onSelectScreen(SCREENS_DATA[nextIdx].id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#03060f]/95 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl h-[94vh] bg-[#070e22] border-2 border-[#d4af37]/80 rounded-md flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.95)] overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="px-4 py-3 bg-[#0a1532] border-b border-[#d4af37]/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="px-2 py-0.5 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-xs font-mono text-[#fde047]">
              Screen {currentMeta.number} of 11
            </span>
            <h3 className="font-cinzel text-base md:text-lg font-bold text-[#fae596]">
              {currentMeta.title}
            </h3>
            <span className="hidden sm:inline text-xs text-zinc-400 font-sans">
              • {currentMeta.category}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Prev / Next Nav */}
            <button
              onClick={handlePrev}
              className="p-1.5 rounded border border-[#d4af37]/30 hover:border-[#fcd34d] text-zinc-300 hover:text-white transition-colors"
              title="Previous Screen"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded border border-[#d4af37]/30 hover:border-[#fcd34d] text-zinc-300 hover:text-white transition-colors"
              title="Next Screen"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="ml-2 p-1.5 rounded bg-rose-950/40 border border-rose-800/60 hover:bg-rose-900/60 text-rose-200 transition-colors"
              title="Close Fullscreen View"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Screen Interactive Body */}
        <div className="flex-1 overflow-auto relative">
          {renderScreenContent(screenId)}
        </div>

        {/* Modal Footer with UI Highlights */}
        <div className="px-4 py-2 bg-[#050b18] border-t border-[#d4af37]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-[#cbd5e1] gap-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-mono text-[#fcd34d] uppercase">Key UI Highlights:</span>
            <div className="flex items-center space-x-2 overflow-x-auto text-[11px]">
              {currentMeta.uiHighlights.map((hl, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-[#0f224a] text-[#f7eed9] whitespace-nowrap">
                  {hl}
                </span>
              ))}
            </div>
          </div>

          <div className="text-[10px] font-mono text-[#c59b27]">
            Press ESC or click Close to return to Concept Sheet
          </div>
        </div>
      </div>
    </div>
  );
};
