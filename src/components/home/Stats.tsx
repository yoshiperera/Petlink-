import { Heart, Search, Eye, Users } from "lucide-react";

const stats = [
  { icon: Heart, value: "1", label: "Pets Reunited", color: "text-green-600", bg: "bg-green-100" },
  { icon: Search, value: "0", label: "Lost Pets", color: "text-red-500", bg: "bg-red-100" },
  { icon: Eye, value: "0", label: "Found Pets", color: "text-blue-600", bg: "bg-blue-100" },
  {
    icon: Users,
    value: "5,000+",
    label: "Community Members",
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
];

export function Stats() {
  return (
    <section className="bg-background py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group rounded-xl border border-border bg-card p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${s.bg} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}
            >
              <s.icon className={`h-7 w-7 ${s.color}`} strokeWidth={2.2} />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-foreground">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
