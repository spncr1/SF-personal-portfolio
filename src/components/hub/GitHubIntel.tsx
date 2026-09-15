"use client";

import { useEffect, useState } from "react";
import { CountUpValue } from "@/components/ui/CountUpValue";
import { SiteIcon } from "@/components/ui/SiteIcon";
import type { GitHubSummary } from "@/types/github";

type LoadState = "loading" | "ready" | "error";

function formatRelativeTime(value: string | null) {
  if (!value) return "No pushes";

  const timestamp = new Date(value).getTime();
  const diffSeconds = Math.round((timestamp - Date.now()) / 1000);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];
  const formatter = new Intl.RelativeTimeFormat("en-AU", { numeric: "auto" });

  for (const [unit, seconds] of units) {
    const amount = Math.trunc(diffSeconds / seconds);
    if (Math.abs(amount) >= 1) {
      return formatter.format(amount, unit);
    }
  }

  return "Just now";
}

export function GitHubIntel() {
  const [state, setState] = useState<LoadState>("loading");
  const [summary, setSummary] = useState<GitHubSummary | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadGitHubIntel() {
      try {
        const response = await fetch("/api/github/summary", { cache: "no-store" });
        if (!response.ok) throw new Error("GitHub summary unavailable");

        const data = (await response.json()) as GitHubSummary;
        if (cancelled) return;

        setSummary(data);
        setState("ready");
      } catch {
        if (cancelled) return;
        setState("error");
      }
    }

    void loadGitHubIntel();

    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") {
    return (
      <section className="central-hub__github-card" aria-label="GitHub intelligence">
        <div className="central-hub__github-header">
          <span><SiteIcon name="code" />GitHub Live</span>
          <strong>Syncing</strong>
        </div>
        <p className="central-hub__github-message">Repository telemetry access link in progress.</p>
      </section>
    );
  }

  if (state === "error" || !summary) {
    return (
      <section className="central-hub__github-card" aria-label="GitHub intelligence">
        <div className="central-hub__github-header">
          <span><SiteIcon name="code" />GitHub Live</span>
          <strong>Offline</strong>
        </div>
        <p className="central-hub__github-message">GitHub telemetry is unavailable right now.</p>
      </section>
    );
  }

  const topLanguage = summary.topLanguages[0]?.name ?? "Pending";

  return (
    <section className="central-hub__github-card" aria-label="GitHub intelligence">
      <div className="central-hub__github-header">
        <span><SiteIcon name="code" />GitHub Live</span>
        <a href={summary.profileUrl} target="_blank" rel="noreferrer">
          @{summary.username}
          <SiteIcon name="open-in-new" />
        </a>
      </div>

      <dl className="central-hub__github-intel">
        <div>
          <dt>Repositories</dt>
          <dd>
            <CountUpValue value={summary.publicRepos} />
          </dd>
        </div>
        <div>
          <dt>Active repos</dt>
          <dd>
            <CountUpValue value={summary.activeRepos} delayMs={90} />
          </dd>
        </div>
        <div>
          <dt>Stars / forks</dt>
          <dd>
            <CountUpValue value={summary.totalStars} delayMs={180} />
            <span className="system-count__divider">/</span>
            <CountUpValue value={summary.totalForks} delayMs={240} />
          </dd>
        </div>
        <div>
          <dt>Top language</dt>
          <dd>{topLanguage}</dd>
        </div>
        <div>
          <dt>Latest push</dt>
          <dd>{formatRelativeTime(summary.latestRepo?.pushedAt ?? null)}</dd>
        </div>
      </dl>

      {summary.latestRepo && (
        <a className="central-hub__repo-signal" href={summary.latestRepo.url} target="_blank" rel="noreferrer">
          <span>Recently Updated</span>
          <strong>{summary.latestRepo.name}</strong>
          <SiteIcon name="open-in-new" />
        </a>
      )}

      {summary.topLanguages.length > 0 && (
        <ul className="central-hub__language-strip" aria-label="Top GitHub languages">
          {summary.topLanguages.map((language) => (
            <li key={language.name}>
              {language.name}
              <CountUpValue value={language.count} delayMs={320} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
