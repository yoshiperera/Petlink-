import { PetCard, type Pet } from "@/components/pets/PetCard";
export function StoryCard({ pet }: { pet: Pet }) {
  return <PetCard pet={{ ...pet, status: "reunited" }} />;
}
