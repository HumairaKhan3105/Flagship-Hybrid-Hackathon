import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import FestivalsApp from "../experiences/festivals/App";
import { ReturnToAnveshamPill } from "@/components/heritage/ReturnToAnveshamPill";

export const Route = createFileRoute("/festivals")({
  head: () => ({
    meta: [
      { title: "Festivals of Light — ANVESHAM" },
      {
        name: "description",
        content: "Experience the vibrant celebrations of Indian festivals, lights, and sacred traditions.",
      },
    ],
  }),
  component: FestivalsRoute,
});

function FestivalsRoute() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FDF5E6] flex items-center justify-center text-[#5D4037]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <span className="font-serif text-sm tracking-widest uppercase">Loading Festivals Experience...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <ReturnToAnveshamPill />
      <FestivalsApp />
    </div>
  );
}
