"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useState } from "react";
import { motion } from "motion/react";

import { ProjectActivityTimeline } from "@/components/projects/ProjectActivityTimeline";
import type { ProjectDetail } from "@/types/project";
import { TechnologyBadge } from "@/components/ui/TechnologyBadge";

interface ProjectArchiveRecordProps {
  project: ProjectDetail;
  reduceMotion: boolean;
}

export function ProjectArchiveRecord({ project, reduceMotion }: ProjectArchiveRecordProps) {
  const [activeVisualIndex, setActiveVisualIndex] = useState(0);
  const activeVisual = project.visualRecords[activeVisualIndex] ?? project.visualRecords[0];

  return (
    <motion.article
      className="project-record"
      aria-labelledby="project-record-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
    >
      <RecordField index={0} reduceMotion={reduceMotion} className="project-record__identity">
        <p>{project.category}</p>
        <h2 id="project-record-title">{project.title}</h2>
        <span>{project.description}</span>
      </RecordField>

      <RecordField index={1} reduceMotion={reduceMotion} label="Visual snapshot" className="project-record__visual-field">
        <div className="project-record__gallery">
          <figure className="project-record__hero-visual">
            <Image
              className="project-record__image"
              src={activeVisual.src}
              alt={activeVisual.alt}
              width={1440}
              height={778}
              priority
            />
            <figcaption>
              <span>{String(activeVisualIndex + 1).padStart(2, "0")}</span>
              {activeVisual.label}
            </figcaption>
          </figure>

          {project.visualRecords.length > 1 && (
            <div className="project-record__visual-selector" aria-label={`${project.title} screenshots`}>
              {project.visualRecords.map((visual, index) => (
                <button
                  key={visual.src}
                  type="button"
                  aria-label={`Show ${visual.label}`}
                  aria-pressed={index === activeVisualIndex}
                  onClick={() => setActiveVisualIndex(index)}
                >
                  <Image src={visual.src} alt="" width={320} height={173} />
                  <span>{visual.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </RecordField>

      <RecordField index={2} reduceMotion={reduceMotion} label="Problem solved">
        <p className="project-record__body">{project.problemSolved}</p>
      </RecordField>

      <RecordField index={3} reduceMotion={reduceMotion} label="Stack & architecture">
        <p className="project-record__body">{project.architectureSummary}</p>
        <ul className="capabilities-matrix__technologies project-record__technology-list" aria-label="Technology stack">
          {project.stack.map((technology) => (
            <li key={technology}>
              <TechnologyBadge technology={technology} />
            </li>
          ))}
        </ul>
      </RecordField>

      <RecordField index={4} reduceMotion={reduceMotion} label="Key features">
        <ol className="project-record__features">
          {project.keyFeatures.map((feature, index) => (
            <li key={feature}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{feature}</p>
            </li>
          ))}
        </ol>
      </RecordField>

      {project.verifiedStats.length > 0 && (
        <RecordField index={5} reduceMotion={reduceMotion} label="Stats">
          <dl className="project-record__stats">
            {project.verifiedStats.map((stat) => (
              <div key={stat.label} title={stat.evidence}>
                <dd className="project-record__stat-value">{stat.value}</dd>
                <dt>{stat.label}</dt>
                <dd className="project-record__stat-evidence">{stat.evidence}</dd>
              </div>
            ))}
          </dl>
        </RecordField>
      )}

      <RecordField index={6} reduceMotion={reduceMotion} label="Timeline" className="project-record__timeline-field">
        <ProjectActivityTimeline project={project} />
      </RecordField>
    </motion.article>
  );
}

function RecordField({
  children,
  className,
  index,
  label,
  reduceMotion,
}: {
  children: ReactNode;
  className?: string;
  index: number;
  label?: string;
  reduceMotion: boolean;
}) {
  const classes = ["project-record__field", className].filter(Boolean).join(" ");

  return (
    <motion.section
      className={classes}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.32, delay: index * 0.09, ease: "easeOut" }}
    >
      {label && <h3>{label}</h3>}
      {children}
    </motion.section>
  );
}
