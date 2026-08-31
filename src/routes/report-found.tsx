import { createFileRoute } from "@tanstack/react-router";
import { MainLayout } from "@/layouts/MainLayout";
import { ReportPetForm } from "@/components/pets/ReportPetForm";

export const Route = createFileRoute("/report-found")({
  head: () => ({
    meta: [
      { title: "Report a Found Pet — Petlink" },
      {
        name: "description",
        content: "Report a pet you've found and help reunite them with their family.",
      },
    ],
  }),
  component: () => (
    <MainLayout>
      <ReportPetForm kind="found" />
    </MainLayout>
  ),
});

