export interface LearningStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  tips: string[];
}

export interface LearnInstrumentItem {
  id: string;
  name: string;
  hindiName: string;
  family: 'Sushira (Wind)' | 'Tata (String)' | 'Avanaddha (Percussion)' | 'Ghana (Idiophone)';
  difficulty: 'Beginner Friendly' | 'Intermediate' | 'Mastery Level';
  image: string;
  summary: string;
  youtubeUrl: string;
  youtubeEmbedId: string;
  videoTitle: string;
  audioSoundType: 'bansuri' | 'tabla' | 'sitar' | 'shehnai' | 'veena' | 'mridangam' | 'dholak' | 'sarangi';
  ragaOrScale: string;
  steps: LearningStep[];
  commonMistakes: string[];
  dailyRiyazRoutine: string;
}

export const LEARN_TO_PLAY_INSTRUMENTS: LearnInstrumentItem[] = [
  {
    id: 'learn-bansuri',
    name: 'Bansuri',
    hindiName: 'बांसुरी',
    family: 'Sushira (Wind)',
    difficulty: 'Beginner Friendly',
    image: '/images/instruments/bansuri.jpg',
    summary: 'The hollow bamboo flute of Lord Krishna. Learn the foundational embouchure, breathing columns, and first clear notes without mechanical reeds.',
    youtubeUrl: 'https://www.youtube.com/watch?v=Fj2F7eXg0u8',
    youtubeEmbedId: 'Fj2F7eXg0u8',
    videoTitle: 'Bansuri Lesson 1: How to Produce the First Sound & Proper Lip Position',
    audioSoundType: 'bansuri',
    ragaOrScale: 'Raga Yaman / Bilawal Thaat',
    steps: [
      {
        stepNumber: 1,
        title: 'Embouchure & Lip Formation (Mukharandhra)',
        subtitle: 'Shape your lips like a natural, relaxed smile',
        description: 'Place the blowing hole just below your lower lip line. Roll the flute inward slightly until one-third of the blowing hole is covered by your lower lip. Blow a focused, narrow stream of air across the outer sharp edge of the hole, not directly inside it.',
        tips: [
          'Think of blowing over a narrow soda bottle to make a whistle tone.',
          'Keep your shoulders and throat completely loose; avoid puffing cheeks.',
        ],
      },
      {
        stepNumber: 2,
        title: 'Holding Posture & Finger Pad Placement',
        subtitle: 'Use the fleshy pads of your fingers, never fingertips',
        description: 'Hold the flute at a 45-degree angle pointing to your right. Place the pads of your index, middle, and ring fingers of both hands flat over the tone holes. Finger pads seal the holes completely without causing hand cramps.',
        tips: [
          'Left hand covers the upper 3 holes; right hand covers the lower 3 holes.',
          'Support the flute underside with your right thumb and left index base.',
        ],
      },
      {
        stepNumber: 3,
        title: 'Producing the First Note: Pa (पंचम)',
        subtitle: 'Close the upper three holes and release the rest',
        description: 'With holes 1, 2, and 3 closed by your upper hand, gently blow to produce the steady tone "Pa". Focus on maintaining a clean, unwavering pitch for 8 to 10 seconds per breath.',
        tips: [
          'If the sound is airy or hissing, rotate the flute millimeter by millimeter.',
          'Start with a medium blowing pressure to avoid jumping into overtones.',
        ],
      },
      {
        stepNumber: 4,
        title: 'Descending to Sa (षड्ज) & Basic Alankars',
        subtitle: 'Gradually cover the lower holes one by one',
        description: 'Close hole 4 (Ma), hole 5 (Ga), and hole 6 (Re) to arrive at the foundational root note "Sa" where all 6 holes are closed. Practice descending and ascending the pure notes: Sa - Re - Ga - Ma - Pa - Dha - Ni - Sa.',
        tips: [
          'Check for air leaks at the lowest hole (Re/Sa) using a mirror.',
          'Breathe deeply from the diaphragm, not shallowly from the chest.',
        ],
      },
      {
        stepNumber: 5,
        title: 'Microtonal Glides (Meend) & Half-Hole Technique',
        subtitle: 'Smoothly slide fingers across the curved surface',
        description: 'Indian classical expression relies on Meend (continuous glides). Gradually slide or roll the finger off half the hole to produce Komal (flat) swaras like Komal Re and Komal Ga.',
        tips: [
          'Avoid lifting fingers abruptly; glide horizontally.',
          'Listen closely to a tanpura drone to tune each microtone.',
        ],
      },
    ],
    commonMistakes: [
      'Blowing directly into the hole like a trumpet rather than across the edge.',
      'Using fingertips instead of flat finger pads, causing tiny air leaks.',
      'Tensing the jaw or breathing with shallow chest movements.',
    ],
    dailyRiyazRoutine: '15 mins long-tone sustain on Sa and Pa + 15 mins ascending/descending Bilawal Alankars + 10 mins Meend sliding practice.',
  },
  {
    id: 'learn-tabla',
    name: 'Tabla',
    hindiName: 'तबला',
    family: 'Avanaddha (Percussion)',
    difficulty: 'Intermediate',
    image: '/images/instruments/tabla.jpg',
    summary: 'The iconic twin drums of Hindustani rhythm. Master the fundamental finger strokes (Bols) on the resonant Dayan and modulating bass Bayan.',
    youtubeUrl: 'https://www.youtube.com/watch?v=F_Yw4xH4wR4',
    youtubeEmbedId: 'F_Yw4xH4wR4',
    videoTitle: 'Tabla Basics: Sitting Posture and First Bols (Na, Tin, Ge, Ke)',
    audioSoundType: 'tabla',
    ragaOrScale: 'Teentaal (16 Beats Cycle)',
    steps: [
      {
        stepNumber: 1,
        title: 'Seating & Drum Orientation',
        subtitle: 'Position the Bira cushions for stable balance',
        description: 'Sit in cross-legged Sukhasana. Place the Bayan (larger metal/clay bass drum) on your left and the Dayan (smaller wooden treble drum) on your right. Tilt both drums slightly forward away from your body at a 15-degree angle.',
        tips: [
          'Your forearms should rest naturally parallel to the floor.',
          'Keep wrists elevated slightly above the rim of the drum.',
        ],
      },
      {
        stepNumber: 2,
        title: 'Right Hand Dayan Strokes: "Na" & "Tin"',
        subtitle: 'The ringing chime of the outer rim (Chanti)',
        description: 'Anchor your ring finger lightly at the edge of the black Syahi paste as a pivot. Strike the outer parchment rim (Chanti) with the edge of your index finger and bounce off instantly to produce the resonant "Na" (or "Ta"). Strike the inner Sur ring to produce "Tin".',
        tips: [
          'Let your index finger snap like a relaxed whip.',
          'Never leave the finger glued to the rim; instant bounce is essential.',
        ],
      },
      {
        stepNumber: 3,
        title: 'Left Hand Bayan Strokes: "Ge" & "Ke"',
        subtitle: 'Bass resonance and sliding pitch modulation',
        description: 'Rest the heel of your left palm midway between the center and edge of the Bayan. Strike with the tips of your index and middle fingers in the open area to produce the booming "Ge". Slap the flat palm flat down to damp the sound for "Ke".',
        tips: [
          'Slide the wrist heel forward immediately after striking "Ge" to bend the pitch.',
          '"Ke" is an unvoiced, dry slap that controls tempo.',
        ],
      },
      {
        stepNumber: 4,
        title: 'Combined Compound Bols: "Dha" & "Dhin"',
        subtitle: 'Merging left and right hands in unison',
        description: 'Play "Na" (Right Hand) + "Ge" (Left Hand) simultaneously to create the signature full-bodied bol "Dha". Play "Tin" (Right) + "Ge" (Left) simultaneously to produce "Dhin".',
        tips: [
          'Both hands must strike at the exact microsecond without flamming.',
          'Maintain equal volume balance between bass and treble.',
        ],
      },
      {
        stepNumber: 5,
        title: 'The Master Rhythmic Cycle: Teentaal (16 Beats)',
        subtitle: 'Dha Dhin Dhin Dha | Dha Dhin Dhin Dha | Dha Tin Tin Ta | Ta Dhin Dhin Dha',
        description: 'Practice reciting the bols with hand claps (Taali on beats 1, 5, 13) and wave (Khaali on beat 9) before playing on the drums. Repeat smoothly at 60 BPM.',
        tips: [
          'Recite the bols out loud with clear pronunciation while playing.',
          'Always emphasize the first beat (Sam) with extra clarity.',
        ],
      },
    ],
    commonMistakes: [
      'Lifting the pivot ring finger entirely off the Dayan head.',
      'Hitting the black Syahi with brute force rather than relaxed wrist snap.',
      'Allowing the Bayan wrist to stay stiff, eliminating bass pitch bending.',
    ],
    dailyRiyazRoutine: '20 mins Ti-Re-Ki-Ta finger dexterity drills + 15 mins Teentaal Theka practice with metronome + 10 mins Tihai patterns.',
  },
  {
    id: 'learn-sitar',
    name: 'Sitar',
    hindiName: 'सितार',
    family: 'Tata (String)',
    difficulty: 'Intermediate',
    image: '/images/instruments/sitar.jpg',
    summary: 'The majestic plucked lute made famous by Pandit Ravi Shankar. Discover the wire Mizrab plectrum, sympathetic string resonance, and vocal string-pulling (Meend).',
    youtubeUrl: 'https://www.youtube.com/watch?v=0wQ7tXkK52I',
    youtubeEmbedId: '0wQ7tXkK52I',
    videoTitle: 'Sitar Tutorial for Beginners: Holding the Instrument, Mizrab & Stroke Technique',
    audioSoundType: 'sitar',
    ragaOrScale: 'Raga Yaman (Kalyan Thaat)',
    steps: [
      {
        stepNumber: 1,
        title: 'Sitting Posture & Instrument Balance',
        subtitle: 'Resting the main tumba on the left foot arch',
        description: 'Sit cross-legged with your left foot tucked beneath your right thigh. The main rounded gourd (Tumba) rests securely in the hollow arch of your left foot. The neck extends upward across your chest at roughly 45 degrees, balanced with zero left-hand weight.',
        tips: [
          'Your left hand must move freely up and down the neck without holding the weight.',
          'Wear comfortable loose clothing so the gourd does not slip.',
        ],
      },
      {
        stepNumber: 2,
        title: 'Wearing the Mizrab (Wire Plectrum)',
        subtitle: 'Fitted snugly on the right index finger',
        description: 'Slip the wire Mizrab over the tip of your right index finger so the striking point protrudes about 4mm beyond the fingernail. It should feel firm but not restrict blood circulation.',
        tips: [
          'Rest your right forearm gently on the upper curve of the tumba.',
          'Keep the right thumb anchored against the lower edge of the fingerboard.',
        ],
      },
      {
        stepNumber: 3,
        title: 'The Two Core Strokes: "Da" & "Ra"',
        subtitle: 'Inward stroke and outward stroke motion',
        description: 'Pluck the main Baj Tar (first steel string) inward toward your body with an index finger stroke to produce "Da". Pluck outward with the back of the mizrab to produce "Ra". Combining them produces "Dir" (Da-Ra in rapid succession).',
        tips: [
          'Strike with a clean, crisp stroke near the bridge (Javari) for maximum shimmer.',
          'Let the wrist remain relaxed while the index finger pivots.',
        ],
      },
      {
        stepNumber: 4,
        title: 'Fret Placement on the Baj Tar',
        subtitle: 'Pressing firmly behind the curved brass frets',
        description: 'Use the index and middle fingers of your left hand to press the string down right behind the curved metal frets (Parda). Practice clean single notes: Sa - Re - Ga - Ma - Pa - Dha - Ni - Sa.',
        tips: [
          'Press directly with the fingertips; calluses will naturally form in 2 weeks.',
          'Hear the sympathetic strings underneath start to chime automatically.',
        ],
      },
      {
        stepNumber: 5,
        title: 'The Art of Meend (String Pulling)',
        subtitle: 'Pulling the string sideways to bend pitch by 2 to 4 notes',
        description: 'Keep your left index finger firmly pressing the fret for "Ga" and pull the string downward across the curved fret towards your body. The tension raises the pitch smoothly to "Ma", "Pa", or even "Dha", creating a continuous vocal glide.',
        tips: [
          'Pull smoothly with forearm support, keeping the string from catching on fret ends.',
          'Listen intently to land accurately on the target microtone.',
        ],
      },
    ],
    commonMistakes: [
      'Supporting the heavy weight of the neck with the left hand, locking finger movement.',
      'Plucking the string too far up the neck where the sound becomes dull and muddy.',
      'Bending the string diagonally instead of pulling perpendicularly across the fret.',
    ],
    dailyRiyazRoutine: '15 mins slow Da-Ra strokes on open strings + 20 mins scale ascending/descending with Tanpura + 15 mins single-fret Meend pitch bending.',
  },
  {
    id: 'learn-veena',
    name: 'Saraswati Veena',
    hindiName: 'सरस्वती वीणा',
    family: 'Tata (String)',
    difficulty: 'Mastery Level',
    image: '/images/instruments/veena.jpg',
    summary: 'The ancient mother of South Indian strings, sacred to Goddess Saraswati. Master the 24 brass frets embedded in beeswax and simultaneous rhythm strokes on the talam strings.',
    youtubeUrl: 'https://www.youtube.com/watch?v=kY6TfT92sQI',
    youtubeEmbedId: 'kY6TfT92sQI',
    videoTitle: 'Saraswati Veena Basics: Posture, Meetu Plectrums, and Sarali Varisai',
    audioSoundType: 'veena',
    ragaOrScale: 'Raga Mayamalavagowla (Carnatic)',
    steps: [
      {
        stepNumber: 1,
        title: 'Seating & Kudam Alignment',
        subtitle: 'Padmasana seating with the jackwood resonator',
        description: 'Sit in half or full lotus posture. Place the large resonator (Kudam) on your right side touching your right thigh. Rest the secondary upper gourd (Yali neck end) lightly on your left thigh.',
        tips: [
          'Maintain an upright spine; do not hunch over the fingerboard.',
          'The brass frets should face directly upward toward your eyes.',
        ],
      },
      {
        stepNumber: 2,
        title: 'Wearing Finger Plectrums (Meetu)',
        subtitle: 'Index, middle, and little finger assignments',
        description: 'Fit curved metal plectrums (Meetu) on the index and middle fingers of your right hand for plucking the 4 main melody strings downwards. The little finger plucks the 3 side Talam strings upwards.',
        tips: [
          'Alternate between index and middle fingers for speed and clarity.',
          'The little finger upward stroke keeps the rhythmic heartbeat (Tala).',
        ],
      },
      {
        stepNumber: 3,
        title: 'Left Hand Fingering Across the 24 Frets',
        subtitle: 'Two-finger slide technique across brass bars',
        description: 'Press the melody strings using the index and middle fingers of your left hand. The frets are permanently tuned to two complete octaves in beeswax.',
        tips: [
          'Do not press down into the wax grooves; press firmly against the brass ridge.',
          'Keep fingers close to the frets to prevent unwanted buzzing.',
        ],
      },
      {
        stepNumber: 4,
        title: 'Carnatic Sarali Varisai Exercises',
        subtitle: 'Practicing in the fundamental Raga Mayamalavagowla',
        description: 'Play the foundational Carnatic exercises: Sa Pa Sa / Sa Re Ga Ma Pa Dha Ni Sa in Mayamalavagowla. Strike the Talam drone strings in sync with the rhythm count.',
        tips: [
          'Coordinate the right hand melody pluck with the little finger rhythm tap.',
          'Begin at slow tempo (Prathama Kala) before doubling speed.',
        ],
      },
      {
        stepNumber: 5,
        title: 'Gamaka Ornamentation (Kampita & Nokku)',
        subtitle: 'The soul of Carnatic expression',
        description: 'Unlike Western fretboards where notes are static, Veena frets are wide enough to oscillate the string horizontally and vertically (Kampita Gamaka) to create fluid vocal curves.',
        tips: [
          'Oscillate with wrist rotation rather than finger muscle strain.',
          'Every swara in Carnatic music has a specific prescribed gamaka contour.',
        ],
      },
    ],
    commonMistakes: [
      'Hitting the Talam rhythm strings at the wrong beat subdivision.',
      'Allowing fingernails to scrape against the beeswax fret bed.',
      'Playing gamakas without maintaining clean intonation against the root drone.',
    ],
    dailyRiyazRoutine: '20 mins Sarali & Janta Varisai in 3 speeds + 15 mins Talam string coordination + 15 mins Raga Mayamalavagowla Alapana phrasing.',
  },
  {
    id: 'learn-dholak',
    name: 'Dholak',
    hindiName: 'ढोलक',
    family: 'Avanaddha (Percussion)',
    difficulty: 'Beginner Friendly',
    image: '/images/instruments/dholak.jpg',
    summary: 'The beloved folk drum of Indian celebrations, weddings, and folk festivities. Learn the bass slap and high-treble rim strokes of the energetic Keherwa groove.',
    youtubeUrl: 'https://www.youtube.com/watch?v=JmU7bL2K23A',
    youtubeEmbedId: 'JmU7bL2K23A',
    videoTitle: 'Easy Dholak Lesson: Basic Keherwa Taal Pattern for Beginners',
    audioSoundType: 'dholak',
    ragaOrScale: 'Keherwa Taal (8 Beats Folk Rhythm)',
    steps: [
      {
        stepNumber: 1,
        title: 'Holding Position & Lap Balance',
        subtitle: 'Resting horizontally across your crossed legs',
        description: 'Sit cross-legged and place the Dholak horizontally across your lap. The larger bass head (Bayan) faces your left, and the smaller treble head (Dayan) faces your right.',
        tips: [
          'Rest your left forearm comfortably over the drum shell for stability.',
          'If sitting on a chair, secure the drum with a cloth strap across your foot.',
        ],
      },
      {
        stepNumber: 2,
        title: 'Bass Head Technique: Open "Ghe" and Closed "Ke"',
        subtitle: 'Producing the warm, round folk bass thump',
        description: 'Strike the bass head with the four fingers of your left hand near the center and release immediately for a warm booming "Ghe". Slap the flat palm firmly against the skin and hold it there for a muted, dry "Ke".',
        tips: [
          'The internal tar paste on the bass head adds rich lower sub-frequencies.',
          'Keep your left wrist loose to avoid fatigue.',
        ],
      },
      {
        stepNumber: 3,
        title: 'Treble Head Technique: Sharp "Taa" & "Ti"',
        subtitle: 'The crisp rim crack of folk music',
        description: 'Strike the outer edge of the treble head with your right index finger for a bright ringing "Taa". Tap the center with your middle/ring fingers for the softer muted note "Ti".',
        tips: [
          'Snap from the wrist like bouncing a small ball off the drum face.',
          'Never push through the drum head; let the momentum rebound.',
        ],
      },
      {
        stepNumber: 4,
        title: 'The Essential 8-Beat Keherwa Taal Pattern',
        subtitle: 'Dha Ge Na Tin | Na Ke Dhin Na',
        description: 'Count 1 - 2 - 3 - 4 | 5 - 6 - 7 - 8. Beats 1 and 2 feature the resonant open bass, while beat 5 uses the closed muted slap to create the syncopated swing of Indian folk songs.',
        tips: [
          'Practice slowly with a steady foot tap before increasing tempo.',
          'Emphasize the swing between beats 3 and 4.',
        ],
      },
      {
        stepNumber: 5,
        title: 'Laggi & Accelerando (Tihai Finishes)',
        subtitle: 'Rapid double-time variations to conclude songs',
        description: 'Learn the rapid double-time pattern: Dha-Ti-Ti-Dha / Dha-Ti-Ti-Dha. Play it 3 times to create a classic musical Tihai landing cleanly on the Sam (Beat 1).',
        tips: [
          'Maintain steady volume without rushing as tempo speeds up.',
          'Smile and stay relaxed; folk music thrives on joy and bounce.',
        ],
      },
    ],
    commonMistakes: [
      'Slapping with stiff fingers, which deadens the skin and tires the wrists.',
      'Playing the bass and treble heads out of sync on compound beats.',
      'Ignoring the distinction between open bass (Ghe) and closed bass (Ke).',
    ],
    dailyRiyazRoutine: '10 mins single-stroke wrist warmups + 20 mins continuous Keherwa groove at steady 80 BPM + 10 mins fast Laggi variation.',
  },
  {
    id: 'learn-shehnai',
    name: 'Shehnai',
    hindiName: 'शहनाई',
    family: 'Sushira (Wind)',
    difficulty: 'Mastery Level',
    image: '/images/instruments/shehnai.jpg',
    summary: 'The auspicious mangal vadya that sanctifies Indian ceremonies. Master the delicate quadruple reed, intense breath pressure, and vocal microtones.',
    youtubeUrl: 'https://www.youtube.com/watch?v=F0f1zWj7rWk',
    youtubeEmbedId: 'F0f1zWj7rWk',
    videoTitle: 'Shehnai Masterclass: Reed Preparation, Lip Pressure, and Swara Production',
    audioSoundType: 'shehnai',
    ragaOrScale: 'Raga Bhairav / Mangal Dhun',
    steps: [
      {
        stepNumber: 1,
        title: 'Conditioning the Quadruple Reed (Patti)',
        subtitle: 'Soaking the delicate cane blades in water',
        description: 'Before playing, dip the small cane reed in lukewarm water for 1 to 2 minutes until the four blades soften and become supple. Gently test the crow sound by blowing into the detached reed.',
        tips: [
          'Never blow into a dry, brittle reed as it will crack instantly.',
          'Adjust the fine wire binding to set the optimal blade aperture.',
        ],
      },
      {
        stepNumber: 2,
        title: 'Lip Formation & Controlled Embouchure',
        subtitle: 'Enclosing the reed without pinching the blades shut',
        description: 'Roll your lips slightly inward over your teeth to form a firm, airtight cushion around the staple brass tube. Apply even circular lip pressure around the reed without biting.',
        tips: [
          'The sound requires substantially higher breath pressure than a western flute.',
          'Engage the core abdominal muscles to sustain continuous air flow.',
        ],
      },
      {
        stepNumber: 3,
        title: 'Finger Covering on the Conical Bore',
        subtitle: 'Covering tone holes with flat finger segments',
        description: 'Hold the wooden conical tube at a downward 45-degree angle. Use the first joints of your fingers to seal the 7 to 9 tone holes cleanly.',
        tips: [
          'The flared brass bell at the base projects sound outward to the audience.',
          'Keep finger lifts minimal (within 1 cm of the wood).',
        ],
      },
      {
        stepNumber: 4,
        title: 'Microtonal Pitch Bending with Lip Pressure',
        subtitle: 'Shifting pitch by adjusting embouchure tension',
        description: 'Unlike key-driven woodwinds, the Shehnai player changes pitch by as much as a minor third purely by modulating lip pressure against the reed blades.',
        tips: [
          'Tightening the lips raises the pitch; loosening drops it smoothly into Komal swaras.',
          'Practice matching the pitch of a harmonium or tanpura drone.',
        ],
      },
      {
        stepNumber: 5,
        title: 'Playing the Auspicious Mangal Dhun',
        subtitle: 'The timeless celebratory wedding melody',
        description: 'Learn the soaring, joyful phrases of the traditional wedding Mangal Dhun in Raga Bilawal, celebrated across Indian royal courts and temple festivals.',
        tips: [
          'Infuse each phrase with rapid ornamental tremolo (Murki).',
          'Coordinate breaths at natural pause points in the melodic line.',
        ],
      },
    ],
    commonMistakes: [
      'Biting the reed shut with the teeth, preventing sound production.',
      'Allowing air to escape from the corners of the mouth due to weak lip seal.',
      'Playing without sufficient diaphragm support, resulting in unstable pitch.',
    ],
    dailyRiyazRoutine: '15 mins reed buzzing & long-tone pitch stabilization + 20 mins Raga Bhairav scale work + 15 mins wedding dhun phrasing.',
  },
  {
    id: 'learn-mridangam',
    name: 'Mridangam',
    hindiName: 'मृदंगम',
    family: 'Avanaddha (Percussion)',
    difficulty: 'Mastery Level',
    image: '/images/instruments/mridangam.jpg',
    summary: 'The primary rhythm instrument of Carnatic classical music. Master the four foundational syllables (Tha Dhi Thom Nam) and semolina paste tuning.',
    youtubeUrl: 'https://www.youtube.com/watch?v=7yCq8dO22_s',
    youtubeEmbedId: '7yCq8dO22_s',
    videoTitle: 'Mridangam Basics: Tha Dhi Thom Nam Strokes and Adi Tala',
    audioSoundType: 'mridangam',
    ragaOrScale: 'Adi Tala (8 Beats Carnatic)',
    steps: [
      {
        stepNumber: 1,
        title: 'Seating Posture & Leg Cradling',
        subtitle: 'Resting the barrel across the right ankle',
        description: 'Sit in Ardha Padmasana. The narrow right head (Valanthalai) rests over your right ankle, while the wider left head (Thoppi) rests on the floor beside your left knee.',
        tips: [
          'Tilt the drum slightly forward for comfortable wrist access.',
          'Keep your back straight and shoulders level.',
        ],
      },
      {
        stepNumber: 2,
        title: 'Applying the Semolina (Rava) Paste on Thoppi',
        subtitle: 'Tuning the left bass head before every session',
        description: 'Mix a small pinch of semolina (rava) with water into a pliable dough. Apply it in a circular ring at the center of the left drum head (Thoppi) to lower the pitch to a deep resonant hum matching the drone.',
        tips: [
          'Remove the paste immediately after practice so it does not dry into the leather.',
          'Test the tone by tapping lightly with your left thumb.',
        ],
      },
      {
        stepNumber: 3,
        title: 'The Four Fundamental Syllables: Tha, Dhi, Thom, Nam',
        subtitle: 'The building blocks of Carnatic rhythm',
        description: '• Tha: Flat strike with four fingers of left hand.\n• Dhi: Middle, ring, and little fingers strike the black central Karanai.\n• Thom: Open resonant stroke on left bass head.\n• Nam: Crisp index finger strike on outer rim while ring finger anchors.',
        tips: [
          'Vocalize the syllables (Konnakol) out loud as you play each stroke.',
          'Keep fingers together as a single unit when playing "Tha" and "Dhi".',
        ],
      },
      {
        stepNumber: 4,
        title: 'Adi Tala 8-Beat Metric Cycle',
        subtitle: '1 Laghu (4 counts) + 2 Dhrithams (2 counts each)',
        description: 'Practice the classic Adi Tala structure: Clap - little - ring - middle | Clap - wave | Clap - wave. Play the matching strokes: Tha Dhi Thom Nam / Tha Dhi Thom Nam.',
        tips: [
          'Keep a precise, unwavering tempo without speeding up.',
          'Practice in 1st speed (Vilamba) then double speed (Madhyama).',
        ],
      },
      {
        stepNumber: 5,
        title: 'Korvai & Moras (Rhythmic Cadences)',
        subtitle: 'Mathematical rhythm compositions landing on the Samam',
        description: 'Construct a structured Korvai with purvangam (theme) and uttarangam (thrice-repeated tihai cadence) that lands triumphantly on beat 1 of the song.',
        tips: [
          'Count the mathematical subdivisions (Gatis: 4, 3, 5, 7, 9) accurately.',
          'Coordinate closely with the vocalist’s lyrical phrases.',
        ],
      },
    ],
    commonMistakes: [
      'Leaving the semolina paste on the leather after practice, ruining the skin.',
      'Hitting the black Karanai with rigid fingers, causing painful bruised knuckles.',
      'Failing to anchor the ring finger properly while executing the "Nam" stroke.',
    ],
    dailyRiyazRoutine: '20 mins Tha-Dhi-Thom-Nam syllable precision + 15 mins Adi Tala speed doubling exercises + 15 mins Korvai calculation.',
  },
  {
    id: 'learn-santoor',
    name: 'Santoor',
    hindiName: 'संतूर',
    family: 'Tata (String)',
    difficulty: 'Intermediate',
    image: '/images/instruments/santoor.jpg',
    summary: 'The 100-string hammered dulcimer from the misty valleys of Kashmir. Learn how to hold the delicate walnut mallets (Mezrab) and strike melodic cascades.',
    youtubeUrl: 'https://www.youtube.com/watch?v=k_jH2wP0vWc',
    youtubeEmbedId: 'k_jH2wP0vWc',
    videoTitle: 'Santoor Beginner Guide: Holding the Mezrab Mallets and Striking Notes',
    audioSoundType: 'sitar',
    ragaOrScale: 'Raga Bhupali (Pentatonic)',
    steps: [
      {
        stepNumber: 1,
        title: 'Lap Positioning & Instrument Angle',
        subtitle: 'Resting the trapezoidal walnut soundbox on your lap',
        description: 'Sit cross-legged and rest the Santoor directly in your lap. The wider base rests near your knees, and the narrower side points away toward the front.',
        tips: [
          'Ensure the instrument is steady and does not rock during fast strikes.',
          'Keep your back comfortably straight with elbows resting easily beside your ribcage.',
        ],
      },
      {
        stepNumber: 2,
        title: 'Holding the Walnut Mezrab Mallets',
        subtitle: 'Light grip between index and middle fingers',
        description: 'Grasp the curved wooden mallets between your index and middle fingers with your thumb providing gentle stabilization. Never hold them tightly with a clenched fist; the mallets must pivot like delicate seesaws.',
        tips: [
          'The curved striking tips should face downward toward the strings.',
          'All striking force comes from the elastic flick of the wrists.',
        ],
      },
      {
        stepNumber: 3,
        title: 'Striking String Courses for Clear Notes',
        subtitle: 'Bouncing the mallet cleanly off the brass and steel wires',
        description: 'Each pitch consists of 4 unison strings resting on a wooden bridge. Strike the grouping of 4 strings cleanly and allow the mallet to rebound instantly to prevent buzzing.',
        tips: [
          'Never press down on the strings with the mallet after striking.',
          'Aim within 1 inch of the wooden bridge for the clearest harmonic bloom.',
        ],
      },
      {
        stepNumber: 4,
        title: 'Playing the Pentatonic Scale (Raga Bhupali)',
        subtitle: 'Sa - Re - Ga - Pa - Dha - Sa',
        description: 'Map the five swaras of Raga Bhupali across the left and right bridge rows. Alternate left and right mallets in a smooth, flowing sequence.',
        tips: [
          'Keep mallet heights equal for both hands to achieve balanced volume.',
          'Listen for the ethereal sustained resonance of the open box.',
        ],
      },
      {
        stepNumber: 5,
        title: 'Fast Tremolo (Jhala) & Meend Simulation',
        subtitle: 'Rapid alternating strikes and mallet gliding',
        description: 'Execute rapid alternating strikes (right-left-right-left) on a single note to create a sustained shimmering singing tone. Lightly slide the smooth wooden back of the mallet across the string to simulate vocal Meend glides.',
        tips: [
          'Stay light on your wrists to sustain high speed without muscle cramping.',
          'Gradually accelerate from slow tempo to crescendo.',
        ],
      },
    ],
    commonMistakes: [
      'Gripping the mallets too tightly, which creates dull clacking sounds.',
      'Striking only 2 of the 4 unison strings in a course, producing a thin tone.',
      'Allowing the mallet to bounce multiple accidental times on the wire.',
    ],
    dailyRiyazRoutine: '15 mins alternating mallet wrist bounces on open strings + 20 mins Raga Bhupali scalar patterns + 15 mins rapid Jhala tremolo endurance.',
  },
  {
    id: 'learn-ghatam',
    name: 'Ghatam',
    hindiName: 'घटम',
    family: 'Ghana (Idiophone)',
    difficulty: 'Intermediate',
    image: '/images/instruments/ghatam.jpg',
    summary: 'The ancient earthen clay pot baked with metallic brass dust. Learn finger ring strikes, wrist chops, and abdomen bass-compression (Gumki).',
    youtubeUrl: 'https://www.youtube.com/watch?v=Fj2F7eXg0u8',
    youtubeEmbedId: 'Fj2F7eXg0u8',
    videoTitle: 'Ghatam Tutorial: Hand Positions, Neck Strikes and Gumki Bass Resonance',
    audioSoundType: 'tabla',
    ragaOrScale: 'Mishra Chapu / Adi Tala',
    steps: [
      {
        stepNumber: 1,
        title: 'Seating & Belly Bracing Position',
        subtitle: 'Resting the pot mouth directly against your abdomen',
        description: 'Sit cross-legged and place the Ghatam in your lap with its open mouth facing toward your stomach. Press the rim gently against your bare or thin-shirted belly.',
        tips: [
          'The pot is held firmly in place by your thighs and abdomen.',
          'Your hands remain completely free to strike the neck and belly.',
        ],
      },
      {
        stepNumber: 2,
        title: 'The Gumki Bass Resonance Effect',
        subtitle: 'Modulating air inside the pot with belly pressure',
        description: 'Strike the clay body with the flat palm while simultaneously pushing your stomach into the mouth opening or pulling it away. This changes the internal air cavity volume, creating an unmistakable deep popping bass "Gumki" sound.',
        tips: [
          'Practice moving your abdominal wall in rhythm with your palm strikes.',
          'Adjust the contact angle to maximize the bass punch.',
        ],
      },
      {
        stepNumber: 3,
        title: 'Neck and Rim Strikes (Sharp Tones)',
        subtitle: 'Using the knuckles, finger rings, and wrist base',
        description: 'Strike the thick clay rim of the mouth with your index and middle fingers to produce bright ringing metallic pings. The brass shavings baked into the clay give it an idiophonic bell resonance.',
        tips: [
          'Wear a silver or copper ring on your finger for crisp traditional accents.',
          'Strike with a snappy, percussive motion.',
        ],
      },
      {
        stepNumber: 4,
        title: 'Executing Fast Rhythm Solos (Tani Avartanam)',
        subtitle: 'Interlocking patterns with Carnatic Mridangam',
        description: 'Learn to play fast syncopated syllables: Ta-Ka-Dhi-Mi / Ta-Ki-Ta. Alternate between the heavy belly bass and crisp neck strikes to match the primary drummer.',
        tips: [
          'Recite the Konnakol rhythms out loud before playing.',
          'Keep your strikes light and bouncy to avoid wrist fatigue.',
        ],
      },
      {
        stepNumber: 5,
        title: 'Spinning & Pitch Variations',
        subtitle: 'Rotating the pot during performance',
        description: 'Advanced performers rotate the Ghatam mid-performance to strike different wall thicknesses, eliciting subtle pitch variations and dazzling visual flair.',
        tips: [
          'Ensure a secure grip before attempting mid-air pot spins.',
          'Maintain rhythmic continuity throughout the visual motion.',
        ],
      },
    ],
    commonMistakes: [
      'Holding the pot too loosely, causing it to wobble during heavy strikes.',
      'Neglecting the belly seal, which eliminates the signature deep bass gumki tone.',
      'Hitting with excessive force instead of relaxed, snappy finger velocity.',
    ],
    dailyRiyazRoutine: '15 mins belly gumki coordination exercises + 20 mins Konnakol finger mapping on rim + 15 mins fast Chapu rhythm cycles.',
  },
];
