import { AnimatePresence, motion, useMotionValue, useSpring, animate } from "motion/react";
import { useEffect, useState } from "react";

import { GAME_TOTALS, useGame } from "@/lib/game-state";

const NAV = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "map", label: "Map", icon: "🗺️" },
  { id: "festivals", label: "Culture", icon: "🏺" },
  { id: "places", label: "History", icon: "🏰" },
  { id: "collection", label: "Collection", icon: "🎒" },
  { id: "manuscript", label: "Manuscript", icon: "📜" },
];

function Counter({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, mv]);
  return <>{shown}</>;
}

export function GameHud() {
  const { xp, discoveries, fragments, soundOn, toggleSound, toasts, ping } = useGame();
  const [active, setActive] = useState("home");

  useEffect(() => {
    const ids = NAV.map((n) => n.id);
    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { threshold: [0.25, 0.5] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const progress = Math.min(100, (discoveries.length / GAME_TOTALS.discoveries) * 100);

  return (
    <>
      {/* player panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.1, duration: 0.8 }}
        className="panel-carved fixed left-3 top-3 z-50 hidden w-56 rounded-md p-3 sm:block"
      >
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-primary/60 text-sm">
            🧭
          </span>
          <div>
            <p className="font-display text-[0.62rem] uppercase tracking-[0.2em] text-primary">
              Heritage Explorer
            </p>
            <p className="text-[0.6rem] text-muted-foreground">Level {1 + Math.floor(xp / 120)}</p>
          </div>
        </div>
        <div className="mt-3 space-y-1.5 font-body text-[0.68rem]">
          <p className="flex justify-between">
            <span className="text-muted-foreground">⭐ XP</span>
            <span className="text-primary">
              <Counter value={xp} />
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-muted-foreground">🏆 Discoveries</span>
            <span className="text-primary">
              <Counter value={discoveries.length} />/{GAME_TOTALS.discoveries}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-muted-foreground">📜 Fragments</span>
            <span className="text-primary">
              <Counter value={fragments} />/{GAME_TOTALS.fragments}
            </span>
          </p>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full"
            style={{ background: "var(--gradient-gold)" }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
          />
        </div>
      </motion.div>

      {/* nav HUD */}
      <motion.nav
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="panel-carved fixed bottom-3 left-1/2 z-50 -translate-x-1/2 rounded-full px-2 py-1.5"
        aria-label="Heritage world navigation"
      >
        <ul className="flex items-center gap-0.5">
          {NAV.map((n) => {
            const on = active === n.id;
            return (
              <li key={n.id}>
                <button
                  onPointerEnter={() => ping("hover")}
                  onClick={() => {
                    ping("click");
                    document.getElementById(n.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="relative flex flex-col items-center rounded-full px-2.5 py-1.5 sm:px-3.5"
                >
                  {on && (
                    <motion.span
                      layoutId="nav-glow"
                      className="absolute inset-0 rounded-full border border-primary/60 bg-primary/15"
                      transition={{ type: "spring", stiffness: 300, damping: 26 }}
                    />
                  )}
                  <span
                    className={`relative text-sm transition-transform duration-300 ${on ? "scale-125" : "opacity-70"}`}
                  >
                    {n.icon}
                  </span>
                  <span
                    className={`relative mt-0.5 hidden font-display text-[0.5rem] uppercase tracking-[0.18em] sm:block ${
                      on ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {n.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </motion.nav>

      {/* sound */}
      <motion.button
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.3 }}
        onClick={() => {
          toggleSound();
        }}
        className="panel-carved fixed right-3 top-3 z-50 rounded-full px-3 py-2 font-display text-[0.58rem] uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary/15"
        aria-pressed={soundOn}
      >
        {soundOn ? "🔊 Sound On" : "🔇 Sound Off"}
      </motion.button>

      {/* toasts */}
      <div className="pointer-events-none fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: -8, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={
                t.detail
                  ? "panel-carved max-w-xs rounded-md px-4 py-3 text-center"
                  : "rounded-full bg-primary px-4 py-1.5 font-display text-xs text-primary-foreground"
              }
            >
              <p className={t.detail ? "font-display text-xs tracking-[0.2em] text-primary" : ""}>
                {t.label}
              </p>
              {t.detail && (
                <>
                  <p className="mt-1 font-display text-[0.55rem] uppercase tracking-[0.24em] text-muted-foreground">
                    Did you know?
                  </p>
                  <p className="mt-1 text-xs text-foreground/90">{t.detail}</p>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

/** Cursor-following glow torch. */
export function CursorTorch() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 120, damping: 18 });
  const sy = useSpring(y, { stiffness: 120, damping: 18 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[45] hidden h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full lg:block"
      style={{
        left: sx,
        top: sy,
        background:
          "radial-gradient(circle, oklch(0.85 0.13 85 / 0.1) 0%, oklch(0.85 0.13 85 / 0.04) 40%, transparent 70%)",
      }}
    />
  );
}
