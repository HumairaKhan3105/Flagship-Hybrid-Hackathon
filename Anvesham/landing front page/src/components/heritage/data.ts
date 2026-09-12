import festivalsImg from "@/assets/sec-festivals.jpg";
import clothingImg from "@/assets/sec-clothing.jpg";
import placesImg from "@/assets/sec-places.jpg";
import musicImg from "@/assets/sec-music.jpg";
import artImg from "@/assets/sec-art.jpg";
import manuscriptImg from "@/assets/manuscript.jpg";

export type WorldItem = {
  name: string;
  region: string;
  blurb: string;
  icon: string;
  locked?: boolean;
};

export type World = {
  id: string;
  eyebrow: string;
  title: string;
  icon: string;
  intro: string;
  image: string;
  companion: string;
  motif: "ember" | "steam" | "wind" | "dust" | "notes" | "ink";
  items: WorldItem[];
};

export const REGIONS = [
  {
    id: "rajasthan",
    name: "Rajasthan",
    icon: "🏰",
    tag: "Forts & Royal Heritage",
    fact: "Kumbhalgarh's wall runs 36 km — second only to the Great Wall.",
    x: 26,
    y: 33,
  },
  {
    id: "uttar-pradesh",
    name: "Uttar Pradesh",
    icon: "🛕",
    tag: "Ancient Civilization",
    fact: "Varanasi has been continuously inhabited for over 3,000 years.",
    x: 45,
    y: 34,
  },
  {
    id: "kashmir",
    name: "Kashmir",
    icon: "🏔",
    tag: "Culture & Landscapes",
    fact: "Pashmina wool is hand-spun from Changthangi goats at 4,500 m.",
    x: 27,
    y: 12,
  },
  {
    id: "gujarat",
    name: "Gujarat",
    icon: "🎨",
    tag: "Art & Crafts",
    fact: "Patan Patola double-ikat silk can take a year to weave.",
    x: 19,
    y: 47,
  },
  {
    id: "west-bengal",
    name: "West Bengal",
    icon: "🎭",
    tag: "Art & Festivals",
    fact: "Durga Puja in Kolkata is recognised by UNESCO as living heritage.",
    x: 66,
    y: 43,
  },
  {
    id: "kerala",
    name: "Kerala",
    icon: "🌊",
    tag: "Traditions & Festivals",
    fact: "Kathakali performers train their eye muscles for years.",
    x: 33,
    y: 82,
  },
  {
    id: "tamil-nadu",
    name: "Tamil Nadu",
    icon: "🌴",
    tag: "Temples & Classical Culture",
    fact: "The Brihadeeswarar temple tower was raised without mortar in 1010 CE.",
    x: 42,
    y: 84,
  },
] as const;

export const WORLDS: World[] = [
  {
    id: "festivals",
    eyebrow: "Path 01",
    title: "Festivals of Light",
    icon: "🎉",
    intro: "Lamps are lit, colours fly, drums answer. Step into the celebration of Diwali, Holi, and ancient traditions.",
    image: festivalsImg,
    companion: "Your explorer joins the rangoli circle, diya in hand.",
    motif: "ember",
    items: [
      {
        name: "Diwali",
        region: "Pan-India",
        blurb: "Rows of clay diyas mark the return of light over darkness.",
        icon: "🪔",
      },
      {
        name: "Holi",
        region: "North India",
        blurb: "Gulal clouds, water drums and the arrival of spring.",
        icon: "🌈",
      },
      {
        name: "Navratri",
        region: "Gujarat",
        blurb: "Nine nights of garba circles spinning until dawn.",
        icon: "💃",
      },
      {
        name: "Durga Puja",
        region: "West Bengal",
        blurb: "Artisan pandals become temporary temples of clay and craft.",
        icon: "🎭",
      },
      {
        name: "Onam",
        region: "Kerala",
        blurb: "Flower carpets, snake boats and the harvest feast.",
        icon: "🌺",
      },
      {
        name: "Pongal",
        region: "Tamil Nadu",
        blurb: "The first rice boils over — a thanksgiving to the sun.",
        icon: "🌾",
      },
    ],
  },
  {
    id: "clothing",
    eyebrow: "Path 02",
    title: "Woven Identities",
    icon: "👘",
    intro: "Six yards, one drape, a thousand dialects of cloth. Journey through Banarasi brocades and royal looms.",
    image: clothingImg,
    companion: "Your explorer studies a loom, threads catching the wind.",
    motif: "wind",
    items: [
      {
        name: "Saree",
        region: "Pan-India",
        blurb: "Unstitched drape worn for over two millennia.",
        icon: "🥻",
      },
      {
        name: "Dhoti",
        region: "Pan-India",
        blurb: "Knotted cotton length, the classical everyday garment.",
        icon: "🧵",
      },
      {
        name: "Sherwani",
        region: "North India",
        blurb: "Courtly long coat of the Mughal-era wardrobe.",
        icon: "🤵",
      },
      { name: "Kurta", region: "Pan-India", blurb: "The loose tunic of poets and pilgrims.", icon: "👕" },
      {
        name: "Lehenga",
        region: "Rajasthan",
        blurb: "Flared skirt heavy with mirror and zari work.",
        icon: "👗",
      },
      {
        name: "Mekhela Chador",
        region: "Assam",
        blurb: "Two-piece muga silk woven on Assamese looms.",
        icon: "🪡",
      },
      {
        name: "Phiran",
        region: "Kashmir",
        blurb: "Long wool robe built for valley winters.",
        icon: "🧥",
      },
      { name: "Mundu", region: "Kerala", blurb: "Crisp white cotton with a golden kasavu border.", icon: "🤍" },
    ],
  },
  {
    id: "art",
    eyebrow: "Path 03",
    title: "Hands That Paint",
    icon: "🎨",
    intro: "Folk traditions passed hand to hand, wall to wall, generation on. Madhubani, Warli, and sacred craft.",
    image: artImg,
    companion: "Your explorer grinds pigment and begins to paint.",
    motif: "ink",
    items: [
      { name: "Madhubani", region: "Bihar", blurb: "Fish, lotus and sun filled edge-to-edge.", icon: "🐟" },
      { name: "Warli", region: "Maharashtra", blurb: "White triangles dancing on mud walls.", icon: "🔺" },
      { name: "Pattachitra", region: "Odisha", blurb: "Cloth scrolls painted with natural pigment.", icon: "📜" },
      { name: "Kalamkari", region: "Andhra Pradesh", blurb: "Pen-drawn epics dyed with myrobalan.", icon: "🖊" },
      { name: "Phulkari", region: "Punjab", blurb: "Flower-work darned from the reverse side.", icon: "🌸" },
      { name: "Blue Pottery", region: "Jaipur", blurb: "Turquoise glaze fired at low heat.", icon: "🏺" },
      { name: "Chikankari", region: "Lucknow", blurb: "Shadow-work whitening cotton like mist.", icon: "🪷" },
      { name: "Dhokra", region: "Chhattisgarh", blurb: "Lost-wax brass casting, 4,000 years old.", icon: "🥉" },
    ],
  },
  {
    id: "music",
    eyebrow: "Path 04",
    title: "Instruments of Memory",
    icon: "🎵",
    intro: "Ragas were memorised long before they were written. Resonant acoustics of Sitar, Tabla, and Veena.",
    image: musicImg,
    companion: "Your explorer taps a tabla — notes drift up like sparks.",
    motif: "notes",
    items: [
      { name: "Tabla", region: "North India", blurb: "Paired drums with a tuned black syahi eye.", icon: "🪘" },
      { name: "Sitar", region: "North India", blurb: "Sympathetic strings that hum on their own.", icon: "🎸" },
      { name: "Veena", region: "South India", blurb: "Carved from a single jackfruit trunk.", icon: "🪕" },
      { name: "Bansuri", region: "Pan-India", blurb: "One bamboo tube, breath and seven holes.", icon: "🎶" },
      { name: "Sarod", region: "North India", blurb: "Fretless steel fingerboard, deep and glassy.", icon: "🎻" },
      { name: "Shehnai", region: "North India", blurb: "The double-reed voice of weddings and dawn.", icon: "📯" },
      { name: "Mridangam", region: "Tamil Nadu", blurb: "The percussive spine of Carnatic concerts.", icon: "🥁" },
    ],
  },
  {
    id: "places",
    eyebrow: "Path 05",
    title: "Lost Locations — Hampi",
    icon: "🏰",
    intro: "A 3D historical mystery exploring ancient Vijayanagara, decoding temple inscriptions, and the Stone Chariot.",
    image: placesImg,
    companion: "Your explorer scales a fort wall, lantern swinging.",
    motif: "dust",
    items: [
      { name: "Stone Chariot", region: "Karnataka", blurb: "Iconic stone monument dedicated to Garuda in Vittala temple.", icon: "🛞" },
      { name: "Virupaksha Temple", region: "Karnataka", blurb: "Continuously active pilgrimage shrine by the Tungabhadra.", icon: "🛕" },
      { name: "Lotus Mahal", region: "Karnataka", blurb: "Indo-Islamic royal pavilion with lotus bud arches.", icon: "🪷" },
      { name: "Elephant Stables", region: "Karnataka", blurb: "Domed chambers for the royal elephants of the empire.", icon: "🐘" },
    ],
  },
  {
    id: "nalanda",
    eyebrow: "Path 06",
    title: "Nalanda University",
    icon: "📚",
    intro: "Step into the 5th-century global seat of learning, solve ancient puzzles, and recover the lost manuscript.",
    image: manuscriptImg,
    companion: "Your explorer decodes an ancient palm leaf manuscript.",
    motif: "ink",
    items: [
      { name: "Dharmaganja", region: "Bihar", blurb: "The legendary multi-storey library that housed sacred wisdom.", icon: "🏛️" },
      { name: "Aryabhata Hall", region: "Ancient India", blurb: "Where ancient mathematics, zero, and astronomy flourished.", icon: "📐" },
      { name: "Xuanzang Courtyard", region: "Silk Route", blurb: "Named after the pilgrim who brought manuscripts across Asia.", icon: "📜" },
      { name: "Seal of Nalanda", region: "Magadha", blurb: "Emblem of wheel and deer symbolising universal knowledge.", icon: "🪙" },
    ],
  },
];

export const RELICS = [
  { icon: "📜", fact: "Nalanda's library, Dharmaganja, is said to have burned for months." },
  { icon: "🏺", fact: "Harappan potters used a standardised kiln temperature over 1000°C." },
  { icon: "🪔", fact: "Diya wicks were traditionally twisted from raw cotton by hand." },
  { icon: "🪙", fact: "Punch-marked coins circulated in India from the 6th century BCE." },
  { icon: "🗡️", fact: "Wootz steel from South India became the legendary Damascus blade." },
  { icon: "🎨", fact: "Ajanta painters bound pigment with plant gum and animal glue." },
  { icon: "🎵", fact: "The Natya Shastra codified performance arts around 200 BCE." },
  { icon: "🌸", fact: "Lotus motifs appear on nearly every ancient Indian monument." },
  { icon: "🪶", fact: "Palm-leaf manuscripts were incised with a stylus, then inked with soot." },
  { icon: "📚", fact: "Takshashila taught 64 disciplines, from archery to astronomy." },
];
