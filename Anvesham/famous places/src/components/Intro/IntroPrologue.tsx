import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ArrowRight, SkipForward, Sparkles } from 'lucide-react';
import { soundService } from '../../services/soundService';

export const IntroPrologue: React.FC = () => {
  const { skipIntro } = useGameStore();
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    {
      subtitle: 'PROLOGUE I • THE ARRIVAL AT SUNSET',
      title: 'THE CITY OF VICTORY',
      body: 'You arrive at Hampi at golden twilight. The setting sun paints the rugged granite boulders in deep amber. Across the horizon, the grand 50-meter Rajagopuram of Virupaksha Temple pierces the Karnataka sky.',
      detail: 'Once home to half a million souls, Vijayanagara was the second-largest metropolis on Earth in 1500 CE—richer than Rome, adorned in rubies, silk, and sacred stone.'
    },
    {
      subtitle: 'PROLOGUE II • THE ROYAL COVENANT',
      title: 'THE STONE CHARIOT SECRET',
      body: 'In the archives of the Royal Mint, a faded palm-leaf manuscript speaks of a lost royal decree consecrated by Emperor Krishnadevaraya himself in 1516 CE.',
      detail: 'The decree was sealed behind an intricate astronomical mechanism within the world-famous Stone Chariot at the Vitthala temple complex. Four sacred emblems lock the chamber.'
    },
    {
      subtitle: 'PROLOGUE III • THE EXPEDITION BEGINS',
      title: 'YOUR SACRED EXPEDITION',
      body: 'Guided by the wisdom of Acharya Vidyadhar, your companion historian, you must walk the ancient pathways, inspect carved granite plinths, and decipher Kannada epigraphs.',
      detail: 'Begin your search in Hampi Bazaar. Uncover the merchant’s chest and find the first cartographic fragment of the lost empire.'
    }
  ];

  const currentSlide = slides[slideIndex];

  const handleNext = () => {
    soundService.playStoneInteract();
    if (slideIndex < slides.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      soundService.playDiscovery();
      skipIntro();
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-6 sm:p-12 bg-stone-950 text-stone-100 select-none overflow-hidden">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 40%, #78350f 0%, #1c1007 70%, #0c0704 100%)`
        }}
      />

      {/* Prologue Card */}
      <div className="relative z-10 w-full max-w-2xl bg-gradient-to-b from-[#22160d]/95 via-[#140e09]/95 to-[#0b0805]/95 border border-amber-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl box-gold-glow flex flex-col justify-between min-h-[440px]">
        <div>
          {/* Header Badge */}
          <div className="flex items-center justify-between mb-4 border-b border-amber-900/40 pb-3">
            <span className="text-xs font-serif text-amber-400 tracking-widest font-semibold">
              {currentSlide.subtitle}
            </span>
            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === slideIndex ? 'bg-amber-400 w-6' : 'bg-stone-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-amber-100 gold-glow tracking-tight mb-4">
            {currentSlide.title}
          </h2>

          {/* Narrative Body */}
          <p className="font-serif text-sm sm:text-base text-stone-200 leading-relaxed mb-4">
            {currentSlide.body}
          </p>

          {/* Detail Box */}
          <div className="bg-amber-950/40 border border-amber-900/50 rounded-2xl p-4 text-xs text-amber-200/90 font-sans leading-relaxed italic flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>{currentSlide.detail}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-amber-900/40 mt-6">
          <button
            onClick={skipIntro}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-300 transition-colors font-serif cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>SKIP PROLOGUE</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-7 py-3 rounded-full font-serif font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 box-gold-glow transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>{slideIndex === slides.length - 1 ? 'ENTER HAMPI WORLD' : 'NEXT CHAPTER'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
