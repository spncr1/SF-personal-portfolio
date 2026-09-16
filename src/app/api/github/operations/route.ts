import {
  getGitHubRepositoryUrl,
  githubRepositories,
  operationRepositoryIds,
} from "@/data/githubRepositories";
import {
  getGitHubUsername,
  githubFetch,
  GitHubRequestError,
  hasGitHubToken,
  type GitHubCommitResponse,
  type GitHubRepoResponse,
} from "@/lib/github";
import type {
  GitHubCommitSignal,
  GitHubOperationsActivity,
  GitHubRepositoryActivity,
} from "@/types/github";

export const dynamic = "force-dynamic";

const WINDOW_DAYS = 7 as const;
const PAGE_SIZE = 100;
const REVALIDATE_SECONDS = 300;

function toCommitSignal(commit: GitHubCommitResponse): GitHubCommitSignal | null {
  const committedAt = commit.commit.committer?.date ?? commit.commit.author?.date;

  if (!committedAt) return null;

  return {
    message: commit.commit.message.split(/\r?\n/, 1)[0].trim(),
    url: commit.html_url,
    committedAt,
  };
}

async function getRecentCommits(owner: string, repository: string, since: string) {
  const commits: GitHubCommitResponse[] = [];
  let page = 1;

  while (true) {
    const result = await githubFetch<GitHubCommitResponse[]>(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/commits?since=${encodeURIComponent(since)}&per_page=${PAGE_SIZE}&page=${page}`,
      REVALIDATE_SECONDS,
    );

    commits.push(...result);

    if (result.length < PAGE_SIZE) return commits;
    page += 1;
  }
}

async function getLatestCommit(owner: string, repository: string) {
  const commits = await githubFetch<GitHubCommitResponse[]>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/commits?per_page=1`,
    REVALIDATE_SECONDS,
  );

  return commits[0] ?? null;
}

async function getRepositoryActivity(
  username: string,
  id: (typeof operationRepositoryIds)[number],
  windowStartedAt: string,
): Promise<GitHubRepositoryActivity> {
  const { repository } = githubRepositories[id];
  const repositoryUrl = getGitHubRepositoryUrl(id, username);

  try {
    const repositoryResponse = await githubFetch<GitHubRepoResponse>(
      `/repos/${encodeURIComponent(username)}/${encodeURIComponent(repository)}`,
      REVALIDATE_SECONDS,
    );
    if (repositoryResponse.private) {
      throw new GitHubRequestError(404);
    }

    const recentCommits = await getRecentCommits(username, repository, windowStartedAt);
    const latestResponse = recentCommits[0] ?? (await getLatestCommit(username, repository));
    const latestCommit = latestResponse ? toCommitSignal(latestResponse) : null;

    return {
      id,
      repository,
      repositoryUrl,
      state: latestCommit ? "ready" : "empty",
      latestCommit,
      commitsLastSevenDays: recentCommits.length,
    };
  } catch (error) {
    if (error instanceof GitHubRequestError && error.status === 409) {
      return {
        id,
        repository,
        repositoryUrl,
        state: "empty",
        latestCommit: null,
        commitsLastSevenDays: 0,
      };
    }

    return {
      id,
      repository,
      repositoryUrl,
      state: "unavailable",
      latestCommit: null,
      commitsLastSevenDays: null,
    };
  }
}

export async function GET() {
  const username = getGitHubUsername();
  const now = new Date();
  const windowStartedAt = new Date(now.getTime() - WINDOW_DAYS * 86_400_000).toISOString();
  const repositories = await Promise.all(
    operationRepositoryIds.map((repositoryId) =>
      getRepositoryActivity(username, repositoryId, windowStartedAt),
    ),
  );

  const activity: GitHubOperationsActivity = {
    username,
    windowDays: WINDOW_DAYS,
    windowStartedAt,
    repositories,
    updatedAt: now.toISOString(),
    source: hasGitHubToken() ? "authenticated" : "public",
  };

  return Response.json(activity, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
    },
  });
}
