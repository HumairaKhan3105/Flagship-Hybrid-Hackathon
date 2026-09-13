import { MonumentInfo } from '../types';

export const MONUMENTS: Record<string, MonumentInfo> = {
  bazaar: {
    id: 'bazaar',
    name: 'Hampi Bazaar',
    kannadaName: 'ಹಂಪಿ ಬಜಾರ್',
    tagline: 'The ancient gem market of the Vijayanagara Empire',
    description: 'A sprawling stone-columned boulevard stretching nearly a kilometer from Virupaksha Temple, once buzzing with merchants trading rubies, gold, and Arabian steeds.',
    detailedHistory: 'Portuguese chronicler Domingo Paes documented in 1520 CE that diamonds and rubies were weighed in open scales here. The two-story pillared pavilions housed foreign envoys, jewelers, and royal merchants under the patronage of King Krishnadevaraya.',
    historicalPeriod: '14th – 16th Century CE',
    rulerAssociation: 'King Krishnadevaraya & Devaraya II',
    architecturalStyle: 'Dravidian Civic & Commercial Pavilion Stone Architecture',
    coordinates: [22, 68],
    worldPosition: [0, 0, 0],
    unlockRequirementText: 'Unlocked at start of adventure.',
    unlockedByDefault: true,
    clueIds: ['clue_map_fragment', 'clue_merchant_seal'],
    puzzleId: 'puzzle_architecture',
    keyFeatures: [
      'Twin rows of granite arcades and colonnades',
      'Open market pavilions for precious gemstones',
      'Direct royal ceremonial pathway to Virupaksha Temple',
      'Ancient carved water troughs for pack horses'
    ]
  },
  virupaksha: {
    id: 'virupaksha',
    name: 'Virupaksha Temple',
    kannadaName: 'ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯ',
    tagline: 'The eternal sanctum on the banks of Tungabhadra',
    description: 'The spiritual heart of Vijayanagara, crowned by a 50-meter-high eastern Rajagopuram that has witnessed ceremonies for over a millennium.',
    detailedHistory: 'Dedicated to Lord Virupaksha (Shiva), patron deity of the Sangama dynasty. King Krishnadevaraya commissioned the soaring eastern gateway and the grand Ranga Mandapa in 1509-1510 CE to commemorate his coronation. The inner chamber exhibits an ancient pinhole camera illusion projecting the inverted shadow of the gopuram.',
    historicalPeriod: '7th Century origins; 1509 CE Golden Expansion',
    rulerAssociation: 'Sage Vidyaranya, Harihara I & King Krishnadevaraya',
    architecturalStyle: 'Classical Dravidian Gopuram & Hypostyle Ranga Mandapa',
    coordinates: [38, 48],
    worldPosition: [55, 0, -40],
    unlockRequirementText: 'Find the Ancient Map Fragment in Hampi Bazaar.',
    unlockedByDefault: false,
    clueIds: ['clue_gopuram_cipher', 'clue_royal_seal'],
    puzzleId: 'puzzle_architecture',
    keyFeatures: [
      '50-meter 9-tiered monumental Rajagopuram',
      'Pinhole camera optical phenomenon inverted projection',
      'Intricate 100-pillar ceremonial Kalyana Mandapa',
      'Ceiling murals depicting the Mahabharata and royal processions'
    ]
  },
  vitthala: {
    id: 'vitthala',
    name: 'Vitthala Temple Complex',
    kannadaName: 'ವಿಜಯ ವಿಠ್ಠಲ ದೇವಾಲಯ',
    tagline: 'Crown jewel of Vijayanagara art and acoustics',
    description: 'An architectural masterpiece celebrated for its monolithic musical pillars that resonate with distinct notes when struck by worshippers.',
    detailedHistory: 'Started under Devaraya II and heavily enhanced during Krishnadevaraya (1513 CE). The Maha Mandapa is supported by 56 intricately carved acoustic pillars designed to emit distinct musical frequencies representing Indian classical percussion and bells.',
    historicalPeriod: 'Early 16th Century CE (1513 CE)',
    rulerAssociation: 'Devaraya II, Achyuta Deva Raya & Krishnadevaraya',
    architecturalStyle: 'High Vijayanagara Style with Acoustical Resonators',
    coordinates: [68, 30],
    worldPosition: [120, 0, 25],
    unlockRequirementText: 'Solve the Virupaksha architectural cipher.',
    unlockedByDefault: false,
    clueIds: ['clue_musical_notes', 'clue_stone_inscription'],
    puzzleId: 'puzzle_inscription',
    keyFeatures: [
      '56 Musical Sa-Re-Ga-Ma pillars in the Maha Mandapa',
      'Yali (mythical lion-elephant beast) balustrade pillars',
      'Deeply undercut ceiling rosettes and stone chains',
      'Sanctum facing the holy Tungabhadra river valley'
    ]
  },
  stone_chariot: {
    id: 'stone_chariot',
    name: 'The Stone Chariot (Kallina Ratha)',
    kannadaName: 'ಕಲ್ಲಿನ ರಥ',
    tagline: 'The iconic granite shrine of Garuda and royal secrets',
    description: 'One of the three great stone chariots of India, crafted from interlocking granite blocks disguised seamlessly as a monolithic carriage.',
    detailedHistory: 'Built inside the courtyard of Vitthala Temple, this chariot serves as a sanctum dedicated to Garuda, the celestial mount of Lord Vishnu. Its giant concentric stone wheels were engineered with real axles so they could once revolve freely. Royal folklore whispered that a hidden compartment locked with the Emperor’s 5 royal seals holds the secret decree.',
    historicalPeriod: 'c. 1516 CE',
    rulerAssociation: 'Emperor Krishnadevaraya',
    architecturalStyle: 'Monolithic Dravidian Granite Shrine on Wheels',
    coordinates: [76, 26],
    worldPosition: [160, 0, 20],
    unlockRequirementText: 'Decode the ancient inscription at Vitthala Temple.',
    unlockedByDefault: false,
    clueIds: ['clue_chariot_quadrant', 'clue_final_decree'],
    puzzleId: 'puzzle_stone_chariot',
    keyFeatures: [
      'Four sculpted stone wheels with floral medallion hubs',
      'Twin elephant guardians flanking the front ramparts',
      'Upper tiered Dravidian vimana tower silhouette',
      'Secret interlocking stone mechanical locking quadrant'
    ]
  },
  lotus_mahal: {
    id: 'lotus_mahal',
    name: 'Lotus Mahal (Kamal Mahal)',
    kannadaName: 'ಕಮಲ ಮಹಲ್',
    tagline: 'The symmetrical jewel of the Zenana Enclosure',
    description: 'A two-story secular pleasure palace harmonizing Vijayanagara stepped pyramidal rooflines with Islamic cusped archways.',
    detailedHistory: 'Constructed as an airy pavilion for the royal ladies of the court. The palace featured an ingenious ancient engineering cooling system: hollow pipelines in the walls pumped chilled water from subterranean tanks across stone channels to cool the summer heat.',
    historicalPeriod: '15th – 16th Century CE',
    rulerAssociation: 'Queen Tirumala Devi & Krishnadevaraya',
    architecturalStyle: 'Indo-Islamic Syncretic Royal Architecture',
    coordinates: [52, 78],
    worldPosition: [60, 0, 85],
    unlockRequirementText: 'Investigate the Royal Enclosure records.',
    unlockedByDefault: false,
    clueIds: ['clue_royal_canal_plans'],
    puzzleId: 'puzzle_timeline',
    keyFeatures: [
      'Multi-foliate recessed cusped arches',
      'Nine stepped pyramidal towers evoking lotus petals',
      'Subterranean terracotta conduit air-conditioning system',
      'Surrounding watchtowers and elephant stables'
    ]
  },
  royal_enclosure: {
    id: 'royal_enclosure',
    name: 'Royal Enclosure & Mahanavami Dibba',
    kannadaName: 'ರಾಜ ಆವರಣ',
    tagline: 'Seat of imperial power and royal decree archives',
    description: 'The fortified administrative hub containing the ceremonial Mahanavami Dibba platform, public baths, and the King’s subterranean audience hall.',
    detailedHistory: 'Spread over 59,000 square meters. The three-tiered Mahanavami Dibba was erected after Krishnadevaraya’s military triumph over Udayagiri in 1513 CE. Carved panels show foreign emissaries, royal horsemen, dancers, and the royal insignia depicting the Boar (Varaha), Dagger, and Sun.',
    historicalPeriod: '14th – 16th Century CE',
    rulerAssociation: 'King Krishnadevaraya & Rama Raya',
    architecturalStyle: 'Granite Stepped Platform with Intaglio Relief Carvings',
    coordinates: [45, 88],
    worldPosition: [10, 0, 110],
    unlockRequirementText: 'Unearth the Emperor’s Timeline clue.',
    unlockedByDefault: false,
    clueIds: ['clue_boar_emblem'],
    puzzleId: 'puzzle_timeline',
    keyFeatures: [
      'Mahanavami Dibba tiered granite ceremonial victory throne',
      'Subterranean secret council chamber',
      'Aqueduct-fed geometric Stepped Tank (Pushkarani)',
      'Relief carvings depicting Arabian horses and Chinese traders'
    ]
  }
};
