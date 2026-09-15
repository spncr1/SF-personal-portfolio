import type { Metadata } from "next";
import { getProjectBySlug } from "@/data/projects";
import { ProjectSystemsClient } from "@/components/projects/ProjectSystemsClient";
import { notFound } from "next/navigation";

interface ProjectInspectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectInspectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  return {
    title: `${project?.title ?? "Project Inspection"} | Spencer Fisher`,
  };
}

export default async function ProjectInspectionPage({
  params,
}: ProjectInspectionPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectSystemsClient initialSlug={project.slug} />;
}
