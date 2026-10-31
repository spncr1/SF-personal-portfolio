"use client";

import { useEffect, useState } from "react";

import { SiteIcon } from "@/components/ui/SiteIcon";
import type {
  GitHubProjectTimeline,
  GitHubTimelineCommit,
  GitHubTimelineMonth,
} from "@/types/github";
import type { ProjectDetail } from "@/types/project";

type TimelineLoadState = "loading" | "ready" | "unavailable";

interface ProjectActivityTimelineProps {
  project: ProjectDetail;
}

const monthFormatter = new Intl.DateTimeFormat("en-AU", {
  month: "short",
  timeZone: "UTC",
});
const monthYearFormatter = new Intl.DateTimeFormat("en-AU", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
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

function countLongestActiveStreak(weeks: GitHubProjectTimeline["weeks"]) {
  let longest = 0;
  let current = 0;

  for (const week of weeks) {
    current = week.commits > 0 ? current + 1 : 0;
    longest = Math.max(longest, current);
  }

  return longest;
}

function countCurrentActiveStreak(weeks: GitHubProjectTimeline["weeks"]) {
  let streak = 0;

  for (let index = weeks.length - 1; index >= 0; index -= 1) {
    if (weeks[index].commits === 0) break;
    streak += 1;
  }

  return streak;
}

function formatWeeks(value: number) {
  return `${value} ${value === 1 ? "week" : "weeks"}`;
}

function CommitMilestone({
  commit,
  icon,
  label,
}: {
  commit: GitHubTimelineCommit;
  icon: "description" | "git";
  label: string;
}) {
  return (
    <article className="project-activity__milestone">
      <span className="project-activity__milestone-icon">
        <SiteIcon name={icon} />
      </span>
      <div>
        <span>{label}</span>
        <strong>{commit.message}</strong>
        <time dateTime={commit.committedAt}>
          {dateFormatter.format(new Date(commit.committedAt))}
        </time>
      </div>
      <a href={commit.url} target="_blank" rel="noreferrer">
        <SiteIcon name="open-in-new" />
        View commit
      </a>
    </article>
  );
}

function findMonth(
  months: GitHubTimelineMonth[],
  year: number,
  monthIndex: number,
) {
  return months.find((month) => {
    const date = new Date(month.startedAt);
    return date.getUTCFullYear() === year && date.getUTCMonth() === monthIndex;
  });
}

export function ProjectActivityTimeline({ project }: ProjectActivityTimelineProps) {
  const [state, setState] = useState<TimelineLoadState>("loading");
  const [timeline, setTimeline] = useState<GitHubProjectTimeline | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getUTCFullYear());

  useEffect(() => {
    let cancelled = false;

    async function loadTimeline() {
      setState("loading");
      try {
        const response = await fetch(
          `/api/github/projects/${encodeURIComponent(project.slug)}`,
          { cache: "no-store" },
        );
        if (!response.ok) throw new Error("Project activity unavailable");
        const nextTimeline = (await response.json()) as GitHubProjectTimeline;
        if (cancelled) return;
        setTimeline(nextTimeline);
        setSelectedYear(new Date().getUTCFullYear());
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

  const currentMonth = new Date(
    Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1),
  );
  const projectStartedAt = new Date(timeline.startedAt);
  const firstYear = projectStartedAt.getUTCFullYear();
  const displayedMonths = Array.from({ length: 12 }, (_, monthIndex) => {
    const date = new Date(Date.UTC(selectedYear, monthIndex, 1));
    const month = findMonth(timeline.months, selectedYear, monthIndex);
    const future = date > currentMonth;
    const beforeProject = date < new Date(
      Date.UTC(projectStartedAt.getUTCFullYear(), projectStartedAt.getUTCMonth(), 1),
    );

    return { beforeProject, date, future, month };
  });
  const selectedYearPeak = Math.max(
    ...displayedMonths.map(({ month }) => month?.commits ?? 0),
    1,
  );
  const peakMonth = timeline.months.reduce((peak, month) =>
    month.commits > peak.commits ? month : peak,
  );
  const averageCommits = timeline.activeWeeks
    ? (timeline.totalCommits ?? 0) / timeline.activeWeeks
    : 0;
  const longestStreak = countLongestActiveStreak(timeline.weeks);
  const currentStreak = countCurrentActiveStreak(timeline.weeks);

  return (
    <div className="project-activity">
      <div
        className="project-activity__column-row project-activity__summary"
        data-columns="3"
      >
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

      <div className="project-activity__dashboard">
        <section className="project-activity__monthly" aria-labelledby="monthly-activity-title">
          <header className="project-activity__section-heading">
            <div>
              <h4 id="monthly-activity-title">Monthly activity</h4>
              <p className="project-activity__range">
                <time dateTime={timeline.startedAt}>
                  {dateFormatter.format(new Date(timeline.startedAt))}
                </time>
                <span aria-hidden="true">—</span>
                <span>Present</span>
              </p>
            </div>

            <div className="project-activity__year-control" aria-label="Activity year">
              {selectedYear > firstYear ? (
                <button
                  aria-label={`Show ${selectedYear - 1} activity`}
                  onClick={() => setSelectedYear((year) => Math.max(firstYear, year - 1))}
                  type="button"
                >
                  ‹
                </button>
              ) : (
                <span aria-hidden="true" />
              )}
              <strong>{selectedYear}</strong>
              <button
                aria-label={`Show ${selectedYear + 1} activity`}
                onClick={() => setSelectedYear((year) => year + 1)}
                type="button"
              >
                ›
              </button>
            </div>
          </header>

          <ul
            className="project-activity__months-grid"
            aria-label={`${selectedYear} commits grouped by month`}
          >
            {displayedMonths.map(({ beforeProject, date, future, month }) => {
              const commits = month?.commits ?? 0;
              const level = activityLevel(commits, selectedYearPeak);
              const inactiveState = future
                ? "future"
                : beforeProject
                  ? "pre-project"
                  : undefined;

              return (
                <li
                  data-level={level}
                  data-state={inactiveState}
                  key={date.toISOString()}
                  title={
                    inactiveState
                      ? `${monthYearFormatter.format(date)}: ${future ? "upcoming" : "before project creation"}`
                      : `${monthYearFormatter.format(date)}: ${commits} ${commits === 1 ? "commit" : "commits"}`
                  }
                >
                  <div className="project-activity__month-heading">
                    <span>{monthFormatter.format(date)}</span>
                    <time dateTime={date.toISOString()}>{selectedYear}</time>
                  </div>
                  <div className="project-activity__month-meter" aria-hidden="true">
                    {inactiveState ? null : (
                      <i
                        style={{
                          height: `${commits === 0 ? 0 : Math.max(10, Math.round((commits / selectedYearPeak) * 100))}%`,
                        }}
                      />
                    )}
                  </div>
                  {inactiveState ? (
                    <span className="project-activity__month-status">
                      {future ? "Upcoming" : "Pre-project"}
                    </span>
                  ) : (
                    <>
                      <strong>{commits}</strong>
                      <span className="project-activity__month-unit">
                        {commits === 1 ? "commit" : "commits"}
                      </span>
                    </>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="project-activity__legend" aria-label="Monthly activity key">
            <span><i data-level="1" />Low activity</span>
            <span><i data-level="2" />Moderate activity</span>
            <span><i data-level="3" />High activity</span>
            <span><i data-level="future" />Future month</span>
          </div>
        </section>

        <aside className="project-activity__intelligence" aria-labelledby="repository-intelligence-title">
          <header className="project-activity__section-heading">
            <h4 id="repository-intelligence-title">Repository intelligence</h4>
            <SiteIcon name="github" />
          </header>

          <div className="project-activity__milestones">
            {timeline.firstCommit ? (
              <CommitMilestone
                commit={timeline.firstCommit}
                icon="git"
                label="Project initialisation"
              />
            ) : null}
            {timeline.latestCommit ? (
              <CommitMilestone
                commit={timeline.latestCommit}
                icon="description"
                label="Latest commit"
              />
            ) : null}
          </div>

          <section className="project-activity__insights" aria-labelledby="activity-insights-title">
            <h5 id="activity-insights-title">
              <SiteIcon name="git" />
              Activity insights
            </h5>
            <dl>
              <div>
                <dt>Average commits / active week</dt>
                <dd>{averageCommits.toFixed(1)}</dd>
              </div>
              <div>
                <dt>Most active month</dt>
                <dd>{monthYearFormatter.format(new Date(peakMonth.startedAt))}</dd>
              </div>
              <div>
                <dt>Peak monthly commits</dt>
                <dd>{peakMonth.commits}</dd>
              </div>
              <div>
                <dt>Longest active streak</dt>
                <dd>{formatWeeks(longestStreak)}</dd>
              </div>
              <div>
                <dt>Current active streak</dt>
                <dd>{formatWeeks(currentStreak)}</dd>
              </div>
            </dl>
          </section>

          <div className="project-activity__links">
            {project.github ? (
              <a href={project.github} target="_blank" rel="noreferrer">
                <SiteIcon className="project-activity__link-icon" name="github" />
                <span>Repository</span>
                <SiteIcon className="project-activity__external-icon" name="open-in-new" />
              </a>
            ) : null}
            {project.live ? (
              <a href={project.live} target="_blank" rel="noreferrer">
                <SiteIcon className="project-activity__link-icon" name="vercel" />
                <span>Deployment</span>
                <SiteIcon className="project-activity__external-icon" name="open-in-new" />
              </a>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
