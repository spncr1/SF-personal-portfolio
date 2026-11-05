"use client";

import Image from "next/image";
import type { KeyboardEvent, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { ProjectActivityTimeline } from "@/components/projects/ProjectActivityTimeline";
import { ProjectArchitectureVisualisation } from "@/components/projects/ProjectArchitectureVisualisation";
import { ProjectDevelopmentProcess } from "@/components/projects/ProjectDevelopmentProcess";
import { ProjectEngineeringDossier } from "@/components/projects/ProjectEngineeringDossier";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { TechnologyBadge } from "@/components/ui/TechnologyBadge";
import type { ProjectDetail } from "@/types/project";

interface ProjectArchiveRecordProps {
  project: ProjectDetail;
  reduceMotion: boolean;
}

const dossierSections = ["overview", "engineering", "process", "results", "github"] as const;
type DossierSection = (typeof dossierSections)[number];

const dossierLabels: Record<DossierSection, string> = {
  overview: "Overview",
  engineering: "Engineering",
  process: "Process",
  results: "Results",
  github: "GitHub",
};

export function ProjectArchiveRecord({ project, reduceMotion }: ProjectArchiveRecordProps) {
  const [activeVisualSrc, setActiveVisualSrc] = useState(project.visualRecords[0].src);
  const [activeSection, setActiveSection] = useState<DossierSection>("overview");
  const [entryStaggerActive, setEntryStaggerActive] = useState(true);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const tabSetId = useId();
  const selectedVisualIndex = project.visualRecords.findIndex((visual) => visual.src === activeVisualSrc);
  const activeVisualIndex = selectedVisualIndex >= 0 ? selectedVisualIndex : 0;
  const activeVisual = project.visualRecords[activeVisualIndex];

  useEffect(() => {
    if (reduceMotion) return;

    const entryTimer = window.setTimeout(() => setEntryStaggerActive(false), 2200);
    return () => window.clearTimeout(entryTimer);
  }, [reduceMotion]);

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    let nextIndex: number | null = null;
    const lastIndex = dossierSections.length - 1;

    if (event.key === "ArrowRight") nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    if (event.key === "ArrowLeft") nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = lastIndex;
    if (nextIndex === null) return;

    event.preventDefault();
    const nextSection = dossierSections[nextIndex];
    setActiveSection(nextSection);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <motion.article
      className="project-record"
      data-stagger-entry={!reduceMotion && entryStaggerActive ? "true" : "false"}
      aria-labelledby="project-record-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.24 }}
    >
      <div className="project-record__inspection-deck">
        <section className="project-record__identity" data-project={project.slug}>
          <div className="project-record__identity-heading">
            <span className="project-record__identity-mark" data-project={project.slug}>
              <Image src={project.brand.src} alt={project.brand.alt} width={220} height={220} />
            </span>
            <div>
              <h2 id="project-record-title">{project.title}</h2>
            </div>
          </div>
          <p className="project-record__description">{project.description}</p>

          <ul className="project-record__technology-list" aria-label="Technical stack">
            {project.stack.map((technology) => (
              <li key={technology}><TechnologyBadge technology={technology} /></li>
            ))}
          </ul>

          <ProjectRecordActions project={project} placement="desktop" />
        </section>

        <section className="project-preview" aria-label={`${project.title} application screenshots`}>
          <div className="project-preview__halo" aria-hidden="true" />
          <div className="project-preview__projector" aria-hidden="true">
            <span className="project-preview__beam project-preview__beam--blue" />
            <span className="project-preview__beam project-preview__beam--amber" />
            <span className="project-preview__emitter-shadow" />
            <div className="project-preview__emitter">
              <span className="project-preview__emitter-platform" />
              <span className="project-preview__emitter-ring project-preview__emitter-ring--outer" />
              <span className="project-preview__emitter-ring project-preview__emitter-ring--middle" />
              <span className="project-preview__emitter-ring project-preview__emitter-ring--inner" />
              <span className="project-preview__emitter-core" />
            </div>
          </div>
          <figure className="project-preview__display">
            <span className="project-preview__frame" aria-hidden="true" />
            <Image key={activeVisual.src} className="project-preview__image" src={activeVisual.src} alt={activeVisual.alt} width={1440} height={778} priority />
            <figcaption><span>{String(activeVisualIndex + 1).padStart(2, "0")}</span>{activeVisual.label}</figcaption>
          </figure>
          {project.visualRecords.length > 1 && (
            <div className="project-preview__selector">
              {project.visualRecords.map((visual, index) => (
                <button
                  key={visual.src}
                  type="button"
                  aria-label={`Show ${visual.label}`}
                  aria-pressed={index === activeVisualIndex}
                  onClick={() => setActiveVisualSrc(visual.src)}
                >
                  <Image src={visual.src} alt="" width={320} height={173} />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>
          )}
        </section>
        <ProjectRecordActions project={project} placement="mobile" />
      </div>

      <div className="project-dossier">
        <div className="project-dossier__nav-shell">
          <div className="project-dossier__nav" role="tablist" aria-label={`${project.title} dossier sections`}>
            {dossierSections.map((section, index) => {
              const selected = activeSection === section;
              return (
                <button
                  key={section}
                  ref={(node) => { tabRefs.current[index] = node; }}
                  id={`${tabSetId}-${section}-tab`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${tabSetId}-${section}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveSection(section)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  {dossierLabels[section]}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="project-dossier__panel"
            key={activeSection}
            id={`${tabSetId}-${activeSection}-panel`}
            role="tabpanel"
            aria-labelledby={`${tabSetId}-${activeSection}-tab`}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
          >
            {activeSection === "overview" && <OverviewDossier project={project} reduceMotion={reduceMotion} />}
            {activeSection === "engineering" && <ProjectEngineeringDossier project={project} />}
            {activeSection === "process" && <ProcessDossier project={project} />}
            {activeSection === "results" && <ResultsDossier project={project} />}
            {activeSection === "github" && <GitHubDossier project={project} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

function ProjectRecordActions({ project, placement }: { project: ProjectDetail; placement: "desktop" | "mobile" }) {
  if (!project.live && !project.github) return null;

  return (
    <div className={`project-record__actions project-record__actions--${placement}`}>
      {project.live && (
        <a className="project-record__action project-record__action--primary" href={project.live} target="_blank" rel="noreferrer">
          <SiteIcon className="project-record__action-brand" name="vercel" />
          <span>Launch app</span>
          <SiteIcon className="project-record__action-link" name="open-in-new" />
        </a>
      )}
      {project.github && (
        <a className="project-record__action" href={project.github} target="_blank" rel="noreferrer">
          <SiteIcon className="project-record__action-brand" name="github" />
          <span>View GitHub</span>
          <SiteIcon className="project-record__action-link" name="open-in-new" />
        </a>
      )}
    </div>
  );
}

function OverviewDossier({ project, reduceMotion }: ProjectArchiveRecordProps) {
  const demonstrationVisual = project.visualRecords[0];

  return (
    <div className="project-overview">
      <DossierModule index="01" title="Project demo" className="project-overview__demonstration">
        <figure className="project-demonstration">
          <Image src={demonstrationVisual.src} alt={demonstrationVisual.alt} width={1440} height={810} />
          <figcaption>
            <span>Demonstration poster</span>
            <strong>{demonstrationVisual.label}</strong>
            <small>Narrated demonstration pending</small>
          </figcaption>
        </figure>
      </DossierModule>

      <DossierModule index="02" title="Key features" className="project-overview__features">
        <ol className="project-feature-list">
          {project.keyFeatures.map((feature, index) => (
            <li key={feature}><span>{String(index + 1).padStart(2, "0")}</span><p>{feature}</p></li>
          ))}
        </ol>
      </DossierModule>

      <DossierModule index="03" title="Architecture overview" className="project-overview__architecture">
        <ProjectArchitectureVisualisation project={project} reduceMotion={reduceMotion} />
      </DossierModule>
    </div>
  );
}

function ProcessDossier({ project }: { project: ProjectDetail }) {
  return (
    <DossierModule index="01" title="Development process" className="project-development-section">
      <ProjectDevelopmentProcess key={project.slug} project={project} />
    </DossierModule>
  );
}

function ResultsDossier({ project }: { project: ProjectDetail }) {
  return (
    <DossierModule index="01" title="Verified results">
      <dl className="project-results">
        {project.verifiedStats.map((stat) => (
          <div key={stat.label}><dd>{stat.value}</dd><dt>{stat.label}</dt><dd>{stat.evidence}</dd></div>
        ))}
      </dl>
    </DossierModule>
  );
}

function GitHubDossier({ project }: { project: ProjectDetail }) {
  return <DossierModule index="01" title="Repository activity"><ProjectActivityTimeline project={project} /></DossierModule>;
}

function DossierModule({ children, className, index, title }: { children: ReactNode; className?: string; index: string; title: string }) {
  const classes = ["project-dossier__module", className].filter(Boolean).join(" ");
  return <section className={classes}><h3><span>[ {index} ]</span>{title}</h3><div className="project-dossier__module-content">{children}</div></section>;
}
