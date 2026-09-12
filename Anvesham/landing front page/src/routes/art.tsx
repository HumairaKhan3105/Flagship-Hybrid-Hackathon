import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ArtApp from "../experiences/art/App";
import { ReturnToAnveshamPill } from "@/components/heritage/ReturnToAnveshamPill";

export const Route = createFileRoute("/art")({
  head: () => ({
    meta: [
      { title: "Kala Yatra: Indian Art & Craft — ANVESHAM" },
      {
        name: "description",
        content: "Explore living craft traditions, painting studios, and folk heritage across Indian states.",
      },
    ],
  }),
  component: ArtRoute,
});

function ArtRoute() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#1c120c] flex items-center justify-center text-[#f59e0b]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 border-2 border-[#f59e0b] border-t-transparent rounded-full animate-spin" />
          <span className="font-serif text-sm tracking-widest uppercase">Loading Kala Yatra...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <ReturnToAnveshamPill />
      <ArtApp />
    </div>
  );
}
