"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useParams, useRouter } from "next/navigation";

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
  const router = useRouter();
  const params = useParams<{ slug?: string }>();
  const shouldReduceMotion = Boolean(useReducedMotion());
  const selectedSlug = params.slug ?? initialSlug;
  const selectedProject =
    projects.find((project) => project.slug === selectedSlug) ?? projects[0];

  function selectProject(project: ProjectDetail) {
    if (project.slug === selectedProject.slug) return;

    router.push(`/projects/${project.slug}`, { scroll: false });
  }

  return (
    <section className="sector sector--projects project-systems">
      <header className="project-systems__masthead">
        <div>
          <SystemLabel>Engineering Database</SystemLabel>
          <h1>Project Systems</h1>
        </div>
      </header>

      <div className="project-systems__workspace">
        <ProjectIndex
          projects={projects}
          selectedSlug={selectedProject.slug}
          onSelect={selectProject}
        />

        <ProjectRecordStage
          key={selectedProject.slug}
          project={selectedProject}
          reduceMotion={shouldReduceMotion}
        />
      </div>
    </section>
  );
}

function ProjectRecordStage({
  project,
  reduceMotion,
}: {
  project: ProjectDetail;
  reduceMotion: boolean;
}) {
  const [recordOpen, setRecordOpen] = useState(false);

  useEffect(() => {
    const revealTimer = window.setTimeout(
      () => setRecordOpen(true),
      reduceMotion ? 0 : 2300,
    );

    return () => window.clearTimeout(revealTimer);
  }, [reduceMotion]);

  return (
    <div className="project-systems__record-stage" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {!recordOpen ? (
          <motion.div
            key={`unlock-${project.slug}`}
            className="project-systems__unlock"
            data-reduced-motion={reduceMotion ? "true" : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: reduceMotion ? 0 : 0.16, delay: 0 } }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.2, delay: 0.65 }}
          >
            <div className="project-systems__unlock-content">
              <RecordRevealEmblem
                mode="closed"
                ariaLabel={`Unlocking ${project.title} project record`}
                showNode={false}
              />
              <span>Opening {project.recordCode}</span>
            </div>
          </motion.div>
        ) : (
          <ProjectArchiveRecord
            key={`record-${project.slug}`}
            project={project}
            reduceMotion={reduceMotion}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
