import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User, Heart, PawPrint, Pencil, PartyPopper } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import { Loader } from "@/components/common/Loader";
import { supabase, type PetReport } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Petlink" },
      { name: "description", content: "Your Petlink profile and pet reports." },
    ],
  }),
  component: ProfilePage,
});

const inputCls =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

type EditableFields = Pick<
  PetReport,
  "pet_name" | "breed" | "color" | "location" | "description" | "contact_info"
>;

function ProfilePage() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditableFields | null>(null);

  const { data: reports, isLoading } = useQuery({
    queryKey: ["pet_reports", "mine", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pet_reports")
        .select("*")
        .eq("pet_owner_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PetReport[];
    },
  });

  const saveEdit = useMutation({
    mutationFn: async ({ id, fields }: { id: string; fields: EditableFields }) => {
      const { error } = await supabase.from("pet_reports").update(fields).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      setEditingId(null);
      setDraft(null);
      queryClient.invalidateQueries({ queryKey: ["pet_reports"] });
    },
  });

  // Reuniting copies the pet across to Happy Tails, then removes the live
  // report - the spec's "delete the report once the pet is back home".
  const markReunited = useMutation({
    mutationFn: async (report: PetReport) => {
      const { error: insertError } = await supabase.from("happy_tails").insert({
        pet_owner_id: report.pet_owner_id,
        pet_name: report.pet_name,
        pet_type: report.pet_type,
        breed: report.breed,
        color: report.color,
        photo_url: report.photo_url,
        story: `${report.pet_name || "This pet"} made it home safely. Thank you Petlink community!`,
        source_report_id: report.id,
      });
      if (insertError) throw insertError;

      const { error: deleteError } = await supabase
        .from("pet_reports")
        .delete()
        .eq("id", report.id);
      if (deleteError) throw deleteError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pet_reports"] });
      queryClient.invalidateQueries({ queryKey: ["happy_tails"] });
    },
  });

  const startEditing = (report: PetReport) => {
    setEditingId(report.id);
    setDraft({
      pet_name: report.pet_name,
      breed: report.breed,
      color: report.color,
      location: report.location,
      description: report.description,
      contact_info: report.contact_info,
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
            <User className="h-8 w-8" />
          </span>
          <h1 className="mt-5 text-3xl text-foreground">You're not signed in</h1>
          <p className="mt-3 text-muted-foreground">
            Sign in to manage your profile and pet reports.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Link
              to="/login"
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-md border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
            >
              Create Account
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const myReports = reports ?? [];
  const displayName = (user.user_metadata?.full_name as string | undefined) || "Pet owner";

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
            <User className="h-8 w-8" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Link
            to="/report-lost"
            className="ml-auto rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Report a Lost Pet
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5 text-center">
            <PawPrint className="mx-auto h-6 w-6 text-primary" />
            <div className="mt-2 text-2xl font-extrabold">{myReports.length}</div>
            <div className="text-sm text-muted-foreground">Active Reports</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 text-center">
            <Heart className="mx-auto h-6 w-6 text-primary" />
            <div className="mt-2 text-2xl font-extrabold">
              {myReports.filter((report) => report.is_reunited).length}
            </div>
            <div className="text-sm text-muted-foreground">Reunited</div>
          </div>
        </div>

        <h2 className="mt-10 text-xl font-bold text-foreground">My Reports</h2>

        {isLoading ? (
          <Loader />
        ) : myReports.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            You haven't reported a lost pet yet.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {myReports.map((report) => (
              <div
                key={report.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                {editingId === report.id && draft ? (
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        className={inputCls}
                        placeholder="Pet name"
                        value={draft.pet_name ?? ""}
                        onChange={(event) => setDraft({ ...draft, pet_name: event.target.value })}
                      />
                      <input
                        className={inputCls}
                        placeholder="Breed"
                        value={draft.breed ?? ""}
                        onChange={(event) => setDraft({ ...draft, breed: event.target.value })}
                      />
                      <input
                        className={inputCls}
                        placeholder="Colour"
                        value={draft.color ?? ""}
                        onChange={(event) => setDraft({ ...draft, color: event.target.value })}
                      />
                      <input
                        className={inputCls}
                        placeholder="Last seen location"
                        value={draft.location ?? ""}
                        onChange={(event) => setDraft({ ...draft, location: event.target.value })}
                      />
                    </div>
                    <textarea
                      rows={3}
                      className={inputCls + " resize-none py-2"}
                      placeholder="Description"
                      value={draft.description ?? ""}
                      onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                    />
                    <input
                      className={inputCls}
                      placeholder="Contact info"
                      value={draft.contact_info ?? ""}
                      onChange={(event) => setDraft({ ...draft, contact_info: event.target.value })}
                    />
                    <div className="flex gap-2">
                      <button
                        disabled={saveEdit.isPending}
                        onClick={() => saveEdit.mutate({ id: report.id, fields: draft })}
                        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                      >
                        {saveEdit.isPending ? "Saving..." : "Save changes"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setDraft(null);
                        }}
                        className="rounded-md border border-input px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent"
                      >
                        Cancel
                      </button>
                    </div>
                    {saveEdit.isError ? (
                      <p className="text-sm text-destructive">Couldn't save. Please try again.</p>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex flex-wrap items-start gap-4">
                    {report.photo_url ? (
                      <img
                        src={report.photo_url}
                        alt={report.pet_name ?? "Reported pet"}
                        className="h-24 w-24 rounded-xl object-cover"
                      />
                    ) : (
                      <span className="grid h-24 w-24 place-items-center rounded-xl bg-muted text-muted-foreground">
                        <PawPrint />
                      </span>
                    )}
                    <div className="min-w-48 flex-1">
                      <h3 className="text-lg font-bold text-foreground">
                        {report.pet_name || "Unnamed pet"}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {[report.pet_type, report.breed, report.color].filter(Boolean).join(" â€¢ ")}
                      </p>
                      {report.location ? (
                        <p className="mt-1 text-xs text-muted-foreground">{report.location}</p>
                      ) : null}
                      {report.description ? (
                        <p className="mt-2 text-sm text-muted-foreground">{report.description}</p>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => startEditing(report)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        disabled={markReunited.isPending}
                        onClick={() => markReunited.mutate(report)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-green-brand px-3 py-2 text-sm font-semibold text-green-900 hover:brightness-95 disabled:opacity-60"
                      >
                        <PartyPopper className="h-3.5 w-3.5" /> Reunited
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {markReunited.isError ? (
          <p className="mt-4 text-sm text-destructive">
            Couldn't mark that pet as reunited. Please try again.
          </p>
        ) : null}
      </div>
    </MainLayout>
  );
}

