export interface Instrument {
  _id?: string;
  slug: string;
  name: string;
  alternativeNames: string[];
  state: string;
  region: string;
  family: 'String' | 'Wind' | 'Percussion' | 'Folk' | 'Classical' | 'Tribal' | 'Keyboard / other';
  tradition: string;
  origin: string;
  description: string;
  history: string;
  construction: string;
  howItIsPlayed: string;
  culturalUses: string[];
  festivals: string[];
  community: string;
  materials: string[];
  interestingFacts: string[];
  imageUrl: string;
  audioUrl?: string | null;
  audioNote?: string;
  popularity: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  instrumentSlug?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  score: number;
  totalQuestions: number;
  accuracy: number;
  title: string;
  streak: number;
  date: string;
  gameName?: string;
}

export interface HeritageGame {
  id: string;
  title: string;
  hindiTitle: string;
  category: 'Rhythm & Sound' | 'Memory & Match' | 'Geography & Lore' | 'Speed & Reflex';
  description: string;
  duration: string;
  pointsReward: string;
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  icon: string;
  badge: string;
}

export type SortOption = 'popular' | 'a-z' | 'region' | 'recent';

export interface FilterState {
  search: string;
  state: string;
  family: string;
  region: string;
  sort: SortOption;
}
