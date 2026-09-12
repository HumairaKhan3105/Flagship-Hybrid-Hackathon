import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Play,
  Volume2,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Youtube,
  Music2,
} from 'lucide-react';
import { LEARN_TO_PLAY_INSTRUMENTS, LearnInstrumentItem } from '../data/learnToPlayData.ts';
import { soundSynthesizer } from '../services/soundSynthesizer.ts';

export const LearnToPlayPage: React.FC = () => {
  const [selectedInstrument, setSelectedInstrument] = useState<LearnInstrumentItem>(
    LEARN_TO_PLAY_INSTRUMENTS[0]
  );
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const families = [
    { id: 'all', label: 'All Instruments' },
    { id: 'Sushira (Wind)', label: 'Sushira (Wind)' },
    { id: 'Tata (String)', label: 'Tata (Strings)' },
    { id: 'Avanaddha (Percussion)', label: 'Avanaddha (Drums)' },
    { id: 'Ghana (Idiophone)', label: 'Ghana (Solids)' },
  ];

  const filteredInstruments =
    selectedFamily === 'all'
      ? LEARN_TO_PLAY_INSTRUMENTS
      : LEARN_TO_PLAY_INSTRUMENTS.filter((i) => i.family === selectedFamily);

  const handlePlaySolo = (soundType: LearnInstrumentItem['audioSoundType']) => {
    setIsPlayingAudio(true);
    soundSynthesizer.playVillageInstrumentSolo(soundType);
    setTimeout(() => setIsPlayingAudio(false), 2200);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-black">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        {/* Top Breadcrumb & Header */}
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Home</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide mb-3">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>Interactive Masterclass & Curriculum</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Learn To Play Indian Instruments
              </h1>
              <p className="text-stone-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                Master the fundamental postures, finger placements, vocal bols, and microtonal techniques across India’s classical and folk traditions, paired with verified video tutorials.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-900 rounded-2xl border border-stone-800 self-start md:self-end">
              {families.map((fam) => (
                <button
                  key={fam.id}
                  onClick={() => setSelectedFamily(fam.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedFamily === fam.id
                      ? 'bg-amber-500 text-stone-950 font-semibold shadow-xs'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {fam.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Instrument Selector Sidebar + Detailed Lesson Suite */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Instrument Selector List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
              Select Instrument ({filteredInstruments.length})
            </h2>

            <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
              {filteredInstruments.map((inst) => {
                const isSelected = selectedInstrument.id === inst.id;
                return (
                  <button
                    key={inst.id}
                    onClick={() => {
                      setSelectedInstrument(inst);
                      setActiveStepIndex(0);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center gap-3.5 group ${
                      isSelected
                        ? 'bg-stone-900 border-amber-400/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40'
                        : 'bg-stone-900/60 hover:bg-stone-900 border-stone-800/80 hover:border-stone-700'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-950 border border-stone-800 shrink-0 relative">
                      <img
                        src={inst.image}
                        alt={inst.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80';
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-base text-white group-hover:text-amber-300 transition-colors truncate">
                          {inst.name}
                        </span>
                        <span className="text-[10px] text-stone-400 font-hindi">
                          {inst.hindiName}
                        </span>
                      </div>
                      <span className="text-xs text-stone-400 block truncate mt-0.5">
                        {inst.family}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-800 text-amber-300/90 border border-stone-700">
                          {inst.difficulty}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {inst.steps.length} Steps
                        </span>
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-amber-400 translate-x-1' : 'text-stone-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Lesson Suite for Active Instrument (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Instrument Hero Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-stone-900/90 border border-amber-500/30 backdrop-blur-md shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      {selectedInstrument.family}
                    </span>
                    <span className="text-stone-500">•</span>
                    <span className="text-xs text-stone-400 font-sans">
                      {selectedInstrument.difficulty}
                    </span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
                    <span>{selectedInstrument.name}</span>
                    <span className="text-2xl text-amber-300/80 font-normal font-hindi">
                      ({selectedInstrument.hindiName})
                    </span>
                  </h2>
                </div>

                {/* Sound Preview Action */}
                <button
                  onClick={() => handlePlaySolo(selectedInstrument.audioSoundType)}
                  disabled={isPlayingAudio}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-semibold transition-all active:scale-95 shrink-0"
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-amber-200' : ''}`} />
                  <span>{isPlayingAudio ? 'Playing Solo...' : 'Play Reference Tone'}</span>
                </button>
              </div>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6">
                {selectedInstrument.summary}
              </p>

              {/* Raga and Scale Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-950/60 border border-stone-800 text-xs text-stone-300">
                <Music2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Foundational Tuning / Scale:</span>
                <strong className="text-amber-200">{selectedInstrument.ragaOrScale}</strong>
              </div>
            </div>

            {/* YOUTUBE VIDEO TUTORIAL SECTION */}
            <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Youtube className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      Recommended Video Tutorial
                    </h3>
                    <p className="text-xs text-stone-400">{selectedInstrument.videoTitle}</p>
                  </div>
                </div>

                <a
                  href={selectedInstrument.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors shrink-0"
                >
                  <span>Open on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>
              </div>

              {/* Embedded YouTube Player */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-stone-800 shadow-inner relative">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${selectedInstrument.youtubeEmbedId}?rel=0`}
                  title={selectedInstrument.videoTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </div>

            {/* STEP-BY-STEP LEARNING CURRICULUM */}
            <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                    <span>Step-by-Step Learning Instructions</span>
                  </h3>
                  <span className="text-xs font-medium text-stone-400">
                    Step {activeStepIndex + 1} of {selectedInstrument.steps.length}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-400">
                  Follow each instructional stage sequentially to develop proper muscle memory and tonal purity.
                </p>
              </div>

              {/* Step Navigation Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {selectedInstrument.steps.map((step, idx) => (
                  <button
                    key={step.stepNumber}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      activeStepIndex === idx
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-sm'
                        : 'bg-stone-950/60 hover:bg-stone-950 text-stone-300 border-stone-800'
                    }`}
                  >
                    <span className="block text-[10px] uppercase tracking-wider opacity-80">
                      Stage {step.stepNumber}
                    </span>
                    <span className="block text-xs truncate mt-0.5">
                      {step.title.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Step Content Card */}
              {selectedInstrument.steps[activeStepIndex] && (
                <div className="p-6 rounded-2xl bg-stone-950/80 border border-amber-500/20 space-y-4 animate-in fade-in duration-200">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
                      Stage {selectedInstrument.steps[activeStepIndex].stepNumber} Curriculum
                    </span>
                    <h4 className="font-serif text-xl sm:text-2xl font-bold text-white">
                      {selectedInstrument.steps[activeStepIndex].title}
                    </h4>
                    <p className="text-xs sm:text-sm text-amber-200/90 italic mt-0.5">
                      {selectedInstrument.steps[activeStepIndex].subtitle}
                    </p>
                  </div>

                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                    {selectedInstrument.steps[activeStepIndex].description}
                  </p>

                  {/* Pro Practice Tips */}
                  <div className="pt-4 border-t border-stone-800/80 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Guru-Shishya Practice Tips</span>
                    </span>
                    <ul className="space-y-1.5">
                      {selectedInstrument.steps[activeStepIndex].tips.map((tip, tIdx) => (
                        <li
                          key={tIdx}
                          className="text-xs sm:text-sm text-stone-300 flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Next / Previous Step Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-stone-800">
                    <button
                      onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                      disabled={activeStepIndex === 0}
                      className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      ← Previous Stage
                    </button>
                    <button
                      onClick={() =>
                        setActiveStepIndex((prev) =>
                          Math.min(selectedInstrument.steps.length - 1, prev + 1)
                        )
                      }
                      disabled={activeStepIndex === selectedInstrument.steps.length - 1}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                      Next Stage →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* COMMON MISTAKES & DAILY RIYAZ GUIDE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Common Mistakes */}
              <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-serif font-bold text-lg">
                  <AlertCircle className="w-5 h-5" />
                  <span>Common Beginner Mistakes</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
                  {selectedInstrument.commonMistakes.map((mistake, mIdx) => (
                    <li key={mIdx} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold shrink-0">•</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Daily Riyaz Routine */}
              <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-lg">
                  <Clock className="w-5 h-5" />
                  <span>Daily Riyaz (Practice) Regimen</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {selectedInstrument.dailyRiyazRoutine}
                </p>
                <div className="pt-2 text-[11px] text-stone-400 italic">
                  Consistency of 45 minutes daily yields exponentially higher results than sporadic weekend marathon sessions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
