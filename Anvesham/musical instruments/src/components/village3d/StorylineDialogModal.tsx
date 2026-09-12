import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  Award,
  ArrowRight,
  X,
  Play,
  CheckCircle2,
  AlertCircle,
  Compass,
  Layers,
  Music,
} from 'lucide-react';
import { MusicianCharacter } from '../../data/villageStorylineData.ts';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';

interface StorylineDialogModalProps {
  musician: MusicianCharacter;
  isQuestCompleted: boolean;
  onCompleteQuest: (musicianId: string) => void;
  onClose: () => void;
  onViewFullInstrument: (slug: string) => void;
}

export const StorylineDialogModal: React.FC<StorylineDialogModalProps> = ({
  musician,
  isQuestCompleted,
  onCompleteQuest,
  onClose,
  onViewFullInstrument,
}) => {
  const [activeTab, setActiveTab] = useState<'lore' | 'sound' | 'challenge'>('lore');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(isQuestCompleted);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(
    isQuestCompleted ? 'correct' : null
  );

  const handlePlaySolo = () => {
    setIsPlayingAudio(true);
    soundSynthesizer.playVillageInstrumentSolo(musician.audioSampleType, 1.0);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 2800);
  };

  const handlePlayPreview = () => {
    setIsPlayingAudio(true);
    const stop = soundSynthesizer.playCulturalRagaPreview(
      musician.family.includes('Chordophone')
        ? 'String'
        : musician.family.includes('Aerophone')
        ? 'Wind'
        : 'Percussion'
    );
    setTimeout(() => {
      setIsPlayingAudio(false);
      stop();
    }, 3200);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    if (selectedOption === musician.question.correctIndex) {
      setFeedback('correct');
      setIsAnswerSubmitted(true);
      soundSynthesizer.playSuccessSound();
      onCompleteQuest(musician.id);
    } else {
      setFeedback('wrong');
      soundSynthesizer.playErrorSound();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] w-full max-w-2xl rounded-3xl border border-amber-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Musician Title & Seal */}
        <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-serif text-2xl font-bold shadow-md shrink-0 border border-white/20"
              style={{ backgroundColor: musician.color }}
            >
              {musician.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Chapter {musician.storyChapter}: {musician.family}
                </span>
                <span className="text-xs text-amber-200/80 font-medium">
                  {musician.zoneName}
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                {musician.name}
                <span className="text-xs font-normal text-amber-200/90 italic">
                  ({musician.hindiName})
                </span>
              </h2>

              <p className="text-xs text-amber-100/90 font-medium">
                {musician.honorific} • {musician.role}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-amber-200/60 bg-amber-50/70 px-6 pt-2">
          <button
            onClick={() => setActiveTab('lore')}
            className={`pb-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'lore'
                ? 'border-amber-800 text-amber-950 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-700" />
            Story & Heritage
          </button>

          <button
            onClick={() => setActiveTab('sound')}
            className={`pb-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'sound'
                ? 'border-amber-800 text-amber-950 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Volume2 className="w-4 h-4 text-amber-700" />
            Sound & Craft
          </button>

          <button
            onClick={() => setActiveTab('challenge')}
            className={`pb-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'challenge'
                ? 'border-amber-800 text-amber-950 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-700" />
            Wisdom Seal {isQuestCompleted && '✓'}
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {activeTab === 'lore' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Spoken dialogue speech bubble */}
              <div className="relative bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs">
                <div className="text-xs uppercase tracking-wider font-bold text-amber-800 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                  Words of the Maestro:
                </div>
                <p className="text-sm sm:text-base text-stone-700 italic font-serif leading-relaxed">
                  "{musician.dialogueIntro}"
                </p>
              </div>

              {/* Core teaching */}
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                  <Music className="w-4 h-4 text-amber-700" />
                  Sacred Philosophy of {musician.instrumentName}
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {musician.dialogueTeaching}
                </p>
              </div>

              {/* Historical Context */}
              <div className="space-y-2 pt-2 border-t border-stone-200/80">
                <h4 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-700" />
                  History & Legacy
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {musician.dialogueHistory}
                </p>
              </div>

              {/* Quick Cultural Fact Pill */}
              <div className="bg-amber-100/60 border border-amber-300 rounded-xl p-3.5 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong className="font-semibold">Village Lore: </strong>
                  {musician.culturalTrivia}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sound' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Instrument Anatomy & Technique */}
              <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Acoustic Craftsmanship & Technique
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                    {musician.ragaOrTaal}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {musician.dialogueTechnique}
                </p>
              </div>

              {/* Audio Synthesizer Controls */}
              <div className="bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100/50 rounded-2xl p-5 border border-amber-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="font-serif font-bold text-stone-900 text-sm">
                      Listen to {musician.instrumentName} Acoustics
                    </h5>
                    <p className="text-xs text-stone-500">
                      Real-time synthesized harmonic preview based on traditional tuning
                    </p>
                  </div>
                  {isPlayingAudio && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-amber-600" />
                      Playing
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handlePlaySolo}
                    disabled={isPlayingAudio}
                    className="py-3 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 active:scale-98"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Play Characteristic Solo Phrase
                  </button>

                  <button
                    onClick={handlePlayPreview}
                    disabled={isPlayingAudio}
                    className="py-3 px-4 rounded-xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 active:scale-98"
                  >
                    <Volume2 className="w-4 h-4 text-amber-700" />
                    Play {musician.family.split(' ')[0]} Microtonal Glide
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'challenge' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-700" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Musical Quest Seal: {musician.sealReward}
                  </span>
                </div>
                <p className="text-xs text-stone-600">
                  Answer the maestro's question to earn the sacred seal and complete Chapter{' '}
                  {musician.storyChapter} of your journey!
                </p>
              </div>

              {/* Question */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-base text-stone-900">
                  {musician.question.prompt}
                </h4>

                <div className="space-y-2.5">
                  {musician.question.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!isAnswerSubmitted) {
                          setSelectedOption(idx);
                          setFeedback(null);
                        }
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                        selectedOption === idx
                          ? 'bg-amber-100 border-amber-500 text-amber-950 font-bold shadow-xs'
                          : 'bg-white border-stone-200 hover:border-amber-300 text-stone-700'
                      }`}
                    >
                      <span>{opt}</span>
                      {selectedOption === idx && (
                        <CheckCircle2 className="w-4 h-4 text-amber-700" />
                      )}
                    </button>
                  ))}
                </div>

                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={selectedOption === null}
                    className="w-full mt-3 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    Submit Answer & Claim Seal
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm space-y-1">
                    <div className="flex items-center gap-2 font-bold text-emerald-950">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      Quest Completed! You earned: {musician.sealReward}
                    </div>
                    <p className="text-emerald-800">{musician.question.explanation}</p>
                  </div>
                )}

                {feedback === 'wrong' && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Not quite! Think back to what the maestro explained, and try again.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onViewFullInstrument(musician.instrumentSlug);
              onClose();
            }}
            className="w-full sm:w-auto text-xs font-semibold text-amber-900 hover:text-amber-700 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl hover:bg-amber-50 transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4 text-amber-600" />
            Inspect Full {musician.instrumentName} Archive Specs
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {activeTab !== 'challenge' ? (
              <button
                onClick={() => setActiveTab('challenge')}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Take Chapter Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Continue Exploring Village</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
