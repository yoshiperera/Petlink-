export const SITE_NAME = "Petlink";

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/lost-pets", label: "Lost Pets" },
  { to: "/found-pets", label: "Found Pets" },
  { to: "/happy-tails", label: "Happy Tails" },
  { to: "/blog", label: "Blog" },
  { to: "/profile", label: "Profile" },
] as const;

export const PET_TYPES = ["All Types", "Dog", "Cat", "Bird", "Rabbit", "Other"] as const;
