import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { gameApi } from '../../services/gameApi';
import { Sparkles, Send, X, Bot, Compass, HelpCircle } from 'lucide-react';

interface AIGuideWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'guide' | 'player';
  text: string;
}

export const AIGuideWidget: React.FC<AIGuideWidgetProps> = ({ isOpen, onClose }) => {
  const { currentLocation, quests, currentQuestIndex, clues, solvedPuzzles, unlockedLocations } = useGameStore();
  const currentQuest = quests[currentQuestIndex] || quests[0];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'guide',
      text: `Namaskara, Explorer. I am Acharya Vidyadhar, keeper of the chronicles of Vijayanagara. We stand currently at ${currentLocation.replace('_', ' ').toUpperCase()}. What mystery do you seek to unravel?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const quickPrompts = [
    'What should I inspect here?',
    'Tell me about the Stone Chariot',
    'How do I solve the current puzzle?',
    'Who was King Krishnadevaraya?'
  ];

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    const playerMsg: Message = {
      id: `p_${Date.now()}`,
      sender: 'player',
      text
    };

    setMessages(prev => [...prev, playerMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const context = {
        currentLocation,
        currentQuestTitle: currentQuest.title,
        currentQuestObjective: currentQuest.objective,
        discoveredCluesCount: clues.filter(c => c.status === 'discovered').length,
        solvedPuzzlesCount: solvedPuzzles.length,
        unlockedLocations
      };

      const replyText = await gameApi.askAIGuide(text, context);

      const guideMsg: Message = {
        id: `g_${Date.now()}`,
        sender: 'guide',
        text: replyText
      };

      setMessages(prev => [...prev, guideMsg]);
    } catch (e) {
      console.error('AI Guide Error:', e);
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'guide',
          text: 'The desert winds obscure the archives for a moment. Look closely at the carved stone friezes nearby for your next revelation.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-stone-950/95 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] box-gold-glow animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950/90 to-stone-900/90 border-b border-amber-800/40">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-800 border border-amber-300 flex items-center justify-center shadow-lg">
              <span className="text-2xl">🧑🏽‍🏫</span>
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-amber-200 tracking-wide text-base">
                  Acharya Vidyadhar
                </h3>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  AI HISTORIAN
                </span>
              </div>
              <p className="text-xs text-amber-400/80 font-serif flex items-center gap-1.5">
                <Compass className="w-3 h-3 text-amber-400" />
                Guiding at: {currentLocation.replace('_', ' ').toUpperCase()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-amber-400 hover:text-amber-200 hover:bg-stone-800/70 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quest Context Pill */}
        <div className="px-6 py-2 bg-stone-900/80 border-b border-amber-900/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-stone-300 truncate">
            <span className="text-amber-400 font-bold">Active:</span>
            <span className="truncate">{currentQuest.title}</span>
          </div>
          <span className="text-amber-500/80 text-[11px] font-mono shrink-0">
            Progressive Guidance
          </span>
        </div>

        {/* Chat Message Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 parchment-scroll">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'player' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'guide' && (
                <div className="w-7 h-7 rounded-lg bg-amber-800/60 border border-amber-500/40 flex items-center justify-center shrink-0 text-sm mt-0.5">
                  🧑🏽‍🏫
                </div>
              )}

              <div
                className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'player'
                    ? 'bg-amber-600 text-stone-950 font-medium rounded-tr-none'
                    : 'bg-stone-900/90 border border-amber-900/40 text-stone-200 rounded-tl-none font-serif'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2.5 text-xs text-amber-400 font-serif italic py-1">
              <div className="w-7 h-7 rounded-lg bg-amber-800/40 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-amber-300 animate-spin" />
              </div>
              <span>Acharya is consulting the palm-leaf chronicles...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-2.5 bg-stone-900/60 border-t border-amber-900/30 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="shrink-0 px-2.5 py-1 text-[11px] font-sans font-medium rounded-lg bg-amber-950/50 hover:bg-amber-900/70 border border-amber-700/40 text-amber-200 hover:text-amber-100 transition-all cursor-pointer whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage(inputMessage);
          }}
          className="p-4 bg-stone-950 border-t border-amber-900/50 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="Ask about inscriptions, temple secrets, or rulers..."
            className="flex-1 bg-stone-900 border border-amber-900/60 rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all font-sans"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer font-bold"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
