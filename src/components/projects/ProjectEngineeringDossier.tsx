"use client";

import type { ReactNode } from "react";
import { useId, useState } from "react";

import { SiteIcon, type SiteIconName } from "@/components/ui/SiteIcon";
import type {
  ProjectDetail,
  ProjectEngineeringChallenge,
  ProjectEngineeringIcon,
} from "@/types/project";

interface ProjectEngineeringDossierProps {
  project: ProjectDetail;
}

const iconNames: Record<ProjectEngineeringIcon, SiteIconName> = {
  api: "api",
  code: "code",
  database: "database",
  description: "description",
  git: "git",
  mail: "mail",
  school: "school",
  vercel: "vercel",
};

export function ProjectEngineeringDossier({
  project,
}: ProjectEngineeringDossierProps) {
  const { engineering } = project;
  const [activeDecisionId, setActiveDecisionId] = useState(
    engineering.decisions[0].id,
  );
  const [activeChallengeId, setActiveChallengeId] = useState(
    engineering.challenges[0].id,
  );
  const decisionGroupId = useId();
  const challengeGroupId = useId();
  const activeDecision =
    engineering.decisions.find((decision) => decision.id === activeDecisionId)
    ?? engineering.decisions[0];
  const activeChallenge =
    engineering.challenges.find((challenge) => challenge.id === activeChallengeId)
    ?? engineering.challenges[0];

  return (
    <section className="engineering-dossier" aria-label="Engineering">
      <div className="engineering-dossier__grid">
        <EngineeringSection
          className="engineering-objective"
          eyebrow="The problem → The opportunity → The goal"
          index="01"
          title="Engineering objective"
        >
          <p className="engineering-section__introduction">
            Why {project.title} exists and how that need became a concrete
            engineering objective.
          </p>

          <div className="engineering-objective__sequence">
            <ObjectiveBlock icon="description" label="The problem">
              <p>{engineering.objective.problem}</p>
            </ObjectiveBlock>
            <ObjectiveBlock icon="school" label="The opportunity">
              <p>{engineering.objective.opportunity}</p>
            </ObjectiveBlock>
            <ObjectiveBlock icon="code" label="The goal">
              <p>{engineering.objective.goal}</p>
            </ObjectiveBlock>
          </div>
        </EngineeringSection>

        <EngineeringSection
          className="engineering-decisions"
          eyebrow="Choices → Alternatives → Reasoning → Trade-offs"
          index="02"
          title="Engineering decisions"
        >
          <p className="engineering-section__introduction">
            Evidence-backed choices made as the project evolved, including the
            approaches they replaced or retained.
          </p>

          <div className="engineering-decisions__explorer">
            <div
              className="engineering-decisions__list"
              aria-label="Engineering decisions"
            >
              {engineering.decisions.map((decision, index) => {
                const selected = decision.id === activeDecision.id;
                return (
                  <button
                    aria-controls={`${decisionGroupId}-detail`}
                    aria-label={`Show decision ${index + 1}: ${decision.label}`}
                    aria-pressed={selected}
                    key={decision.id}
                    onClick={() => setActiveDecisionId(decision.id)}
                    title={decision.label}
                    type="button"
                  >
                    [ {String(index + 1).padStart(2, "0")} ]
                  </button>
                );
              })}
            </div>

            <article
              aria-live="polite"
              className="engineering-decision-detail"
              id={`${decisionGroupId}-detail`}
              key={activeDecision.id}
            >
              <h4>{activeDecision.label}</h4>
              <p>{activeDecision.context}</p>

              <section>
                <h5>Options recorded</h5>
                <ul className="engineering-decision-detail__alternatives">
                  {activeDecision.alternatives.map((alternative) => (
                    <li data-status={alternative.status} key={alternative.label}>
                      <span>{alternative.status}</span>
                      {alternative.label}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h5>Reasoning</h5>
                <p>{activeDecision.reasoning}</p>
              </section>

              <section>
                <h5>Trade-offs</h5>
                <ul className="engineering-decision-detail__tradeoffs">
                  {activeDecision.tradeoffs.map((tradeoff) => (
                    <li data-effect={tradeoff.effect} key={tradeoff.text}>
                      <span aria-hidden="true">
                        {tradeoff.effect === "benefit" ? "+" : "−"}
                      </span>
                      {tradeoff.text}
                    </li>
                  ))}
                </ul>
              </section>

              <div className="engineering-decision-detail__outcome">
                <SiteIcon name="code" />
                <div>
                  <strong>Outcome</strong>
                  <p>{activeDecision.outcome}</p>
                </div>
              </div>
            </article>
          </div>
        </EngineeringSection>

        <EngineeringSection
          className="engineering-challenges"
          eyebrow="Constraint → Investigation → Solution → Outcome"
          index="03"
          title="Engineering challenges"
        >
          <p className="engineering-section__introduction">
            Technical problems supported by the project history, and the work
            used to move each one to a defined outcome.
          </p>

          <div className="engineering-challenges__selector">
            <span>Challenge case files</span>
            <div aria-label="Engineering challenges">
              {engineering.challenges.map((challenge) => (
                <button
                  aria-controls={`${challengeGroupId}-trace`}
                  aria-pressed={challenge.id === activeChallenge.id}
                  key={challenge.id}
                  onClick={() => setActiveChallengeId(challenge.id)}
                  type="button"
                >
                  <SiteIcon name={iconNames[challenge.icon]} />
                  <span>{challenge.label}</span>
                </button>
              ))}
            </div>
          </div>

          <ChallengeTrace
            challenge={activeChallenge}
            id={`${challengeGroupId}-trace`}
          />
        </EngineeringSection>
      </div>
    </section>
  );
}

function EngineeringSection({
  children,
  className,
  eyebrow,
  index,
  title,
}: {
  children: ReactNode;
  className: string;
  eyebrow: string;
  index: string;
  title: string;
}) {
  return (
    <article className={`project-dossier__module engineering-section ${className}`}>
      <h3><span>[ {index} ]</span>{title}</h3>
      <div className="project-dossier__module-content engineering-section__body">
        <p className="engineering-section__eyebrow">{eyebrow}</p>
        {children}
      </div>
    </article>
  );
}

function ObjectiveBlock({
  children,
  icon,
  label,
}: {
  children: ReactNode;
  icon: SiteIconName;
  label: string;
}) {
  return (
    <section className="engineering-objective__block">
      <span><SiteIcon name={icon} /></span>
      <div>
        <h4>{label}</h4>
        {children}
      </div>
    </section>
  );
}

function ChallengeTrace({
  challenge,
  id,
}: {
  challenge: ProjectEngineeringChallenge;
  id: string;
}) {
  const stages = [
    ["Constraint", challenge.constraint],
    ["Investigation", challenge.investigation],
    ["Solution", challenge.solution],
    ["Outcome", challenge.outcome],
  ] as const;

  return (
    <ol
      aria-live="polite"
      className="engineering-challenge-trace"
      id={id}
      key={challenge.id}
    >
      {stages.map(([label, detail], index) => (
        <li key={label}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div>
            <h4>{label}</h4>
            <p>{detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
