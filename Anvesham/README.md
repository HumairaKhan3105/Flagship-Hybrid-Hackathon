# ANVESHAM (अन्वेषणम्) — Explore India’s Timeless Heritage

ANVESHAM is an interactive, cinematic journey through India’s rich cultural tapestry: historical monuments, classical instruments, ancient universities, folk arts and crafts, traditional attire, and festival traditions.

---

## 🚀 Quick Start

### 1. Unified Master Application (Recommended)
Runs the complete Anvesham web platform with all integrated 3D interactive experiences, quizzes, maps, and audio:

```bash
# Run from the root directory:
npm run dev
```
Open **[http://localhost:8080](http://localhost:8080)** in your browser.

#### Available Routes in the Unified App:
- **Home / Landing Portal:** `/`
- **Lost Locations (Hampi & Monuments):** `/places`
- **Nalanda University:** `/nalanda`
- **Festivals of Light (Diwali):** `/festivals`
- **Hands That Paint (Indian Art & Craft):** `/art`
- **Instruments of Memory (Indian Classical Music):** `/music`
- **Woven Identities (Traditional Clothes):** `/clothing`

---

### 2. Standalone Sub-Applications
Each experience can also be executed independently if desired:

| Application | Command | Default URL |
| :--- | :--- | :--- |
| **All-in-One Portal** (`landing front page`) | `npm run dev` | `http://localhost:8080` |
| **Famous Places** (`famous places`) | `npm run dev:places` | `http://localhost:3000` |
| **Diwali & Festivals** (`festivals diwali`) | `npm run dev:festivals` | `http://localhost:3000` |
| **Nalanda University** (`historical and famous places nalanda university`) | `npm run dev:nalanda` | `http://localhost:3000` |
| **Indian Art & Craft** (`indian art and craft`) | `npm run dev:art` | `http://localhost:3000` |
| **Musical Instruments** (`musical instruments`) | `npm run dev:music` | `http://localhost:3000` |
| **Traditional Clothes** (`traditional clothes`) | `npm run dev:clothing` | `http://localhost:3000` |

---

## 🛠️ Building for Production

To create an optimized production build for the portal:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 📦 Project Architecture
- **Framework:** React 19, TanStack Start & Router, Vite
- **Styling:** Tailwind CSS, Framer Motion
- **3D Graphics & Canvas:** Three.js, Canvas Confetti
- **Audio & Sound:** Web Audio API sound engines
