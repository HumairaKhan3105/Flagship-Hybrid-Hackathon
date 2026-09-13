import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";

import mapArt from "@/assets/india-map.png";
import { REGIONS } from "./data";
import { Embers, MandalaBackdrop } from "./Atmosphere";
import { useGame } from "@/lib/game-state";

export function IndiaMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const { discover, isDiscovered, ping } = useGame();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.86, 1.04, 1.12]);
  const rotate = useTransform(scrollYProgress, [0, 1], [6, -4]);
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.55, 0.15]);

  const active = REGIONS.find((r) => r.id === hover);

  return (
    <section id="map" ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      <MandalaBackdrop />
      <Embers count={14} />
      <div className="relative z-10 mx-auto max-w-6xl px-5">
        <header className="text-center">
          <p className="font-display text-[0.6rem] uppercase tracking-[0.4em] text-accent">
            World Map
          </p>
          <h2 className="text-gold-gradient mt-3 text-3xl sm:text-5xl">Choose Your Region</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Seven exploration zones hold the scattered fragments. Hover a node to scout it, tap to
            claim the discovery.
          </p>
        </header>

        <div className="relative mt-12 flex justify-center">
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-full blur-3xl"
            style={{ opacity: glow, background: "radial-gradient(circle, var(--gold) 0%, transparent 65%)" }}
          />
          <motion.div
            style={{ scale, rotate }}
            className="relative w-full max-w-xl"
          >
            <img
              src={mapArt}
              alt="Illustrated fantasy treasure map of India on aged parchment"
              width={1024}
              height={1280}
              loading="lazy"
              className="w-full drop-shadow-[0_30px_60px_oklch(0.09_0.02_50/0.9)]"
            />

            {/* connecting routes */}
            <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
              {REGIONS.slice(0, -1).map((r, i) => {
                const n = REGIONS[i + 1];
                if (!n) return null;
                const lit = hover === r.id || hover === n.id;
                return (
                  <motion.line
                    key={r.id}
                    x1={r.x}
                    y1={r.y}
                    x2={n.x}
                    y2={n.y}
                    stroke="var(--gold)"
                    strokeWidth={lit ? 0.6 : 0.25}
                    strokeDasharray="2 2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: lit ? 0.95 : 0.35 }}
                    viewport={{ once: false }}
                    transition={{ duration: 1.4, delay: i * 0.12 }}
                  />
                );
              })}
            </svg>

            {REGIONS.map((r, i) => {
              const found = isDiscovered(`region-${r.id}`);
              return (
                <motion.button
                  key={r.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${r.x}%`, top: `${r.y}%` }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 220, damping: 14 }}
                  whileHover={{ scale: 1.35 }}
                  onPointerEnter={() => {
                    setHover(r.id);
                    ping("hover");
                  }}
                  onPointerLeave={() => setHover(null)}
                  onClick={() =>
                    discover(`region-${r.id}`, { xp: 15, label: "+15 XP", detail: r.fact })
                  }
                  aria-label={`${r.name} — ${r.tag}`}
                >
                  <span
                    className={`relative grid h-8 w-8 place-items-center rounded-full border text-xs backdrop-blur-sm transition-colors sm:h-10 sm:w-10 sm:text-sm ${
                      found
                        ? "border-primary bg-primary/30 text-primary-foreground"
                        : "border-primary/60 bg-background/70"
                    }`}
                  >
                    {r.icon}
                    <motion.span
                      className="absolute inset-0 rounded-full border border-primary/70"
                      animate={{ scale: [1, 1.9], opacity: [0.7, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.3 }}
                    />
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* scouting panel */}
          <motion.aside
            className="panel-carved absolute bottom-2 left-2 w-52 rounded-md p-3 sm:left-6 sm:w-64"
            animate={{ opacity: active ? 1 : 0.45, y: active ? 0 : 10 }}
            transition={{ duration: 0.35 }}
          >
            <p className="font-display text-[0.55rem] uppercase tracking-[0.3em] text-accent">
              {active ? "Zone scouted" : "Awaiting orders"}
            </p>
            <p className="font-title mt-1 text-lg text-primary">
              {active ? `${active.icon} ${active.name}` : "— — —"}
            </p>
            <p className="text-[0.7rem] text-muted-foreground">
              {active ? active.tag : "Move the cursor over a glowing node."}
            </p>
            {active && (
              <p className="mt-2 border-t border-border pt-2 text-[0.7rem] text-foreground/85">
                {active.fact}
              </p>
            )}
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
