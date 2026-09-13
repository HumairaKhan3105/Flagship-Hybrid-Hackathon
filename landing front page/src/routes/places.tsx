import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import PlacesApp from "../experiences/places/App";
import { ReturnToAnveshamPill } from "@/components/heritage/ReturnToAnveshamPill";

export const Route = createFileRoute("/places")({
  head: () => ({
    meta: [
      { title: "Hampi Echoes: Famous Places — ANVESHAM" },
      {
        name: "description",
        content: "Explore the ancient 3D ruins of Vijayanagara, decode temple inscriptions, and discover Hampi.",
      },
    ],
  }),
  component: PlacesRoute,
});

function PlacesRoute() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center text-amber-300">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="font-serif text-sm tracking-widest uppercase">Loading Hampi 3D World...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <ReturnToAnveshamPill />
      <PlacesApp />
    </div>
  );
}
