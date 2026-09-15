import {
  getGitHubUsername,
  githubFetch,
  GitHubRequestError,
  hasGitHubToken,
  type GitHubCommitResponse,
  type GitHubRepoResponse,
} from "@/lib/github";
import type {
  GitHubProjectTimeline,
  GitHubTimelineCommit,
  GitHubTimelineMonth,
  GitHubTimelineWeek,
} from "@/types/github";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 100;
const REVALIDATE_SECONDS = 900;
const MAX_PAGES = 10;

const projectRepositories = {
  "atmos-fc": { repository: "atmosfc-v1" },
  nexa: { repository: "nexa-v2" },
} as const;

type ProjectSlug = keyof typeof projectRepositories;

function startOfUtcWeek(value: Date) {
  const date = new Date(value);
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - daysSinceMonday);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function toTimelineCommit(commit: GitHubCommitResponse): GitHubTimelineCommit | null {
  const committedAt = commit.commit.committer?.date ?? commit.commit.author?.date;
  if (!committedAt) return null;

  return {
    message: commit.commit.message.split(/\r?\n/, 1)[0].trim(),
    url: commit.html_url,
    committedAt,
  };
}

function buildWeeks(startedAt: string, commits: GitHubTimelineCommit[]): GitHubTimelineWeek[] {
  const firstWeek = startOfUtcWeek(new Date(startedAt));
  const currentWeek = startOfUtcWeek(new Date());
  const totals = new Map<string, number>();

  for (const commit of commits) {
    const key = startOfUtcWeek(new Date(commit.committedAt)).toISOString();
    totals.set(key, (totals.get(key) ?? 0) + 1);
  }

  const weeks: GitHubTimelineWeek[] = [];
  for (let cursor = firstWeek; cursor <= currentWeek; cursor = new Date(cursor.getTime() + 7 * 86_400_000)) {
    const key = cursor.toISOString();
    weeks.push({ startedAt: key, commits: totals.get(key) ?? 0 });
  }

  return weeks;
}

function startOfUtcMonth(value: Date) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), 1));
}

function buildMonths(startedAt: string, commits: GitHubTimelineCommit[]): GitHubTimelineMonth[] {
  const firstMonth = startOfUtcMonth(new Date(startedAt));
  const currentMonth = startOfUtcMonth(new Date());
  const totals = new Map<string, { commits: number; weeks: number[] }>();

  for (const commit of commits) {
    const committedAt = new Date(commit.committedAt);
    const monthKey = `${committedAt.getUTCFullYear()}-${committedAt.getUTCMonth()}`;
    const current = totals.get(monthKey) ?? { commits: 0, weeks: [0, 0, 0, 0, 0] };
    const weekIndex = Math.min(4, Math.floor((committedAt.getUTCDate() - 1) / 7));
    current.commits += 1;
    current.weeks[weekIndex] += 1;
    totals.set(monthKey, current);
  }

  const months: GitHubTimelineMonth[] = [];
  for (
    let cursor = firstMonth;
    cursor <= currentMonth;
    cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1))
  ) {
    const monthKey = `${cursor.getUTCFullYear()}-${cursor.getUTCMonth()}`;
    const activity = totals.get(monthKey) ?? { commits: 0, weeks: [0, 0, 0, 0, 0] };
    months.push({ startedAt: cursor.toISOString(), ...activity });
  }

  return months;
}

async function getProjectCommits(owner: string, repository: string, since: string) {
  const commits: GitHubCommitResponse[] = [];

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const result = await githubFetch<GitHubCommitResponse[]>(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/commits?since=${encodeURIComponent(since)}&per_page=${PAGE_SIZE}&page=${page}`,
      REVALIDATE_SECONDS,
    );
    commits.push(...result);
    if (result.length < PAGE_SIZE) break;
  }

  return commits;
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in projectRepositories)) {
    return Response.json({ error: "Unknown project" }, { status: 404 });
  }

  const projectId = slug as ProjectSlug;
  const project = projectRepositories[projectId];
  const username = getGitHubUsername();
  const repositoryUrl = `https://github.com/${encodeURIComponent(username)}/${encodeURIComponent(project.repository)}`;
  const now = new Date().toISOString();

  try {
    const repository = await githubFetch<GitHubRepoResponse>(
      `/repos/${encodeURIComponent(username)}/${encodeURIComponent(project.repository)}`,
      REVALIDATE_SECONDS,
    );
    const responses = await getProjectCommits(username, project.repository, repository.created_at);
    const commits = responses
      .map(toTimelineCommit)
      .filter((commit): commit is GitHubTimelineCommit => commit !== null);
    const weeks = buildWeeks(repository.created_at, commits);
    const months = buildMonths(repository.created_at, commits);
    const peakWeekCommits = weeks.reduce((peak, week) => Math.max(peak, week.commits), 0);

    const timeline: GitHubProjectTimeline = {
      projectId,
      repository: project.repository,
      repositoryUrl,
      state: commits.length > 0 ? "ready" : "empty",
      startedAt: repository.created_at,
      totalCommits: commits.length,
      activeWeeks: weeks.filter((week) => week.commits > 0).length,
      peakWeekCommits,
      firstCommit: commits.at(-1) ?? null,
      latestCommit: commits[0] ?? null,
      months,
      weeks,
      updatedAt: now,
      source: hasGitHubToken() ? "authenticated" : "public",
    };

    return Response.json(timeline, {
      headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" },
    });
  } catch (error) {
    const unavailable: GitHubProjectTimeline = {
      projectId,
      repository: project.repository,
      repositoryUrl,
      state: error instanceof GitHubRequestError && error.status === 409 ? "empty" : "unavailable",
      startedAt: now,
      totalCommits: null,
      activeWeeks: null,
      peakWeekCommits: null,
      firstCommit: null,
      latestCommit: null,
      months: [],
      weeks: [],
      updatedAt: now,
      source: hasGitHubToken() ? "authenticated" : "public",
    };

    return Response.json(unavailable, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900" },
    });
  }
}
