"use client";

import { useEffect, useState } from "react";

import { SiteIcon } from "@/components/ui/SiteIcon";
import type { GitHubProjectTimeline, GitHubTimelineCommit } from "@/types/github";
import type { ProjectDetail } from "@/types/project";

type TimelineLoadState = "loading" | "ready" | "unavailable";

interface ProjectActivityTimelineProps {
  project: ProjectDetail;
}

const monthFormatter = new Intl.DateTimeFormat("en-AU", { month: "short", timeZone: "UTC" });
const dateFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function activityLevel(commits: number, peak: number) {
  if (commits === 0 || peak === 0) return 0;
  return Math.max(1, Math.ceil((commits / peak) * 3));
}

function CommitMilestone({ commit, label }: { commit: GitHubTimelineCommit; label: string }) {
  return (
    <a className="project-activity__milestone" href={commit.url} target="_blank" rel="noreferrer">
      <span>{label}</span>
      <strong>{commit.message}</strong>
      <time dateTime={commit.committedAt}>{dateFormatter.format(new Date(commit.committedAt))}</time>
      <SiteIcon name="open-in-new" />
    </a>
  );
}

export function ProjectActivityTimeline({ project }: ProjectActivityTimelineProps) {
  const [state, setState] = useState<TimelineLoadState>("loading");
  const [timeline, setTimeline] = useState<GitHubProjectTimeline | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTimeline() {
      setState("loading");
      try {
        const response = await fetch(`/api/github/projects/${encodeURIComponent(project.slug)}`, { cache: "no-store" });
        if (!response.ok) throw new Error("Project activity unavailable");
        const nextTimeline = (await response.json()) as GitHubProjectTimeline;
        if (cancelled) return;
        setTimeline(nextTimeline);
        setState(nextTimeline.state === "unavailable" ? "unavailable" : "ready");
      } catch {
        if (cancelled) return;
        setTimeline(null);
        setState("unavailable");
      }
    }

    void loadTimeline();
    return () => {
      cancelled = true;
    };
  }, [project.slug]);

  if (state === "loading") {
    return <p className="project-activity__state">Synchronising repository history</p>;
  }

  if (state === "unavailable" || !timeline) {
    return <p className="project-activity__state">Repository history is temporarily unavailable</p>;
  }

  if (timeline.state === "empty" || timeline.months.length === 0) {
    return <p className="project-activity__state">No repository activity recorded for this period</p>;
  }

  const peak = timeline.peakWeekCommits ?? 0;
  const peakMonth = Math.max(...timeline.months.map((month) => month.commits), 1);

  return (
    <div className="project-activity">
      <div className="project-activity__summary">
        <div>
          <strong>{timeline.totalCommits ?? 0}</strong>
          <span>Total commits</span>
        </div>
        <div>
          <strong>{timeline.activeWeeks ?? 0}</strong>
          <span>Active weeks</span>
        </div>
        <div>
          <strong>{timeline.peakWeekCommits ?? 0}</strong>
          <span>Commits during peak week</span>
        </div>
      </div>

      <p className="project-activity__range">
        <time dateTime={timeline.startedAt}>{dateFormatter.format(new Date(timeline.startedAt))}</time>
        <span aria-hidden="true">-</span>
        <span>Present</span>
      </p>

      <div className="project-activity__chart-wrap">
        <ul className="project-activity__months-grid" aria-label={`${timeline.totalCommits ?? 0} commits grouped by month`}>
          {timeline.months.map((month) => {
            const monthDate = new Date(month.startedAt);
            const fill = month.commits === 0 ? 0 : Math.max(12, Math.round((month.commits / peakMonth) * 100));

            return (
              <li key={month.startedAt} title={`${monthFormatter.format(monthDate)} ${monthDate.getUTCFullYear()}: ${month.commits} ${month.commits === 1 ? "commit" : "commits"}`}>
                <div className="project-activity__month-heading">
                  <span>{monthFormatter.format(monthDate)}</span>
                  <time dateTime={month.startedAt}>{monthDate.getUTCFullYear()}</time>
                </div>
                <div className="project-activity__month-meter" aria-hidden="true">
                  <i style={{ height: `${fill}%` }} />
                </div>
                <strong>{month.commits}</strong>
                <span className="project-activity__month-unit">{month.commits === 1 ? "commit" : "commits"}</span>
                <div className="project-activity__week-pulses" aria-hidden="true">
                  {month.weeks.map((commits, index) => <i key={index} data-level={activityLevel(commits, peak)} />)}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="project-activity__legend" aria-label="Weekly activity key">
          <span><i data-level="0" />No commits</span>
          <span><i data-level="1" />Low activity</span>
          <span><i data-level="2" />Moderate activity</span>
          <span><i data-level="3" />High activity</span>
        </div>
      </div>

      {(timeline.firstCommit || timeline.latestCommit) && (
        <div className="project-activity__milestones">
          {timeline.firstCommit && <CommitMilestone commit={timeline.firstCommit} label="Project initialisation" />}
          {timeline.latestCommit && <CommitMilestone commit={timeline.latestCommit} label="Latest update" />}
        </div>
      )}

      <div className="project-activity__links">
        {project.github && (
          <a href={project.github} target="_blank" rel="noreferrer">
            <SiteIcon className="project-activity__link-icon" name="github" />
            <span>REPOSITORY</span>
            <SiteIcon className="project-activity__external-icon" name="open-in-new" />
          </a>
        )}
        {project.live && (
          <a href={project.live} target="_blank" rel="noreferrer">
            <SiteIcon className="project-activity__link-icon" name="vercel" />
            <span>DEPLOYMENT</span>
            <SiteIcon className="project-activity__external-icon" name="open-in-new" />
          </a>
        )}
      </div>
    </div>
  );
}
