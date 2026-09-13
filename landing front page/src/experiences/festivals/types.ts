export type CategoryId = 
  | 'festivals' 
  | 'clothes' 
  | 'food' 
  | 'instruments' 
  | 'art' 
  | 'places';

export type GameCategory = CategoryId;

export type GameType = 
  | 'multiple-choice'
  | 'image-guess'
  | 'memory-match'
  | 'match-pairs'
  | 'true-false'
  | 'emoji-guess'
  | 'odd-one-out'
  | 'order-sequence'
  | 'sound-recognition'
  | 'word-scramble'
  | 'map-challenge'
  | 'cultural-riddle';

export type CharacterMood = 
  | 'idle' 
  | 'thinking' 
  | 'happy' 
  | 'excited' 
  | 'surprised' 
  | 'confused' 
  | 'celebration' 
  | 'level-up';

export interface CharacterProfile {
  id: string;
  name: string;
  title: string;
  region: string;
  state: string;
  outfit: string;
  personality: string;
  intro: string;
  avatarColor: string;
  avatar?: string;
  greeting?: string;
  role?: string;
  specialty?: string;
  dialogues: {
    greeting: string;
    correct: string;
    wrong: string;
    hint: string;
    perfect: string;
  };
}

export interface PairMatchItem {
  id: string;
  left: string;
  right: string;
  leftSub?: string;
  rightSub?: string;
}

export interface MemoryCardItem {
  id: string;
  label: string;
  matchId: string;
  icon?: string;
  sub?: string;
}

export interface LevelData {
  id: number;
  category: CategoryId;
  level: number;
  title: string;
  characterId: string;
  gameType: GameType;
  question: string;
  options?: string[];
  correctAnswer: string | string[] | boolean;
  explanation: string;
  hint: string;
  fact: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in seconds
  region: string;
  subRegion?: string;
  visualType?: string;
  // Specific minigame data:
  pairs?: PairMatchItem[];
  memoryCards?: MemoryCardItem[];
  orderItems?: string[];
  oddItems?: { text: string; isOdd: boolean; explanation: string }[];
  scrambleWord?: string;
  soundInstrument?: string;
  soundType?: 'sitar' | 'tabla' | 'flute' | 'veena' | 'shehnai' | 'dhol' | 'ghatam';
  mapOptions?: { state: string; isCorrect: boolean }[];
  emojis?: string;
}

export interface CategoryProgress {
  currentLevel: number;
  completedLevels: number[];
  starsEarned: number;
}

export interface UserProgress {
  displayName: string;
  avatarId: string;
  score: number;
  xp: number;
  coins: number;
  level: number; // Detective rank level (1..50)
  title: string;
  rankTitle: string;
  streak: number;
  lastPlayedDate: string;
  completedLevels: Record<string, { stars: number; highscore: number; completedAt: string }>;
  categoryProgress: Record<CategoryId, CategoryProgress>;
  unlockedBadges: string[];
  soundEnabled: boolean;
  musicEnabled: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  dailyChallengeCompletedDate?: string;
  factsUnlocked: string[];
}

export interface Badge {
  id: string;
  title: string;
  name?: string;
  description: string;
  icon: string;
  category: string;
  reqType: 'levels' | 'stars' | 'streak' | 'xp' | 'category' | 'daily';
  reqValue: number;
  rewardCoins?: number;
  rewardXp?: number;
  targetCategory?: CategoryId;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  score: number;
  stars: number;
  badgesCount: number;
  isCurrentUser?: boolean;
}

export type ScreenName = 
  | 'home'
  | 'categories'
  | 'level-map'
  | 'gameplay'
  | 'leaderboard'
  | 'profile'
  | 'facts'
  | 'daily-challenge'
  | 'how-to-play'
  | 'settings';
