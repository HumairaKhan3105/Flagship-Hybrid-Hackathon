import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowDown, ArrowRight, Check, Compass, Pause, Play, RotateCcw, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useNavigate } from "@tanstack/react-router";

import introFilm from "@/assets/anvesham-intro.mp4.asset.json";
import filmPoster from "@/assets/anvesham-film-poster.jpg.asset.json";
import { Button } from "@/components/ui/button";
import { WORLDS, type World } from "./data";

const INTRO_KEY = "anvesham-intro-seen-v1";

const DISPLAY_NAMES: Record<string, string> = {
  festivals: "Festivals",
  clothing: "Traditional Clothes",
  art: "Art & Craft",
  music: "Musical Instruments",
  places: "Famous Places — Hampi",
  nalanda: "Nalanda University",
};

const ROUTE_PATHS: Record<string, string> = {
  festivals: "/festivals",
  clothing: "/clothing",
  art: "/art",
  music: "/music",
  places: "/places",
  nalanda: "/nalanda",
};

const QUESTIONS: Record<string, { prompt: string; answers: string[]; correct: number; note: string }> = {
  festivals: {
    prompt: "Which festival welcomes spring with clouds of gulal?",
    answers: ["Onam", "Holi", "Pongal"],
    correct: 1,
    note: "Holi’s coloured powders celebrate spring, renewal, and the triumph of good.",
  },
  clothing: {
    prompt: "Which Assamese garment is often woven from muga silk?",
    answers: ["Mekhela Chador", "Phiran", "Mundu"],
    correct: 0,
    note: "The Mekhela Chador is a two-piece Assamese drape celebrated for luminous muga silk.",
  },
  places: {
    prompt: "Which UNESCO World Heritage site features the iconic Stone Chariot in the Vittala Temple?",
    answers: ["Konark", "Hampi", "Khajuraho"],
    correct: 1,
    note: "Hampi's Vittala Temple complex features the famed stone chariot dedicated to Garuda.",
  },
  music: {
    prompt: "Which instrument is made from bamboo and played with breath?",
    answers: ["Bansuri", "Sarod", "Mridangam"],
    correct: 0,
    note: "The bansuri is a side-blown bamboo flute with a sound deeply rooted in Indian tradition.",
  },
  art: {
    prompt: "Which painting tradition comes from Bihar?",
    answers: ["Warli", "Pattachitra", "Madhubani"],
    correct: 2,
    note: "Madhubani painting began in Bihar’s Mithila region and is known for dense natural motifs.",
  },
  nalanda: {
    prompt: "Which legendary multi-storey library at Nalanda housed sacred manuscripts for centuries?",
    answers: ["Dharmaganja", "Aryabhata Hall", "Taxila Vault"],
    correct: 0,
    note: "Dharmaganja was Nalanda's legendary library complex, meaning 'Treasury of Truth'.",
  },
};

type IntroState = "checking" | "playing" | "leaving" | "done";

export function AnveshamExperience() {
  const [introState, setIntroState] = useState<IntroState>("checking");
  const [activeWorld, setActiveWorld] = useState<World | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [ambientPlaying, setAmbientPlaying] = useState(true);
  const ambientRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = window.localStorage.getItem(INTRO_KEY) === "true";
    setIntroState(reduceMotion || seen ? "done" : "playing");
  }, []);

  useEffect(() => {
    const video = ambientRef.current;
    if (!video) return;
    video.playbackRate = 0.65;
    if (ambientPlaying) void video.play().catch(() => setAmbientPlaying(false));
    else video.pause();
  }, [ambientPlaying, introState]);

  const finishIntro = () => {
    window.localStorage.setItem(INTRO_KEY, "true");
    setIntroState("leaving");
    window.setTimeout(() => setIntroState("done"), 900);
  };

  const enterJourney = () => {
    document.getElementById("paths")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AnimatePresence>
        {introState !== "done" && (
          <CinematicIntro state={introState} onFinish={finishIntro} />
        )}
      </AnimatePresence>

      <Hero
        ambientRef={ambientRef}
        soundOn={soundOn}
        playing={ambientPlaying}
        onToggleSound={() => setSoundOn((value) => !value)}
        onTogglePlayback={() => setAmbientPlaying((value) => !value)}
        onEnter={enterJourney}
      />

      <ExplorationPaths onOpen={setActiveWorld} />

      <AnimatePresence>
        {activeWorld && <WorldDialog world={activeWorld} onClose={() => setActiveWorld(null)} />}
      </AnimatePresence>
    </main>
  );
}

function CinematicIntro({ state, onFinish }: { state: IntroState; onFinish: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (state !== "playing") return;
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(onFinish);
  }, [state, onFinish]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.025, filter: "blur(8px)" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      aria-label="ANVESHAM cinematic introduction"
    >
      {state === "checking" ? (
        <div className="absolute inset-0 bg-background" />
      ) : (
        <>
          <video
            ref={videoRef}
            src={introFilm.url}
            poster={filmPoster.url}
            muted
            playsInline
            preload="auto"
            onCanPlay={() => setReady(true)}
            onEnded={onFinish}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="cinematic-vignette absolute inset-0" />
          <motion.div
            className="absolute inset-x-0 bottom-[12%] text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 16 }}
            transition={{ delay: 5.4, duration: 1.2 }}
          >
            <p className="font-display text-xs uppercase tracking-[0.42em] text-primary/80">
              India remembers
            </p>
          </motion.div>
          <Button
            type="button"
            variant="ghost"
            onClick={onFinish}
            className="absolute right-5 top-5 h-10 rounded-full border border-primary/35 bg-background/25 px-5 font-display text-[0.62rem] uppercase tracking-[0.2em] text-foreground backdrop-blur-md hover:bg-background/50 sm:right-8 sm:top-8"
          >
            Skip intro <ArrowRight />
          </Button>
        </>
      )}
    </motion.div>
  );
}

function Hero({
  ambientRef,
  soundOn,
  playing,
  onToggleSound,
  onTogglePlayback,
  onEnter,
}: {
  ambientRef: React.RefObject<HTMLVideoElement | null>;
  soundOn: boolean;
  playing: boolean;
  onToggleSound: () => void;
  onTogglePlayback: () => void;
  onEnter: () => void;
}) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 45, damping: 24 });
  const smoothY = useSpring(pointerY, { stiffness: 45, damping: 24 });
  const sceneX = useTransform(smoothX, [-1, 1], [-14, 14]);
  const sceneY = useTransform(smoothY, [-1, 1], [-7, 7]);

  const moveScene = (event: ReactPointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  return (
    <section
      id="home"
      onPointerMove={moveScene}
      className="relative min-h-[100svh] overflow-hidden bg-background"
    >
      <motion.div className="absolute -inset-6" style={{ x: sceneX, y: sceneY }}>
        <video
          ref={ambientRef}
          src={introFilm.url}
          poster={filmPoster.url}
          muted={!soundOn}
          loop
          playsInline
          preload="metadata"
          aria-hidden
          className="h-full w-full scale-105 object-cover object-center opacity-65 saturate-[0.78]"
        />
      </motion.div>
      <div className="hero-film-grade absolute inset-0" />
      <div className="sun-shaft absolute inset-0" aria-hidden />
      <ParticleField />

      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 sm:px-10 sm:py-7 lg:px-16">
        <a href="#home" className="group flex items-center gap-3" aria-label="ANVESHAM home">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-primary/55 bg-background/20 backdrop-blur-md">
            <Compass className="size-4 text-primary transition-transform duration-500 group-hover:rotate-45" />
          </span>
          <span className="font-display text-sm uppercase tracking-[0.28em] text-foreground">Anvesham</span>
        </a>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onTogglePlayback}
            aria-label={playing ? "Pause background atmosphere" : "Play background atmosphere"}
            className="rounded-full border border-primary/35 bg-background/20 text-primary backdrop-blur-md hover:bg-background/45"
          >
            {playing ? <Pause /> : <Play />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleSound}
            aria-label={soundOn ? "Mute background atmosphere" : "Unmute background atmosphere"}
            className="rounded-full border border-primary/35 bg-background/20 text-primary backdrop-blur-md hover:bg-background/45"
          >
            {soundOn ? <Volume2 /> : <VolumeX />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onEnter}
            className="hidden rounded-full border border-primary/35 bg-background/20 px-5 font-display text-[0.62rem] uppercase tracking-[0.2em] text-foreground backdrop-blur-md hover:bg-background/45 sm:inline-flex"
          >
            Explore
          </Button>
        </div>
      </header>

      <div className="relative z-20 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-5 pb-16 pt-24 text-center sm:px-10 lg:px-16">
        <div className="max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-display text-[0.62rem] uppercase tracking-[0.4em] text-primary sm:text-xs"
          >
            A living archive of India
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-gold-gradient mt-5 text-[clamp(3.5rem,11vw,8.5rem)] leading-[0.82]"
          >
            ANVESHAM
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.9 }}
            className="font-title mx-auto mt-5 max-w-xl text-xl text-parchment sm:text-3xl"
          >
            Explore India’s Timeless Heritage
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 1 }}
            className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base"
          >
            Cross the threshold. Follow six paths through celebration, flavour, craft, sound,
            memory, and stone.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-8 flex justify-center"
          >
            <Button
              type="button"
              size="lg"
              onClick={onEnter}
              className="journey-button h-14 rounded-sm border border-primary/70 px-8 font-display text-xs uppercase tracking-[0.25em] shadow-none sm:px-10"
            >
              Enter the Journey <ArrowDown />
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

function ParticleField() {
  const particles = Array.from({ length: 18 }, (_, index) => index);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((index) => (
        <span
          key={index}
          className="heritage-particle absolute rounded-full bg-primary"
          style={{
            left: `${7 + ((index * 31) % 89)}%`,
            bottom: `${-8 + ((index * 17) % 32)}%`,
            animationDelay: `${(index % 9) * -1.3}s`,
            animationDuration: `${13 + (index % 6) * 2.4}s`,
          }}
        />
      ))}
    </div>
  );
}

function ExplorationPaths({ onOpen }: { onOpen: (world: World) => void }) {
  const navigate = useNavigate();

  return (
    <section id="paths" className="relative overflow-hidden py-20 sm:py-28">
      <div className="path-texture absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-10 lg:px-16">
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-display text-[0.62rem] uppercase tracking-[0.4em] text-accent">Six paths await</p>
          <h2 className="mt-4 text-3xl text-parchment sm:text-5xl">Choose what calls to you</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            Open a path, uncover its living traditions, then test what you discovered.
          </p>
        </header>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORLDS.map((world, index) => {
            const targetRoute = ROUTE_PATHS[world.id] || `/${world.id}`;
            return (
              <motion.article
                key={world.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: (index % 3) * 0.08, duration: 0.7 }}
                whileHover={{ y: -7 }}
                onClick={() => navigate({ to: targetRoute })}
                className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-md border border-primary/20 bg-card"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate({ to: targetRoute });
                  }
                }}
                aria-label={`Explore ${DISPLAY_NAMES[world.id] || world.title}`}
              >
                <img
                  src={world.image}
                  alt={`${DISPLAY_NAMES[world.id]} heritage scene`}
                  width={1024}
                  height={640}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                />
                <div className="path-card-shade absolute inset-0 transition-opacity duration-500 group-hover:opacity-90" />
                <div className="path-card-glint absolute inset-0" aria-hidden />

                {/* Top quick lore button */}
                <div className="absolute right-4 top-4 z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen(world);
                    }}
                    title="View Lore & Quiz"
                    className="flex items-center gap-1 rounded-full border border-primary/40 bg-background/70 px-2.5 py-1 text-[0.6rem] font-medium tracking-wider text-primary backdrop-blur-md transition hover:border-primary hover:bg-background/95 hover:text-gold-bright"
                  >
                    <span>📜 Lore</span>
                  </button>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <p className="font-display text-[0.58rem] uppercase tracking-[0.3em] text-primary/75">
                    Path {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-2xl leading-tight text-parchment">{DISPLAY_NAMES[world.id]}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{world.intro}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({ to: targetRoute });
                    }}
                    className="mt-5 h-auto rounded-none p-0 font-display text-[0.62rem] uppercase tracking-[0.22em] text-primary hover:bg-transparent hover:text-gold-bright"
                    aria-label={`Explore ${DISPLAY_NAMES[world.id]}`}
                  >
                    Enter Experience <ArrowRight className="transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-20 border-t border-primary/20 pt-8 text-center">
          <p className="mt-3 font-display text-xs uppercase tracking-[0.28em] text-primary/70">Truth alone triumphs</p>
        </div>
      </div>
    </section>
  );
}

function WorldDialog({ world, onClose }: { world: World; onClose: () => void }) {
  const navigate = useNavigate();
  const question = QUESTIONS[world.id];
  const [answer, setAnswer] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!question) return null;
  const correct = answer === question.correct;

  return (
    <motion.div
      className="fixed inset-0 z-[80] overflow-y-auto bg-background/90 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="path-title"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onClose}
        aria-label="Close heritage path"
        className="fixed right-5 top-5 z-20 rounded-full border border-primary/35 bg-background/55 text-primary backdrop-blur-md hover:bg-card sm:right-8 sm:top-8"
      >
        <X />
      </Button>

      <div className="mx-auto min-h-full max-w-6xl px-5 py-20 sm:px-10 lg:px-16">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end"
        >
          <div>
            <p className="font-display text-[0.62rem] uppercase tracking-[0.4em] text-accent">{world.eyebrow}</p>
            <h2 id="path-title" className="text-gold-gradient mt-4 text-4xl sm:text-6xl">{DISPLAY_NAMES[world.id]}</h2>
            <p className="font-title mt-4 max-w-2xl text-xl text-parchment sm:text-2xl">{world.intro}</p>
            <div className="mt-6">
              <Button
                type="button"
                size="lg"
                onClick={() => {
                  onClose();
                  navigate({ to: ROUTE_PATHS[world.id] || `/${world.id}` });
                }}
                className="journey-button h-12 rounded-sm border border-primary/70 px-6 font-display text-xs uppercase tracking-[0.2em] shadow-none"
              >
                Enter Full Experience <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-md border border-primary/25">
            <img src={world.image} alt={`${DISPLAY_NAMES[world.id]} heritage`} width={1024} height={640} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        </motion.header>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {world.items.slice(0, showAll ? world.items.length : 4).map((item, index) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.06 }}
              className="heritage-fact border-l border-primary/35 bg-card/45 p-5"
            >
              <span className="text-2xl" aria-hidden>{item.icon}</span>
              <p className="mt-4 font-display text-base text-parchment">{item.name}</p>
              <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-primary/70">{item.region}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.blurb}</p>
            </motion.article>
          ))}
        </div>
        {world.items.length > 4 && (
          <div className="mt-6 text-center">
            <Button type="button" variant="ghost" onClick={() => setShowAll((value) => !value)} className="font-display text-[0.62rem] uppercase tracking-[0.22em] text-primary hover:bg-primary/10">
              {showAll ? "Show less" : `Reveal ${world.items.length - 4} more`}
            </Button>
          </div>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mx-auto mt-16 max-w-3xl border-y border-primary/25 py-10 text-center"
        >
          <p className="font-display text-[0.62rem] uppercase tracking-[0.35em] text-accent">Knowledge trial</p>
          <h3 className="mt-4 text-2xl text-parchment sm:text-3xl">{question.prompt}</h3>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {question.answers.map((option, index) => {
              const selected = answer === index;
              const revealCorrect = answer !== null && index === question.correct;
              return (
                <Button
                  key={option}
                  type="button"
                  variant="outline"
                  onClick={() => answer === null && setAnswer(index)}
                  className={`h-12 rounded-sm border-primary/30 bg-card/40 font-title text-base text-foreground hover:border-primary hover:bg-primary/10 ${
                    revealCorrect ? "border-jade bg-jade/15" : selected ? "border-accent bg-accent/15" : ""
                  }`}
                >
                  {revealCorrect && <Check />} {option}
                </Button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            {answer !== null && (
              <motion.div
                key={String(answer)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto mt-7 max-w-xl"
              >
                <p className={`font-display text-sm uppercase tracking-[0.2em] ${correct ? "text-jade" : "text-accent"}`}>
                  {correct ? "Path mastered" : "A worthy attempt"}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{question.note}</p>
                <Button type="button" variant="ghost" onClick={() => setAnswer(null)} className="mt-3 font-display text-[0.6rem] uppercase tracking-[0.2em] text-primary hover:bg-primary/10">
                  <RotateCcw /> Try again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </div>
    </motion.div>
  );
}