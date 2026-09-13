import { PlayerProfile, GameScreen } from '../../types';
import { GAME_ASSETS } from '../../data/gameData';
import { 
  Sparkles, 
  Compass, 
  Shirt, 
  Star, 
  ArrowRight, 
  MapPin, 
  HelpCircle,
  ScrollText,
  Volume2
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface WelcomeScreenProps {
  player: PlayerProfile;
  onNavigate: (screen: GameScreen) => void;
}

export default function WelcomeScreen({ player, onNavigate }: WelcomeScreenProps) {
  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden select-none">
      {/* Cinematic Varanasi Ghats & Volumetric Light Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={GAME_ASSETS.varanasiGhats}
          alt="Varanasi Ghats at Sunset"
          className="w-full h-full object-cover object-center filter brightness-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-[#091122]/70 to-[#070d18]/80" />
      </div>

      {/* Floating Volumetric Golden Glow / Dust motes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Title & Subtitle Banner */}
      <div className="relative z-10 text-center mt-2 sm:mt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-400/40 text-amber-300 text-[11px] font-cinzel tracking-widest uppercase mb-2 backdrop-blur-md shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive 3D Heritage Adventure</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-cinzel font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#fff2cc] via-[#f7c948] to-[#9e6d0a] drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
          VASTRA YATRA
        </h1>
        <p className="text-sm sm:text-lg font-marcellus text-amber-100 tracking-widest uppercase drop-shadow mt-1">
          Journey Through India's Heritage
        </p>
      </div>

      {/* Main Content Showcase: Left Progress Plaque + Center 3D Sahana + Right Dialog */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-4">
        {/* Left Side: My Progress Plaque (Matching Reference Top-Left Screen) */}
        <div className="md:col-span-4 royal-glass-card rounded-2xl p-5 border border-amber-500/40 shadow-2xl relative">
          <div className="ornate-corner-tl" />
          <div className="ornate-corner-tr" />
          <div className="ornate-corner-bl" />
          <div className="ornate-corner-br" />

          <div className="flex items-center gap-2 border-b border-amber-500/20 pb-3 mb-4">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-cinzel font-bold text-amber-300 tracking-wider">
              MY PROGRESS
            </h3>
          </div>

          <div className="space-y-4">
            {/* Regions Discovered */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-amber-950/80 text-amber-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-xs font-marcellus text-stone-300">
                  Regions Discovered
                </span>
              </div>
              <span className="text-sm font-cinzel font-bold text-amber-300">
                {player.discoveredRegions.length}/12
              </span>
            </div>

            {/* Clothing Unlocked */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-amber-950/80 text-amber-400">
                  <Shirt className="w-4 h-4" />
                </div>
                <span className="text-xs font-marcellus text-stone-300">
                  Clothing Unlocked
                </span>
              </div>
              <span className="text-sm font-cinzel font-bold text-amber-300">
                {player.unlockedGarments.length}/40
              </span>
            </div>

            {/* Heritage Points */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-amber-950/80 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="text-xs font-marcellus text-stone-300">
                  Heritage Points
                </span>
              </div>
              <span className="text-sm font-cinzel font-bold text-amber-300">
                {player.points.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Quick Start Buttons */}
          <div className="mt-5 pt-3 border-t border-amber-500/20 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onNavigate('weaver');
              }}
              className="px-2.5 py-2 rounded-lg bg-stone-900/80 hover:bg-amber-950/60 border border-amber-500/30 text-xs font-cinzel text-amber-200 flex items-center justify-center gap-1.5 transition-all"
            >
              <ScrollText className="w-3.5 h-3.5 text-amber-400" />
              <span>Weaver's Loom</span>
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onNavigate('quiz');
              }}
              className="px-2.5 py-2 rounded-lg bg-stone-900/80 hover:bg-amber-950/60 border border-amber-500/30 text-xs font-cinzel text-amber-200 flex items-center justify-center gap-1.5 transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Culture Quiz</span>
            </button>
          </div>
        </div>

        {/* Center: Stylized 3D Character Sahana Presentation */}
        <div className="md:col-span-4 flex flex-col items-center justify-center relative">
          {/* Ambient Rim Glow */}
          <div className="absolute w-52 h-72 rounded-full bg-amber-500/20 blur-2xl -z-10" />

          <div className="relative group">
            <div className="w-56 sm:w-64 h-80 sm:h-96 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-[0_0_40px_rgba(212,154,35,0.4)] relative">
              <img
                src={GAME_ASSETS.sahanaFull}
                alt="Sahana Character Render"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent opacity-80" />

              {/* Character Tag */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/80 border border-amber-400/60 text-[11px] font-cinzel font-bold text-amber-300 tracking-wider whitespace-nowrap shadow-xl">
                Sahana • Royal Culture Guide
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Speech Bubble & Continue Journey */}
        <div className="md:col-span-4 flex flex-col gap-4">
          {/* Parchment Speech Bubble */}
          <div className="parchment-bg rounded-2xl p-5 border-2 border-amber-600/40 relative shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-cinzel font-bold text-amber-950 tracking-wider uppercase">
                Guide Message
              </span>
            </div>
            <p className="text-sm sm:text-base font-marcellus text-stone-900 leading-relaxed italic">
              "Welcome, Explorer! Every garment tells a story of people, place, and ancient loom. Choose a region to begin your journey through Bharat's timeless textiles."
            </p>
            <div className="mt-3 text-right">
              <span className="text-xs font-cinzel font-bold text-amber-900 tracking-wider">
                — Sahana
              </span>
            </div>
          </div>

          {/* Dramatic CTA Button: CONTINUE JOURNEY (Matching Reference Design) */}
          <button
            onClick={() => {
              soundManager.playCorrectFanfare();
              onNavigate('map');
            }}
            className="w-full py-4 px-6 rounded-xl font-cinzel font-bold text-base tracking-widest uppercase text-amber-200 bg-gradient-to-r from-[#2a133d] via-[#481c66] to-[#2a133d] hover:from-[#36174d] hover:to-[#552077] border-2 border-amber-400 shadow-[0_0_30px_rgba(212,154,35,0.5)] active:scale-98 transition-all flex items-center justify-center gap-3 group"
          >
            <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>CONTINUE JOURNEY</span>
            <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Ambient Sitar Audio Prompt */}
      <div className="relative z-10 flex items-center gap-2 text-xs font-marcellus text-stone-400">
        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
        <span>Immersive soundscape enabled • Indian handloom heritage experience</span>
      </div>
    </div>
  );
}
