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

export type OperationRepositoryId = "atmos-fc" | "nexa" | "portfolio";

export type GitHubActivityState = "ready" | "empty" | "unavailable";

export type GitHubActivityViewState = "loading" | GitHubActivityState;

export interface GitHubCommitSignal {
  message: string;
  url: string;
  committedAt: string;
}

export interface GitHubRepositoryActivity {
  id: OperationRepositoryId;
  repository: string;
  repositoryUrl: string;
  state: GitHubActivityState;
  latestCommit: GitHubCommitSignal | null;
  commitsLastSevenDays: number | null;
}

export interface GitHubOperationsActivity {
  username: string;
  windowDays: 7;
  windowStartedAt: string;
  repositories: GitHubRepositoryActivity[];
  updatedAt: string;
  source: "public" | "authenticated";
}

export interface GitHubTimelineWeek {
  startedAt: string;
  commits: number;
}

export interface GitHubTimelineMonth {
  startedAt: string;
  commits: number;
  weeks: number[];
}

export interface GitHubTimelineCommit {
  message: string;
  url: string;
  committedAt: string;
}

export interface GitHubProjectTimeline {
  projectId: string;
  repository: string;
  repositoryUrl: string;
  state: GitHubActivityState;
  startedAt: string;
  totalCommits: number | null;
  activeWeeks: number | null;
  peakWeekCommits: number | null;
  firstCommit: GitHubTimelineCommit | null;
  latestCommit: GitHubTimelineCommit | null;
  months: GitHubTimelineMonth[];
  weeks: GitHubTimelineWeek[];
  updatedAt: string;
  source: "public" | "authenticated";
}
