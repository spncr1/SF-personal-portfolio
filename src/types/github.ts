export interface GitHubLanguageStat {
  name: string;
  count: number;
}

export interface GitHubRepoSignal {
  name: string;
  description: string | null;
  url: string;
  pushedAt: string | null;
}

export interface GitHubSummary {
  username: string;
  profileUrl: string;
  publicRepos: number;
  activeRepos: number;
  totalStars: number;
  totalForks: number;
  topLanguages: GitHubLanguageStat[];
  latestRepo: GitHubRepoSignal | null;
  updatedAt: string;
  source: "public" | "authenticated";
}
