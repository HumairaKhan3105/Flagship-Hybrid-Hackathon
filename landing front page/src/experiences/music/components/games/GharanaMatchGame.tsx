import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, RotateCcw, Flame, Check, Music } from 'lucide-react';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';
import { GameOverModal } from './GameOverModal.tsx';

interface CardItem {
  id: number;
  pairId: number;
  type: 'maestro' | 'instrument';
  label: string;
  sublabel: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const PAIRS_DATA = [
  {
    pairId: 1,
    maestro: 'Pandit Ravi Shankar',
    maestroInfo: 'Maihar Gharana',
    instrument: 'Sitar',
    instrumentInfo: 'Shimmering Meend & Taraf',
  },
  {
    pairId: 2,
    maestro: 'Ustad Bismillah Khan',
    maestroInfo: 'Bharat Ratna Maestro',
    instrument: 'Shehnai',
    instrumentInfo: 'Sacred Temple Double-Reed',
  },
  {
    pairId: 3,
    maestro: 'Ustad Zakir Hussain',
    maestroInfo: 'Punjab Gharana',
    instrument: 'Tabla',
    instrumentInfo: 'Dayan & Bayan Pair',
  },
  {
    pairId: 4,
    maestro: 'Pt. Hariprasad Chaurasia',
    maestroInfo: 'Classical Virtuoso',
    instrument: 'Bansuri',
    instrumentInfo: 'Bamboo Flute Raas',
  },
  {
    pairId: 5,
    maestro: 'Pt. Shivkumar Sharma',
    maestroInfo: 'Kashmiri Sufiana Heritage',
    instrument: 'Santoor',
    instrumentInfo: '100-String Hammered Dulcimer',
  },
  {
    pairId: 6,
    maestro: 'Ustad Amjad Ali Khan',
    maestroInfo: 'Senia Bangash Lineage',
    instrument: 'Sarod',
    instrumentInfo: 'Fretless Steel Fingerboard',
  },
];

function generateShuffledCards(): CardItem[] {
  const cards: CardItem[] = [];
  let idCounter = 1;

  PAIRS_DATA.forEach((pair) => {
    cards.push({
      id: idCounter++,
      pairId: pair.pairId,
      type: 'maestro',
      label: pair.maestro,
      sublabel: pair.maestroInfo,
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      id: idCounter++,
      pairId: pair.pairId,
      type: 'instrument',
      label: pair.instrument,
      sublabel: pair.instrumentInfo,
      isFlipped: false,
      isMatched: false,
    });
  });

  return cards.sort(() => Math.random() - 0.5);
}

export const GharanaMatchGame: React.FC<{ onExit: () => void; onViewLeaderboard: () => void }> = ({
  onExit,
  onViewLeaderboard,
}) => {
  const [cards, setCards] = useState<CardItem[]>(generateShuffledCards);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Timer
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Card Click
  const handleCardClick = (card: CardItem) => {
    if (card.isFlipped || card.isMatched || flippedIds.length >= 2) return;

    soundSynthesizer.playPercussionBeat('ta');
    const newFlipped = [...flippedIds, card.id];
    setFlippedIds(newFlipped);

    // Update flip state
    setCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c))
    );

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const first = cards.find((c) => c.id === newFlipped[0])!;
      const second = card;

      if (first.pairId === second.pairId) {
        // MATCH!
        soundSynthesizer.playSuccessSound();
        setStreak((st) => st + 1);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.pairId === first.pairId ? { ...c, isMatched: true } : c
            )
          );
          setMatches((m) => {
            const next = m + 1;
            if (next === PAIRS_DATA.length) {
              setGameOver(true);
            }
            return next;
          });
          setFlippedIds([]);
        }, 500);
      } else {
        // NO MATCH
        soundSynthesizer.playErrorSound();
        setStreak(0);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first.id || c.id === second.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedIds([]);
        }, 1100);
      }
    }
  };

  // Score points calculation
  const basePoints = matches * 180;
  const timeBonus = Math.max(0, 300 - timerSeconds * 3);
  const movesPenalty = Math.max(0, (moves - 10) * 15);
  const totalPoints = Math.max(200, basePoints + timeBonus - movesPenalty + streak * 30);

  const handleRestart = () => {
    setCards(generateShuffledCards());
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
    setStreak(0);
    setTimerSeconds(0);
    setGameOver(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 inline-block mb-1">
            Gharana & Maestro Memory
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950">
            Gharana & Maestro Flip Match
          </h2>
          <p className="text-sm text-stone-600">
            Pair each legendary Indian maestro with their consecrated instrument!
          </p>
        </div>

        <div className="flex items-center gap-4 bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-200">
          <div className="text-center">
            <span className="text-[10px] text-stone-500 font-semibold block uppercase">Moves</span>
            <span className="text-base font-bold text-stone-800">{moves}</span>
          </div>
          <div className="w-px h-8 bg-amber-200" />
          <div className="text-center">
            <span className="text-[10px] text-stone-500 font-semibold block uppercase">Time</span>
            <span className="text-base font-bold text-stone-800">{timerSeconds}s</span>
          </div>
          <div className="w-px h-8 bg-amber-200" />
          <div className="text-center">
            <span className="text-[10px] text-stone-500 font-semibold block uppercase">Pairs</span>
            <span className="text-lg font-bold text-amber-700">
              {matches}/{PAIRS_DATA.length}
            </span>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 mb-6">
        {cards.map((card) => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              disabled={isRevealed}
              className={`h-36 sm:h-40 rounded-2xl p-4 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer border-2 relative overflow-hidden ${
                card.isMatched
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm opacity-90'
                  : card.isFlipped
                  ? 'bg-amber-100/90 border-amber-400 text-amber-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-stone-900 border-stone-800 text-amber-200 hover:border-amber-600 shadow-md'
              }`}
            >
              {isRevealed ? (
                <>
                  <span
                    className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full mb-1.5 ${
                      card.type === 'maestro'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-200 text-amber-900'
                    }`}
                  >
                    {card.type === 'maestro' ? 'Maestro' : 'Instrument'}
                  </span>
                  <span className="font-serif font-bold text-sm sm:text-base leading-tight mb-1">
                    {card.label}
                  </span>
                  <span className="text-[11px] text-stone-600 line-clamp-2">{card.sublabel}</span>
                  {card.isMatched && (
                    <div className="absolute top-2 right-2 text-emerald-600">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-amber-400 mb-2 border border-stone-700">
                    <Music className="w-5 h-5" />
                  </div>
                  <span className="font-serif text-xs font-semibold text-amber-300/80">
                    ItihaasX
                  </span>
                  <span className="text-[9px] text-stone-400">Tap to Flip</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {gameOver && (
        <GameOverModal
          gameTitle="Gharana & Maestro Flip"
          score={matches}
          totalQuestions={PAIRS_DATA.length}
          points={totalPoints}
          streak={streak}
          onRestart={handleRestart}
          onExit={onExit}
          onViewLeaderboard={onViewLeaderboard}
        />
      )}
    </div>
  );
};
