import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Heart } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account — PawTrack" },
      {
        name: "description",
        content: "Join PawTrack and help reunite lost pets with their families.",
      },
    ],
  }),
  component: RegisterPage,
});

const inputCls =
  "mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setSubmitting(false);
      return;
    }

    // Supabase deliberately hides whether an email is already registered - so
    // nobody can probe the site for valid addresses - by returning a user with
    // no identities instead of an error. Left unhandled it shows "check your
    // email" for an account that was never created. Tell the real person why.
    if (data.user && data.user.identities?.length === 0) {
      setError("This email already has an account. Please sign in instead.");
      setSubmitting(false);
      return;
    }

    // The profiles row is created by the on_auth_user_created trigger, which
    // works even when email confirmation leaves us without a session. Only
    // refresh it here when we do have one - otherwise RLS rejects the write.
    if (data.session && data.user) {
      await supabase.from("profiles").upsert({ id: data.user.id, full_name: fullName, email });
    }

    setSubmitting(false);

    // With email confirmation switched on, signUp returns a user but no session.
    if (data.session) {
      navigate({ to: "/profile" });
    } else {
      setNeedsConfirmation(true);
    }
  };

  if (needsConfirmation) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="text-3xl text-foreground">Check your email 📩</h1>
          <p className="mt-3 text-muted-foreground">
            We sent a confirmation link to <span className="font-semibold">{email}</span>. Confirm
            your address, then sign in to report a lost pet.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Go to Sign In
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-accent/40 to-background py-14">
        <div className="mx-auto max-w-md px-4 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary">
            <Heart className="h-6 w-6 fill-white text-white" />
          </span>
          <h1 className="mt-4 text-4xl text-foreground">Join PawTrack</h1>
          <p className="mt-2 text-muted-foreground">Create your account to start helping pets</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 max-w-md rounded-2xl border border-border bg-card p-7 shadow-sm"
        >
          <label className="block text-sm font-semibold">Full Name</label>
          <input
            required
            className={inputCls}
            placeholder="Jane Doe"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
          <label className="mt-4 block text-sm font-semibold">Email</label>
          <input
            type="email"
            required
            className={inputCls}
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label className="mt-4 block text-sm font-semibold">Password</label>
          <input
            type="password"
            required
            minLength={6}
            className={inputCls}
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
          <button
            disabled={submitting}
            className="mt-6 h-11 w-full rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </MainLayout>
  );
}
