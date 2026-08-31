import { createFileRoute } from "@tanstack/react-router";
import { MainLayout } from "@/layouts/MainLayout";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { About } from "@/components/home/About";
import { HowItWorks } from "@/components/home/HowItWorks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Petlink — Help Pets Find Their Home" },
      {
        name: "description",
        content: "Report lost or found pets and join a caring community helping reunite families.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <MainLayout>
      <Hero />
      <Stats />
      <About />
      <HowItWorks />
    </MainLayout>
  );
}

