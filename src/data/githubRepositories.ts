import type { OperationRepositoryId } from "@/types/github";

export const DEFAULT_GITHUB_USERNAME = "spncr1";

export const githubRepositories: Record<OperationRepositoryId, { repository: string }> = {
  "atmos-fc": { repository: "atmosfc-v1" },
  nexa: { repository: "nexa-v2" },
  portfolio: { repository: "SF-personal-portfolio" },
};

export const operationRepositoryIds: readonly OperationRepositoryId[] = [
  "atmos-fc",
  "nexa",
  "portfolio",
];

export type ProjectRepositoryId = Exclude<OperationRepositoryId, "portfolio">;

const projectRepositoryIds: readonly ProjectRepositoryId[] = ["atmos-fc", "nexa"];

export function isProjectRepositoryId(value: string): value is ProjectRepositoryId {
  return projectRepositoryIds.some((projectId) => projectId === value);
}

export function getGitHubRepositoryUrl(
  id: OperationRepositoryId,
  username = DEFAULT_GITHUB_USERNAME,
) {
  const repository = githubRepositories[id].repository;
  return `https://github.com/${encodeURIComponent(username)}/${encodeURIComponent(repository)}`;
}
