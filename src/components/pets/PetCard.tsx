import { MapPin, PawPrint } from "lucide-react";

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string;
  color?: string;
  location?: string;
  image?: string;
  video?: string;
  description?: string;
  status?: "lost" | "found" | "reunited";
}

export function PetCard({ pet }: { pet: Pet }) {
  const badge =
    pet.status === "reunited"
      ? "bg-green-100 text-green-700"
      : pet.status === "found"
        ? "bg-blue-100 text-blue-700"
        : "bg-red-100 text-red-700";
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {pet.image ? (
          <img
            src={pet.image}
            alt={pet.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : pet.video ? (
          <video
            src={pet.video}
            controls
            playsInline
            muted
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted-foreground">
            <PawPrint />
          </div>
        )}
        {pet.status && (
          <span
            className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold capitalize ${badge}`}
          >
            {pet.status}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-foreground">{pet.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <PawPrint className="h-3.5 w-3.5" />
          <span>{pet.type}</span>
          {pet.breed && <span>• {pet.breed}</span>}
          {pet.color && <span>• {pet.color}</span>}
        </p>
        {pet.location && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {pet.location}
          </p>
        )}
        {pet.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{pet.description}</p>
        )}
      </div>
    </article>
  );
}
