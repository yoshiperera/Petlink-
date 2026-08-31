import { MapPin, Bell, ShieldCheck } from "lucide-react";

const items = [
  {
    icon: MapPin,
    title: "Interactive Map",
    desc: "View lost and found pets on an interactive map with precise location tracking and real-time updates.",
    bg: "bg-blue-brand/50",
    iconBg: "bg-blue-200",
    iconColor: "text-blue-600",
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    desc: "Get instant alerts when pets matching your search criteria are reported in your area.",
    bg: "bg-pink-brand/50",
    iconBg: "bg-pink-200",
    iconColor: "text-pink-500",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Moderated",
    desc: "All listings are verified and moderated to ensure authenticity and prevent misuse.",
    bg: "bg-green-brand/60",
    iconBg: "bg-green-200",
    iconColor: "text-green-600",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl text-foreground">How Petlink Works</h2>
          <p className="mt-3 text-muted-foreground">
            Simple steps to help reunite pets with their families
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className={`rounded-2xl ${it.bg} p-8 text-center`}>
              <span
                className={`mx-auto grid h-14 w-14 place-items-center rounded-full ${it.iconBg}`}
              >
                <it.icon className={`h-6 w-6 ${it.iconColor}`} />
              </span>
              <h3 className="mt-4 text-xl font-bold text-foreground">{it.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

