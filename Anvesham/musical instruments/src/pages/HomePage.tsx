import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  Gamepad2,
  Map,
  HelpCircle,
  Scale,
  ArrowRight,
  Music2,
  Volume2,
  GraduationCap,
} from 'lucide-react';
import { MusicRiddleModal } from '../components/MusicRiddleModal.tsx';

interface PortalOption {
  to: string;
  title: string;
  subtitle: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeColor?: string;
}

export const HomePage: React.FC = () => {
  const [isRiddleOpen, setIsRiddleOpen] = useState(false);

  const portalOptions: PortalOption[] = [
    {
      to: '/village',
      title: '3D Village',
      subtitle: 'Travel as the Swara Seeker in an explorable 3D village with living instrument masters and storyline quests.',
      badge: 'Interactive Storyline',
      icon: Sparkles,
      accentColor: 'from-amber-500/20 to-amber-700/10 border-amber-400/40 hover:border-amber-300',
      badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    },
    {
      to: '/instruments',
      title: 'Explore',
      subtitle: 'Delve into 30+ classical, folk, and tribal instruments across Tata, Sushira, Avanaddha, and Ghana families.',
      icon: Compass,
      accentColor: 'from-orange-500/20 to-amber-600/10 border-orange-400/30 hover:border-orange-300',
    },
    {
      to: '/games',
      title: 'Games',
      subtitle: 'Challenge your rhythm, bol recognition, ear training, and memory with interactive musical games.',
      icon: Gamepad2,
      accentColor: 'from-rose-500/20 to-amber-600/10 border-rose-400/30 hover:border-rose-300',
    },
    {
      to: '/learn',
      title: 'Learn To Play',
      subtitle: 'Step-by-step master lessons, postures, finger techniques, and verified video tutorials for 10 instruments.',
      badge: 'Tutorials',
      icon: GraduationCap,
      accentColor: 'from-yellow-500/20 to-amber-600/10 border-yellow-400/30 hover:border-yellow-300',
      badgeColor: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
    },
    {
      to: '/map',
      title: 'Sound Map',
      subtitle: 'Trace traditional melodies across the geographic landscape and regional cultures of India.',
      icon: Map,
      accentColor: 'from-emerald-500/20 to-teal-600/10 border-emerald-400/30 hover:border-emerald-300',
    },
    {
      to: '/quiz',
      title: 'Quiz',
      subtitle: 'Put your auditory knowledge, acoustic physics, and historical heritage understanding to the test.',
      icon: HelpCircle,
      accentColor: 'from-cyan-500/20 to-blue-600/10 border-cyan-400/30 hover:border-cyan-300',
    },
    {
      to: '/compare',
      title: 'Compare',
      subtitle: 'Analyze two instruments side-by-side: contrast resonance mechanisms, octave ranges, and craft.',
      icon: Scale,
      accentColor: 'from-purple-500/20 to-indigo-600/10 border-purple-400/30 hover:border-purple-300',
    },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-black">
      {/* TOP RIGHT RIDDLE BUTTON */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setIsRiddleOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/90 hover:bg-stone-900 text-amber-200 hover:text-amber-100 backdrop-blur-md border border-amber-500/40 text-xs font-semibold shadow-lg shadow-amber-500/10 transition-all active:scale-95 group hover:border-amber-400"
          aria-label="Open Musical Riddle"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span>Riddle</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        </button>
      </div>

      {/* RIDDLE MODAL */}
      <MusicRiddleModal isOpen={isRiddleOpen} onClose={() => setIsRiddleOpen(false)} />

      {/* 1. CINEMATIC BACKGROUND IMAGE WITH OVERLAYS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/images/music_heritage_bg.jpg"
          alt="Indian Musical Instruments Background"
          className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-110"
          onError={(e) => {
            // Fallback to high quality unsplash music background if local image is delayed
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920&q=80';
          }}
        />
        {/* Multi-tier gradient overlay for contrast and warm atmosphere */}
        <div className="absolute inset-0 bg-radial from-stone-950/40 via-stone-950/75 to-stone-950/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/60" />
        {/* Subtle decorative motif pattern */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      {/* 2. MAIN FOREGROUND CONTENT */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-20 sm:pb-24 flex flex-col items-center justify-center">
        {/* Brand / Heritage Label */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-medium tracking-wide backdrop-blur-md mb-8 shadow-sm">
          <Music2 className="w-4 h-4 text-amber-400" />
          <span>Indian Musical Heritage & Living Traditions</span>
        </div>

        {/* PROMINENT MUSICAL INSTRUMENTS QUOTE */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-16">
          <div className="flex items-center justify-center gap-3 text-amber-400/80 mb-2">
            <span className="h-[1px] w-10 sm:w-16 bg-gradient-to-r from-transparent to-amber-400/60" />
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span className="h-[1px] w-10 sm:w-16 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>

          <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl text-amber-50 font-normal leading-relaxed tracking-wide italic drop-shadow-md">
            “Where words fail, the instrument speaks.”
          </blockquote>

          <div className="pt-2">
            <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-amber-300/80 font-medium font-sans">
              — The Voice of Nada Brahma
            </p>
          </div>
        </div>

        {/* 3. ACCESS OPTIONS GRID (3D Village, Explore, Games, Sound Map, Quiz, Compare only) */}
        <div className="w-full">
          <div className="text-center mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">
              Select an experience to enter
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {portalOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <Link
                  key={opt.to}
                  to={opt.to}
                  className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-stone-900/85 hover:bg-stone-900/95 backdrop-blur-md border ${opt.accentColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 active:scale-[0.99]`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-center text-amber-400 group-hover:text-amber-300 group-hover:scale-110 transition-all duration-300 shadow-inner">
                        <Icon className="w-6 h-6" />
                      </div>
                      {opt.badge && (
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                            opt.badgeColor || 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                          }`}
                        >
                          {opt.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-amber-200 transition-colors flex items-center gap-2">
                        {opt.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-300 font-normal leading-relaxed mt-1.5">
                        {opt.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-stone-800/80 flex items-center justify-between text-xs font-semibold text-amber-300/90 group-hover:text-amber-200">
                    <span>Enter Experience</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. SUBTLE FOOTER ACCENT */}
      <footer className="relative z-10 w-full text-center py-6 border-t border-stone-800/60 text-[11px] text-stone-500">
        <p>Preserving and celebrating the acoustic heritage of India</p>
      </footer>
    </div>
  );
};
