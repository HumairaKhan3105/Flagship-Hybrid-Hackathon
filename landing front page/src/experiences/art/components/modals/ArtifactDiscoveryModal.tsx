import React from 'react';
import { CulturalArtifact } from '../../types';
import { sound } from '../../utils/soundEngine';
import { Sparkles, Award, MapPin, X } from 'lucide-react';

interface ArtifactDiscoveryModalProps {
  artifact: CulturalArtifact;
  onClose: () => void;
}

export const ArtifactDiscoveryModal: React.FC<ArtifactDiscoveryModalProps> = ({
  artifact,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative glow-heritage text-center animate-in zoom-in-95 duration-200">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-all"
        >
          <X size={20} />
        </button>

        {/* Glowing Artifact Icon */}
        <div
          className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center text-4xl shadow-2xl border-2 border-amber-400/80"
          style={{ backgroundColor: `${artifact.color}33` }}
        >
          {artifact.icon}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
          <Sparkles size={14} />
          <span>Cultural Relic Discovered!</span>
        </div>

        <h3 className="text-2xl font-bold font-heading text-amber-100 mb-1">
          {artifact.name}
        </h3>

        <div className="flex items-center justify-center gap-2 text-xs text-stone-400 mb-4">
          <MapPin size={12} className="text-orange-400" />
          <span>{artifact.region} • Traditional Artisan Craft</span>
        </div>

        <p className="text-stone-300 text-sm mb-4 leading-relaxed">
          {artifact.description}
        </p>

        {/* Interesting Fact Card */}
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs sm:text-sm text-amber-200 leading-relaxed text-left mb-6">
          <span className="font-bold block text-amber-400 mb-1">
            📜 Heritage Fact:
          </span>
          {artifact.interestingFact}
        </div>

        {/* XP Reward Badge */}
        <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-amber-900/40 border border-amber-500/30 text-amber-300 text-sm font-bold w-fit mx-auto mb-6">
          <Award size={18} className="text-yellow-400" />
          <span>+10 Explorer XP Added</span>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 text-white rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95"
        >
          Collect & Continue
        </button>
      </div>
    </div>
  );
};
