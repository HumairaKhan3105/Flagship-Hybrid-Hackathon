import React, { useState } from 'react';
import { Network, User, BookOpen, MapPin, Footprints, ShieldAlert, Sparkles, X } from 'lucide-react';
import { CLUE_NODES } from '../../data/gameData';
import { ClueNode } from '../../types';
import { sounds } from '../../audio';

export const KnowledgeWebScreen: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<ClueNode | null>(CLUE_NODES[0]);

  const getNodeIcon = (type: ClueNode['type']) => {
    switch (type) {
      case 'Person':
        return User;
      case 'Manuscript':
        return BookOpen;
      case 'Place':
        return MapPin;
      case 'Clue':
        return Footprints;
      case 'Knowledge':
        return ShieldAlert;
    }
  };

  return (
    <div id="screen-knowledge-web" className="relative w-full h-full min-h-[360px] flex flex-col justify-between overflow-hidden bg-[#050c1e] text-[#f7eed9] select-none p-4 md:p-6">
      {/* Dark Navy Blueprint Graph Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#142a5c_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Screen Header & Legend */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-[#d4af37]/30 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-full border border-[#38bdf8] bg-[#0c1e45] flex items-center justify-center text-[#38bdf8]">
            <Network className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-cinzel text-base md:text-lg font-bold text-[#fae596] tracking-wide">
              Knowledge Web
            </h3>
            <p className="text-xs text-[#93c5fd]">
              Connect the clues to uncover the truth.
            </p>
          </div>
        </div>

        {/* Legend (matching screenshot) */}
        <div className="flex items-center space-x-4 bg-[#091535]/80 border border-[#d4af37]/30 px-3 py-1.5 rounded text-[11px] font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[#a7f3d0]">Discovered</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full border border-rose-400 bg-transparent" />
            <span className="text-rose-300">Not Discovered</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-4 h-0.5 bg-[#fcd34d]" />
            <span className="text-[#fde047]">Connection</span>
          </div>
        </div>
      </div>

      {/* Central Interactive Deduction Clue Canvas */}
      <div className="relative z-10 flex-1 my-3 relative min-h-[220px]">
        {/* SVG Glowing Connection Threads */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* Connecting lines between nodes */}
          <line x1="18%" y1="40%" x2="42%" y2="28%" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" className="animate-[dash_20s_linear_infinite]" />
          <line x1="42%" y1="28%" x2="75%" y2="35%" stroke="#fcd34d" strokeWidth="2" />
          <line x1="18%" y1="40%" x2="75%" y2="35%" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="42%" y1="28%" x2="65%" y2="75%" stroke="#fcd34d" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="75%" y1="35%" x2="35%" y2="72%" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="35%" y1="72%" x2="65%" y2="75%" stroke="#fcd34d" strokeWidth="2.5" />
          <line x1="18%" y1="40%" x2="35%" y2="72%" stroke="#38bdf8" strokeWidth="1.5" />
        </svg>

        {/* Clue Nodes in 2D Space */}
        {CLUE_NODES.map((node) => {
          const Icon = getNodeIcon(node.type);
          const isSelected = selectedNode?.id === node.id;
          return (
            <div
              key={node.id}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <button
                onClick={() => {
                  sounds.playStoneClick();
                  setSelectedNode(node);
                }}
                className={`group flex flex-col items-center transition-all ${
                  isSelected ? 'scale-110' : 'hover:scale-105'
                }`}
              >
                {/* Node Orb with Icon */}
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-all shadow-lg ${
                    isSelected
                      ? 'border-[#f6d77e] bg-[#1e3a7a] text-[#fff1be] shadow-[0_0_20px_rgba(246,215,126,0.6)]'
                      : 'border-[#38bdf8]/70 bg-[#0c1836] text-[#93c5fd] hover:border-[#f6d77e]'
                  }`}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>

                {/* Node Label (Type & Subtitle) */}
                <div className="mt-1 text-center whitespace-nowrap bg-[#060e24]/90 px-2 py-0.5 rounded border border-[#d4af37]/30">
                  <div className="font-cinzel text-[11px] font-bold text-[#fae596]">
                    {node.title}
                  </div>
                  <div className="text-[9px] text-[#93c5fd] font-sans">
                    ({node.subtitle})
                  </div>
                </div>
              </button>
            </div>
          );
        })}

        {/* Clue Dossier Inspector Popover (Bottom Right / Side) */}
        {selectedNode && (
          <div className="absolute bottom-2 right-2 max-w-xs md:max-w-sm bg-[#091535]/95 border-2 border-[#d4af37]/70 rounded-md p-3.5 shadow-2xl backdrop-blur-md z-20 animate-fadeIn">
            <div className="flex justify-between items-start pb-2 border-b border-[#d4af37]/30 mb-2">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#38bdf8] uppercase">
                  INVESTIGATIVE DOSSIER • {selectedNode.type}
                </span>
                <h4 className="font-cinzel text-sm md:text-base font-bold text-[#fae596]">
                  {selectedNode.title}: {selectedNode.subtitle}
                </h4>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-zinc-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#e2d5b6] leading-relaxed">
              {selectedNode.description}
            </p>
            <div className="mt-2.5 pt-2 border-t border-[#d4af37]/20 flex items-center justify-between text-[10px] font-mono">
              <span className="text-emerald-400">● Verification: Confirmed</span>
              <span className="text-[#fcd34d]">Linked Threads: {selectedNode.connectedTo.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Screen Label Badge */}
      <div className="relative z-10 px-2 pt-2 flex items-center justify-between text-[11px] text-[#c59b27]/80 font-mono">
        <span className="bg-[#050b18]/80 px-2 py-0.5 border border-[#d4af37]/20 rounded">
          7. Knowledge Web
        </span>
        <span className="text-[10px] tracking-wider text-amber-200/50">
          DETECTIVE DEDUCTION & SCHOLAR THREADS
        </span>
      </div>
    </div>
  );
};
