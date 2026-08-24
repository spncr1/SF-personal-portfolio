"use client";

import type { Project } from "@/types/project";
import { SystemLabel } from "@/components/ui/SystemLabel";

interface ProjectIndexProps {
  projects: Project[];
  onSelect: (project: Project) => void;
  selectedSlug?: string;
}

export function ProjectIndex({ projects, onSelect, selectedSlug }: ProjectIndexProps) {
  return (
    <aside className="project-index" aria-label="Project index">
      <div className="project-index__header">
        <SystemLabel variant="metadata">Index</SystemLabel>
        <span>ID / Record / Year</span>
      </div>

      <ul className="project-index__list">
        {projects.map((project, index) => {
          const selected = selectedSlug === project.slug;

          return (
            <li key={project.slug}>
              <button
                className="project-index__row"
                type="button"
                aria-current={selected ? "true" : undefined}
                onClick={() => onSelect(project)}
              >
                <span className="project-index__id">PRJ-{String(index + 1).padStart(2, "0")}</span>
                <span className="project-index__title">{project.title}</span>
                <span className="project-index__status">{project.status}</span>
                <span className="project-index__year">{project.year}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
