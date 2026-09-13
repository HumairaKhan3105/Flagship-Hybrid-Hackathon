import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type Toast = { id: number; label: string; detail?: string | undefined };

type GameState = {
  xp: number;
  discoveries: string[];
  fragments: number;
  soundOn: boolean;
  toasts: Toast[];
  discover: (id: string, opts?: { xp?: number; label?: string; detail?: string }) => void;
  addFragment: () => void;
  toggleSound: () => void;
  isDiscovered: (id: string) => boolean;
  ping: (kind: "hover" | "click" | "unlock") => void;
};

const TOTAL_DISCOVERIES = 50;
const TOTAL_FRAGMENTS = 10;

const GameContext = createContext<GameState | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [xp, setXp] = useState(0);
  const [discoveries, setDiscoveries] = useState<string[]>([]);
  const [fragments, setFragments] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const audioRef = useRef<AudioContext | null>(null);
  const toastId = useRef(0);

  const ping = useCallback(
    (kind: "hover" | "click" | "unlock") => {
      if (!soundOn || typeof window === "undefined") return;
      try {
        audioRef.current ??= new AudioContext();
        const ctx = audioRef.current;
        if (ctx.state === "suspended") void ctx.resume();
        const now = ctx.currentTime;
        const freq = kind === "hover" ? 880 : kind === "click" ? 523 : 1046;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now);
        if (kind === "unlock") osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.25);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(kind === "hover" ? 0.03 : 0.08, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === "hover" ? 0.14 : 0.6));
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
      } catch {
        /* audio unavailable */
      }
    },
    [soundOn],
  );

  const pushToast = useCallback((label: string, detail?: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, label, detail }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), detail ? 5200 : 2000);
  }, []);

  const discover = useCallback(
    (id: string, opts?: { xp?: number; label?: string; detail?: string }) => {
      let isNew = false;
      setDiscoveries((prev) => {
        if (prev.includes(id)) return prev;
        isNew = true;
        return [...prev, id];
      });
      if (!isNew) return;
      const gain = opts?.xp ?? 10;
      setXp((v) => v + gain);
      pushToast(opts?.label ?? `+${gain} XP`, opts?.detail);
      ping("unlock");
    },
    [ping, pushToast],
  );

  const addFragment = useCallback(() => {
    setFragments((f) => Math.min(TOTAL_FRAGMENTS, f + 1));
  }, []);

  const value = useMemo<GameState>(
    () => ({
      xp,
      discoveries,
      fragments,
      soundOn,
      toasts,
      discover,
      addFragment,
      toggleSound: () => setSoundOn((s) => !s),
      isDiscovered: (id: string) => discoveries.includes(id),
      ping,
    }),
    [xp, discoveries, fragments, soundOn, toasts, discover, addFragment, ping],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}

export const GAME_TOTALS = { discoveries: TOTAL_DISCOVERIES, fragments: TOTAL_FRAGMENTS };
