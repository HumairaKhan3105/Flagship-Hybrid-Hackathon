import React from 'react';
import { X, Sparkles, BookOpen, Layers, ShieldCheck, Compass, Globe } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#02050e]/95 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-3xl bg-[#081229] border-2 border-[#d4af37] rounded-md p-6 max-h-[90vh] overflow-y-auto shadow-2xl relative text-[#f5ebd6]">
        
        {/* Header */}
        <div className="flex justify-between items-start pb-3 border-b border-[#d4af37]/40 mb-4">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#f59e0b] uppercase">
              AAA Game Concept Sheet Design Document
            </div>
            <h2 className="font-cinzel text-xl md:text-2xl font-bold text-[#fae596]">
              Nalanda Mystery: Design & Heritage Pillars
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded border border-[#d4af37]/30 hover:border-[#fcd34d] text-[#fae596]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content sections */}
        <div className="space-y-5 text-xs md:text-sm text-[#e2d5b6] leading-relaxed font-sans">
          
          {/* Aesthetic Palette */}
          <div className="p-3.5 bg-[#050b18] border border-[#d4af37]/30 rounded-sm">
            <h3 className="font-cinzel text-sm font-bold text-[#fcd34d] flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Core Visual Identity & Color Archetype</span>
            </h3>
            <p>
              Combining <strong>ancient Magadha red-terracotta architecture</strong> and <strong>parchment manuscripts</strong> with <strong>dark royal navy UI frames (#060c1c)</strong>, <strong>antique brass and 24k gold filigree accents</strong>, and <strong>warm golden temple lighting</strong>. Every screen is calibrated for high visual contrast and historical authenticity.
            </p>
          </div>

          {/* Historical Depth */}
          <div className="p-3.5 bg-[#050b18] border border-[#d4af37]/30 rounded-sm">
            <h3 className="font-cinzel text-sm font-bold text-[#fcd34d] flex items-center space-x-2 mb-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>The 11 Screen Progression & Narrative Arc</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <strong className="text-[#fae596]">1. Main Menu:</strong> Sunrise over Nalanda stupas.
              </div>
              <div>
                <strong className="text-[#fae596]">2. 3rd-Person Exploration:</strong> Courtyard HUD with objective & compass.
              </div>
              <div>
                <strong className="text-[#fae596]">3. NPC Dialogue:</strong> Acharya Shilabhadra in the library.
              </div>
              <div>
                <strong className="text-[#fae596]">4. Notebook / Journal:</strong> Quests, clues, and ink sketches.
              </div>
              <div>
                <strong className="text-[#fae596]">5. Mathematics Puzzle:</strong> Vedic algebra and missing digits.
              </div>
              <div>
                <strong className="text-[#fae596]">6. Astronomy Puzzle:</strong> Golayantra armillary celestial alignment.
              </div>
              <div>
                <strong className="text-[#fae596]">7. Knowledge Web:</strong> Detective mind map with luminous nodes.
              </div>
              <div>
                <strong className="text-[#fae596]">8. Nalanda Map:</strong> Isometric 7th-century cartography.
              </div>
              <div>
                <strong className="text-[#fae596]">9. Inventory:</strong> Relics, coins, keys, and Ayurvedic herbs.
              </div>
              <div>
                <strong className="text-[#fae596]">10. Final Moral Choice:</strong> 3 philosophical preservation paths.
              </div>
              <div className="sm:col-span-2">
                <strong className="text-[#fae596]">11. Emotional Ending:</strong> Epilogue on Nalanda's global transmission.
              </div>
            </div>
          </div>

          {/* Soundscape & Audio */}
          <div className="p-3.5 bg-[#050b18] border border-[#d4af37]/30 rounded-sm">
            <h3 className="font-cinzel text-sm font-bold text-[#fcd34d] flex items-center space-x-2 mb-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Interactive Audio Synthesizer</span>
            </h3>
            <p>
              Built entirely in procedural Web Audio API with zero external assets: resonant Indian bronze temple bells (Ghanta), authentic Tanpura Sa-Pa drone harmonics, stone sliding clicks for Vedic puzzles, and rustling parchment paper.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-[#d4af37]/30 text-center">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-sm bg-[#d4af37] text-[#1a0c04] font-cinzel font-bold text-xs hover:bg-[#f6d77e] transition-colors"
          >
            Return to Concept Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
