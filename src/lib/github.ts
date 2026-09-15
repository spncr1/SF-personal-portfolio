export interface GitHubUserResponse {
  login: string;
  html_url: string;
  public_repos: number;
}

export interface GitHubRepoResponse {
  name: string;
  description: string | null;
  html_url: string;
  fork: boolean;
  archived: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  pushed_at: string | null;
  updated_at: string;
  owner: {
    login: string;
  };
}

export interface GitHubCommitResponse {
  html_url: string;
  commit: {
    message: string;
    author: {
      date: string | null;
    } | null;
    committer: {
      date: string | null;
    } | null;
  };
}

export class GitHubRequestError extends Error {
  constructor(public readonly status: number) {
    super(`GitHub request failed: ${status}`);
    this.name = "GitHubRequestError";
  }
}

export function getGitHubUsername() {
  return process.env.GITHUB_USERNAME?.trim() || "spncr1";
}

export function hasGitHubToken() {
  return Boolean(process.env.GITHUB_TOKEN);
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

export async function githubFetch<T>(path: string, revalidate = 900): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: githubHeaders(),
    next: { revalidate },
  });

  if (!response.ok) {
    throw new GitHubRequestError(response.status);
  }

  return response.json() as Promise<T>;
}
