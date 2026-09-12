import React from 'react';
import {
  X,
  BookOpen,
  Award,
  CheckCircle2,
  Lock,
  Compass,
  MapPin,
  Sparkles,
  Play,
  RotateCcw,
} from 'lucide-react';
import { VILLAGE_MUSICIANS } from '../../data/villageStorylineData.ts';

interface StorylineJournalModalProps {
  completedQuests: Set<string>;
  activeQuestChapter: number;
  onFastTravel: (musicianId: string) => void;
  onStartCinematicTour: () => void;
  onResetStory: () => void;
  onClose: () => void;
}

export const StorylineJournalModal: React.FC<StorylineJournalModalProps> = ({
  completedQuests,
  activeQuestChapter,
  onFastTravel,
  onStartCinematicTour,
  onResetStory,
  onClose,
}) => {
  const totalChapters = VILLAGE_MUSICIANS.length;
  const completedCount = completedQuests.size;
  const progressPercent = Math.round((completedCount / totalChapters) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] w-full max-w-3xl rounded-3xl border border-amber-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Sangeet Gram Quest Journal
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            The Journey of the Swara Seeker
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/80 mt-1 max-w-xl">
            You have walked into Sangeet Gram—the timeless village of sound. Learn the 4 ancient
            acoustic families from the 8 village masters to awaken the cosmic harmony of Nada Brahma.
          </p>

          {/* Progress Bar */}
          <div className="mt-4 bg-white/10 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-amber-200">
                Storyline Progress: {completedCount} of {totalChapters} Masters Met
              </span>
              <span className="text-amber-300 font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content list of 8 Chapters */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-700" />
              Village Story Chapters & Masters
            </h4>
            <span className="text-xs text-stone-500">
              Click Fast Travel to teleport directly to any master
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {VILLAGE_MUSICIANS.map((m) => {
              const isCompleted = completedQuests.has(m.id);
              const isCurrent = m.storyChapter === activeQuestChapter;

              return (
                <div
                  key={m.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCompleted
                      ? 'bg-emerald-50/60 border-emerald-300 shadow-2xs'
                      : isCurrent
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/40 shadow-xs'
                      : 'bg-white border-stone-200'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold font-mono ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-amber-600 text-white animate-pulse'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {m.storyChapter}
                        </span>
                        <div>
                          <h5 className="font-serif font-bold text-sm text-stone-900 leading-tight">
                            {m.name}
                          </h5>
                          <span className="text-[11px] text-stone-500 font-medium block">
                            {m.instrumentName} ({m.family.split(' ')[0]})
                          </span>
                        </div>
                      </div>

                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Earned
                        </span>
                      ) : isCurrent ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
                          Active Quest
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-stone-400">
                          <Lock className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
                      {m.questObjective}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      {m.zoneName}
                    </span>

                    <button
                      onClick={() => {
                        onFastTravel(m.id);
                        onClose();
                      }}
                      className="text-xs font-bold text-amber-800 hover:text-amber-950 hover:bg-amber-100/70 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Compass className="w-3.5 h-3.5 text-amber-700" />
                      Fast Travel
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onStartCinematicTour();
                onClose();
              }}
              className="py-2.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Cinematic Story Tour</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all storyline chapter progress?')) {
                  onResetStory();
                }
              }}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 py-2 px-3 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Quest
            </button>
          </div>

          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Journal
          </button>
        </div>
      </div>
    </div>
  );
};
