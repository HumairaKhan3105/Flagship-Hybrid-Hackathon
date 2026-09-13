import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ClothingApp from "../experiences/clothing/App";
import { ReturnToAnveshamPill } from "@/components/heritage/ReturnToAnveshamPill";

export const Route = createFileRoute("/clothing")({
  head: () => ({
    meta: [
      { title: "Vastra Yatra: Traditional Clothes — ANVESHAM" },
      {
        name: "description",
        content: "Discover royal weaves, silk heritage, and ancient garments across India.",
      },
    ],
  }),
  component: ClothingRoute,
});

function ClothingRoute() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#060a12] flex items-center justify-center text-[#f5c042]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 border-2 border-[#f5c042] border-t-transparent rounded-full animate-spin" />
          <span className="font-serif text-sm tracking-widest uppercase">Loading Vastra Yatra...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <ReturnToAnveshamPill />
      <ClothingApp />
    </div>
  );
}
