"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { SiteIcon, type SiteIconName } from "@/components/ui/SiteIcon";
import type { ProjectDetail } from "@/types/project";

interface ProjectDevelopmentProcessProps {
  project: ProjectDetail;
}

const detailIcons: Record<string, SiteIconName> = {
  objective: "draw",
  development: "code",
  outcome: "api",
  changes: "git",
  next: "chevron-right",
};

export function ProjectDevelopmentProcess({ project }: ProjectDevelopmentProcessProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const milestones = project.developmentProcess.milestones;
  const activeMilestone = milestones[activeIndex];

  return (
    <div className="development-process" aria-label={`${project.title} development process`}>
      <nav className="development-process__timeline" aria-label="Development milestones">
        <StageNavigation placement="mobile" activeIndex={activeIndex} count={milestones.length} onChange={setActiveIndex} />
        <ol className="development-process__timeline-list">
          {milestones.map((milestone, index) => {
            const selected = index === activeIndex;
            const tone = index % 2 === 0 ? "amber" : "blue";

            return (
              <li data-tone={tone} key={milestone.id}>
                <span className="development-process__node" aria-hidden="true" />
                <button
                  aria-current={selected ? "step" : undefined}
                  aria-label={`View milestone ${index + 1}: ${milestone.title}`}
                  data-selected={selected ? "true" : undefined}
                  data-tone={tone}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                >
                  <span className="development-process__milestone-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="development-process__milestone-copy">
                    <strong>{milestone.title}</strong>
                    <small>{milestone.period}</small>
                  </span>
                  <SiteIcon
                    className="development-process__milestone-chevron"
                    name="chevron-right"
                  />
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <section className="development-process__detail" aria-live="polite">
        <StageNavigation placement="desktop" activeIndex={activeIndex} count={milestones.length} onChange={setActiveIndex} />

        <div className="development-process__detail-grid" key={activeMilestone.id}>
          {activeMilestone.objective ? (
            <ProcessDetailCard icon={detailIcons.objective} title="Objective">
              <p>{activeMilestone.objective}</p>
            </ProcessDetailCard>
          ) : null}

          {activeMilestone.keyDevelopment ? (
            <ProcessDetailCard icon={detailIcons.development} title="Key development">
              <ProcessList bulleted items={activeMilestone.keyDevelopment} />
            </ProcessDetailCard>
          ) : null}

          {activeMilestone.outcome ? (
            <ProcessDetailCard icon={detailIcons.outcome} title="Outcome">
              <p>{activeMilestone.outcome}</p>
            </ProcessDetailCard>
          ) : null}

          {activeMilestone.keyChanges ? (
            <ProcessDetailCard
              className={activeMilestone.nextSteps
                ? "development-process__detail-card--split"
                : "development-process__detail-card--wide"}
              icon={detailIcons.changes}
              title="Key changes"
            >
              <ProcessList bulleted items={activeMilestone.keyChanges} />
            </ProcessDetailCard>
          ) : null}

          {activeMilestone.nextSteps ? (
            <ProcessDetailCard
              className={activeMilestone.keyChanges
                ? "development-process__detail-card--split"
                : "development-process__detail-card--wide"}
              icon={detailIcons.next}
              title="Next steps"
            >
              <ProcessList items={activeMilestone.nextSteps} />
            </ProcessDetailCard>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function StageNavigation({ placement, activeIndex, count, onChange }: {
  placement: "desktop" | "mobile";
  activeIndex: number;
  count: number;
  onChange: (index: number) => void;
}) {
  return (
    <div className={`development-process__stage-navigation development-process__stage-navigation--${placement}`}>
      <button
        aria-label="View previous development milestone"
        disabled={activeIndex === 0}
        onClick={() => onChange(Math.max(0, activeIndex - 1))}
        type="button"
      >
        <SiteIcon name="chevron-right" />
      </button>
      <button
        aria-label="View next development milestone"
        disabled={activeIndex === count - 1}
        onClick={() => onChange(Math.min(count - 1, activeIndex + 1))}
        type="button"
      >
        <SiteIcon name="chevron-right" />
      </button>
    </div>
  );
}

function ProcessDetailCard({
  children,
  className,
  icon,
  title,
}: {
  children: ReactNode;
  className?: string;
  icon: SiteIconName;
  title: string;
}) {
  const classes = ["development-process__detail-card", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes}>
      <SiteIcon className="development-process__detail-icon" name={icon} />
      <div>
        <h5>{title}</h5>
        {children}
      </div>
    </section>
  );
}

function ProcessList({
  bulleted = false,
  items,
}: {
  bulleted?: boolean;
  items: readonly string[];
}) {
  return (
    <ul data-bulleted={bulleted ? "true" : undefined}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
