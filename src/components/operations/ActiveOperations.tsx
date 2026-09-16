"use client";

import Image from "next/image";
import type { CSSProperties, KeyboardEvent } from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { RecordRevealEmblem } from "@/components/system/RecordRevealEmblem";
import { SystemLabel } from "@/components/ui/SystemLabel";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { activeOperations, type ActiveOperation } from "@/data/operations";
import { formatRelativeTime } from "@/lib/relativeTime";
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

interface TetherEndpoint {
  x: number;
  y: number;
}

const initialTetherEndpoints: TetherEndpoint[] = [
  { x: 208, y: 118 },
  { x: 747, y: 22 },
  { x: 690, y: 242 },
  { x: 293, y: 384 },
  { x: 430, y: 484 },
];

function getTetherPaths(endpoints: TetherEndpoint[]) {
  const [status, phase, screenshot, thinking, github] = endpoints;

  return [
    `M 468 277 L 365 194 L ${status.x + 52} 194 L ${status.x} ${status.y}`,
    `M 531 276 L 624 184 L ${phase.x - 47} ${phase.y} L ${phase.x} ${phase.y}`,
    `M 540 322 L 640 336 L ${screenshot.x - 15} ${screenshot.y} L ${screenshot.x} ${screenshot.y}`,
    `M 458 326 L 356 372 L ${thinking.x + 63} ${thinking.y} L ${thinking.x} ${thinking.y}`,
    `M 497 348 L 497 430 L ${github.x} ${github.y}`,
  ];
}

const nodeRevealDelays = [1.6, 1.8, 1.9, 2, 2.2];

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
  const [activeNodeIndex, setActiveNodeIndex] = useState<number | null>(null);
  const [tetherEndpoints, setTetherEndpoints] = useState(initialTetherEndpoints);
  const stageRef = useRef<HTMLDivElement>(null);
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

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const nodes = operationNodes.map((node) =>
      stage.querySelector<HTMLElement>(`.operations-live__node[data-node="${node.kind}"]`),
    );

    function measureEndpoints() {
      if (!stage) return;
      const stageRect = stage.getBoundingClientRect();
      if (!stageRect.width || !stageRect.height) return;

      const nextEndpoints = nodes.map((node, index) => {
        if (!node) return initialTetherEndpoints[index];
        const rect = node.getBoundingClientRect();
        const kind = operationNodes[index].kind;
        const useRightEdge = kind === "status" || kind === "thinking";
        const useBottomEdge = kind === "status";

        return {
          x: ((useRightEdge ? rect.right : rect.left) - stageRect.left) * (1000 / stageRect.width),
          y: ((useBottomEdge ? rect.bottom : rect.top) - stageRect.top) * (620 / stageRect.height),
        };
      });

      setTetherEndpoints((currentEndpoints) =>
        nextEndpoints.every(
          (endpoint, index) =>
            Math.abs(endpoint.x - currentEndpoints[index].x) < 0.1 &&
            Math.abs(endpoint.y - currentEndpoints[index].y) < 0.1,
        )
          ? currentEndpoints
          : nextEndpoints,
      );
    }

    measureEndpoints();
    const resizeObserver = new ResizeObserver(measureEndpoints);
    resizeObserver.observe(stage);
    nodes.forEach((node) => {
      if (node) resizeObserver.observe(node);
    });

    return () => resizeObserver.disconnect();
  }, [activityState, selectedOperation.id]);

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
    setActiveNodeIndex(null);
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
              onClick={() => {
                setActiveNodeIndex(null);
                setSelectedId(operation.id);
              }}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              <span>{operation.code}</span>
              {operation.name}
            </button>
          );
        })}
      </div>

      <div
        ref={stageRef}
        key={selectedOperation.id}
        id={`${tabIdPrefix}-${selectedOperation.id}-panel`}
        className="operations-live__stage"
        role="tabpanel"
        aria-labelledby={`${tabIdPrefix}-${selectedOperation.id}-tab`}
      >
        <div className="operations-live__emblem">
          <RecordRevealEmblem mode="open" ariaLabel={`${selectedOperation.name} active operation`} showNode={false} />
          <Image
            className="operations-live__emblem-logo"
            src="/brand/spencer-fisher-logo.png"
            alt=""
            width={855}
            height={1149}
            aria-hidden="true"
          />
        </div>

        <svg
          className="operations-live__tethers"
          viewBox="0 0 1000 620"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="operations-route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--palette-ember)" stopOpacity="0.16" />
              <stop offset="55%" stopColor="var(--palette-gold-soft)" stopOpacity="0.82" />
              <stop offset="100%" stopColor="var(--palette-rust)" stopOpacity="0.28" />
            </linearGradient>
          </defs>
          {getTetherPaths(tetherEndpoints).map((path, index) => (
            <g
              className="operations-live__tether"
              data-active={activeNodeIndex === index}
              key={path}
              style={{ "--operations-reveal-delay": `${860 + index * 80}ms` } as CSSProperties}
            >
              <path className="operations-live__tether-base" d={path} />
              <path className="operations-live__tether-signal" d={path} />
              {activeNodeIndex === index && (
                <circle className="operations-live__tether-packet" r="3.2">
                  <animateMotion dur="0.72s" repeatCount="indefinite" path={path} />
                </circle>
              )}
            </g>
          ))}
        </svg>

        {operationNodes.map((node, index) => {
          const revealDelay = nodeRevealDelays[index];

          return (
            <motion.article
              key={node.kind}
              className="operations-live__node"
              data-node={node.kind}
              initial={shouldReduceMotion ? false : { opacity: 0, filter: "blur(5px) brightness(1.8)" }}
              animate={{ opacity: 1, filter: "blur(0px) brightness(1)" }}
              data-active={activeNodeIndex === index}
              onPointerEnter={() => setActiveNodeIndex(index)}
              onPointerLeave={() => setActiveNodeIndex(null)}
              onFocusCapture={() => setActiveNodeIndex(index)}
              onBlurCapture={() => setActiveNodeIndex(null)}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.8, delay: revealDelay, ease: [0.16, 1, 0.3, 1] }
              }
            >
              <div className="operations-live__panel">
                <div className="operations-live__panel-header">
                  <span className="operations-live__node-index">0{index + 1}</span>
                  <p className="operations-live__node-eyebrow">{node.eyebrow}</p>
                </div>
                <div className="operations-live__panel-content">
                  <OperationNodeContent
                    node={node.kind}
                    operation={selectedOperation}
                    activityState={activityState}
                    repositoryActivity={repositoryActivity}
                  />
                </div>
              </div>
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
        <span className="operations-live__github-message">
          {repositoryActivity.latestCommit.message}
        </span>
        <SiteIcon name="open-in-new" />
      </a>
      <p>
        <span>
          {commitCount === 0
            ? "No commits in the last 7 days"
            : `${commitCount} ${commitCount === 1 ? "commit" : "commits"} in the last 7 days`}
        </span>
        <span>Last updated {formatRelativeTime(repositoryActivity.latestCommit.committedAt)}</span>
      </p>
    </div>
  );
}
