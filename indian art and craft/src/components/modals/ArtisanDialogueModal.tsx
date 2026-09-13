import React, { useState } from 'react';
import { CraftRegion } from '../../types';
import { sound } from '../../utils/soundEngine';
import { ChevronRight, Sparkles, Paintbrush, BookOpen, X } from 'lucide-react';

interface ArtisanDialogueModalProps {
  region: CraftRegion;
  onClose: () => void;
  onStartPainting: () => void;
  onStartPuzzle: () => void;
}

export const ArtisanDialogueModal: React.FC<ArtisanDialogueModalProps> = ({
  region,
  onClose,
  onStartPainting,
  onStartPuzzle,
}) => {
  const [loreIndex, setLoreIndex] = useState<number>(0);
  const artisan = region.artisan;

  const handleNextLore = () => {
    sound.playClick();
    if (loreIndex < artisan.culturalLore.length - 1) {
      setLoreIndex((prev) => prev + 1);
    } else {
      // Finished dialogue, direct to painting
      onStartPainting();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative glow-heritage animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-all"
        >
          <X size={20} />
        </button>

        {/* Artisan Profile Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-900/60 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-lg">
            👵🏽
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              {artisan.title}
            </span>
            <h3 className="text-xl font-bold font-heading text-amber-100">
              {artisan.name}
            </h3>
            <span className="text-xs text-stone-400">
              {region.craftName} • {region.state}
            </span>
          </div>
        </div>

        {/* Greeting Banner */}
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 mb-6 text-amber-100 font-medium text-sm sm:text-base leading-relaxed italic">
          {artisan.greeting}
        </div>

        {/* Cultural Lore Slides */}
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 mb-6">
          <div className="flex items-center justify-between text-xs text-amber-400/90 font-semibold mb-2">
            <span className="flex items-center gap-1">
              <Sparkles size={14} />
              Living Heritage Wisdom
            </span>
            <span>
              {loreIndex + 1} / {artisan.culturalLore.length}
            </span>
          </div>
          <p className="text-stone-300 text-sm leading-relaxed">
            {artisan.culturalLore[loreIndex]}
          </p>
        </div>

        {/* Mission Objective Reminder */}
        <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-500/20 mb-6 flex items-start gap-2 text-xs text-orange-200">
          <BookOpen size={16} className="text-orange-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-orange-300 block mb-0.5">
              Mission: {region.missionName}
            </span>
            <span>{region.missionObjective}</span>
          </div>
        </div>

        {/* Navigation & Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleNextLore}
            className="flex-1 py-3 px-4 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-xl font-semibold text-sm border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all"
          >
            <span>{loreIndex < artisan.culturalLore.length - 1 ? 'Continue Lore →' : 'Understood!'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onStartPainting();
            }}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Paintbrush size={16} />
            <span>Restore Painting (+50 XP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
