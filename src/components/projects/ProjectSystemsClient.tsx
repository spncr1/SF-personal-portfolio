"use client";

import { useState } from "react";
import { ProjectDisplay } from "@/components/projects/ProjectDisplay";
import { ProjectIndex } from "@/components/projects/ProjectIndex";
import { ProjectTelemetry } from "@/components/projects/ProjectTelemetry";
import { SystemLabel } from "@/components/ui/SystemLabel";
import { projects } from "@/data/projects";
import type { Project } from "@/types/project";

export function ProjectSystemsClient() {
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);

  return (
    <section className="sector sector--projects">
      <div className="project-console__masthead">
        <div>
          <SystemLabel>Project Systems</SystemLabel>
          <h1>Engineering Database</h1>
        </div>
        <span className="project-console__count">{projects.length.toString().padStart(2, "0")} records</span>
      </div>

      <div className="project-console">
        <ProjectIndex
          projects={projects}
          selectedSlug={selectedProject.slug}
          onSelect={setSelectedProject}
        />
        <ProjectDisplay project={selectedProject} />
        <ProjectTelemetry project={selectedProject} />
      </div>
    </section>
  );
}
