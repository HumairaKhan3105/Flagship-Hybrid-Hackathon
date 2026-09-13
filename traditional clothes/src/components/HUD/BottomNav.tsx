import { GameScreen } from '../../types';
import { 
  Compass, 
  BookOpen, 
  HelpCircle, 
  Crown, 
  Shirt, 
  Sparkles,
  ScrollText,
  SlidersHorizontal 
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface BottomNavProps {
  currentScreen: GameScreen;
  onNavigate: (screen: GameScreen) => void;
}

export default function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'welcome', label: 'Home', icon: Sparkles },
    { id: 'map', label: 'Explore Map', icon: Compass },
    { id: 'weaver', label: "Weaver's Challenge", icon: ScrollText },
    { id: 'quiz', label: 'Culture Quiz', icon: HelpCircle },
    { id: 'collection', label: 'Wardrobe', icon: Shirt },
    { id: 'timeline', label: 'Timeline', icon: BookOpen },
    { id: 'grand-challenge', label: 'Grand Challenge', icon: Crown },
  ];

  return (
    <nav className="relative z-30 w-full px-2 py-2 bg-gradient-to-t from-[#060a12] via-[#09101d]/95 to-transparent border-t border-amber-500/20 backdrop-blur-lg flex items-center justify-center select-none shadow-[0_-10px_25px_rgba(0,0,0,0.6)]">
      <div className="w-full max-w-4xl flex items-center justify-between sm:justify-center sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundManager.playClick();
                onNavigate(item.id as GameScreen);
              }}
              className={`relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl flex flex-col items-center gap-1 transition-all duration-200 flex-shrink-0 group ${
                isActive
                  ? 'bg-gradient-to-b from-amber-900/60 to-amber-950/80 border border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,192,66,0.3)] scale-105'
                  : 'text-stone-400 hover:text-amber-200 hover:bg-stone-900/60 border border-transparent hover:border-amber-500/30'
              }`}
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-amber-300 stroke-[2.5]' : ''}`} />
              <span className={`text-[10px] sm:text-[11px] font-cinzel font-semibold tracking-wider whitespace-nowrap ${isActive ? 'text-amber-200' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-6 h-0.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f5c042]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
