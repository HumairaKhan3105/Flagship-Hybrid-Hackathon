import React, { useState } from 'react';
import { CRAFT_REGIONS } from '../../data/craftsData';
import { sound } from '../../utils/soundEngine';
import { ChevronLeft, Lock, BookOpen, Sparkles, MapPin, Award, Layers } from 'lucide-react';

interface CulturalMuseumViewProps {
  unlockedRegionIds: string[];
  onBack: () => void;
}

export const CulturalMuseumView: React.FC<CulturalMuseumViewProps> = ({
  unlockedRegionIds,
  onBack,
}) => {
  const [selectedCraftId, setSelectedCraftId] = useState<string>(CRAFT_REGIONS[0].id);

  const selectedCraft = CRAFT_REGIONS.find((c) => c.id === selectedCraftId) || CRAFT_REGIONS[0];
  const isSelectedUnlocked = unlockedRegionIds.includes(selectedCraft.id);

  return (
    <div className="relative w-full h-full flex flex-col bg-stone-950 text-amber-50 select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-stone-900 border-b border-amber-500/30 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/20 transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-amber-400 flex items-center gap-2">
              <BookOpen size={20} />
              <span>National Museum of Indian Craft Heritage</span>
            </h2>
            <p className="text-xs text-stone-400">
              Living encyclopedic archives of indigenous art traditions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 border border-amber-500/20 text-xs font-semibold text-amber-300">
          <Award size={14} className="text-yellow-400" />
          <span>
            {unlockedRegionIds.length} / {CRAFT_REGIONS.length} Crafts Collected
          </span>
        </div>
      </div>

      {/* Main Museum Exhibit Floor */}
      <div className="p-6 max-w-6xl mx-auto w-full flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left Side: Collectible Cards List */}
        <div className="w-full lg:w-80 flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            Heritage Gallery Exhibits
          </h3>
          <div className="space-y-2.5 overflow-y-auto max-h-[72vh] pr-1">
            {CRAFT_REGIONS.map((craft) => {
              const isUnlocked = unlockedRegionIds.includes(craft.id);
              const isSelected = selectedCraftId === craft.id;

              return (
                <button
                  key={craft.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedCraftId(craft.id);
                  }}
                  className={`w-full p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between text-left ${
                    isSelected
                      ? 'bg-amber-950/60 border-amber-400 shadow-lg scale-101'
                      : isUnlocked
                      ? 'bg-stone-900 border-amber-500/20 hover:border-amber-500/50 hover:bg-stone-800'
                      : 'bg-stone-900/40 border-stone-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border border-white/10 shrink-0"
                      style={{
                        backgroundColor: isUnlocked ? `${craft.accentColor}33` : '#27272a',
                      }}
                    >
                      {isUnlocked ? '🏛️' : '🔒'}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-amber-100 block truncate">
                        {craft.craftName}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {craft.state} • {craft.difficulty}
                      </span>
                    </div>
                  </div>

                  {isUnlocked ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      Archived
                    </span>
                  ) : (
                    <Lock size={14} className="text-stone-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detailed Artifact Exhibit Plaque */}
        <div className="flex-1">
          {isSelectedUnlocked ? (
            <div className="bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              {/* Exhibit Header */}
              <div className="border-b border-stone-800 pb-6 mb-6">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <MapPin size={14} />
                    {selectedCraft.region} • State of {selectedCraft.state}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    Master Artisan: {selectedCraft.artisan.name}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-amber-100">
                  {selectedCraft.craftName}
                </h1>
                <p className="text-sm text-amber-300/90 mt-1 italic">
                  “{selectedCraft.tagline}”
                </p>
              </div>

              {/* Exhibit Lore Sections */}
              <div className="space-y-6 text-sm text-stone-300 leading-relaxed">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                    <Sparkles size={14} />
                    Historical Genesis
                  </h4>
                  <p>{selectedCraft.history}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                    <Layers size={14} />
                    Traditional Technique & Organic Pigments
                  </h4>
                  <p>{selectedCraft.traditionalTechnique}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                    <BookOpen size={14} />
                    Cultural Significance & Motifs
                  </h4>
                  <p>{selectedCraft.culturalSignificance}</p>
                </div>
              </div>

              {/* Curated Artifacts in this craft */}
              <div className="mt-8 pt-6 border-t border-stone-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                  Catalogued Cultural Relics ({selectedCraft.artifacts.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCraft.artifacts.map((art) => (
                    <div
                      key={art.id}
                      className="p-3.5 rounded-2xl bg-stone-950/60 border border-amber-500/20 flex items-start gap-3"
                    >
                      <span className="text-2xl shrink-0 p-1.5 rounded-xl bg-stone-900 border border-stone-800">
                        {art.icon}
                      </span>
                      <div>
                        <span className="font-bold text-xs text-amber-200 block">
                          {art.name}
                        </span>
                        <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-2">
                          {art.interestingFact}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 rounded-3xl bg-stone-900/30 border-2 border-dashed border-stone-800 text-center backdrop-blur-md">
              <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center text-3xl mb-4 text-stone-500">
                🔒
              </div>
              <h3 className="text-xl font-bold font-heading text-stone-400 mb-2">
                Exhibition Wing Locked
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md">
                Travel to {selectedCraft.state} on the cultural map and complete the artisan missions to unveil this ancient craft in the National Museum.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
