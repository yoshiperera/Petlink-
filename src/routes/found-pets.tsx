import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Video, MailCheck } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import { ReportPetForm } from "@/components/pets/ReportPetForm";

export const Route = createFileRoute("/found-pets")({
  head: () => ({
    meta: [
      { title: "Found a Pet — Petlink" },
      {
        name: "description",
        content:
          "Found a pet? Upload a short video and we'll match it against reported missing pets.",
      },
    ],
  }),
  component: FoundPetsPage,
});

const steps = [
  {
    icon: Video,
    title: "Upload a short video",
    desc: "A few seconds is enough. Our matcher compares it against every reported missing pet.",
  },
  {
    icon: ShieldCheck,
    title: "It stays private",
    desc: "Your video and contact details are never shown publicly or listed on the site.",
  },
  {
    icon: MailCheck,
    title: "We email the owner",
    desc: "If it matches a missing pet, the owner gets your details and contacts you directly.",
  },
];

function FoundPetsPage() {
  return (
    <MainLayout>
      <section className="bg-gradient-to-b from-accent/40 to-background py-12">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="text-4xl text-foreground">Found a Pet?</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            You don't need an account. Upload a video of the pet you found and we'll take it from
            there.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-5xl gap-5 px-4 sm:px-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10">
                <step.icon className="h-5 w-5 text-primary" />
              </span>
              <h2 className="mt-4 text-base font-bold text-foreground">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <ReportPetForm kind="found" />
    </MainLayout>
  );
}

