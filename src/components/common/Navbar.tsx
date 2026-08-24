import { Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { NAV_LINKS } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 bg-teal text-teal-foreground shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-semibold text-white/85 transition hover:text-white"
              activeProps={{
                className: "text-yellow-brand border-b-2 border-yellow-brand pb-1 -mb-1",
              }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {loading ? null : user ? (
            <>
              <Link
                to="/profile"
                className="rounded-md border border-white/80 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                My Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-md border border-white/80 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="rounded-md border border-white/80 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="rounded-md border border-white/80 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
