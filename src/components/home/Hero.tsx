import { Link } from "@tanstack/react-router";
import { PawPrint } from "lucide-react";
import heroPets from "@/assets/new-photo.png";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      {/* decorative shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-16 h-56 w-56 rounded-full bg-orange-300/50 blur-3xl animate-blob-pulse" />
        <div className="absolute -top-16 left-1/4 h-52 w-52 rounded-full bg-pink-300/50 blur-3xl animate-blob-pulse [animation-delay:1.5s]" />
        <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-teal/30 blur-3xl animate-blob-pulse [animation-delay:3s]" />

        <span className="absolute bottom-10 left-8 grid h-12 w-12 -rotate-12 place-items-center rounded-full bg-primary/10 animate-float-paw [animation-delay:0s]">
          <PawPrint className="h-6 w-6 text-primary" strokeWidth={2} />
        </span>
        <span className="absolute right-16 top-28 grid h-14 w-14 rotate-12 place-items-center rounded-full bg-pink-500/10 animate-float-paw [animation-delay:0.8s]">
          <PawPrint className="h-7 w-7 text-pink-500" strokeWidth={2} />
        </span>
        <span className="absolute right-8 bottom-16 grid h-12 w-12 -rotate-6 place-items-center rounded-full bg-teal/10 animate-float-paw [animation-delay:1.6s]">
          <PawPrint className="h-6 w-6 text-teal" strokeWidth={2} />
        </span>
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <h1 className="text-5xl leading-[1.05] text-foreground md:text-6xl lg:text-7xl">
            Help Pets Find
            <br />
            Their Home
          </h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground">
            Join our community-driven platform to help reunite lost pets with their families. Every
            pet deserves to find their way home.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/report-lost"
              className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Report Lost Pet
            </Link>
            <Link
              to="/report-found"
              className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Report Found Pet
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-x-8 top-10 h-[80%] rounded-[50%] bg-white/60 blur-2xl" />
          <img
            src={heroPets}
            alt="Happy pets together"
            width={1536}
            height={1024}
            className="relative z-10 mx-auto w-full max-w-lg drop-shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
