import type { Metadata } from "next";
import { ProjectSystemsClient } from "@/components/projects/ProjectSystemsClient";

export const metadata: Metadata = {
  title: "Project Systems | Spencer Fisher",
};

export default function ProjectsPage() {
  return <ProjectSystemsClient />;
}
