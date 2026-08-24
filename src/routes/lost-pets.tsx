import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import { SearchBar } from "@/components/common/SearchBar";
import { PetCard } from "@/components/pets/PetCard";
import { Loader } from "@/components/common/Loader";
import { supabase, type PetReport } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/lost-pets")({
  head: () => ({
    meta: [
      { title: "Lost Pets — PawTrack" },
      {
        name: "description",
        content: "Browse recently reported lost pets and help bring them home.",
      },
    ],
  }),
  component: LostPetsPage,
});

const tips = [
  "Search your neighborhood thoroughly, including hiding spots",
  "Contact local animal shelters and veterinary clinics",
  "Post on social media and community groups",
  "Put up flyers with clear photos and contact information",
  "Leave familiar items outside (clothing, bedding, toys)",
  "Search during quiet times (early morning, late evening)",
  "Ask neighbors to check their garages, sheds, and basements",
  "Don't give up — pets can be found weeks or months later",
];

function LostPetsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pet_reports", "lost"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pet_reports")
        .select("*")
        .eq("type", "lost")
        .eq("is_reunited", false)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PetReport[];
    },
  });

  const reports = data ?? [];
  const term = search.trim().toLowerCase();
  // A lost report only carries a photo, plus an optional name and location, so
  // those are the only fields worth searching.
  const filtered = reports.filter(
    (report) =>
      !term ||
      [report.pet_name, report.location].some((field) => field?.toLowerCase().includes(term)),
  );

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-4xl text-foreground">Lost Pets</h1>
        <p className="mt-2 text-muted-foreground">
          Help these pets find their way home. {reports.length}{" "}
          {reports.length === 1 ? "pet is" : "pets are"} currently missing.
        </p>

        {!user ? (
          <div className="mt-8 rounded-2xl border-2 border-dashed border-primary/40 bg-gradient-to-br from-blue-brand/30 to-pink-brand/30 p-10 text-center">
            <h2 className="text-2xl text-foreground">Help Bring Them Home</h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Join our community to report lost pets and get alerts when pets are found in your
              area.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link
                to="/login"
                className="rounded-md bg-gradient-to-r from-teal to-primary px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-md border border-primary px-5 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : null}

        <div className="mt-8">
          <SearchBar
            placeholder="Search by pet name or location..."
            value={search}
            onChange={setSearch}
          />
        </div>

        {isLoading ? (
          <Loader />
        ) : isError ? (
          <p className="mt-12 text-center text-destructive">
            Couldn't load lost pets right now. Please refresh and try again.
          </p>
        ) : filtered.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((report) => (
              <PetCard
                key={report.id}
                pet={{
                  id: report.id,
                  name: report.pet_name || "Unnamed pet",
                  type: report.pet_type || "Pet",
                  breed: report.breed ?? undefined,
                  color: report.color ?? undefined,
                  location: report.location ?? undefined,
                  image: report.photo_url ?? undefined,
                  description: report.description ?? undefined,
                  status: "lost",
                }}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid place-items-center py-12 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </span>
            <h3 className="mt-5 text-xl font-bold text-foreground">
              {reports.length === 0 ? "No Lost Pets Reported" : "No Matching Pets"}
            </h3>
            <p className="mt-1 text-muted-foreground">
              {reports.length === 0
                ? "There are currently no lost pets."
                : "Try a different search or pet type."}
            </p>
            <Link
              to="/report-lost"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" /> Report Lost Pet
            </Link>
          </div>
        )}

        <section className="mt-10 rounded-2xl bg-blue-brand/30 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-foreground">Tips for Finding Your Lost Pet</h3>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {tips.map((t) => (
              <li key={t} className="flex gap-2 text-sm text-foreground/80">
                <span className="text-primary">•</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </MainLayout>
  );
}
