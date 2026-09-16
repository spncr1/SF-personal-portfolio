import {
  getGitHubUsername,
  githubFetch,
  hasGitHubToken,
  type GitHubRepoResponse,
  type GitHubUserResponse,
} from "@/lib/github";
import type { GitHubLanguageStat, GitHubSummary } from "@/types/github";

export const dynamic = "force-dynamic";

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
  const username = getGitHubUsername();
  const encodedUsername = encodeURIComponent(username);
  const hasToken = hasGitHubToken();

  try {
    const userPromise = githubFetch<GitHubUserResponse>(`/users/${encodedUsername}`);
    const reposPromise = githubFetch<GitHubRepoResponse[]>(
      `/users/${encodedUsername}/repos?per_page=100&sort=updated&type=owner`,
    );

    const [user, reposResponse] = await Promise.all([userPromise, reposPromise]);
    const ownedRepos = reposResponse.filter(
      (repo) => repo.owner.login.toLowerCase() === username.toLowerCase() && !repo.private && !repo.fork,
    );
    const signalRepos = ownedRepos.filter((repo) => !repo.archived);

    const summary: GitHubSummary = {
      username: user.login,
      profileUrl: user.html_url,
      publicRepos: user.public_repos,
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
