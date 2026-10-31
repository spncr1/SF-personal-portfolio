"use client";

import Image from "next/image";
import type { CSSProperties, KeyboardEvent } from "react";
import { useEffect, useId, useRef } from "react";

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
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const revealSelectedRow = () => {
      const selectedRow = list.querySelector<HTMLElement>('[aria-current="true"]');
      if (!selectedRow) return;

      const listBounds = list.getBoundingClientRect();
      const rowBounds = selectedRow.getBoundingClientRect();
      const rowLeft = list.scrollLeft + rowBounds.left - listBounds.left;
      const rowRight = rowLeft + rowBounds.width;
      const visibleLeft = list.scrollLeft;
      const visibleRight = visibleLeft + list.clientWidth;

      if (rowLeft < visibleLeft) list.scrollTo({ left: rowLeft, behavior: "auto" });
      if (rowRight > visibleRight) list.scrollTo({ left: rowRight - list.clientWidth, behavior: "auto" });
    };

    const frame = window.requestAnimationFrame(revealSelectedRow);
    const resizeObserver = new ResizeObserver(revealSelectedRow);
    resizeObserver.observe(list);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [selectedSlug]);

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

      <ul className="project-index__list" ref={listRef}>
        {projects.map((project, index) => {
          const selected = selectedSlug === project.slug;

          return (
            <li
              key={project.slug}
              style={{ "--project-directory-delay": `${540 + index * 140}ms` } as CSSProperties}
            >
              <button
                className="project-index__row"
                data-project={project.slug}
                id={`${directoryId}-${project.slug}`}
                type="button"
                aria-current={selected ? "true" : undefined}
                onClick={() => onSelect(project)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <span className="project-index__logo">
                  <Image src={project.brand.src} alt="" width={180} height={180} />
                </span>
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
