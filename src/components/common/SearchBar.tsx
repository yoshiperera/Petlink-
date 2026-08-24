import { Search } from "lucide-react";

interface Props {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
}

export function SearchBar({ placeholder = "Search...", value, onChange }: Props) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
