import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { MONUMENTS } from '../../data/monuments';
import { HISTORICAL_FIGURES, ARCHITECTURAL_GLOSSARY } from '../../data/historicalData';
import { X, BookOpen, Key, Award, Landmark, Users, GraduationCap, Lock, CheckCircle2 } from 'lucide-react';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'story' | 'clues' | 'artifacts' | 'monuments' | 'figures' | 'glossary';

export const JournalModal: React.FC<JournalModalProps> = ({ isOpen, onClose }) => {
  const { quests, currentQuestIndex, clues, artifacts } = useGameStore();
  const [activeTab, setActiveTab] = useState<TabType>('story');
  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);

  if (!isOpen) return null;

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'story', label: 'Story Chronicle', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'clues', label: 'Discovered Clues', icon: <Key className="w-4 h-4" /> },
    { id: 'artifacts', label: 'Royal Artifacts', icon: <Award className="w-4 h-4" /> },
    { id: 'monuments', label: 'Monuments Lore', icon: <Landmark className="w-4 h-4" /> },
    { id: 'figures', label: 'Historical Rulers', icon: <Users className="w-4 h-4" /> },
    { id: 'glossary', label: 'Architecture Terms', icon: <GraduationCap className="w-4 h-4" /> }
  ];

  const discoveredCount = clues.filter(c => c.status === 'discovered').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-stone-950 border border-amber-600/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] box-gold-glow animate-in fade-in zoom-in-95">
        {/* Journal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-b border-amber-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-amber-100 tracking-wider">
                EXPLORER'S ROYAL JOURNAL
              </h3>
              <p className="text-xs text-amber-400/80 font-serif">
                Chronicles & Artifacts of the Vijayanagara Golden Age
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs font-mono bg-amber-950/70 border border-amber-800/50 text-amber-300 px-3 py-1 rounded-full">
              Clues: {discoveredCount} / {clues.length}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-amber-400 hover:text-amber-200 hover:bg-stone-800/70 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-4 bg-stone-900/90 border-b border-amber-900/30 overflow-x-auto no-scrollbar gap-1 py-1.5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedClueId(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-serif font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-600/90 text-stone-950 border border-amber-400 shadow-md font-bold'
                  : 'text-stone-300 hover:text-amber-200 hover:bg-stone-800/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Journal Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 parchment-scroll bg-[#15110d]">
          {/* TAB 1: STORY CHRONICLE */}
          {activeTab === 'story' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-amber-900/40 pb-4">
                <h4 className="font-serif font-bold text-lg text-amber-100 mb-1">
                  The Mystery of the Stone Chariot Decree
                </h4>
                <p className="text-xs text-stone-400 font-sans leading-relaxed">
                  In 1516 CE, during the zenith of Emperor Krishnadevaraya's reign, an imperial decree outlining the cosmic geometry and sacred covenant of Vijayanagara was placed within the celestial Garuda chariot at the Vitthala complex. Follow the trail of echoes left across the monuments.
                </p>
              </div>

              <div className="space-y-4">
                {quests.map((q, idx) => {
                  const isCurrent = idx === currentQuestIndex;
                  const isUnlocked = idx <= currentQuestIndex || q.completed;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        q.completed
                          ? 'bg-amber-950/20 border-amber-600/40'
                          : isCurrent
                          ? 'bg-amber-950/40 border-amber-400 box-gold-glow'
                          : 'bg-stone-950/40 border-stone-800/40 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                              q.completed
                                ? 'bg-emerald-900 text-emerald-300'
                                : isCurrent
                                ? 'bg-amber-500 text-stone-950'
                                : 'bg-stone-800 text-stone-400'
                            }`}
                          >
                            CHAPTER {q.number}
                          </span>
                          <h5 className="font-serif font-bold text-amber-100 text-sm">
                            {isUnlocked ? q.title : 'UNKNOWN CHAPTER'}
                          </h5>
                        </div>
                        {q.completed ? (
                          <span className="text-xs text-emerald-400 font-serif flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            COMPLETED
                          </span>
                        ) : isCurrent ? (
                          <span className="text-xs text-amber-400 font-serif font-bold animate-pulse">
                            ACTIVE QUEST
                          </span>
                        ) : (
                          <span className="text-xs text-stone-600 font-serif flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            LOCKED
                          </span>
                        )}
                      </div>

                      {isUnlocked ? (
                        <>
                          <p className="text-xs text-stone-300 mb-2 font-medium">
                            {q.objective}
                          </p>
                          <p className="text-[11px] text-amber-300/80 font-serif italic bg-stone-900/50 p-2.5 rounded-xl border border-amber-950/60">
                            "{q.historicalNarration}"
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-stone-600 italic">
                          This chapter of the chronicle remains locked in the sands of time. Complete previous quests to reveal its words.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: DISCOVERED CLUES */}
          {activeTab === 'clues' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clues.map(clue => {
                const isFound = clue.status === 'discovered';
                return (
                  <div
                    key={clue.id}
                    onClick={() => isFound && setSelectedClueId(clue.id)}
                    className={`p-4 rounded-2xl border transition-all ${
                      isFound
                        ? 'bg-stone-900/90 border-amber-600/50 hover:border-amber-400 cursor-pointer shadow-lg'
                        : 'bg-stone-950/50 border-stone-800 text-stone-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                            isFound
                              ? 'bg-amber-600/30 border border-amber-400/50 text-amber-300'
                              : 'bg-stone-900 border border-stone-800 text-stone-600'
                          }`}
                        >
                          {isFound ? clue.icon : <Lock className="w-4 h-4" />}
                        </div>
                        <div>
                          <h5 className={`font-serif font-bold text-sm ${isFound ? 'text-amber-100' : 'text-stone-500'}`}>
                            {isFound ? clue.title : 'UNKNOWN HISTORICAL CLUE'}
                          </h5>
                          <span className="text-[10px] font-mono text-amber-400/80 uppercase">
                            {isFound ? clue.locationName : 'Location Unexplored'}
                          </span>
                        </div>
                      </div>

                      {isFound && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                          DISCOVERED
                        </span>
                      )}
                    </div>

                    {isFound ? (
                      <div className="space-y-2 mt-3 text-xs text-stone-300">
                        <p>{clue.shortDescription}</p>
                        <div className="bg-amber-950/30 border border-amber-900/40 rounded-xl p-2.5">
                          <span className="text-amber-400 font-serif font-bold block text-[10px] mb-0.5">
                            SECRET REVELATION:
                          </span>
                          <p className="text-amber-200/90 text-[11px] italic font-serif">
                            "{clue.secretRevelation}"
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-stone-600 italic mt-2">
                        Inspect ancient ruins, pillars, and chests in Hampi to uncover this clue.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: ROYAL ARTIFACTS */}
          {activeTab === 'artifacts' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {artifacts.map(art => (
                <div
                  key={art.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    art.unlocked
                      ? 'bg-stone-900/90 border-amber-600/40 shadow-lg'
                      : 'bg-stone-950/50 border-stone-800/60 text-stone-600'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                        art.unlocked
                          ? 'bg-gradient-to-br from-amber-600/40 to-amber-900/40 border border-amber-400/50 text-amber-200'
                          : 'bg-stone-900 border border-stone-800 text-stone-700'
                      }`}
                    >
                      {art.unlocked ? art.icon : <Lock className="w-5 h-5 text-stone-600" />}
                    </div>
                    <div>
                      <h5 className={`font-serif font-bold text-sm ${art.unlocked ? 'text-amber-100' : 'text-stone-500'}`}>
                        {art.unlocked ? art.name : 'UNDISCOVERED RELIC'}
                      </h5>
                      <span className="text-[10px] font-mono text-amber-400/70">
                        {art.unlocked ? `${art.period} • ${art.material}` : 'Unknown Period'}
                      </span>
                    </div>
                  </div>

                  {art.unlocked ? (
                    <div className="text-xs text-stone-300 space-y-2 mt-2">
                      <p>{art.description}</p>
                      <p className="text-[11px] text-amber-300/80 bg-amber-950/40 p-2 rounded-lg border border-amber-900/30 italic">
                        ✦ {art.historicalFact}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-stone-600 italic mt-2">
                      Complete puzzle missions to add this imperial artifact to your collection.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: MONUMENTS LORE */}
          {activeTab === 'monuments' && (
            <div className="space-y-4">
              {Object.values(MONUMENTS).map(mon => (
                <div key={mon.id} className="p-4 rounded-2xl bg-stone-900/90 border border-amber-900/40">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-serif font-bold text-amber-100 text-base">
                        {mon.name} ({mon.kannadaName})
                      </h5>
                      <span className="text-xs text-amber-400 font-serif italic">
                        "{mon.tagline}"
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400 bg-stone-950 px-2 py-1 rounded-md border border-amber-950">
                      {mon.historicalPeriod}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed mb-3">
                    {mon.detailedHistory}
                  </p>
                  <div className="bg-amber-950/30 border border-amber-900/30 rounded-xl p-2.5">
                    <span className="text-amber-400 font-serif font-bold text-[10px] block mb-1">
                      ARCHITECTURAL STYLE:
                    </span>
                    <p className="text-stone-300 text-xs">
                      {mon.architecturalStyle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: HISTORICAL FIGURES */}
          {activeTab === 'figures' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {HISTORICAL_FIGURES.map((fig, i) => (
                <div key={i} className="p-4 rounded-2xl bg-stone-900/90 border border-amber-900/40">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-serif font-bold text-amber-100 text-sm">
                        {fig.name}
                      </h5>
                      <span className="text-xs text-amber-400/80 font-serif block">
                        {fig.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400 bg-stone-950 px-2 py-0.5 rounded-md">
                      {fig.reign}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 mb-2.5 leading-relaxed">
                    {fig.description}
                  </p>
                  <blockquote className="text-[11px] text-amber-200/90 font-serif italic bg-amber-950/30 p-2.5 rounded-xl border-l-2 border-amber-500">
                    "{fig.quote}"
                  </blockquote>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: GLOSSARY */}
          {activeTab === 'glossary' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ARCHITECTURAL_GLOSSARY.map((term, i) => (
                <div key={i} className="p-4 rounded-2xl bg-stone-900/80 border border-amber-900/40">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-serif font-bold text-amber-200 text-sm">
                      {term.term}
                    </h5>
                    <span className="text-xs font-serif text-amber-400/80">
                      {term.kannada}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed mt-1">
                    {term.definition}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
