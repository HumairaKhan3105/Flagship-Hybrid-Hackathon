export type GameScreen = 
  | 'welcome' 
  | 'map' 
  | 'story' 
  | 'weaver' 
  | 'quiz' 
  | 'unlock' 
  | 'collection' 
  | 'guide'
  | 'timeline' 
  | 'grand-challenge' 
  | 'settings';

export type GarmentCategory = 'all' | 'sarees' | 'textiles' | 'mens' | 'regional' | 'accessories';

export interface Region {
  id: string;
  name: string;
  nativeScript?: string;
  state: string;
  mapX: number; // percentage on India map (0-100)
  mapY: number; // percentage on India map (0-100)
  climate: string;
  textileTraditions: string[];
  storyCount: number;
  unlocked: boolean;
  color: string;
  description: string;
  environmentBackdrop: string;
  signatureGarmentId: string;
}

export interface Garment {
  id: string;
  name: string;
  nativeTitle: string;
  regionId: string;
  regionName: string;
  category: 'sarees' | 'textiles' | 'mens' | 'regional' | 'accessories';
  rarity: 'Common' | 'Royal' | 'Imperial' | 'Sacred';
  unlocked: boolean;
  unlockedAt?: string;
  description: string;
  culturalSignificance: string;
  loreQuote: string;
  historicalEra: string;
  fabricDetails: {
    baseMaterial: string;
    weaveTechnique: string;
    zariType: string;
    weavingDuration: string;
    giCertified: boolean;
    traditionalMotifs: string[];
  };
  imageAsset?: string;
  colorHex: string;
  accentGold: string;
  patternName: string;
}

export interface WeaverPatternOption {
  id: string;
  letter: 'A' | 'B' | 'C' | 'D';
  name: string;
  region: string;
  motifName: string;
  patternType: string;
  isCorrect: boolean;
  bgColor: string;
  accentColor: string;
  svgMotif: 'floral_jal' | 'peacock' | 'bandhani_dots' | 'ikat_geometry' | 'paisley_kalka' | 'temple_spire';
  description: string;
}

export interface WeaverLevel {
  levelNumber: number;
  title: string;
  regionName: string;
  targetGarmentId: string;
  prompt: string;
  options: WeaverPatternOption[];
  timeLimitSeconds: number;
  pointsReward: number;
  companionHint: string;
}

export interface QuizQuestion {
  id: string;
  level: number;
  questionNumber: number;
  totalQuestions: number;
  regionId: string;
  garmentId: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  companionHint: string;
  pointsReward: number;
}

export interface TimelineEra {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  icon: string;
  summary: string;
  techniqueMilestone: string;
  royalInfluence: string;
  garmentHighlight: string;
}

export interface PlayerProfile {
  name: string;
  rankTitle: string;
  level: number;
  points: number;
  lives: number;
  maxLives: number;
  discoveredRegions: string[];
  unlockedGarments: string[];
  completedQuizzes: string[];
  completedWeaverLevels: number[];
  grandChallengeUnlocked: boolean;
  grandChallengeMastered: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
}
