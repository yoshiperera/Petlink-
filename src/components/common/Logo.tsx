import { Heart } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-yellow-brand shadow-sm">
        <Heart className="h-5 w-5 fill-white text-white" />
      </span>
      <span className="text-xl font-extrabold tracking-tight text-white">PawTrack</span>
    </Link>
  );
}
