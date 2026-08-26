const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "";

export async function getGitHubActivity() {
  if (!GITHUB_USERNAME) {
    return null;
  }

  return { username: GITHUB_USERNAME };
}
