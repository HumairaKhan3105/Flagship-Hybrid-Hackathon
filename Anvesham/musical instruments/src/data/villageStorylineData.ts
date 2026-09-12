export interface MusicianCharacter {
  id: string;
  name: string;
  hindiName: string;
  honorific: string;
  role: string;
  instrumentSlug: string;
  instrumentName: string;
  instrumentHindiName: string;
  family:
    | 'Tata (Chordophone)'
    | 'Sushira (Aerophone)'
    | 'Avanaddha (Membranophone)'
    | 'Ghana (Idiophone)'
    | 'Avanaddha & Ghana'
    | 'Tata (Bowed Chordophone)';
  zoneName: string;
  position: [number, number, number]; // [x, y, z] in Three.js coordinates
  color: string;
  turbanColor: string;
  vestColor: string;
  storyChapter: number;
  questTitle: string;
  questObjective: string;
  dialogueIntro: string;
  dialogueTeaching: string;
  dialogueHistory: string;
  dialogueTechnique: string;
  ragaOrTaal: string;
  audioSampleType: 'bansuri' | 'tabla' | 'sitar' | 'shehnai' | 'veena' | 'mridangam' | 'dholak' | 'sarangi';
  culturalTrivia: string;
  question: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  sealReward: string;
}

export interface VillageLandmark {
  id: string;
  name: string;
  hindiName: string;
  description: string;
  position: [number, number, number];
  color: string;
  type: 'tree' | 'ghat' | 'baithak' | 'mandap' | 'temple' | 'workshop' | 'firepit' | 'pavilion';
}

export const VILLAGE_LANDMARKS: VillageLandmark[] = [
  {
    id: 'banyan-choupal',
    name: 'The Great Banyan Choupal',
    hindiName: 'विशाल बरगद चौपाल',
    description: 'A 300-year-old sacred banyan tree with an octagonal stone platform where village elders and visiting ustads gather for evening baithaks.',
    position: [0, 0, 0],
    color: '#3f6212',
    type: 'tree',
  },
  {
    id: 'river-ghat',
    name: 'Saraswati River Ghat',
    hindiName: 'सरस्वती नदी घाट',
    description: 'Carved sandstone steps descending into peaceful waters with floating lotus flowers and morning prayer bells.',
    position: [-24, 0, -18],
    color: '#0284c7',
    type: 'ghat',
  },
  {
    id: 'heritage-baithak',
    name: 'Haveli Heritage Baithak',
    hindiName: 'हवेली बैठक',
    description: 'An open-air veranda with traditional wooden columns, Persian carpets, and bolsters where rhythmic masters practice.',
    position: [20, 0, -14],
    color: '#b45309',
    type: 'baithak',
  },
  {
    id: 'festive-mandap',
    name: 'Shehnai Celebration Mandap',
    hindiName: 'उत्सव मंडप',
    description: 'A decorated canopy adorned with fresh marigold garlands (genda phool) and brass lamps for auspicious celebrations.',
    position: [22, 0, 18],
    color: '#d97706',
    type: 'mandap',
  },
  {
    id: 'temple-sanctum',
    name: 'Nada Mandir Sanctum',
    hindiName: 'नाद मंदिर प्रांगण',
    description: 'Ancient stone temple dedicated to the cosmic sound (Nada Brahma) where divine Carnatic melodies resonate.',
    position: [-18, 0, 20],
    color: '#e11d48',
    type: 'temple',
  },
  {
    id: 'luthier-workshop',
    name: 'Master Craftsman Luthier Workshop',
    hindiName: 'शिल्पकार कार्यशाला',
    description: 'Rustic wooden workshop filled with seasoning Tun wood, dried bottle gourds, animal parchment, and resonant bridge bone.',
    position: [2, 0, -28],
    color: '#78350f',
    type: 'workshop',
  },
  {
    id: 'choupal-firepit',
    name: 'Folk Campfire Choupal',
    hindiName: 'लोक संगीत अलाव',
    description: 'Earthen circular arena where village folk storytellers and wandering minstrels play energetic dholak and khartal beats under stars.',
    position: [-28, 0, 0],
    color: '#ea580c',
    type: 'firepit',
  },
  {
    id: 'south-pavilion',
    name: 'Carnatic Rhythm Pavilion',
    hindiName: 'लय मंडप',
    description: 'Pillared stone pavilion with geometric granite flooring designed specifically for acoustic clarity of Mridangam solkattu.',
    position: [0, 0, 26],
    color: '#4f46e5',
    type: 'pavilion',
  },
];

export const VILLAGE_MUSICIANS: MusicianCharacter[] = [
  {
    id: 'musician-bansuri',
    name: 'Devi Radha',
    hindiName: 'देवी राधा',
    honorific: 'Venu Vidushi',
    role: 'Flute Custodian of the River Ghat',
    instrumentSlug: 'bansuri',
    instrumentName: 'Bansuri',
    instrumentHindiName: 'बांसुरी',
    family: 'Sushira (Aerophone)',
    zoneName: 'Saraswati River Ghat',
    position: [-22, 0, -16],
    color: '#0284c7',
    turbanColor: '#38bdf8',
    vestColor: '#0369a1',
    storyChapter: 1,
    questTitle: 'The Breath of the Holy Reeds',
    questObjective: 'Walk to the river ghat on the northwest path and speak with Devi Radha.',
    dialogueIntro: 'Namaste, traveler. You step lightly upon these stone ghats. Listen closely—do you hear how the river breeze sings when caught in the hollow bamboo reeds?',
    dialogueTeaching: 'The Bansuri is one of humanity’s oldest instruments, referenced in the Rigveda as Venu or Nadi. It has no mechanical reeds or keys—it is pure human breath and bamboo nodes. To coax a true Madhyam or Pancham swara, you do not force the air; you let your prana (life breath) become one with the reed.',
    dialogueHistory: 'Lord Krishna made the flute immortal across the forests of Vrindavan. In modern classical music, legends like Pt. Pannalal Ghosh and Pt. Hariprasad Chaurasia elevated this pastoral folk pipe to the grandeur of midnight ragas.',
    dialogueTechnique: 'Our flutes are carved from special Assam bamboo seasoned over years. By covering half of a finger hole (kan-swara), we can bend pitches microtonally, producing the deep meend (glides) essential to Indian ragas.',
    ragaOrTaal: 'Raga Bhupali (Pentatonic peace)',
    audioSampleType: 'bansuri',
    culturalTrivia: 'Traditional bamboo flutes have 6 or 7 finger holes and are chosen to match the musician’s natural vocal range.',
    question: {
      prompt: 'In the ancient Natya Shastra, what classification does the Bansuri belong to?',
      options: ['Tata (Chordophone)', 'Sushira (Aerophone)', 'Avanaddha (Membranophone)', 'Ghana (Idiophone)'],
      correctIndex: 1,
      explanation: 'Sushira refers to wind/aerophone instruments where sound is generated through vibrating columns of air.',
    },
    sealReward: 'Seal of Sushira (Breath of Vayu)',
  },
  {
    id: 'musician-tabla',
    name: 'Ustad Zakir Khan',
    hindiName: 'उस्ताद ज़ाकिर ख़ान',
    honorific: 'Taal Samrat',
    role: 'Rhythm Master of the Haveli',
    instrumentSlug: 'tabla',
    instrumentName: 'Tabla (Dayan & Bayan)',
    instrumentHindiName: 'तबला',
    family: 'Avanaddha (Membranophone)',
    zoneName: 'Haveli Heritage Baithak',
    position: [18, 0, -12],
    color: '#b45309',
    turbanColor: '#f59e0b',
    vestColor: '#92400e',
    storyChapter: 2,
    questTitle: 'The Cosmic Heartbeat of Clay & Iron',
    questObjective: 'Travel northeast to the Haveli Baithak veranda to learn the language of Tabla bols.',
    dialogueIntro: 'Aadab! Welcome to our baithak. You arrive right as we conclude our morning riyaz (practice). Come, sit upon the carpet and feel the floor vibrate with Teentaal!',
    dialogueTeaching: 'The Tabla speaks a complete human language. When we play "Dha Dhin Dhin Dha", we are reciting poetry. The right drum (Dayan) is tuned to a precise musical pitch (often Sa), while the left metal or clay drum (Bayan) produces deep, expressive bass modulations with the wrist.',
    dialogueHistory: 'Tradition attributes the birth of Tabla to the 13th-century polymath Amir Khusrau, who divided the ancient Pakhawaj barrel drum into two vessels for greater agility in Hindustani classical khayal.',
    dialogueTechnique: 'Look at the black circular paste on each head—that is the Syahi (or Gab). It is crafted from iron filings, soot, and cooked rice starch. This black center gives the Indian drum its signature bell-like harmonic overtones, unlike any Western drum!',
    ragaOrTaal: 'Teentaal (16 Beats, 4 Vibhags)',
    audioSampleType: 'tabla',
    culturalTrivia: 'The black Syahi paste must be layered and rubbed with a smooth agate stone hundreds of times to achieve harmonic purity.',
    question: {
      prompt: 'What produces the clear bell-like pitch and metallic overtones on the Tabla drumhead?',
      options: ['Synthetic nylon coating', 'The Syahi (black iron-starch paste)', 'Brass tuning pins', 'Stretched goat tendons'],
      correctIndex: 1,
      explanation: 'The Syahi (gab), made from iron filings and starch paste, adds weight to suppress non-harmonic frequencies and produce pure musical tones.',
    },
    sealReward: 'Seal of Avanaddha (Pulse of Prithvi)',
  },
  {
    id: 'musician-sitar',
    name: 'Pt. Ravi Das',
    hindiName: 'पंडित रवि दास',
    honorific: 'Sitar Ratna',
    role: 'Master of Ragas under the Great Banyan',
    instrumentSlug: 'sitar',
    instrumentName: 'Sitar',
    instrumentHindiName: 'सितार',
    family: 'Tata (Chordophone)',
    zoneName: 'The Great Banyan Choupal',
    position: [0, 0, 2],
    color: '#15803d',
    turbanColor: '#86efac',
    vestColor: '#166534',
    storyChapter: 3,
    questTitle: 'The Tree of Sympathetic Resonance',
    questObjective: 'Approach the center of the village beneath the sprawling Banyan tree platform.',
    dialogueIntro: 'Hari Om, seeker of swaras! Rest under the shade of this ancient banyan. Just as these aerial roots connect heaven to earth, the 20 strings of my sitar bridge the musician’s mind to infinity.',
    dialogueTeaching: 'The Sitar is celebrated for "meend"—the ability to pull a single string sideways across arched brass frets to play four or five notes continuously, imitating the emotive subtleties of the human singing voice (Gayaki Ang).',
    dialogueHistory: 'Evolving from ancient Veena and Persian Setar in the Mughal royal courts, masters like Ustad Vilayat Khan and Pt. Ravi Shankar took this sound from royal durbars to Woodstock and the world.',
    dialogueTechnique: 'Notice the lower strings beneath the main playing string—those are "Tarabdar" (sympathetic strings). When I pluck a note above, the matching string below vibrates entirely on its own without being touched! That creates the shimmering golden halo of sound you hear.',
    ragaOrTaal: 'Raga Yaman (Evening Peace & Devotion)',
    audioSampleType: 'sitar',
    culturalTrivia: 'The base of a traditional sitar is made from a dried, hand-hollowed Kaddu (bottle gourd) grown specially in regions like Pandharpur.',
    question: {
      prompt: 'What are the sympathetic strings located beneath the main frets of a Sitar called?',
      options: ['Chikari strings', 'Tarabdar strings', 'Jawari strings', 'Pakhawaj strings'],
      correctIndex: 1,
      explanation: 'Tarabdar (sympathetic) strings vibrate automatically through acoustic resonance when their corresponding notes are plucked on the main strings.',
    },
    sealReward: 'Seal of Tata (Resonance of Akasha)',
  },
  {
    id: 'musician-shehnai',
    name: 'Ustad Bismillah',
    hindiName: 'उस्ताद बिस्मिल्लाह',
    honorific: 'Mangal Dhwani Ustad',
    role: 'Auspicious Wind Master of the Mandap',
    instrumentSlug: 'shehnai',
    instrumentName: 'Shehnai',
    instrumentHindiName: 'शहनाई',
    family: 'Sushira (Aerophone)',
    zoneName: 'Shehnai Celebration Mandap',
    position: [20, 0, 16],
    color: '#c2410c',
    turbanColor: '#fdba74',
    vestColor: '#9a3412',
    storyChapter: 4,
    questTitle: 'Dawn’s Auspicious Celebration',
    questObjective: 'Head southeast toward the festive marigold-garlanded mandap.',
    dialogueIntro: 'Subhanallah! Smell the fresh marigolds and incense! Wherever joy, marriage, or royal procession takes place across the subcontinent, the Shehnai heralds the dawn.',
    dialogueTeaching: 'The Shehnai uses a quadruple reed made of seasoned river reed (Narkat). Because the player’s lips control the reed directly without a mechanical mouthpiece, it requires extraordinary circular breathing (dam sadhana) to maintain unbroken melody for hours.',
    dialogueHistory: 'Legend recounts that a court barber (Nai) improved the pungi pipe in the palace of the Shah—giving it the name Shah-Nai! Bharat Ratna Ustad Bismillah Khan brought the instrument from the temples of Varanasi to international concert halls.',
    dialogueTechnique: 'The flared brass bell at the bottom magnifies the high frequencies, allowing its sound to pierce through open festival air over miles.',
    ragaOrTaal: 'Raga Kafi & Chaiti Folk Melodies',
    audioSampleType: 'shehnai',
    culturalTrivia: 'Ustad Bismillah Khan famously called the River Ganga his greatest musical teacher and guru.',
    question: {
      prompt: 'Which master soloist was awarded India’s highest civilian honour (Bharat Ratna) for popularising the Shehnai globally?',
      options: ['Pt. Shivkumar Sharma', 'Ustad Bismillah Khan', 'Ustad Zakir Hussain', 'Pt. Hariprasad Chaurasia'],
      correctIndex: 1,
      explanation: 'Ustad Bismillah Khan was honoured with the Bharat Ratna in 2001 for his lifelong dedication to elevating the Shehnai to classical concert stature.',
    },
    sealReward: 'Seal of Mangala (The Auspicious Dawn)',
  },
  {
    id: 'musician-veena',
    name: 'Guru Ramanathan',
    hindiName: 'गुरु रामनाथन',
    honorific: 'Gana Kala Praveena',
    role: 'Divine Scholar of the Nada Mandir',
    instrumentSlug: 'saraswati-veena',
    instrumentName: 'Saraswati Veena',
    instrumentHindiName: 'सरस्वती वीणा',
    family: 'Tata (Chordophone)',
    zoneName: 'Nada Mandir Sanctum',
    position: [-16, 0, 18],
    color: '#be123c',
    turbanColor: '#fecdd3',
    vestColor: '#881337',
    storyChapter: 5,
    questTitle: 'The 24 Sacred Frets of Saraswati',
    questObjective: 'Walk southwest to the stone Nada Mandir courtyard.',
    dialogueIntro: 'Vanakkam. Step onto this sacred stone courtyard. In our southern tradition, music is not mere entertainment; it is Nada Yoga—the science of cosmic vibration.',
    dialogueTeaching: 'Look upon the 24 brass frets fixed with hard beeswax and charcoal paste onto the seasoned jackwood (Palamaram) neck. These 24 frets represent the 24 vertebrae of the human spine and the 24 syllables of the sacred Gayatri mantra.',
    dialogueHistory: 'Goddess Saraswati is revered as holding the Veena across Vedic iconography. The current Tanjore design was perfected during the reign of King Raghunatha Nayak of Thanjavur in the 17th century.',
    dialogueTechnique: 'Unlike the Hindustani sitar with movable curved frets, the Saraswati Veena frets are permanently fixed. Gamakas (ornamental oscillations) are produced by pressing deeply between frets or pulling horizontally across the bronze surface.',
    ragaOrTaal: 'Raga Mayamalavagowla & Kalyani',
    audioSampleType: 'veena',
    culturalTrivia: 'An "Ekanda Veena" is carved from a single solid trunk of Jackwood without separate joints between the resonator and neck.',
    question: {
      prompt: 'Which precious wood is traditionally favored in South India for carving the body of the Saraswati Veena?',
      options: ['Pine wood', 'Jackfruit wood (Palamaram)', 'Oak wood', 'Bamboo wood'],
      correctIndex: 1,
      explanation: 'Jackfruit wood (Palamaram) is revered in Thanjavur lutherie for its density, resistance to climate changes, and acoustic warmth.',
    },
    sealReward: 'Seal of Nada (Divine Wisdom)',
  },
  {
    id: 'musician-mridangam',
    name: 'Maestro Palghat',
    hindiName: 'उस्ताद पालघाट',
    honorific: 'Laya Vidwan',
    role: 'Master of Carnatic Percussion at the Pavilion',
    instrumentSlug: 'mridangam',
    instrumentName: 'Mridangam',
    instrumentHindiName: 'मृदंगम',
    family: 'Avanaddha (Membranophone)',
    zoneName: 'Carnatic Rhythm Pavilion',
    position: [0, 0, 24],
    color: '#4338ca',
    turbanColor: '#c7d2fe',
    vestColor: '#312e81',
    storyChapter: 6,
    questTitle: 'The Thumping Solkattu of the South',
    questObjective: 'Walk south to the pillared granite rhythm pavilion.',
    dialogueIntro: 'Welcome, young rasika! You hear the crisp syllables "Tha Dhi Thom Nam"? That is Solkattu—the ancient mathematical rhythm language of Carnatic concerts.',
    dialogueTeaching: 'The Mridangam is a single barrel-shaped drum carved from jackfruit or blackwood with two distinct leather heads. The right head (Valanthalai) is tuned precisely to the singer’s tonic pitch, while the left head (Thoppi) is dampened with fresh wet semolina (rava) paste to yield a deep, thunderous boom.',
    dialogueHistory: 'The name derives from "Mrid" (clay/earth) and "Anga" (body), indicating the earliest drums of Lord Nandi were made of fired clay before seasoned wood was adopted.',
    dialogueTechnique: 'Masters like Palghat Mani Iyer proved that a percussionist is not merely an accompanist, but a conversational partner who weaves spontaneous polyrhythms through complex Korvais and Mora cadences.',
    ragaOrTaal: 'Adi Tala (8 Beats / 32 Subdivisions)',
    audioSampleType: 'mridangam',
    culturalTrivia: 'Before every Carnatic concert, the percussionist applies moist dough to the left drumhead to calibrate the bass resonance for the room acoustics.',
    question: {
      prompt: 'What temporary substance is traditionally applied to the left head (Thoppi) of the Mridangam before playing to produce deep bass resonance?',
      options: ['Petroleum jelly', 'Moist semolina/wheat dough (rava paste)', 'Sand and wax', 'Melted rubber'],
      correctIndex: 1,
      explanation: 'Moist semolina or wheat flour dough is applied before the concert to lower the frequency of the skin, wiped clean after playing.',
    },
    sealReward: 'Seal of Tala (Mastery of Time Cycles)',
  },
  {
    id: 'musician-dholak',
    name: 'Kalu Ram Minstrel',
    hindiName: 'कालू राम लोकगायक',
    honorific: 'Lok Sangeet Shiromani',
    role: 'Folk Troupe Leader by the Campfire',
    instrumentSlug: 'dholak',
    instrumentName: 'Dholak & Khartal',
    instrumentHindiName: 'ढोलक और खड़ताल',
    family: 'Avanaddha & Ghana',
    zoneName: 'Folk Campfire Choupal',
    position: [-26, 0, 0],
    color: '#c2410c',
    turbanColor: '#fed7aa',
    vestColor: '#7c2d12',
    storyChapter: 7,
    questTitle: 'Desert Dust & Folk Festivity',
    questObjective: 'Walk west toward the earthen folk campfire arena.',
    dialogueIntro: 'Ram Ram sa! Pull up an earthen stool by our fire! While classical ustads debate intricate microtones, we sing the unfiltered joy, harvest celebrations, and desert romances of folk India!',
    dialogueTeaching: 'The Dholak is the soul of weddings, Qawwalis, and village fairs. Tied with rope-tension cords, the high treble head snaps with finger thimbles while the heavy bass head uses masala paste for an immediate, bouncy rhythm that gets an entire village dancing!',
    dialogueHistory: 'Paired with the wooden Khartal clappers of the Manganiyar desert bards, this music preserves centuries of oral history passed down by desert storytellers without a single written note.',
    dialogueTechnique: 'Folk percussion celebrates spontaneity. We swing between rapid Keherwa (8 beats) and Dadra (6 beats), matching the galloping pace of camels across Thar sand dunes.',
    ragaOrTaal: 'Keherwa Taal & Rajasthani Maand',
    audioSampleType: 'dholak',
    culturalTrivia: 'The Khartal is made from seasoned Sheesham rosewood and produces lightning-fast clatter mimicking galloping horses.',
    question: {
      prompt: 'Which famous hereditary desert music community of Rajasthan is renowned for their mastery over Khartal and Kamaicha?',
      options: ['Baul singers of Bengal', 'Manganiyar and Langa bards', 'Sufi Dervishes of Delhi', 'Pandavani singers of Chhattisgarh'],
      correctIndex: 1,
      explanation: 'The Manganiyars and Langas of the Thar desert are celebrated worldwide for their virtuosity on the Khartal, Dholak, and Kamaicha.',
    },
    sealReward: 'Seal of Loka (The Heart of Folk Heritage)',
  },
  {
    id: 'musician-luthier',
    name: 'Artisan Ramji',
    hindiName: 'शिल्पकार रामजी',
    honorific: 'Paramparik Shilpi',
    role: 'Master Instrument Maker at the Workshop',
    instrumentSlug: 'sarangi',
    instrumentName: 'Sarangi & Anatomy Craft',
    instrumentHindiName: 'सारंगी और शिल्प',
    family: 'Tata (Bowed Chordophone)',
    zoneName: 'Master Craftsman Luthier Workshop',
    position: [2, 0, -26],
    color: '#78350f',
    turbanColor: '#fde68a',
    vestColor: '#451a03',
    storyChapter: 8,
    questTitle: 'The Soul of Tun Wood and Resonant Strings',
    questObjective: 'Walk north behind the banyan tree into the woodcraft luthier workshop.',
    dialogueIntro: 'Pranam, traveler. Wipe the sawdust from your clothes and come inspect my workbench. People praise the musician on stage, but music is first born right here—in the scent of aged cedar and Tun wood.',
    dialogueTeaching: 'Look closely at this Sarangi. Its body is carved from a single solid block of Tun (red cedar) wood, hollowed out and covered with wet goat parchment. It has no frets—the player stops the three main gut strings with the cuticles of their fingernails!',
    dialogueHistory: 'The name Sarangi comes from "Sau Rangi"—meaning a hundred colors! For centuries it was the premier instrument to accompany vocalists because it can replicate every sigh, glissando, and inflection of human crying or joy.',
    dialogueTechnique: 'Inside this hollow neck run up to 35 sympathetic steel and brass strings. Tuning a Sarangi takes an entire lifetime of ear training. When tuned properly, touching one gut string creates a cathedral of natural reverberation.',
    ragaOrTaal: 'Raga Darbari Kanada & Bhairavi',
    audioSampleType: 'sarangi',
    culturalTrivia: 'Traditional Sarangi strings were made from sheep gut, requiring seasonal conditioning with natural oils to preserve acoustic warmth.',
    question: {
      prompt: 'What does the Hindi name "Sarangi" literally translate to in musical folklore?',
      options: ['Golden instrument', 'Sau Rangi (One hundred colors)', 'Voice of the forest', 'King of strings'],
      correctIndex: 1,
      explanation: 'Sarangi is derived from "Sau Rang" (a hundred colors), reflecting its supreme versatility in mimicking every nuance of human vocal music.',
    },
    sealReward: 'Seal of Shilpa (Mastery of Craft & Acoustics)',
  },
];
