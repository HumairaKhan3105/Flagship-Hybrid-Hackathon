import { Quest, Clue, Artifact } from '../types';

export const INITIAL_CLUES: Clue[] = [
  {
    id: 'clue_map_fragment',
    title: 'Ancient Cartographic Fragment',
    locationId: 'bazaar',
    locationName: 'Hampi Bazaar',
    status: 'locked',
    icon: '🗺️',
    category: 'map',
    shortDescription: 'A weathered parchment piece marking a hidden axis between Virupaksha and Vitthala.',
    historicalContext: 'Vijayanagara cartographers used sacred geometry aligning temple towers with celestial solstices and the Tungabhadra river bends.',
    secretRevelation: 'Points toward the eastern sanctum of Virupaksha Temple, where the shadow inverts.'
  },
  {
    id: 'clue_merchant_seal',
    title: 'Imperial Merchant Coin (Varaha)',
    locationId: 'bazaar',
    locationName: 'Hampi Bazaar',
    status: 'locked',
    icon: '🪙',
    category: 'royal_seal',
    shortDescription: 'A gold Gadyana bearing the Boar (Varaha avatar) and the royal crescent sun.',
    historicalContext: 'Emperor Krishnadevaraya issued gold coins featuring the boar emblem, signifying divine protection and sovereign imperial legitimacy across the subcontinent.',
    secretRevelation: 'This seal forms the primary key needed to unlock the final quadrant of the Stone Chariot.'
  },
  {
    id: 'clue_gopuram_cipher',
    title: 'Pinhole Camera Inversion Cipher',
    locationId: 'virupaksha',
    locationName: 'Virupaksha Temple',
    status: 'locked',
    icon: '📐',
    category: 'architecture',
    shortDescription: 'A stone tablet explaining how the 50m Gopuram shadow projects upside down through an ancient aperture.',
    historicalContext: 'Vijayanagara master-builders demonstrated advanced optical knowledge. In a dark vestibule behind the sanctum, light passing through a slit casts an inverted shadow of the gopuram upon the wall.',
    secretRevelation: 'The inverted shadow reveals the true alignment needed to read the Vitthala stone inscription.'
  },
  {
    id: 'clue_royal_seal',
    title: 'Seal of the Royal Treasury',
    locationId: 'virupaksha',
    locationName: 'Virupaksha Temple',
    status: 'locked',
    icon: '📜',
    category: 'royal_seal',
    shortDescription: 'An engraved brass seal with Sanskrit Kannada epigraph denoting royal decree authority.',
    historicalContext: 'Only documents stamped with this seal carried imperial weight across the fourteen provinces (Rajyas) of Vijayanagara.',
    secretRevelation: 'Identifies the decree as an Imperial Charter protecting learning, art, and communal harmony.'
  },
  {
    id: 'clue_musical_notes',
    title: 'Harmonic Acoustic Key',
    locationId: 'vitthala',
    locationName: 'Vitthala Temple Complex',
    status: 'locked',
    icon: '🎵',
    category: 'artifact',
    shortDescription: 'A granite tuning tablet resonating with the Sa-Re-Ga-Ma notes of the Maha Mandapa pillars.',
    historicalContext: 'The 56 pillars of the Vitthala hall are carved from solid granite columns surrounded by slender colonnettes that chime different musical pitches when tapped with fingertips.',
    secretRevelation: 'Reveals the vibrational sequence that frees the rotating stone axles of the Chariot.'
  },
  {
    id: 'clue_stone_inscription',
    title: 'The 1516 CE Epigraph Fragment',
    locationId: 'vitthala',
    locationName: 'Vitthala Temple Complex',
    status: 'locked',
    icon: '🪨',
    category: 'inscription',
    shortDescription: 'A stone slab carved in ancient Kannada script mentioning Krishnadevaraya’s secret vow.',
    historicalContext: 'Inscriptions on temple plinths celebrated military victories, endowments of villages, and royal charters witnessed by court poets like Allasani Peddana.',
    secretRevelation: 'Translates to: "Within the celestial mount of the sun bird lies the covenant of the eternal capital."'
  },
  {
    id: 'clue_chariot_quadrant',
    title: 'Garuda Chariot Wheel Cipher',
    locationId: 'stone_chariot',
    locationName: 'The Stone Chariot',
    status: 'locked',
    icon: '☸️',
    category: 'architecture',
    shortDescription: 'Carved symbols on the four monolithic stone wheels depicting the Lotus, Boar, Garuda, and Sun.',
    historicalContext: 'The Stone Chariot is crowned by a brick and mortar vimana tower and was originally painted in vibrant organic mineral dyes with yellow, red, and indigo.',
    secretRevelation: 'Aligning the 4 wheels in cosmic order activates the hidden central stone latch.'
  },
  {
    id: 'clue_final_decree',
    title: 'The Royal Decree of Krishnadevaraya',
    locationId: 'stone_chariot',
    locationName: 'The Stone Chariot',
    status: 'locked',
    icon: '👑',
    category: 'royal_seal',
    shortDescription: 'The legendary lost copper plate edict outlining the preservation of Vijayanagara’s wisdom for future generations.',
    historicalContext: 'Emperor Krishnadevaraya (ruled 1509–1529 CE), scholar-king and patron of the Ashtadiggajas (eight great poets), inscribed this decree to ensure the eternal memory of his city.',
    secretRevelation: 'Mystery Solved! The lost decree bestows upon you the title of "Master Heritage Scholar of Vijayanagara".'
  }
];

export const INITIAL_ARTIFACTS: Artifact[] = [
  {
    id: 'artifact_gadyana',
    name: 'Gold Varaha Gadyana',
    period: '1515 CE',
    material: 'Pure Gold (Pagoda)',
    rarity: 'Royal',
    description: 'The standard high-value currency of the empire, traded from Portugal to Malacca.',
    historicalFact: 'Foreign travelers marveled that rubies and diamonds could be purchased in Hampi with these gold coins without fear of robbery.',
    icon: '🪙',
    unlocked: false
  },
  {
    id: 'artifact_palm_manuscript',
    name: 'Palm-Leaf Chronicle (Tala-patra)',
    period: '15th Century',
    material: 'Treated Palm Leaf & Ink',
    rarity: 'Rare',
    description: 'An ancient administrative manuscript inscribed in Old Kannada script using an iron stylus.',
    historicalFact: 'Tala-patra manuscripts were preserved using neem oil and turmeric to protect against humidity and insects for centuries.',
    icon: '📜',
    unlocked: false
  },
  {
    id: 'artifact_bronze_lamp',
    name: 'Vijayanagara Deepalakshmi',
    period: '16th Century',
    material: 'Lost-Wax Cast Bronze',
    rarity: 'Rare',
    description: 'A ritual ceremonial lamp held by a sculpted female figure wearing traditional royal jewelry.',
    historicalFact: 'The lost-wax casting (cire-perdue) technique of Vijayanagara artisans produced bronze statues revered worldwide.',
    icon: '🪔',
    unlocked: false
  },
  {
    id: 'artifact_carved_yali',
    name: 'Miniature Granite Yali Pillar',
    period: 'c. 1520 CE',
    material: 'Granite',
    rarity: 'Sacred',
    description: 'A miniature master-mason model of the mythical beast Yali (part lion, part elephant, part horse).',
    historicalFact: 'Yali figures were placed at mandapa entrances as spiritual guardians symbolizing immense cosmic strength and vigilance.',
    icon: '🦁',
    unlocked: false
  },
  {
    id: 'artifact_copper_plate',
    name: 'Emperor Krishnadevaraya Copper Plate',
    period: '1521 CE',
    material: 'Engraved Copper with Royal Boar Ring',
    rarity: 'Royal',
    description: 'The authentic royal decree plate sealed with the royal emblem ring of the Sangama and Tuluva dynasties.',
    historicalFact: 'Copper plates served as permanent legal deeds that could withstand fire, war, and time.',
    icon: '👑',
    unlocked: false
  }
];

export const QUESTS: Quest[] = [
  {
    id: 'quest_01',
    number: 1,
    title: 'The First Echo',
    subtitle: 'Hampi Bazaar & The Merchant Mystery',
    objective: 'Explore Hampi Bazaar and uncover the Ancient Map Fragment.',
    locationId: 'bazaar',
    steps: [
      { id: 'step_1_1', description: 'Walk through the ancient colonnades of Hampi Bazaar', isCompleted: false },
      { id: 'step_1_2', description: 'Interact with the weathered Stone Merchant Chest', isCompleted: false, interactionTargetId: 'chest_bazaar' },
      { id: 'step_1_3', description: 'Consult AI Historian Acharya about the ancient cartography', isCompleted: false }
    ],
    rewardXP: 150,
    unlockedClueId: 'clue_map_fragment',
    unlockedLocationId: 'virupaksha',
    historicalNarration: 'Beneath the dusty flagstones of the legendary bazaar, where merchants from Venice and Persia once haggled for gemstones, your hands brush against an antique parchment map...',
    completed: false
  },
  {
    id: 'quest_02',
    number: 2,
    title: 'Whispers in Stone',
    subtitle: 'Virupaksha Temple Architecture',
    objective: 'Travel to Virupaksha Temple, inspect the Gopuram and solve the Architecture Matching puzzle.',
    locationId: 'virupaksha',
    steps: [
      { id: 'step_2_1', description: 'Travel to Virupaksha Temple via the ancient map', isCompleted: false },
      { id: 'step_2_2', description: 'Inspect the sacred Gopuram and ceremonial pillar friezes', isCompleted: false, interactionTargetId: 'pillar_virupaksha' },
      { id: 'step_2_3', description: 'Solve the Architecture Matching Puzzle', isCompleted: false }
    ],
    rewardXP: 250,
    unlockedClueId: 'clue_gopuram_cipher',
    unlockedLocationId: 'vitthala',
    unlocksPuzzleId: 'puzzle_architecture',
    historicalNarration: 'The 50-meter gateway looms into the sunset. As you align the architectural elements of the great temple hall, the ancient pinhole optical secret is revealed!',
    completed: false
  },
  {
    id: 'quest_03',
    number: 3,
    title: "The Chariot's Secret",
    subtitle: 'Vitthala Temple & The Stone Carriage',
    objective: 'Reach Vitthala Temple and inspect the monumental Stone Chariot.',
    locationId: 'vitthala',
    steps: [
      { id: 'step_3_1', description: 'Approach the world-renowned Stone Chariot in the Vitthala courtyard', isCompleted: false },
      { id: 'step_3_2', description: 'Examine the musical Sa-Re-Ga-Ma acoustic pillars in the Maha Mandapa', isCompleted: false, interactionTargetId: 'musical_pillars' },
      { id: 'step_3_3', description: 'Inspect the rotating granite wheel hub of the Stone Chariot', isCompleted: false, interactionTargetId: 'chariot_wheel' }
    ],
    rewardXP: 300,
    unlockedClueId: 'clue_musical_notes',
    unlockedLocationId: 'stone_chariot',
    historicalNarration: 'The iconic Stone Chariot stands serene in the amber twilight. You discover that its massive stone wheels hold interlocking secret grooves...',
    completed: false
  },
  {
    id: 'quest_04',
    number: 4,
    title: 'Words From Stone',
    subtitle: 'Decoding the Ancient Inscription',
    objective: 'Decode the ancient 1516 CE Kannada & Sanskrit stone inscription slab.',
    locationId: 'vitthala',
    steps: [
      { id: 'step_4_1', description: 'Inspect the royal inscription stele near the sanctum', isCompleted: false, interactionTargetId: 'inscription_slab' },
      { id: 'step_4_2', description: 'Rotate and sequence the ancient glyph tiles to translate the edict', isCompleted: false },
      { id: 'step_4_3', description: 'Receive the Imperial Treasury Seal clue into your journal', isCompleted: false }
    ],
    rewardXP: 350,
    unlockedClueId: 'clue_stone_inscription',
    unlocksPuzzleId: 'puzzle_inscription',
    historicalNarration: 'The carved characters awaken: "Within the celestial mount of the sun bird lies the covenant of the eternal capital." The pieces of the mystery are locking together!',
    completed: false
  },
  {
    id: 'quest_05',
    number: 5,
    title: 'The Royal Path',
    subtitle: 'Historical Chronicles of Vijayanagara',
    objective: 'Arrange the timeline of King Krishnadevaraya and the Empire to earn the Royal Boar Seal.',
    locationId: 'lotus_mahal',
    steps: [
      { id: 'step_5_1', description: 'Explore the Zenana Enclosure and Lotus Mahal grounds', isCompleted: false },
      { id: 'step_5_2', description: 'Complete the Vijayanagara Dynasty Historical Timeline Puzzle', isCompleted: false },
      { id: 'step_5_3', description: 'Unlock the Royal Boar (Varaha) medallion key', isCompleted: false }
    ],
    rewardXP: 400,
    unlockedClueId: 'clue_merchant_seal',
    unlockedLocationId: 'stone_chariot',
    unlocksPuzzleId: 'puzzle_timeline',
    historicalNarration: 'From Sage Vidyaranya’s divine inspiration on the banks of Tungabhadra in 1336 CE to Krishnadevaraya’s glorious golden age, you master the chronicle of the empire.',
    completed: false
  },
  {
    id: 'quest_06',
    number: 6,
    title: 'The Lost Royal Decree',
    subtitle: 'The Grand Finale at the Stone Chariot',
    objective: 'Solve the central Stone Chariot multi-symbol mechanism and unearth Emperor Krishnadevaraya’s decree.',
    locationId: 'stone_chariot',
    steps: [
      { id: 'step_6_1', description: 'Approach the Stone Chariot central altar', isCompleted: false, interactionTargetId: 'chariot_altar' },
      { id: 'step_6_2', description: 'Align the 4 celestial quadrants: Lotus, Boar, Garuda, and Sun', isCompleted: false },
      { id: 'step_6_3', description: 'Insert the Royal Seal to trigger the secret mechanical compartment', isCompleted: false }
    ],
    rewardXP: 600,
    unlockedClueId: 'clue_final_decree',
    unlocksPuzzleId: 'puzzle_stone_chariot',
    historicalNarration: 'A deep rumble echoes through the granite stones! The hidden compartment smoothly recedes, revealing the gleaming copper plate of Emperor Krishnadevaraya!',
    completed: false
  }
];
