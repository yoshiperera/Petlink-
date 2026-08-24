import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/layouts/MainLayout";
import { SearchBar } from "@/components/common/SearchBar";
import { StoryCard } from "@/components/stories/StoryCard";
import { Loader } from "@/components/common/Loader";
import { supabase, type HappyTail } from "@/lib/supabase";

export const Route = createFileRoute("/happy-tails")({
  head: () => ({
    meta: [
      { title: "Happy Tails — Reunion Stories | PawTrack" },
      {
        name: "description",
        content: "Heartwarming reunion stories from pets reunited with their families.",
      },
    ],
  }),
  component: HappyTailsPage,
});

function HappyTailsPage() {
  const [q, setQ] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["happy_tails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("happy_tails")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as HappyTail[];
    },
  });

  const stories = data ?? [];
  const term = q.trim().toLowerCase();
  const filtered = stories.filter(
    (story) => !term || (story.pet_name ?? "").toLowerCase().includes(term),
  );

  return (
    <MainLayout>
      <section className="relative overflow-hidden bg-cream py-16">
        <div className="absolute left-10 top-10 text-4xl opacity-40">🐾</div>
        <div className="absolute right-10 top-10 text-4xl opacity-40">🐾</div>
        <div className="absolute left-20 bottom-6 text-4xl opacity-40">🐾</div>
        <div className="absolute right-20 bottom-6 text-4xl opacity-40">🐾</div>
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-5xl text-foreground">Happy Reunion Stories</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Celebrating the joyful reunions that make our hearts full. These success stories show
            the power of community in bringing pets home.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <SearchBar placeholder="Search reunion stories..." value={q} onChange={setQ} />
        </div>

        {isLoading ? (
          <Loader />
        ) : isError ? (
          <p className="mt-12 text-center text-destructive">
            Couldn't load reunion stories right now. Please refresh and try again.
          </p>
        ) : filtered.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((story) => (
              <StoryCard
                key={story.id}
                pet={{
                  id: story.id,
                  name: story.pet_name || "Reunited pet",
                  type: story.pet_type || "Pet",
                  breed: story.breed ?? undefined,
                  color: story.color ?? undefined,
                  image: story.photo_url ?? undefined,
                  description: story.story ?? undefined,
                }}
              />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-muted-foreground">
            {stories.length === 0
              ? "No reunions yet — but every pet reported here gets us closer to the first one."
              : "No stories match that search."}
          </p>
        )}
      </div>
    </MainLayout>
  );
}
