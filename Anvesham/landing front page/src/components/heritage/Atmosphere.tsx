import { useEffect, useState } from "react";

type Spec = { left: number; delay: number; duration: number; size: number; opacity: number };

/** Rising ember / dust particle field. Client-only so SSR stays deterministic. */
export function Embers({ count = 26, className = "" }: { count?: number; className?: string }) {
  const [specs, setSpecs] = useState<Spec[]>([]);

  useEffect(() => {
    setSpecs(
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 14,
        duration: 12 + Math.random() * 14,
        size: 2 + Math.random() * 4,
        opacity: 0.25 + Math.random() * 0.55,
      })),
    );
  }, [count]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {specs.map((s, i) => (
        <span
          key={i}
          className="animate-ember absolute bottom-0 rounded-full bg-primary"
          style={{
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            boxShadow: "0 0 10px currentColor",
          }}
        />
      ))}
    </div>
  );
}

/** Faint carved-stone / mandala texture behind a section. */
export function MandalaBackdrop({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="mandala-ring animate-spin-slow absolute -top-40 -right-40 h-[34rem] w-[34rem] opacity-[0.14]" />
      <div
        className="mandala-ring animate-spin-slow absolute -bottom-56 -left-48 h-[42rem] w-[42rem] opacity-[0.1]"
        style={{ animationDirection: "reverse" }}
      />
    </div>
  );
}

/** Torn parchment divider between chapters. */
export function ParchmentDivider() {
  return (
    <div className="relative h-16 w-full overflow-hidden" aria-hidden>
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/70">
        ✦ ❖ ✦
      </div>
    </div>
  );
}
