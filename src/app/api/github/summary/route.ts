import type { GitHubLanguageStat, GitHubSummary } from "@/types/github";

export const dynamic = "force-dynamic";

interface GitHubUserResponse {
  login: string;
  html_url: string;
  public_repos: number;
}

interface GitHubRepoResponse {
  name: string;
  description: string | null;
  html_url: string;
  fork: boolean;
  archived: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string | null;
  updated_at: string;
  owner: {
    login: string;
  };
}

function githubHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "spencer-fisher-portfolio",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function githubFetch<T>(path: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: githubHeaders(),
    next: { revalidate: 900 },
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function countLanguages(repos: GitHubRepoResponse[]): GitHubLanguageStat[] {
  const languageCounts = new Map<string, number>();

  for (const repo of repos) {
    if (!repo.language) continue;
    languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
  }

  return Array.from(languageCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name))
    .slice(0, 4);
}

function isRecentlyActive(repo: GitHubRepoResponse) {
  const pushedAt = repo.pushed_at ? new Date(repo.pushed_at).getTime() : new Date(repo.updated_at).getTime();
  const daysSincePush = (Date.now() - pushedAt) / 86_400_000;

  return daysSincePush <= 180;
}

function latestRepo(repos: GitHubRepoResponse[]) {
  const [repo] = [...repos].sort((left, right) => {
    const leftTime = new Date(left.pushed_at ?? left.updated_at).getTime();
    const rightTime = new Date(right.pushed_at ?? right.updated_at).getTime();

    return rightTime - leftTime;
  });

  if (!repo) return null;

  return {
    name: repo.name,
    description: repo.description,
    url: repo.html_url,
    pushedAt: repo.pushed_at,
  };
}

export async function GET() {
  const username = process.env.GITHUB_USERNAME?.trim() || "spncr1";
  const encodedUsername = encodeURIComponent(username);
  const hasToken = Boolean(process.env.GITHUB_TOKEN);

  try {
    const userPromise = githubFetch<GitHubUserResponse>(`/users/${encodedUsername}`);
    const reposPromise = hasToken
      ? githubFetch<GitHubRepoResponse[]>("/user/repos?per_page=100&sort=updated&affiliation=owner")
      : githubFetch<GitHubRepoResponse[]>(`/users/${encodedUsername}/repos?per_page=100&sort=updated&type=owner`);

    const [user, reposResponse] = await Promise.all([userPromise, reposPromise]);
    const ownedRepos = reposResponse.filter(
      (repo) => repo.owner.login.toLowerCase() === username.toLowerCase() && !repo.fork,
    );
    const signalRepos = ownedRepos.filter((repo) => !repo.archived);

    const summary: GitHubSummary = {
      username: user.login,
      profileUrl: user.html_url,
      publicRepos: hasToken ? ownedRepos.length : user.public_repos,
      activeRepos: signalRepos.filter(isRecentlyActive).length,
      totalStars: signalRepos.reduce((total, repo) => total + repo.stargazers_count, 0),
      totalForks: signalRepos.reduce((total, repo) => total + repo.forks_count, 0),
      topLanguages: countLanguages(signalRepos),
      latestRepo: latestRepo(signalRepos),
      updatedAt: new Date().toISOString(),
      source: hasToken ? "authenticated" : "public",
    };

    return Response.json(summary, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      },
    });
  } catch {
    return Response.json(
      {
        error: "GitHub telemetry unavailable",
      },
      { status: 502 },
    );
  }
}
