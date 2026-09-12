export interface ArchPuzzleItem {
  id: string;
  name: string;
  category: 'element' | 'meaning';
  description: string;
  matchId: string;
  icon: string;
}

export interface InscriptionTile {
  id: string;
  kannadaChar: string;
  transliteration: string;
  englishMeaning: string;
  orderIndex: number;
  rotation: number; // 0, 90, 180, 270 deg
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  ruler: string;
  chronologicalOrder: number;
}

export interface ChariotQuadrant {
  id: 'lotus' | 'boar' | 'garuda' | 'sun';
  name: string;
  symbol: string;
  kannadaTitle: string;
  description: string;
  correctSlotIndex: number; // 0: North, 1: East, 2: South, 3: West
}

export const ARCHITECTURE_ITEMS: { left: ArchPuzzleItem[]; right: ArchPuzzleItem[] } = {
  left: [
    {
      id: 'arch_1',
      name: 'Maha Mandapa',
      category: 'element',
      description: 'The expansive pillared congregation hall',
      matchId: 'target_1',
      icon: '🏛️'
    },
    {
      id: 'arch_2',
      name: 'Musical Pillars',
      category: 'element',
      description: 'Resonating granite acoustic columns',
      matchId: 'target_2',
      icon: '🎵'
    },
    {
      id: 'arch_3',
      name: 'Stone Chariot',
      category: 'element',
      description: 'The monumental Garuda shrine on wheels',
      matchId: 'target_3',
      icon: '☸️'
    },
    {
      id: 'arch_4',
      name: 'Raja Gopuram',
      category: 'element',
      description: 'The monumental tiered pyramid gateway',
      matchId: 'target_4',
      icon: '⛩️'
    }
  ],
  right: [
    {
      id: 'target_1',
      name: 'Sacred Dance & Royal Gathering Hall',
      category: 'meaning',
      description: 'Hypostyle hall for royal celebrations and public darbar',
      matchId: 'arch_1',
      icon: '👑'
    },
    {
      id: 'target_2',
      name: 'Acoustic Sa-Re-Ga-Ma Resonators',
      category: 'meaning',
      description: 'Engineered columns emitting distinct musical frequencies',
      matchId: 'arch_2',
      icon: '🔔'
    },
    {
      id: 'target_3',
      name: 'Garuda Celestial Vahana Shrine',
      category: 'meaning',
      description: 'Granite carriage symbolizing the journey of the sun deity',
      matchId: 'arch_3',
      icon: '🦅'
    },
    {
      id: 'target_4',
      name: 'Cosmic Axis & Horizon Marker',
      category: 'meaning',
      description: 'Towering landmark visible across the entire river valley',
      matchId: 'arch_4',
      icon: '☀️'
    }
  ]
};

export const INSCRIPTION_TILES: InscriptionTile[] = [
  {
    id: 'tile_1',
    kannadaChar: 'ಶ್ರೀ',
    transliteration: 'Shree',
    englishMeaning: 'Auspicious Invocation',
    orderIndex: 0,
    rotation: 0
  },
  {
    id: 'tile_2',
    kannadaChar: 'ಕೃಷ್ಣದೇವರಾಯ',
    transliteration: 'Krishnadevaraya',
    englishMeaning: 'Emperor of Vijayanagara',
    orderIndex: 1,
    rotation: 90
  },
  {
    id: 'tile_3',
    kannadaChar: 'ವಿಜಯನಗರ',
    transliteration: 'Vijayanagara',
    englishMeaning: 'City of Victory',
    orderIndex: 2,
    rotation: 180
  },
  {
    id: 'tile_4',
    kannadaChar: 'ಶಾಸನ',
    transliteration: 'Shaasana',
    englishMeaning: 'Royal Decree / Covenant',
    orderIndex: 3,
    rotation: 270
  },
  {
    id: 'tile_5',
    kannadaChar: 'ಶಾಶ್ವತ',
    transliteration: 'Shaashvata',
    englishMeaning: 'Everlasting for Generations',
    orderIndex: 4,
    rotation: 90
  }
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'event_1',
    year: '1336 CE',
    title: 'Founding of Vijayanagara',
    description: 'Harihara I and Bukka Raya I establish the empire on the banks of the Tungabhadra River, guided by the venerable sage Vidyaranya.',
    ruler: 'Harihara I & Bukka I (Sangama Dynasty)',
    chronologicalOrder: 0
  },
  {
    id: 'event_2',
    year: '1426 CE',
    title: 'Devaraya II Expands the Realm',
    description: 'The empire reaches maritime supremacy, commissioning the earliest shrines in the Vitthala complex and welcoming Persian envoy Abdur Razzaq.',
    ruler: 'Proudha Devaraya (Devaraya II)',
    chronologicalOrder: 1
  },
  {
    id: 'event_3',
    year: '1509 CE',
    title: 'Coronation of Krishnadevaraya',
    description: 'Emperor Krishnadevaraya ascends the throne, inaugurating the golden age of literature, architecture, and military invincibility.',
    ruler: 'Emperor Krishnadevaraya (Tuluva Dynasty)',
    chronologicalOrder: 2
  },
  {
    id: 'event_4',
    year: '1516 CE',
    title: 'Construction of the Stone Chariot',
    description: 'Following victorious campaigns, the grand granite Garuda chariot is consecrated at the Vitthala Temple complex.',
    ruler: 'Emperor Krishnadevaraya',
    chronologicalOrder: 3
  },
  {
    id: 'event_5',
    year: '1520 CE',
    title: 'Visit of Domingo Paes & Duarte Barbosa',
    description: 'Portuguese chroniclers record that Hampi is comparable in grandeur to Rome, with bustling diamond markets and unparalleled security.',
    ruler: 'Emperor Krishnadevaraya',
    chronologicalOrder: 4
  }
];

export const CHARIOT_QUADRANTS: ChariotQuadrant[] = [
  {
    id: 'lotus',
    name: 'Lotus of Pampa (North)',
    symbol: '🪷',
    kannadaTitle: 'ಪಂಪಾ ಕಮಲ',
    description: 'Sacred river flower representing divine wisdom and purity.',
    correctSlotIndex: 0
  },
  {
    id: 'boar',
    name: 'Royal Varaha Boar (East)',
    symbol: '🐗',
    kannadaTitle: 'ವರಾಹ ಲಾಂಛನ',
    description: 'The supreme imperial emblem of royal authority, valor, and sovereign victory.',
    correctSlotIndex: 1
  },
  {
    id: 'garuda',
    name: 'Celestial Garuda (South)',
    symbol: '🦅',
    kannadaTitle: 'ಗರುಡ ವಾಹನ',
    description: 'The celestial golden eagle, carrier of Vishnu, pointing toward the southern skies.',
    correctSlotIndex: 2
  },
  {
    id: 'sun',
    name: 'Surya Sun Disc (West)',
    symbol: '☀️',
    kannadaTitle: 'ಸೂರ್ಯ ಚಕ್ರ',
    description: 'The eternal solar disc marking the setting sun over Matanga Hill.',
    correctSlotIndex: 3
  }
];

export const PUZZLES: { [id: string]: import('../types').Puzzle } = {
  puzzle_architecture: {
    id: 'puzzle_architecture',
    title: 'Gopuram Inversion & Dravidian Alignment',
    locationName: 'Virupaksha Temple',
    type: 'architecture_cipher',
    difficulty: 'Scholar',
    instructions: 'Re-align the sacred temple architectural components according to classical Shilpa Shastra geometry. Order the tiers from the foundation plinth up to the golden kalasha stupi.',
    hint: 'Temple structures begin at the Upapitha (Plinth), rise through the Tala (Sanctum Hall), ascend into the Gopuram (Stepped Gateway), and culminate in the Stupi (Finial).',
    rewardXP: 300
  },
  puzzle_inscription: {
    id: 'puzzle_inscription',
    title: 'Kannada Epigraphy & Royal Shasana',
    locationName: 'Vitthala Temple Courtyard',
    type: 'inscription_decoder',
    difficulty: 'Scholar',
    instructions: 'Decode the 1516 CE Kannada stone inscription granted by King Krishnadevaraya. Match each sacred glyph to its historical epigraphic translation.',
    hint: '“ಶ್ರೀ” (Shri) represents the invocation of divine auspiciousness. “ವರಾಹ” (Varaha) is the boar seal of imperial authority.',
    rewardXP: 350
  },
  puzzle_timeline: {
    id: 'puzzle_timeline',
    title: 'Chronicles of the Four Dynasties',
    locationName: 'Lotus Mahal & Zenana Enclosure',
    type: 'timeline_ordering',
    difficulty: 'Scholar',
    instructions: 'Restore the chronological flow of historical milestones from the 1336 CE founding to the 1516 CE Stone Chariot consecration.',
    hint: 'The empire was established in 1336 CE by Hakka & Bukka, maritime trade surged under Devaraya II in 1424, followed by Krishnadevaraya’s 1509 coronation and the 1516 Chariot dedication.',
    rewardXP: 350
  },
  puzzle_stone_chariot: {
    id: 'puzzle_stone_chariot',
    title: 'The Stone Chariot Celestial Mechanism',
    locationName: 'Stone Chariot, Vitthala Temple',
    type: 'stone_chariot_rotator',
    difficulty: 'Sacred',
    instructions: 'Rotate the four astronomical dial rings on the monolithic granite wheel. Align all four cardinal symbols—Garuda, Surya, Varaha, and Kamala—with the Zenith marker (0°).',
    hint: 'Click each cardinal dial to rotate it until its orientation reads 0° (Zenith alignment).',
    rewardXP: 500
  }
};
