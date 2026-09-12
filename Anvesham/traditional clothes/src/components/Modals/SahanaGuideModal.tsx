import { useState } from 'react';
import { Garment, Region } from '../../types';
import { GAME_ASSETS } from '../../data/gameData';
import { Sparkles, Send, X, BookOpen, MessageCircle } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface SahanaGuideModalProps {
  garment?: Garment | null;
  region?: Region | null;
  onClose: () => void;
}

export default function SahanaGuideModal({
  garment,
  region,
  onClose,
}: SahanaGuideModalProps) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'sahana'; text: string }>>([
    {
      sender: 'sahana',
      text: garment
        ? `Namaste, Explorer! I am Sahana. The ${garment.name} from ${garment.regionName} is a masterpiece of Indian handloom. What would you like to know about its weaving secret or cultural heritage?`
        : `Namaste, Explorer! I am Sahana, your companion across Bharat's handloom sanctuaries. Ask me about any regional garment, royal weave, or historical tradition!`
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || query;
    if (!textToSend.trim() || isLoading) return;

    soundManager.playClick();
    const newMessages = [...messages, { sender: 'user' as const, text: textToSend }];
    setMessages(newMessages);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garmentName: garment?.name || 'Traditional Indian Saree',
          regionName: region?.name || garment?.regionName || 'India',
          userQuestion: textToSend,
        }),
      });

      if (!response.ok) throw new Error('Guide connection failed');
      const data = await response.json();

      soundManager.playChime();
      setMessages([...newMessages, { sender: 'sahana', text: data.reply }]);
    } catch (err) {
      // Graceful fallback
      soundManager.playChime();
      setMessages([
        ...newMessages,
        {
          sender: 'sahana',
          text: garment?.culturalSignificance ||
            'In Indian textile lore, the loom represents the cosmos, the warp represents the eternal law, and the weft is the transient life woven into it.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'Why is real gold zari used?',
    'What does the peacock motif symbolize?',
    'How long does one saree take to weave?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl royal-glass-card rounded-2xl border-2 border-amber-400 p-6 shadow-2xl flex flex-col h-[550px]">
        {/* Ornate Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={GAME_ASSETS.sahanaAvatar}
                alt="Sahana Guide"
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow ring-2 ring-amber-400/40"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 p-0.5 bg-amber-600 rounded-full text-white">
                <Sparkles className="w-2.5 h-2.5" />
              </span>
            </div>
            <div>
              <h3 className="text-lg font-cinzel font-bold text-amber-200">
                Sahana • AI Culture Guide
              </h3>
              <p className="text-[11px] font-marcellus text-stone-400">
                Guardian of Bharat's Textile Heritage
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-lg bg-stone-900 border border-amber-500/40 text-stone-300 hover:text-amber-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 my-2 no-scrollbar">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm font-marcellus leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-amber-950/80 border border-amber-500/60 text-amber-100 rounded-tr-none'
                    : 'parchment-bg text-stone-900 border border-amber-700/40 shadow-lg rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="parchment-bg rounded-2xl p-3 text-xs font-cinzel text-stone-700 border border-amber-700/40 animate-pulse flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                <span>Sahana is consulting the royal textile chronicles...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 mb-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-full text-[11px] font-marcellus bg-stone-900/80 text-amber-300 border border-amber-500/30 hover:border-amber-400 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-amber-500/20">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Sahana about sarees, motifs, or weaving..."
            className="flex-1 bg-black/60 border border-amber-500/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-300 font-marcellus"
          />
          <button
            onClick={() => handleSend()}
            disabled={!query.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
