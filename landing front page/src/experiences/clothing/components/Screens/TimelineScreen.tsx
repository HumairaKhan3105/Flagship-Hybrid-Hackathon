import { useState } from 'react';
import { TIMELINE_ERAS } from '../../data/gameData';
import { BookOpen, Calendar, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export default function TimelineScreen() {
  const [selectedEraId, setSelectedEraId] = useState<string>(TIMELINE_ERAS[0].id);
  const activeEra = TIMELINE_ERAS.find(e => e.id === selectedEraId) || TIMELINE_ERAS[0];

  return (
    <div className="relative w-full flex-1 flex flex-col p-4 sm:p-8 overflow-y-auto select-none">
      {/* Top Banner */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-500/30 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-amber-200 uppercase tracking-wider">
              HISTORICAL TIMELINE
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-400 text-amber-300 font-cinzel font-semibold text-xs">
              5,000 Years of Bharat's Textiles
            </span>
          </div>
          <p className="text-xs sm:text-sm font-marcellus text-stone-300 mt-0.5">
            Trace the evolution of weaving, spinning, and royal attire across dynasties
          </p>
        </div>
      </div>

      {/* Main Content: Horizontal Era Selector + Rich Era Scroll */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col gap-6">
        {/* Era Navigation Ribbons */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
          {TIMELINE_ERAS.map((era) => {
            const isSelected = era.id === selectedEraId;
            return (
              <button
                key={era.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedEraId(era.id);
                }}
                className={`relative px-4 py-2.5 rounded-xl border transition-all text-left flex-shrink-0 group ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,192,66,0.35)] scale-105'
                    : 'bg-stone-950/70 border-stone-800 text-stone-400 hover:border-amber-500/40 hover:text-stone-200'
                }`}
              >
                <span className="text-[10px] font-cinzel font-semibold text-amber-400 block">
                  {era.period}
                </span>
                <span className="text-xs sm:text-sm font-cinzel font-bold block whitespace-nowrap">
                  {era.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Era Deep Dive Card */}
        <div className="royal-glass-card rounded-2xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl relative grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="ornate-corner-tl" />
          <div className="ornate-corner-tr" />
          <div className="ornate-corner-bl" />
          <div className="ornate-corner-br" />

          {/* Left: Era Overview */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-400 text-xs font-cinzel font-bold text-amber-300">
                  {activeEra.period}
                </span>
                <span className="text-xs font-marcellus text-stone-400">
                  {activeEra.subtitle}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-cinzel font-black text-amber-200 uppercase tracking-wider mb-3">
                {activeEra.title}
              </h3>

              <p className="text-sm font-marcellus text-stone-300 leading-relaxed mb-4">
                {activeEra.summary}
              </p>

              {/* Key Textile Breakthrough */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-amber-500/30 mb-4">
                <span className="text-xs font-cinzel font-bold text-amber-400 uppercase block mb-1">
                  Weaving & Dyeing Breakthrough
                </span>
                <p className="text-xs font-marcellus text-stone-300 leading-relaxed">
                  {activeEra.techniqueMilestone}
                </p>
              </div>
            </div>

            {/* Royal Influence & Dynasty */}
            <div className="flex items-center gap-2 text-xs font-cinzel text-stone-400">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Royal Patronage: {activeEra.royalInfluence}</span>
            </div>
          </div>

          {/* Right: Signature Garment of this Era */}
          <div className="md:col-span-5 flex flex-col justify-between bg-stone-950/60 rounded-xl p-5 border border-amber-500/20">
            <div>
              <h4 className="text-sm font-cinzel font-bold text-amber-300 uppercase tracking-wider border-b border-amber-500/20 pb-2 mb-3">
                Garment Highlight of this Era
              </h4>

              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-2 text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-cinzel font-bold">Heirloom Artifact</span>
                </div>
                <p className="text-sm font-marcellus text-stone-200 font-semibold">
                  {activeEra.garmentHighlight}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-500/20 text-center">
              <p className="text-[11px] font-marcellus text-stone-400 italic">
                "Cloth in ancient India was not merely wear, but sacred cosmology."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
