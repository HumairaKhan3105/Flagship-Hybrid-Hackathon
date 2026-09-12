import React, { useState } from 'react';
import { BookOpen, CheckSquare, Square, FileText, User, Compass, Bookmark, Sparkles } from 'lucide-react';
import { INITIAL_QUESTS } from '../../data/gameData';
import { sounds } from '../../audio';

export const NotebookScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Quests' | 'Clues' | 'Characters' | 'Notes' | 'Map'>('Quests');
  const [quests, setQuests] = useState(INITIAL_QUESTS);

  const toggleQuest = (id: string) => {
    sounds.playParchmentTurn();
    setQuests(prev => prev.map(q => q.id === id ? { ...q, completed: !q.completed } : q));
  };

  return (
    <div id="screen-notebook" className="relative w-full h-full min-h-[360px] flex flex-col justify-between overflow-hidden bg-[#090e1c] text-[#2c1810] select-none p-3 md:p-5">
      {/* Background Studio Lighting & Texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#060a16] via-[#0e172e] to-[#050812] pointer-events-none" />

      {/* Main Journal Frame */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-md overflow-hidden border-2 border-[#8b6528]/80">
        
        {/* Left Leather Spine Tabs */}
        <div className="w-full md:w-28 bg-[#2a170d] border-b md:border-b-0 md:border-r border-[#633519] p-2 flex md:flex-col gap-1.5 justify-start">
          <div className="hidden md:flex items-center space-x-1.5 pb-2 mb-1 border-b border-[#542c14] text-[#e0cfab]">
            <BookOpen className="w-4 h-4 text-[#d4af37]" />
            <span className="font-cinzel text-xs font-bold tracking-wider uppercase text-[#f7e09e]">
              Notebook
            </span>
          </div>

          {[
            { id: 'Quests', icon: Bookmark },
            { id: 'Clues', icon: FileText },
            { id: 'Characters', icon: User },
            { id: 'Notes', icon: Sparkles },
            { id: 'Map', icon: Compass },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playParchmentTurn();
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`flex-1 md:flex-none flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs font-cinzel tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#d4af37] text-[#1c0d05] font-bold shadow-md'
                    : 'text-[#d6c29e] hover:bg-[#3d2315] hover:text-[#fff1cf]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.id}</span>
              </button>
            );
          })}
        </div>

        {/* Dual Page Open Parchment Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 bg-[#f4ecd8] relative text-[#2a170a]">
          {/* Subtle Center Book Crease / Shadow */}
          <div className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 bg-gradient-to-r from-transparent via-[#885d2d]/30 to-transparent pointer-events-none z-10" />

          {/* LEFT PAGE: Quests & Objectives */}
          <div className="p-4 md:p-6 border-b md:border-b-0 md:border-r border-[#caba99] flex flex-col justify-between relative">
            <div>
              {/* Sanskrit header inscription stamp */}
              <div className="text-[10px] tracking-widest text-[#7c562a] font-serif border-b border-[#cca96e]/60 pb-1 mb-3 flex justify-between items-center">
                <span>अन्वेषण पत्र • DHARMAGANJA CHRONICLE</span>
                <span>FO. 42A</span>
              </div>

              <h3 className="font-cinzel text-base md:text-lg font-black text-[#451e08] tracking-wide mb-3">
                Find the Missing Manuscript
              </h3>

              {/* Checkbox Objectives */}
              <div className="space-y-2.5 font-kalam text-sm md:text-base leading-snug">
                {quests.map(quest => (
                  <div
                    key={quest.id}
                    onClick={() => toggleQuest(quest.id)}
                    className="flex items-start space-x-2.5 cursor-pointer group hover:text-[#78350f] transition-colors"
                  >
                    <button className="mt-0.5 text-[#542d13]">
                      {quest.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-800" />
                      ) : (
                        <Square className="w-4 h-4 text-[#8c6239]" />
                      )}
                    </button>
                    <span className={quest.completed ? 'line-through opacity-70' : 'font-medium'}>
                      {quest.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom note quote */}
            <div className="mt-4 pt-2 border-t border-[#d4c3a3] text-[11px] text-[#714b23] italic font-serif">
              “Knowledge is not owned by the hand that writes it, but by the world that remembers it.”
            </div>
          </div>

          {/* RIGHT PAGE: Clues, Hand-drawn sketches & Stupa Drawing */}
          <div className="p-4 md:p-6 flex flex-col justify-between relative bg-[#f7eed9]">
            <div>
              <div className="text-[10px] tracking-widest text-[#7c562a] font-serif border-b border-[#cca96e]/60 pb-1 mb-2 flex justify-between items-center">
                <span>साक्ष्य पत्र • EVIDENCE SHEET</span>
                <span>TAG: #NLD-09</span>
              </div>

              <h4 className="font-cinzel text-sm md:text-base font-bold text-[#451e08]">
                Clue Found
              </h4>
              <p className="font-kalam text-xs md:text-sm text-[#5c3312] mt-1 leading-relaxed">
                Footprints near the library (looked like a scholar's sandals).
              </p>

              {/* Hand-Drawn Ink Illustration: Footprint and Nalanda Stupa Sketch */}
              <div className="mt-3 grid grid-cols-2 gap-3 items-center">
                {/* Hand-drawn Footprint Sketch */}
                <div className="border border-[#cca96e] rounded p-2 bg-[#ecdcb8]/50 flex flex-col items-center justify-center">
                  <svg viewBox="0 0 80 110" className="w-16 h-24 text-[#5c3312] opacity-85">
                    {/* Woven strap sandal imprint */}
                    <ellipse cx="40" cy="72" rx="20" ry="30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 2" />
                    <ellipse cx="40" cy="30" rx="17" ry="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 2" />
                    {/* Sandal toe ring and strap impression */}
                    <circle cx="32" cy="18" r="4" fill="currentColor" />
                    <path d="M32,22 L40,45 L54,35" stroke="currentColor" strokeWidth="2" fill="none" />
                    {/* Cross weave texture */}
                    <line x1="28" y1="65" x2="52" y2="65" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                    <line x1="26" y1="75" x2="54" y2="75" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                    <line x1="30" y1="85" x2="50" y2="85" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                  </svg>
                  <span className="text-[9px] font-mono text-[#78491c] mt-1">Sandal Tread Impression</span>
                </div>

                {/* Hand-drawn Nalanda Stupa Ink Sketch */}
                <div className="border border-[#cca96e] rounded p-2 bg-[#ecdcb8]/50 flex flex-col items-center justify-center">
                  <svg viewBox="0 0 100 110" className="w-20 h-24 text-[#5c3312] opacity-85">
                    {/* Multi-tiered Sariputta Stupa ink hatching */}
                    <path d="M15,100 L85,100 L75,70 L25,70 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                    <line x1="20" y1="90" x2="80" y2="90" stroke="currentColor" strokeWidth="1" />
                    {/* Terracotta niche levels */}
                    <rect x="30" y="45" width="40" height="25" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M40,55 Q50,48 60,55 L60,70 L40,70 Z" fill="currentColor" opacity="0.4" />
                    {/* Domed anda and harmika top */}
                    <path d="M38,45 Q50,25 62,45" fill="none" stroke="currentColor" strokeWidth="2" />
                    <rect x="46" y="20" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="50" y1="20" x2="50" y2="8" stroke="currentColor" strokeWidth="2" />
                    {/* Chatra umbrellas */}
                    <line x1="42" y1="12" x2="58" y2="12" stroke="currentColor" strokeWidth="2" />
                    <line x1="45" y1="8" x2="55" y2="8" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <span className="text-[9px] font-mono text-[#78491c] mt-1">Chaitya Site No. 3</span>
                </div>
              </div>
            </div>

            {/* Handwritten ink marginalia */}
            <div className="mt-3 text-[11px] font-kalam text-[#7c4314]">
              <em>Note: The intruder was fleeing eastward toward the observatory...</em>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Label Badge */}
      <div className="relative z-10 px-2 pt-2 flex items-center justify-between text-[11px] text-[#c59b27]/80 font-mono">
        <span className="bg-[#050b18]/80 px-2 py-0.5 border border-[#d4af37]/20 rounded">
          4. Notebook / Journal
        </span>
        <span className="text-[10px] tracking-wider text-amber-200/50">
          INVESTIGATION DOSSIER & INK SKETCHES
        </span>
      </div>
    </div>
  );
};
