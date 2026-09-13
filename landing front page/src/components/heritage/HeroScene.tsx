import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

import mountains from "@/assets/layer-mountains.jpg";
import temples from "@/assets/layer-temples.png";
import foreground from "@/assets/layer-foreground.png";
import explorer from "@/assets/explorer.png";
import { Embers } from "./Atmosphere";
import { useGame } from "@/lib/game-state";

const TITLE = "NALANDA MYSTERY".split("");

export function HeroScene() {
  const { discover, ping } = useGame();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const py = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });
  const { scrollYProgress } = useScroll();

  const camera = useTransform(scrollYProgress, [0, 0.16], [0, -160]);
  const zoom = useTransform(scrollYProgress, [0, 0.16], [1, 1.18]);
  const veil = useTransform(scrollYProgress, [0, 0.14], [0, 0.85]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  const layer = (depth: number) => ({
    x: useTransform(px, (v) => v * depth),
    y: useTransform(py, (v) => v * depth * 0.5),
  });

  const sky = layer(8);
  const hills = layer(22);
  const town = layer(46);
  const front = layer(88);

  return (
    <section id="home" className="relative h-[100svh] w-full overflow-hidden surface-dusk grain-overlay">
      <motion.div className="absolute inset-0" style={{ y: camera, scale: zoom }}>
        {/* sky glow */}
        <motion.div
          className="absolute inset-0"
          style={{
            ...sky,
            background:
              "radial-gradient(circle at 72% 26%, oklch(0.92 0.13 88 / 0.85) 0%, oklch(0.7 0.13 70 / 0.35) 22%, transparent 55%)",
          }}
        />
        {/* clouds */}
        <motion.div className="absolute inset-x-0 top-0 h-2/3" style={hills} aria-hidden>
          {[12, 38, 64, 84].map((left, i) => (
            <motion.div
              key={left}
              className="absolute rounded-full bg-parchment/20 blur-2xl"
              style={{ left: `${left}%`, top: `${8 + i * 9}%`, width: 260 + i * 70, height: 70 + i * 14 }}
              animate={{ x: [0, 60, 0] }}
              transition={{ duration: 34 + i * 9, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </motion.div>

        <motion.img
          src={mountains}
          alt="Golden mountain valley of the Indian Himalaya at sunrise"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover opacity-90"
          style={hills}
        />

        {/* birds */}
        <motion.div className="absolute left-[18%] top-[26%] text-foreground/50" style={town} aria-hidden>
          <motion.div
            animate={{ x: [0, 420, 840], y: [0, -26, 8], opacity: [0, 1, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="flex gap-4 text-sm"
          >
            <span>𓅯</span>
            <span className="mt-3">𓅯</span>
            <span className="mt-1">𓅯</span>
          </motion.div>
        </motion.div>

        <motion.img
          src={temples}
          alt="Silhouettes of ancient Indian temple spires and fort walls"
          width={1920}
          height={1088}
          className="absolute bottom-[16%] left-1/2 w-[130%] max-w-none -translate-x-1/2 opacity-95"
          style={town}
        />

        <motion.img
          src={foreground}
          alt="Dark silhouettes of ruined stone pillars and lotus plants"
          width={1920}
          height={720}
          className="absolute -bottom-6 left-1/2 w-[135%] max-w-none -translate-x-1/2"
          style={front}
        />
      </motion.div>

      <Embers count={30} />

      {/* fog */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/70 to-transparent" />

      {/* explorer character */}
      <motion.div
        className="absolute bottom-[7%] left-[8%] z-20 w-28 sm:w-36 lg:w-44"
        style={front}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [-1, 1.4, -1] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={explorer}
            alt="The Heritage Explorer, a lantern-carrying traveller"
            width={640}
            height={1024}
            className="animate-breathe w-full drop-shadow-[0_18px_28px_oklch(0.1_0.02_50/0.8)]"
          />
        </motion.div>
        <div className="mt-1 h-3 w-full rounded-[100%] bg-black/45 blur-md" />
      </motion.div>

      {/* title block */}
      <div className="relative z-30 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.05em" }}
          animate={{ opacity: 1, letterSpacing: "0.42em" }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="font-body text-[0.65rem] uppercase text-primary/85 sm:text-xs"
        >
          Heritage Explorer • Chapter Zero
        </motion.p>

        <h1 className="relative mt-4 flex flex-wrap justify-center text-4xl leading-none sm:text-6xl lg:text-8xl">
          <span className="sr-only">Nalanda Mystery</span>
          {TITLE.map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="text-gold-gradient inline-block"
              initial={{ opacity: 0, y: 34, rotateX: -90, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.35 + i * 0.055, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          ))}
          <motion.span
            aria-hidden
            className="animate-shimmer pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-parchment/35 to-transparent"
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.9 }}
          className="font-title mt-3 text-xl text-parchment sm:text-3xl"
        >
          The Lost Manuscript
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base"
        >
          A Journey Through India's Heritage — explore India, discover its history, unlock its
          culture.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.9 }}
          className="mt-9 flex flex-col items-center gap-4 sm:flex-row"
        >
          <QuestButton
            onClick={() => {
              discover("quest-started", { xp: 50, label: "+50 XP", detail: "The journey begins." });
              document.getElementById("map")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            ⚔ BEGIN YOUR JOURNEY
          </QuestButton>
          <button
            onPointerEnter={() => ping("hover")}
            onClick={() => document.getElementById("map")?.scrollIntoView({ behavior: "smooth" })}
            className="group relative rounded-sm border border-primary/45 px-6 py-3 font-display text-[0.7rem] uppercase tracking-[0.28em] text-primary/90 transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:text-primary"
          >
            Explore India
          </button>
        </motion.div>
      </div>

      <motion.div className="pointer-events-none absolute inset-0 z-40 bg-background" style={{ opacity: veil }} />

      <motion.div
        className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 text-[0.6rem] uppercase tracking-[0.3em] text-primary/60"
        animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        scroll to travel
      </motion.div>
    </section>
  );
}

export function QuestButton({
  children,
  onClick,
  size = "lg",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  size?: "lg" | "md";
}) {
  const { ping } = useGame();
  return (
    <motion.button
      onClick={() => {
        ping("click");
        onClick?.();
      }}
      onPointerEnter={() => ping("hover")}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      animate={{ y: [0, -5, 0] }}
      transition={{ y: { duration: 3.4, repeat: Infinity, ease: "easeInOut" } }}
      className={`animate-pulse-glow group relative overflow-hidden rounded-sm border border-primary/70 font-display uppercase tracking-[0.2em] text-primary-foreground ${
        size === "lg" ? "px-8 py-4 text-sm sm:text-base" : "px-6 py-3 text-xs"
      }`}
      style={{ background: "var(--gradient-gold)" }}
    >
      <span className="relative z-10 drop-shadow-sm">{children}</span>
      <span className="animate-shimmer absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <span className="absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(circle at center, oklch(1 0 0 / 0.4), transparent 70%)" }} />
    </motion.button>
  );
}
