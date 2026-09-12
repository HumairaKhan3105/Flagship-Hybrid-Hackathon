# ANVESHAM cinematic heritage experience

## Goal
Transform the unfinished home page into a focused, playable-looking Indian heritage entrance shaped directly by the supplied film: sunrise gold, rose sandstone, river mist, carved gateways, handwoven textiles, and the final Ashoka-wheel reveal.

## What will be built

### 1. One-time cinematic opening
- Present the supplied film edge-to-edge on the first visit, muted and inline, with no visible player frame or controls.
- Add a discreet skip control and a short ANVESHAM reveal timed near the film’s ending.
- Crossfade naturally from the film into the matching front-page scene.
- Remember completion on the visitor’s device so the full opening does not repeat on later visits.
- Respect reduced-motion preferences by bypassing the full sequence.

### 2. Immersive ANVESHAM front page
- Build a full-viewport temple-valley entrance using the film itself as a subtle, slow ambient layer, with a still fallback for performance.
- Lead with **ANVESHAM**, “Explore India’s Timeless Heritage,” and one **Enter the Journey** action.
- Use restrained drifting dust, warm sun shafts, gentle depth movement, and cursor parallax derived from the film rather than generic effects.
- Keep navigation minimal: brand, Explore, and sound control.

### 3. Rotating Satyamev Jayate emblem
- Create a polished antique-gold Lion Capital emblem with “सत्यमेव जयते” as a transparent visual asset.
- Place it prominently in the opening scene as a dimensional, continuously rotating medallion with light glints and layered depth.
- Make motion slower or static for visitors who prefer reduced motion.

### 4. Six exploration paths
- Create exactly six cinematic paths: Festivals, Foods, Traditional Clothes, Historical & Famous Places, Musical Instruments, and Art & Craft.
- Reuse the existing category artwork in a clean, responsive gallery with subtle tilt, light sweep, depth, and click feedback.
- Opening a path reveals focused heritage information and a short quiz without leaving the atmosphere of the experience.
- Each quiz gives immediate feedback and a simple completion state; no dashboard, inventory system, or complicated progression.

### 5. Finish and verify
- Replace the starter page at `/` and add complete ANVESHAM page metadata.
- Adapt the global colors, surfaces, typography, and animation timing to the supplied film.
- Store the uploaded film as a fast CDN asset rather than committing the large binary to the project.
- Check the experience at desktop and mobile sizes, including intro playback, skip/transition behavior, all six paths, quiz feedback, reduced motion, and page health.

## Technical details
- React/TanStack Start route at `/`, Motion for transitions and parallax, and semantic Tailwind design tokens.
- Persistent `localStorage` flag only for the one-time intro preference; heritage content and quiz state remain lightweight in-page state.
- Native `<video>` with `playsInline`, `muted`, preload controls, poster fallback, and graceful autoplay failure handling.
- CSS perspective layers around the emblem to create convincing 3D rotation without loading a heavy 3D engine.
