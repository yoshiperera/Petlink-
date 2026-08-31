import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { Heart, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Petlink" },
      { name: "description", content: "Sign in to your Petlink account." },
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
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);

  // Clicking the reset-password link in the email lands back here with a
  // recovery session already active. Supabase signals that via this event
  // rather than a URL param, so we listen for it instead of parsing the URL.
  const [isRecovery, setIsRecovery] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [recoverySubmitting, setRecoverySubmitting] = useState(false);
  const [recoveryDone, setRecoveryDone] = useState(false);

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  const handleSetNewPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRecoveryError(null);

    if (newPassword.length < 6) {
      setRecoveryError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setRecoveryError("Passwords do not match.");
      return;
    }

    setRecoverySubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setRecoverySubmitting(false);

    if (error) {
      setRecoveryError(error.message);
      return;
    }

    setRecoveryDone(true);
  };

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

    navigate({ to: "/" });
  };

  const handleForgotPassword = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    // Keep this flow independent from the sign-in form and clear any browser autofill so the
    // password is never accidentally sent or reused during password reset.
    setPassword("");
    setError(null);

    if (!email.trim()) {
      setResetError("Please enter your email address first.");
      setResetMessage(null);
      return;
    }

    setResetSubmitting(true);
    setResetError(null);
    setResetMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      setResetError(error.message);
      setResetSubmitting(false);
      return;
    }

    setResetMessage("Password reset link sent. Check your email and follow the instructions.");
    setResetSubmitting(false);
  };

  if (isRecovery) {
    return (
      <MainLayout>
        <div className="bg-gradient-to-b from-accent/40 to-background py-14">
          <div className="mx-auto max-w-md px-4 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary">
              <Heart className="h-6 w-6 fill-white text-white" />
            </span>
            <h1 className="mt-4 text-4xl text-foreground">Set a New Password</h1>
            <p className="mt-2 text-muted-foreground">Choose a new password for your account</p>
          </div>
          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-border bg-card p-7 shadow-sm">
            {recoveryDone ? (
              <div className="text-center">
                <p className="text-sm text-emerald-600">
                  Password updated. You can now sign in with your new password.
                </p>
                <button
                  onClick={() => {
                    setIsRecovery(false);
                    navigate({ to: "/login" });
                  }}
                  className="mt-5 h-11 w-full rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSetNewPassword}>
                <label className="block text-sm font-semibold text-foreground">New Password</label>
                <div className="relative mt-1.5">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Enter a new password"
                    className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <label className="mt-4 block text-sm font-semibold text-foreground">Confirm New Password</label>
                <div className="relative mt-1.5">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={confirmNewPassword}
                    onChange={(event) => setConfirmNewPassword(event.target.value)}
                    placeholder="Confirm your new password"
                    className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                {recoveryError ? <p className="mt-3 text-sm text-destructive">{recoveryError}</p> : null}
                <button
                  disabled={recoverySubmitting}
                  className="mt-5 h-11 w-full rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                >
                  {recoverySubmitting ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}
          </div>
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
          <h1 className="mt-4 text-4xl text-foreground">Welcome Back to Petlink</h1>
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
              autoComplete="username"
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
              autoComplete="current-password"
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
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetSubmitting}
              className="text-xs font-medium text-primary hover:underline disabled:opacity-60"
            >
              {resetSubmitting ? "Sending..." : "Forgot Password?"}
            </button>
          </div>
          {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
          {resetError ? <p className="mt-3 text-sm text-destructive">{resetError}</p> : null}
          {resetMessage ? <p className="mt-3 text-sm text-emerald-600">{resetMessage}</p> : null}
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

