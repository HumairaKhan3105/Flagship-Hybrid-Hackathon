import { GameCategory } from '../types';

export interface CategoryMeta {
  id: GameCategory;
  name: string;
  hindiName: string;
  tagline: string;
  description: string;
  emoji: string;
  totalLevels: number;
  badgeReward: string;
  themeColor: {
    from: string;
    to: string;
    border: string;
    accent: string;
    pillBg: string;
  };
  sampleItems: string[];
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'festivals',
    name: 'Indian Festivals',
    hindiName: 'त्यौहार और उत्सव',
    tagline: 'Colors, Lights & Ancient Celebrations',
    description: 'Explore the kaleidoscope of Indian festivities from Diwali and Holi to Hornbill, Onam, and Bihu.',
    emoji: '🪔',
    totalLevels: 50,
    badgeReward: 'Master of Festivities',
    themeColor: {
      from: 'from-amber-600',
      to: 'to-orange-700',
      border: 'border-amber-400',
      accent: 'text-amber-300',
      pillBg: 'bg-amber-900/60',
    },
    sampleItems: ['Diwali', 'Holi', 'Durga Puja', 'Onam', 'Hornbill', 'Baisakhi'],
  },
  {
    id: 'clothes',
    name: 'Traditional Clothes',
    hindiName: 'पारंपरिक वेशभूषा',
    tagline: 'Royal Silks, Turbans & Handloom Wonders',
    description: 'Unravel the world-famous weaves: Kanjeevaram, Banarasi, Bandhani, Phulkari, Pashmina, and Mekhela.',
    emoji: '🥻',
    totalLevels: 50,
    badgeReward: 'Royal Weaver',
    themeColor: {
      from: 'from-emerald-700',
      to: 'to-teal-800',
      border: 'border-emerald-400',
      accent: 'text-emerald-300',
      pillBg: 'bg-emerald-900/60',
    },
    sampleItems: ['Kanjeevaram', 'Banarasi', 'Phulkari', 'Bandhani', 'Pashmina', 'Kasavu'],
  },
  {
    id: 'food',
    name: 'Indian Food',
    hindiName: 'स्वादिष्ट भारतीय व्यंजन',
    tagline: 'Flavors of 28 States & Six Sacred Tastes',
    description: 'Discover the culinary secrets of Biryani, Dhokla, Dosa, Litti Chokha, Rogan Josh, and royal thalis.',
    emoji: '🍲',
    totalLevels: 50,
    badgeReward: 'Royal Rasoi Detective',
    themeColor: {
      from: 'from-orange-700',
      to: 'to-red-800',
      border: 'border-orange-400',
      accent: 'text-orange-300',
      pillBg: 'bg-orange-900/60',
    },
    sampleItems: ['Hyderabadi Biryani', 'Masala Dosa', 'Litti Chokha', 'Rogan Josh', 'Dhokla'],
  },
  {
    id: 'instruments',
    name: 'Musical Instruments',
    hindiName: 'संगीत वाद्ययंत्र',
    tagline: 'Divine Ragas & Sacred Beats',
    description: 'Hear the resonant acoustic soul of Sitar, Tabla, Veena, Bansuri, Shehnai, Ghatam, and Santoor.',
    emoji: '🪕',
    totalLevels: 50,
    badgeReward: 'Maestro of Melodies',
    themeColor: {
      from: 'from-purple-700',
      to: 'to-indigo-800',
      border: 'border-purple-400',
      accent: 'text-purple-300',
      pillBg: 'bg-purple-900/60',
    },
    sampleItems: ['Sitar', 'Tabla', 'Bansuri', 'Saraswati Veena', 'Shehnai', 'Mridangam'],
  },
  {
    id: 'art',
    name: 'Indian Art & Craft',
    hindiName: 'लोक कला और शिल्प',
    tagline: 'Murals, Miniatures & Lost-Wax Metalwork',
    description: 'Master ancient folk arts: Madhubani, Warli, Gond, Pattachitra, Tanjore, and Dokra bronze craft.',
    emoji: '🎨',
    totalLevels: 50,
    badgeReward: 'Grand Artisan of India',
    themeColor: {
      from: 'from-rose-700',
      to: 'to-amber-800',
      border: 'border-rose-400',
      accent: 'text-rose-300',
      pillBg: 'bg-rose-900/60',
    },
    sampleItems: ['Madhubani', 'Warli', 'Gond', 'Pattachitra', 'Tanjore', 'Dokra'],
  },
  {
    id: 'places',
    name: 'Famous Places',
    hindiName: 'ऐतिहासिक धरोहर',
    tagline: 'Fortresses, Temples & World Wonders',
    description: 'Travel through ancient history at the Taj Mahal, Hampi, Konark, Ellora Caves, and Jaisalmer Fort.',
    emoji: '🏛️',
    totalLevels: 50,
    badgeReward: 'Guardian of Heritage',
    themeColor: {
      from: 'from-amber-800',
      to: 'to-stone-900',
      border: 'border-amber-400',
      accent: 'text-amber-300',
      pillBg: 'bg-stone-900/60',
    },
    sampleItems: ['Taj Mahal', 'Hampi', 'Konark Sun Temple', 'Ellora Caves', 'Golden Temple'],
  },
];
