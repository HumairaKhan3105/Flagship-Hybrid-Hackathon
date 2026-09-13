import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", game: "Vastra Yatra" });
});

// Culture Guide Companion AI endpoint
app.post("/api/culture-guide", async (req, res) => {
  const { garmentName, regionName, question, context } = req.body;

  try {
    const ai = getGeminiClient();

    if (!ai) {
      // Graceful fallback with rich authentic knowledge if API key is not yet set
      const defaultReplies: Record<string, string> = {
        "Banarasi Saree": "Banarasi sarees originate from the sacred ghats of Varanasi. Woven with pure mulberry silk and golden zari, they feature Persian-inspired floral 'Jal' and mango motifs perfected during the Mughal era.",
        "Kanchipuram Saree": "Hailing from Tamil Nadu's temple city, Kanchipuram sarees are famed for their heavy mulberry silk and contrasting borders joined with the intricate 'Korvai' interlocking technique.",
        "Paithani": "Known as the queen of Maharashtrian silks, Paithani sarees feature radiant golden borders with the signature 'Mor' (peacock) and lotus pallu, woven with kaleidoscopic silk threads.",
        "Bandhani": "Bandhani from Gujarat and Rajasthan is an ancient resist-dye craft dating back to the Indus Valley. Artisans tie thousands of tiny knots by hand before dyeing in auspicious red, yellow, and saffron.",
        "Phulkari": "Phulkari, meaning 'flower work', is Punjab's cherished folk embroidery. Spun on coarse khaddar cotton using unspun silk floss ('pat') from the reverse side, it represents love and celebration.",
        "Mekhela Chador": "The traditional two-piece attire of Assam, crafted from rare, naturally golden indigenous Muga silk that grows more lustrous with every wash and lasts generations.",
      };

      const reply = defaultReplies[garmentName] || 
        `${garmentName} from ${regionName || "India"} represents centuries of handloom craftsmanship, embodying sacred geometry, local ecology, and ceremonial pride.`;
      
      return res.json({
        reply,
        source: "curated_archive",
        guide: "Sahana"
      });
    }

    const prompt = `You are Sahana, an elegant and wise Indian cultural guide companion in the AAA game "VASTRA YATRA - Journey Through India's Heritage".
The player is inquiring about the traditional Indian garment "${garmentName || 'Traditional Indian Attire'}" from "${regionName || 'India'}".
Context: ${context || 'Garment discovery in game wardrobe'}.
Player Question/Prompt: "${question || 'Tell me the cultural significance, weaving technique, and why it is special.'}"

Guidelines for Sahana:
- Keep the response short, elegant, educational, and immersive (2 to 3 concise sentences max).
- Speak with warm grace and reverent cultural authenticity.
- Highlight the fabric material, ancient technique (e.g. Zari, Ikat, Brocade), or historical significance.
- Do NOT use modern tech jargon or breaking character. Speak as Sahana, the royal Indian textile explorer.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    const reply = response.text?.trim() || "Every thread of this sacred garment carries centuries of master weavers' devotion and imperial tradition.";

    return res.json({
      reply,
      source: "gemini_ai",
      guide: "Sahana"
    });
  } catch (error: any) {
    console.error("Gemini AI Culture Guide error:", error);
    return res.json({
      reply: `${garmentName} embodies the living artistic soul of ${regionName}. Its motifs and weave represent generations of artisanal mastery passed down from parent to child.`,
      source: "fallback_curated",
      guide: "Sahana"
    });
  }
});

async function startServer() {
  // Vite middleware in dev, static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vastra Yatra server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
