"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { ProjectArchiveRecord } from "@/components/projects/ProjectArchiveRecord";
import { ProjectIndex } from "@/components/projects/ProjectIndex";
import { RecordRevealEmblem } from "@/components/system/RecordRevealEmblem";
import { SystemLabel } from "@/components/ui/SystemLabel";
import { projects } from "@/data/projects";
import type { ProjectDetail } from "@/types/project";

interface ProjectSystemsClientProps {
  initialSlug?: string;
}

export function ProjectSystemsClient({ initialSlug }: ProjectSystemsClientProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectDetail>(
    () => projects.find((project) => project.slug === initialSlug) ?? projects[0],
  );
  const [recordOpen, setRecordOpen] = useState(false);
  const shouldReduceMotion = Boolean(useReducedMotion());

  useEffect(() => {
    const revealTimer = window.setTimeout(
      () => setRecordOpen(true),
      shouldReduceMotion ? 0 : 1060,
    );

    return () => window.clearTimeout(revealTimer);
  }, [selectedProject.slug, shouldReduceMotion]);

  function selectProject(project: ProjectDetail) {
    setRecordOpen(false);
    setSelectedProject(project);
  }

  return (
    <section className="sector sector--projects project-systems">
      <header className="project-systems__masthead">
        <SystemLabel>Engineering Database</SystemLabel>
        <h1>Project Systems</h1>
      </header>

      <div className="project-systems__workspace">
        <ProjectIndex
          projects={projects}
          selectedSlug={selectedProject.slug}
          onSelect={selectProject}
        />

        <div className="project-systems__record-stage" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {!recordOpen ? (
              <motion.div
                key={`unlock-${selectedProject.slug}`}
                className="project-systems__unlock"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.24 }}
              >
                <RecordRevealEmblem
                  mode="closed"
                  ariaLabel={`Unlocking ${selectedProject.title} project record`}
                />
                <span>Opening {selectedProject.recordCode}</span>
              </motion.div>
            ) : (
              <ProjectArchiveRecord
                key={`record-${selectedProject.slug}`}
                project={selectedProject}
                reduceMotion={shouldReduceMotion}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
