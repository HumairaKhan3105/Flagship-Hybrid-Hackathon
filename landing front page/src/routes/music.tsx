import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import MusicApp from "../experiences/music/App";
import { ReturnToAnveshamPill } from "@/components/heritage/ReturnToAnveshamPill";

export const Route = createFileRoute("/music")({
  head: () => ({
    meta: [
      { title: "Echoes of India: Musical Instruments — ANVESHAM" },
      {
        name: "description",
        content: "Discover Indian musical instruments, interactive sounds, and the melodic soul of ragas.",
      },
    ],
  }),
  component: MusicRoute,
});

function MusicRoute() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-[#92400e]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 border-2 border-[#d97706] border-t-transparent rounded-full animate-spin" />
          <span className="font-serif text-sm tracking-widest uppercase">Loading Musical Heritage...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <ReturnToAnveshamPill />
      <MusicApp />
    </div>
  );
}
