import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Project Systems | Spencer Fisher",
};

export default function ProjectsPage() {
  redirect(`/projects/${projects[0].slug}`);
}
