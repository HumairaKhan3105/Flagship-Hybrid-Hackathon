import { createFileRoute } from "@tanstack/react-router";
import { AnveshamExperience } from "@/components/heritage/AnveshamExperience";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ANVESHAM — Explore India’s Timeless Heritage" },
      {
        name: "description",
        content: "Enter ANVESHAM, a cinematic journey through India’s festivals, food, clothing, monuments, music, art, and craft.",
      },
      { property: "og:title", content: "ANVESHAM — Explore India’s Timeless Heritage" },
      {
        property: "og:description",
        content: "A cinematic, interactive journey through the living heritage of India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <AnveshamExperience />;
}
