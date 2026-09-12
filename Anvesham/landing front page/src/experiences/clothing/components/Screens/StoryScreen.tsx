import { Region, Garment } from '../../types';
import { GAME_ASSETS } from '../../data/gameData';
import ClothViewer3D from '../ThreeCanvas/ClothViewer3D';
import { Sparkles, ArrowRight, Play, BookOpen, RotateCw, MapPin } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface StoryScreenProps {
  region: Region;
  garment: Garment;
  storyIndex?: number;
  totalStories?: number;
  onEnterChallenge: () => void;
  onOpenTimeline: () => void;
  onOpenGuide: () => void;
}

export default function StoryScreen({
  region,
  garment,
  storyIndex = 4,
  totalStories = 12,
  onEnterChallenge,
  onOpenTimeline,
  onOpenGuide,
}: StoryScreenProps) {
  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-between p-4 sm:p-8 overflow-y-auto select-none">
      {/* Cinematic Background Backdrop: Varanasi Ghats */}
      <div className="absolute inset-0 z-0">
        <img
          src={region.environmentBackdrop || GAME_ASSETS.varanasiGhats}
          alt={region.name}
          className="w-full h-full object-cover filter brightness-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-[#091122]/60 to-[#070d18]/85" />
      </div>

      {/* Top Header Information: Matching Top-Right Screen in reference */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between border-b border-amber-500/30 pb-3">
        <div>
          <span className="text-xs font-cinzel font-semibold tracking-widest text-amber-400 uppercase flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {garment.regionName}
          </span>
          <h2 className="text-2xl sm:text-4xl font-cinzel font-black tracking-wider text-amber-200 uppercase drop-shadow">
            {garment.name}
          </h2>
        </div>

        <div className="text-right">
          <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-400/50 text-amber-300 font-cinzel font-bold text-xs tracking-wider">
            STORY {storyIndex.toString().padStart(2, '0')} / {totalStories.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Main Center Stage: 3D Garment Relic on Pedestal + Story Lore */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-4">
        {/* Left Side: 3D Interactive Garment Viewer / Mannequin */}
        <div className="md:col-span-7 royal-glass-card rounded-2xl p-4 border border-amber-500/40 shadow-2xl relative min-h-[380px] flex flex-col">
          <div className="ornate-corner-tl" />
          <div className="ornate-corner-tr" />
          <div className="ornate-corner-bl" />
          <div className="ornate-corner-br" />

          {/* 3D Cloth Display */}
          <div className="flex-1 w-full relative">
            <ClothViewer3D
              colorHex={garment.colorHex}
              accentGold={garment.accentGold}
              garmentName={garment.name}
              rarity={garment.rarity}
              isInteractive={true}
            />
          </div>

          <div className="mt-2 pt-2 border-t border-amber-500/20 flex items-center justify-between text-xs text-stone-300 font-marcellus px-2">
            <span>Weave: {garment.fabricDetails.weaveTechnique}</span>
            <span className="text-amber-400 font-semibold">{garment.fabricDetails.weavingDuration}</span>
          </div>
        </div>

        {/* Right Side: Story Scroll & AI Companion Guide */}
        <div className="md:col-span-5 flex flex-col gap-4">
          {/* Main Story Parchment Card */}
          <div className="parchment-bg rounded-2xl p-5 sm:p-6 border-2 border-amber-600/40 shadow-2xl relative">
            <h3 className="text-lg font-cinzel font-bold text-amber-950 tracking-wide uppercase border-b border-amber-800/30 pb-2">
              The Legend of the Loom
            </h3>
            
            <blockquote className="text-base font-marcellus text-stone-900 leading-relaxed italic my-3">
              {garment.loreQuote}
            </blockquote>

            <p className="text-xs sm:text-sm font-marcellus text-stone-800 leading-relaxed">
              {garment.description}
            </p>

            {/* Enter Story CTA Button (Matching Reference Screen) */}
            <div className="mt-5">
              <button
                onClick={() => {
                  soundManager.playCorrectFanfare();
                  onEnterChallenge();
                }}
                className="w-full py-3.5 px-6 rounded-xl font-cinzel font-bold text-sm tracking-widest uppercase text-stone-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 border border-amber-200 shadow-[0_0_20px_rgba(245,192,66,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>ENTER THE STORY</span>
                <Play className="w-4 h-4 fill-stone-950" />
              </button>
            </div>
          </div>

          {/* AI Culture Guide Companion Quick Callout */}
          <div 
            onClick={onOpenGuide}
            className="royal-glass-card rounded-xl p-3 sm:p-4 border border-amber-500/40 shadow-lg flex items-center gap-3 cursor-pointer hover:border-amber-300 transition-all group"
          >
            <div className="relative flex-shrink-0">
              <img
                src={GAME_ASSETS.sahanaAvatar}
                alt="Sahana Guide"
                className="w-12 h-12 rounded-full object-cover border border-amber-400 group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 p-0.5 bg-amber-600 rounded-full text-white">
                <Sparkles className="w-2.5 h-2.5" />
              </span>
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-cinzel font-bold text-amber-300">
                  Sahana • AI Culture Guide
                </span>
                <span className="text-[10px] text-amber-400 font-cinzel underline group-hover:text-amber-200">
                  Ask Sahana
                </span>
              </div>
              <p className="text-xs font-marcellus text-stone-300 line-clamp-2 mt-0.5">
                "{garment.culturalSignificance}"
              </p>
            </div>
          </div>

          {/* Secondary Action: Historical Timeline */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenTimeline();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-900/80 hover:bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-cinzel tracking-wider uppercase transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>View Historical Timeline</span>
          </button>
        </div>
      </div>
    </div>
  );
}
