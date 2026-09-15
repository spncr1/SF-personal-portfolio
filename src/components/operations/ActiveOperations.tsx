"use client";

import Image from "next/image";
import type { KeyboardEvent } from "react";
import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { RecordRevealEmblem } from "@/components/system/RecordRevealEmblem";
import { SystemLabel } from "@/components/ui/SystemLabel";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { activeOperations, type ActiveOperation } from "@/data/operations";
import type { GitHubOperationsActivity, GitHubRepositoryActivity } from "@/types/github";

type ActivityLoadState = "loading" | "ready" | "unavailable";
type OperationNodeKind = "status" | "phase" | "screenshot" | "thinking" | "github";

interface OperationNode {
  kind: OperationNodeKind;
  eyebrow: string;
}

const operationNodes: OperationNode[] = [
  { kind: "status", eyebrow: "Current state" },
  { kind: "phase", eyebrow: "Active phase" },
  { kind: "screenshot", eyebrow: "Visual feed" },
  { kind: "thinking", eyebrow: "Current thinking" },
  { kind: "github", eyebrow: "GitHub activity" },
];

const tetherPaths = [
  "M 468 277 L 365 194 L 220 194 L 160 130",
  "M 531 276 L 624 184 L 765 184 L 842 116",
  "M 540 322 L 675 336 L 760 385 L 900 385",
  "M 458 326 L 356 372 L 250 455 L 118 455",
  "M 497 348 L 497 460 L 570 520",
];

const nodeBob = [-5, 6, -4, 5, -6];
const nodeBobDuration = [4.8, 5.5, 4.4, 5.8, 5.1];

function formatRelativeTime(value: string) {
  const timestamp = new Date(value).getTime();
  const diffSeconds = Math.round((timestamp - Date.now()) / 1000);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];
  const formatter = new Intl.RelativeTimeFormat("en-AU", { numeric: "auto" });

  for (const [unit, seconds] of units) {
    const amount = Math.trunc(diffSeconds / seconds);
    if (Math.abs(amount) >= 1) return formatter.format(amount, unit);
  }

  return "Just now";
}

function getRepositoryActivity(
  activity: GitHubOperationsActivity | null,
  operation: ActiveOperation,
) {
  return activity?.repositories.find((repository) => repository.id === operation.id) ?? null;
}

export function ActiveOperations() {
  const [selectedId, setSelectedId] = useState(activeOperations[0].id);
  const [activityState, setActivityState] = useState<ActivityLoadState>("loading");
  const [activity, setActivity] = useState<GitHubOperationsActivity | null>(null);
  const shouldReduceMotion = Boolean(useReducedMotion());
  const tabIdPrefix = useId();
  const selectedOperation =
    activeOperations.find((operation) => operation.id === selectedId) ?? activeOperations[0];
  const repositoryActivity = getRepositoryActivity(activity, selectedOperation);

  useEffect(() => {
    let cancelled = false;

    async function loadActivity() {
      try {
        const response = await fetch("/api/github/operations", { cache: "no-store" });
        if (!response.ok) throw new Error("Operations activity unavailable");

        const nextActivity = (await response.json()) as GitHubOperationsActivity;
        if (cancelled) return;

        setActivity(nextActivity);
        setActivityState("ready");
      } catch {
        if (cancelled) return;
        setActivityState("unavailable");
      }
    }

    void loadActivity();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    const lastIndex = activeOperations.length - 1;
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    if (event.key === "ArrowLeft") nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = lastIndex;
    if (nextIndex === null) return;

    event.preventDefault();
    const nextOperation = activeOperations[nextIndex];
    setSelectedId(nextOperation.id);
    requestAnimationFrame(() => {
      document.getElementById(`${tabIdPrefix}-${nextOperation.id}-tab`)?.focus();
    });
  }

  return (
    <section className="sector sector--operations operations-live">
      <header className="operations-live__masthead">
        <SystemLabel>Builds in Progress</SystemLabel>
        <h1>Active Operations</h1>
      </header>

      <div className="operations-live__tabs" role="tablist" aria-label="Active operations">
        {activeOperations.map((operation, index) => {
          const selected = operation.id === selectedOperation.id;
          const tabId = `${tabIdPrefix}-${operation.id}-tab`;

          return (
            <button
              key={operation.id}
              id={tabId}
              className="operations-live__tab"
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${tabIdPrefix}-${operation.id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setSelectedId(operation.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              <span>{operation.code}</span>
              {operation.name}
            </button>
          );
        })}
      </div>

      <div
        key={selectedOperation.id}
        id={`${tabIdPrefix}-${selectedOperation.id}-panel`}
        className="operations-live__stage"
        role="tabpanel"
        aria-labelledby={`${tabIdPrefix}-${selectedOperation.id}-tab`}
      >
        <div className="operations-live__emblem">
          <RecordRevealEmblem mode="open" ariaLabel={`${selectedOperation.name} active operation`} />
          <span>{selectedOperation.code}</span>
        </div>

        <svg
          className="operations-live__tethers"
          viewBox="0 0 1000 620"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {tetherPaths.map((path, index) => (
            <motion.path
              key={path}
              d={path}
              pathLength="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.52, delay: 0.58 + index * 0.13, ease: "easeOut" }
              }
            />
          ))}
        </svg>

        {operationNodes.map((node, index) => {
          const revealDelay = 0.9 + index * 0.13;

          return (
            <motion.article
              key={node.kind}
              className="operations-live__node"
              data-node={node.kind}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.28, delay: revealDelay }}
            >
              <motion.div
                animate={shouldReduceMotion ? { y: 0 } : { y: [0, nodeBob[index], 0] }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        duration: nodeBobDuration[index],
                        delay: revealDelay + 0.3,
                        ease: "easeInOut",
                        repeat: Infinity,
                      }
                }
              >
                <span className="operations-live__node-index">0{index + 1}</span>
                <p className="operations-live__node-eyebrow">{node.eyebrow}</p>
                <OperationNodeContent
                  node={node.kind}
                  operation={selectedOperation}
                  activityState={activityState}
                  repositoryActivity={repositoryActivity}
                />
              </motion.div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function OperationNodeContent({
  node,
  operation,
  activityState,
  repositoryActivity,
}: {
  node: OperationNodeKind;
  operation: ActiveOperation;
  activityState: ActivityLoadState;
  repositoryActivity: GitHubRepositoryActivity | null;
}) {
  if (node === "status") {
    return <strong className="operations-live__status">{operation.status}</strong>;
  }

  if (node === "phase") {
    return <p className="operations-live__copy">{operation.phase}</p>;
  }

  if (node === "thinking") {
    return <p className="operations-live__copy operations-live__copy--thinking">“{operation.currentThinking}”</p>;
  }

  if (node === "screenshot") {
    if (operation.screenshot) {
      return (
        <Image
          className="operations-live__screenshot"
          src={operation.screenshot}
          alt={`${operation.name} interface`}
          width={300}
          height={180}
        />
      );
    }

    return (
      <div className="operations-live__visual-placeholder">
        <SiteIcon name="screenshot-monitor" />
        <p>Screenshot pending</p>
        <span>Real project asset not yet supplied</span>
      </div>
    );
  }

  if (activityState === "loading") {
    return <p className="operations-live__telemetry-state">Synchronising repository</p>;
  }

  if (activityState === "unavailable" || !repositoryActivity || repositoryActivity.state === "unavailable") {
    return <p className="operations-live__telemetry-state">GitHub activity unavailable</p>;
  }

  if (repositoryActivity.state === "empty" || !repositoryActivity.latestCommit) {
    return <p className="operations-live__telemetry-state">No commit activity recorded</p>;
  }

  const commitCount = repositoryActivity.commitsLastSevenDays ?? 0;

  return (
    <div className="operations-live__github">
      <a href={repositoryActivity.latestCommit.url} target="_blank" rel="noreferrer">
        <SiteIcon name="github" />
        {repositoryActivity.latestCommit.message}
        <SiteIcon name="open-in-new" />
      </a>
      <p>
        <span>{commitCount} {commitCount === 1 ? "commit" : "commits"} / 7 days</span>
        <span>{formatRelativeTime(repositoryActivity.latestCommit.committedAt)}</span>
      </p>
    </div>
  );
}
