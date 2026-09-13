import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import NalandaApp from "../experiences/nalanda/App";
import { ReturnToAnveshamPill } from "@/components/heritage/ReturnToAnveshamPill";

export const Route = createFileRoute("/nalanda")({
  head: () => ({
    meta: [
      { title: "Nalanda Mystery: Ancient University — ANVESHAM" },
      {
        name: "description",
        content: "Step into 5th-century Nalanda University, solve ancient puzzles, and recover the lost manuscript.",
      },
    ],
  }),
  component: NalandaRoute,
});

function NalandaRoute() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050811] flex items-center justify-center text-[#fae596]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
          <span className="font-serif text-sm tracking-widest uppercase">Loading Nalanda Heritage...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <ReturnToAnveshamPill />
      <NalandaApp />
    </div>
  );
}
