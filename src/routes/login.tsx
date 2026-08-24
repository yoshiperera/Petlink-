import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Heart, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — PawTrack" },
      { name: "description", content: "Sign in to your PawTrack account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setSubmitting(false);
      return;
    }

    navigate({ to: "/profile" });
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-accent/40 to-background py-14">
        <div className="mx-auto max-w-md px-4 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary">
            <Heart className="h-6 w-6 fill-white text-white" />
          </span>
          <h1 className="mt-4 text-4xl text-foreground">Welcome Back to PawTrack</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to help reunite pets with their families
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 max-w-md rounded-2xl border border-border bg-card p-7 shadow-sm"
        >
          <h2 className="text-center text-lg font-bold text-foreground">Sign In to Your Account</h2>
          <label className="mt-6 block text-sm font-semibold text-foreground">Email Address</label>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <label className="mt-4 block text-sm font-semibold text-foreground">Password</label>
          <div className="relative mt-1.5">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type={show ? "text" : "password"}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
          <button
            disabled={submitting}
            className="mt-5 h-11 w-full rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            <span>Don't have an account?</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <Link
            to="/register"
            className="block rounded-md border border-input py-2.5 text-center text-sm font-semibold text-foreground hover:bg-accent"
          >
            Create Account
          </Link>
        </form>
      </div>
    </MainLayout>
  );
}
