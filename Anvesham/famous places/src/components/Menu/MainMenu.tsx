import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Play, BookOpen, Settings, Volume2, VolumeX, Compass, Shield, Sparkles } from 'lucide-react';
import { soundService } from '../../services/soundService';

export const MainMenu: React.FC = () => {
  const { startAdventure, isMuted, toggleMute, setActiveModal } = useGameStore();
  const [showControls, setShowControls] = useState(false);

  const handleStart = () => {
    soundService.playDiscovery();
    startAdventure();
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 md:p-12 overflow-hidden bg-stone-950 text-stone-100 select-none">
      {/* Cinematic Background with atmospheric gradient, sun disc, and Hampi silhouettes */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 30%, #78350f 0%, #1c1007 60%, #0c0704 100%)`
        }}
      />

      {/* Floating gold dust motes */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/5 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* TOP BAR */}
      <header className="relative z-10 flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <span className="font-serif text-xs tracking-widest text-amber-400 uppercase font-bold">
              VIJAYANAGARA ARCHIVES
            </span>
            <p className="text-[10px] text-stone-400 font-mono">
              HISTORICAL 3D ADVENTURE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-amber-900/40 text-amber-400 transition-all cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* CENTER HERO: TITLE & CALL TO ACTION */}
      <main className="relative z-10 flex flex-col items-center text-center my-auto max-w-3xl mx-auto px-4">
        {/* Emblem */}
        <div className="relative mb-4 flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 border-2 border-amber-200 text-stone-950 shadow-2xl box-gold-glow">
          <span className="text-4xl">☸️</span>
          <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-200 animate-pulse" />
        </div>

        {/* Kannada script title */}
        <span className="font-serif text-sm sm:text-base text-amber-400 tracking-widest font-semibold mb-1">
          ಹಂಪಿಯ ಧ್ವನಿಗಳು: ಕಲ್ಲಿನ ರಥದ ರಹಸ್ಯ
        </span>

        {/* Main Title */}
        <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-amber-100 gold-glow tracking-tight mb-2 uppercase leading-none">
          HAMPI ECHOES
        </h1>

        <h2 className="font-serif font-semibold text-base sm:text-xl text-amber-300/90 tracking-widest uppercase mb-6">
          THE STONE CHARIOT SECRET
        </h2>

        {/* Tagline */}
        <p className="font-sans text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed mb-8">
          Step into the 16th-century golden capital of Emperor Krishnadevaraya. Explore ancient granite mandapas, decipher sacred Kannada epigraphs, and solve the astronomical lock of the world-famous Stone Chariot.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md justify-center">
          <button
            onClick={handleStart}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-full font-serif font-bold text-sm sm:text-base bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-stone-950 box-gold-glow shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>START ADVENTURE</span>
          </button>

          <button
            onClick={() => setShowControls(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-serif font-semibold text-xs sm:text-sm bg-stone-900/90 hover:bg-stone-800 text-amber-200 border border-amber-800/60 hover:border-amber-500 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>CONTROLS & GUIDE</span>
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 font-sans border-t border-amber-950/40 pt-4 gap-2">
        <p>
          UNESCO World Heritage Site • Vijayanagara Empire (1336–1646 CE)
        </p>
        <div className="flex items-center gap-4">
          <span>Explore • Observe • Discover • Solve</span>
        </div>
      </footer>

      {/* CONTROLS MODAL POPUP */}
      {showControls && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-stone-950 border border-amber-600/50 rounded-3xl p-6 shadow-2xl box-gold-glow">
            <h3 className="font-serif font-bold text-lg text-amber-100 mb-4 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <span>EXPLORER'S FIELD MANUAL</span>
            </h3>

            <div className="space-y-3 text-xs text-stone-300 font-sans mb-6">
              <div className="flex items-center justify-between p-2.5 bg-stone-900/80 rounded-xl border border-amber-900/40">
                <span className="font-semibold text-amber-200">Move Explorer</span>
                <kbd className="bg-stone-800 text-amber-400 px-2 py-1 rounded font-mono">W A S D / Arrow Keys</kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-stone-900/80 rounded-xl border border-amber-900/40">
                <span className="font-semibold text-amber-200">Sprint / Run</span>
                <kbd className="bg-stone-800 text-amber-400 px-2 py-1 rounded font-mono">Shift Key</kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-stone-900/80 rounded-xl border border-amber-900/40">
                <span className="font-semibold text-amber-200">Jump</span>
                <kbd className="bg-stone-800 text-amber-400 px-2 py-1 rounded font-mono">Spacebar</kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-stone-900/80 rounded-xl border border-amber-900/40">
                <span className="font-semibold text-amber-200">Interact with Objects</span>
                <kbd className="bg-amber-500 text-stone-950 px-2.5 py-1 rounded font-mono font-bold">E Key</kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-stone-900/80 rounded-xl border border-amber-900/40">
                <span className="font-semibold text-amber-200">Rotate Camera</span>
                <span className="text-stone-400">Click & Drag Left / Right Mouse</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-stone-900/80 rounded-xl border border-amber-900/40">
                <span className="font-semibold text-amber-200">World Map & Fast Travel</span>
                <kbd className="bg-stone-800 text-amber-400 px-2 py-1 rounded font-mono">M Key</kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-stone-900/80 rounded-xl border border-amber-900/40">
                <span className="font-semibold text-amber-200">Historical Journal & Clues</span>
                <kbd className="bg-stone-800 text-amber-400 px-2 py-1 rounded font-mono">I Key</kbd>
              </div>
            </div>

            <button
              onClick={() => setShowControls(false)}
              className="w-full py-2.5 rounded-xl font-serif font-bold text-xs bg-amber-600 hover:bg-amber-500 text-stone-950 transition-all cursor-pointer"
            >
              CLOSE MANUAL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
