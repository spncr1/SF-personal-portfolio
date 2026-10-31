import { getGitHubRepositoryUrl } from "@/data/githubRepositories";
import { projectDevelopment } from "@/data/projectDevelopment";
import { projectEngineering } from "@/data/projectEngineering";
import type { ProjectDetail } from "@/types/project";

export const projects: ProjectDetail[] = [
  {
    slug: "nexa",
    recordCode: "PRJ-01",
    title: "Nexa",
    description:
      "A student workload management system built to reduce reliance on disconnected productivity tools for academic planning and assignment management.",
    category: "Student productivity dashboard",
    brand: {
      src: "/brand/nexa-v1.png",
      alt: "Nexa logo",
    },
    stack: ["Node.js", "Express", "PostgreSQL", "EJS", "Passport", "Nodemailer"],
    problemSolved:
      "Student work is often split across disconnected task, calendar, assignment, and study tools, obscuring what needs attention and when work should happen.",
    architectureSummary:
      "An Express application renders EJS views and exposes protected REST routes backed by PostgreSQL. Passport and server-side sessions manage authentication, while Nodemailer supports verification, recovery, and reminder workflows.",
    engineering: projectEngineering.nexa,
    developmentProcess: projectDevelopment.nexa,
    architectureLayers: [
      {
        category: "presentation",
        technologies: [
          { name: "EJS", responsibility: "Renders server-side dashboard views." },
          { name: "HTML", responsibility: "Provides the semantic interface structure." },
          { name: "CSS", responsibility: "Defines the responsive visual system." },
          { name: "Vanilla JavaScript", responsibility: "Handles browser-side interactions." },
        ],
        responsibility: "Renders the student dashboard and browser interactions.",
      },
      {
        category: "application",
        technologies: [
          { name: "Node.js", responsibility: "Runs the server application." },
          { name: "Express", responsibility: "Routes page and protected API requests." },
        ],
        responsibility: "Handles page requests, protected REST routes and academic workflow logic.",
      },
      {
        category: "identity-security",
        technologies: [
          { name: "Passport", responsibility: "Coordinates authentication strategies." },
          { name: "bcrypt", responsibility: "Hashes and verifies account passwords." },
          { name: "express-session", responsibility: "Maintains authenticated browser sessions." },
          { name: "connect-pg-simple", responsibility: "Persists session records in PostgreSQL." },
        ],
        responsibility: "Authenticates users, hashes credentials and maintains server-side sessions.",
      },
      {
        category: "data-persistence",
        technologies: [
          { name: "PostgreSQL", responsibility: "Stores accounts and academic planning data." },
          { name: "node-postgres", responsibility: "Executes application database queries." },
          { name: "SQL migrations", responsibility: "Versions and applies schema changes." },
        ],
        responsibility: "Stores accounts, sessions and per-user academic planning data.",
      },
      {
        category: "integrations",
        technologies: [
          { name: "Nodemailer", responsibility: "Builds and dispatches transactional email." },
          { name: "SMTP", responsibility: "Transports account and planning messages." },
        ],
        responsibility: "Delivers verification, password recovery and reminder emails.",
      },
      {
        category: "infrastructure",
        technologies: [
          { name: "Vercel", responsibility: "Hosts the deployed web application." },
          { name: "Node.js runtime", responsibility: "Executes the application and startup migrations." },
        ],
        responsibility: "Hosts and runs the web application with startup database migrations.",
      },
    ],
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
        src: "/images/projects/nexa/dashboard.png",
        alt: "Nexa home dashboard showing the daily workload and monthly calendar",
        label: "Daily workload dashboard",
      },
      {
        src: "/images/projects/nexa/assignments.png",
        alt: "Nexa assignments workspace showing subjects, assessment weightings, reminders, and the assignments schedule",
        label: "Assignments command view",
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
    brand: {
      src: "/brand/atmosfc-logo-v2.svg",
      alt: "Atmos FC logo",
    },
    stack: ["Python", "FastAPI", "Neon PostgreSQL", "VADER", "Vanilla JavaScript", "Chart.js"],
    problemSolved:
      "Football reactions are scattered across match data, highlight videos, and thousands of comments, making it difficult to understand what a match felt like after full time.",
    architectureSummary:
      "A vanilla JavaScript interface on Vercel reads versioned showcase data by default. Live mode calls a FastAPI service on Railway, which combines football and YouTube data, applies VADER sentiment analysis, and persists match context in Neon PostgreSQL.",
    engineering: projectEngineering["atmos-fc"],
    developmentProcess: projectDevelopment["atmos-fc"],
    architectureLayers: [
      {
        category: "presentation",
        technologies: [
          { name: "HTML", responsibility: "Structures fixture and match interfaces." },
          { name: "CSS", responsibility: "Defines the responsive presentation system." },
          { name: "Vanilla JavaScript", responsibility: "Runs client-side discovery and analysis flows." },
          { name: "Chart.js", responsibility: "Plots post-match reaction intensity." },
        ],
        responsibility: "Presents fixture discovery, match records and reaction visualisations.",
      },
      {
        category: "application",
        technologies: [
          { name: "Python", responsibility: "Runs backend data processing and services." },
          { name: "FastAPI", responsibility: "Exposes the live HTTP API." },
          { name: "VADER", responsibility: "Scores sentiment in fan comments." },
        ],
        responsibility: "Handles live API requests and produces match-context sentiment analysis.",
      },
      {
        category: "data-persistence",
        technologies: [
          { name: "Neon PostgreSQL", responsibility: "Stores live match context data." },
          { name: "SQLAlchemy", responsibility: "Maps and queries relational records." },
          { name: "Alembic", responsibility: "Versions and applies schema changes." },
          { name: "Versioned JSON", responsibility: "Publishes validated showcase snapshots." },
        ],
        responsibility: "Stores live match context and serves validated static showcase snapshots.",
      },
      {
        category: "integrations",
        technologies: [
          { name: "API-Football", responsibility: "Supplies fixtures, events and team data." },
          { name: "Football-Data.org", responsibility: "Provides supplementary football records." },
          { name: "YouTube Data API", responsibility: "Supplies videos and fan comments." },
        ],
        responsibility: "Supplies fixtures, events, team data, videos and fan comments.",
      },
      {
        category: "infrastructure",
        technologies: [
          { name: "Vercel", responsibility: "Hosts the frontend and static showcase." },
          { name: "Railway", responsibility: "Runs the live backend service." },
          { name: "GitHub Actions", responsibility: "Refreshes scheduled showcase data." },
        ],
        responsibility: "Hosts the frontend and live services and refreshes the public showcase data.",
      },
    ],
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
