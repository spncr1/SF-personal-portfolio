"use client";

import type { KeyboardEvent } from "react";
import { useId } from "react";

import type { ProjectDetail } from "@/types/project";
import { SystemLabel } from "@/components/ui/SystemLabel";
import { SiteIcon } from "@/components/ui/SiteIcon";

interface ProjectIndexProps {
  projects: ProjectDetail[];
  onSelect: (project: ProjectDetail) => void;
  selectedSlug?: string;
}

export function ProjectIndex({ projects, onSelect, selectedSlug }: ProjectIndexProps) {
  const directoryId = useId();

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    const lastIndex = projects.length - 1;
    let nextIndex: number | null = null;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = lastIndex;
    if (nextIndex === null) return;

    event.preventDefault();
    const nextProject = projects[nextIndex];
    onSelect(nextProject);
    requestAnimationFrame(() => {
      document.getElementById(`${directoryId}-${nextProject.slug}`)?.focus();
    });
  }

  return (
    <aside className="project-index" aria-label="Project index">
      <div className="project-index__header">
        <SystemLabel variant="metadata">Record directory</SystemLabel>
        <span>{projects.length.toString().padStart(2, "0")} files</span>
      </div>

      <ul className="project-index__list">
        {projects.map((project, index) => {
          const selected = selectedSlug === project.slug;

          return (
            <li key={project.slug}>
              <button
                className="project-index__row"
                id={`${directoryId}-${project.slug}`}
                type="button"
                aria-current={selected ? "true" : undefined}
                onClick={() => onSelect(project)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <span className="project-index__id">{project.recordCode}</span>
                <span className="project-index__title">{project.title}</span>
                <span className="project-index__status">{project.category}</span>
                <SiteIcon className="project-index__marker" name="chevron-right" />
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
