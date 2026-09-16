import { getGitHubRepositoryUrl } from "@/data/githubRepositories";
import type { ProjectDetail } from "@/types/project";

export const projects: ProjectDetail[] = [
  {
    slug: "nexa",
    recordCode: "PRJ-01",
    title: "Nexa",
    description:
      "A student workload management system built to reduce reliance on disconnected productivity tools for academic planning and assignment management.",
    category: "Student productivity dashboard",
    stack: ["Node.js", "Express", "PostgreSQL", "EJS", "Passport", "Nodemailer"],
    problemSolved:
      "Student work is often split across disconnected task, calendar, assignment, and study tools, obscuring what needs attention and when work should happen.",
    architectureSummary:
      "An Express application renders EJS views and exposes protected REST routes backed by PostgreSQL. Passport and server-side sessions manage authentication, while Nodemailer supports verification, recovery, and reminder workflows.",
    keyFeatures: [
      "Plan tasks through weekly and monthly calendar views.",
      "Track assignments, subjects, priorities, weightings, and completion state.",
      "Organise study sessions and review weekly or monthly goals.",
      "Persist separate user data and deliver optional account and planning emails.",
    ],
    verifiedStats: [
      {
        value: "32",
        label: "Protected REST handlers",
        evidence: "Verified across nexa-v2/backend/routes",
      },
      {
        value: "07",
        label: "API route groups",
        evidence: "Subjects, assignments, tasks, study, profile, preferences, and reminders",
      },
      {
        value: "6–8",
        label: "Early users",
        evidence: "Initial product testing cohort",
      },
    ],
    visualRecords: [
      {
        src: "/images/projects/nexa/assignments.png",
        alt: "Nexa assignments workspace showing subjects, assessment weightings, reminders, and the assignments schedule",
        label: "Assignments command view",
      },
      {
        src: "/images/projects/nexa/dashboard.png",
        alt: "Nexa home dashboard showing the daily workload and monthly calendar",
        label: "Daily workload dashboard",
      },
      {
        src: "/images/projects/nexa/study-planner.png",
        alt: "Nexa study planner showing progress, session controls, suggested focuses, and a focus timer",
        label: "Study planning system",
      },
    ],
    timeline: "December 2025 to present",
    github: getGitHubRepositoryUrl("nexa"),
    live: "https://nexa-next.vercel.app/",
  },
  {
    slug: "atmos-fc",
    recordCode: "PRJ-02",
    title: "Atmos FC",
    description:
      "A full-stack football fan sentiment analysis platform that aggregates YouTube comments into interactive post-match reaction summaries.",
    category: "Football fan sentiment analysis platform",
    stack: ["Python", "FastAPI", "Neon PostgreSQL", "VADER", "Vanilla JavaScript", "Chart.js"],
    problemSolved:
      "Football reactions are scattered across match data, highlight videos, and thousands of comments, making it difficult to understand what a match felt like after full time.",
    architectureSummary:
      "A vanilla JavaScript interface on Vercel calls a FastAPI service on Railway. The backend combines football and YouTube data, applies VADER sentiment analysis, and persists match context in Neon PostgreSQL.",
    keyFeatures: [
      "Search and filter finished fixtures across supported competitions and seasons.",
      "Combine scores, match events, and YouTube discussion in one match record.",
      "Visualise reaction intensity across the first 24 hours after full time.",
      "Show top comments, overall vibe, crowd energy, and explicit unavailable states.",
    ],
    verifiedStats: [
      {
        value: "09",
        label: "FastAPI routes",
        evidence: "Verified in atmosfc-v1/backend/main.py",
      },
      {
        value: "03",
        label: "External data APIs",
        evidence: "API-Football, Football-Data.org, and YouTube Data API",
      },
    ],
    visualRecords: [
      {
        src: "/images/projects/atmos-fc/match-analysis.png",
        alt: "Atmos FC match analysis dashboard showing the Manchester City and Aston Villa result, overall fan vibe, crowd energy, comments analysed, and the 24-hour reaction intensity chart",
        label: "Match reaction analysis",
      },
      {
        src: "/images/projects/atmos-fc/search-results.png",
        alt: "Atmos FC fixture search showing competition and season filters with Manchester City match results ready for sentiment analysis",
        label: "Fixture discovery system",
      },
      {
        src: "/images/projects/atmos-fc/team-profile.png",
        alt: "Atmos FC Manchester City team profile showing club identity, stadium, founding year, official sources, and linked football data",
        label: "Club intelligence profile",
      },
    ],
    timeline: "April 2026 to present",
    github: getGitHubRepositoryUrl("atmos-fc"),
    live: "https://atmosfc-v1.vercel.app/",
  },
];

export const projectDetails: Record<string, ProjectDetail> = Object.fromEntries(
  projects.map((project) => [project.slug, project]),
);

export function getProjectBySlug(slug: string): ProjectDetail | undefined {
  return projectDetails[slug];
}
