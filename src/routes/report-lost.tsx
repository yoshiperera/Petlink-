import { createFileRoute, Link } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import { ReportPetForm } from "@/components/pets/ReportPetForm";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/report-lost")({
  head: () => ({
    meta: [
      { title: "Report a Lost Pet — Petlink" },
      { name: "description", content: "Report your lost pet and reach our community fast." },
    ],
  }),
  component: ReportLostPage,
});

function ReportLostPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-xl px-4 py-24 text-center text-muted-foreground">
          Loading...
        </div>
      </MainLayout>
    );
  }

  // Lost reports need an account: that is how we know where to email the owner
  // when a matching found report turns up.
  if (!user) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <LogIn className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-3xl text-foreground">Sign in to report a lost pet</h1>
          <p className="mt-3 text-muted-foreground">
            We need an account so we can email you the moment someone reports a pet that matches
            yours.
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
          <p className="mt-8 text-sm text-muted-foreground">
            Found a pet instead?{" "}
            <Link to="/report-found" className="font-semibold text-primary hover:underline">
              Report it without an account
            </Link>
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ReportPetForm kind="lost" />
    </MainLayout>
  );
}

