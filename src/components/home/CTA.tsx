import { Heart } from "lucide-react";
import { useState } from "react";

export function CTA() {
  const [email, setEmail] = useState("");
  return (
    <section className="bg-gradient-to-b from-accent to-accent/60 py-16">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <Heart className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-4 text-3xl text-foreground">Stay Updated with Petlink Stories</h2>
        <p className="mt-3 text-muted-foreground">
          Get the latest success stories, tips, and updates delivered to your inbox. Join our
          community of pet lovers making a difference.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setEmail("");
          }}
          className="mx-auto mt-6 flex max-w-md gap-2 rounded-xl border-2 border-primary/40 bg-card p-1.5"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
          />
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Subscribe
          </button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}

