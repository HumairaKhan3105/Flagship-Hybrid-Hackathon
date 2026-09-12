export type ScreenId = 
  | 'main-menu'
  | 'exploration'
  | 'dialogue'
  | 'notebook'
  | 'math-puzzle'
  | 'astronomy-puzzle'
  | 'knowledge-web'
  | 'map'
  | 'inventory'
  | 'moral-choice'
  | 'ending';

export interface ScreenMetadata {
  id: ScreenId;
  number: number;
  title: string;
  category: string;
  description: string;
  uiHighlights: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Relic' | 'Document' | 'Tool' | 'Remedy' | 'Curio';
  description: string;
  historicalContext: string;
  sanskritName: string;
  iconType: 'coin' | 'scroll' | 'symbol' | 'key' | 'herb';
  imageFallback: string;
  rarity: 'Common' | 'Rare' | 'Sacred';
}

export interface ClueNode {
  id: string;
  title: string;
  type: 'Person' | 'Manuscript' | 'Place' | 'Clue' | 'Knowledge';
  subtitle: string;
  status: 'discovered' | 'unsolved' | 'connected';
  description: string;
  connectedTo: string[];
  x: number;
  y: number;
}

export interface QuestObjective {
  id: string;
  text: string;
  completed: boolean;
  notes?: string;
}

export interface DialogueChoice {
  id: string;
  text: string;
  response: string;
  unlocksClueId?: string;
  nextStepPrompt?: string;
}

export interface LandmarkLocation {
  id: string;
  name: string;
  ancientName: string;
  type: 'Library' | 'Monastery' | 'Classroom' | 'Courtyard' | 'Market' | 'Residential';
  description: string;
  x: number; // percentage on map
  y: number;
  hasActiveQuest?: boolean;
}
