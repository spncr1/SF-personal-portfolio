import type { Project, ProjectDetail } from "@/types/project";

export const projects: Project[] = [
  {
    slug: "atmos-fc",
    title: "Atmos FC",
    description:
      "A full-stack football fan sentiment analysis platform that aggregates YouTube comments into interactive post-match reaction summaries.",
    status: "active",
    category: "Full-stack data platform",
    year: 2026,
    role: "Software Developer (Independent Project)",
    dateRange: "Apr 2026 - Present",
    stack: ["Python", "FastAPI", "Football-Data.org API", "YouTube Data API"],
    technicalNotes: [
      "Processes fixture data, match events, and fan discussion data across multiple competitions.",
      "Integrates Football-Data.org and YouTube Data APIs through a Python FastAPI backend.",
    ],
  },
  {
    slug: "nexa",
    title: "Nexa",
    description:
      "A student workload management system built to reduce reliance on disconnected productivity tools for academic planning and assignment management.",
    status: "active",
    category: "Student productivity dashboard",
    year: 2025,
    role: "Software Developer (Independent Project)",
    dateRange: "Dec 2025 - Present",
    stack: ["Node.js", "Express", "PostgreSQL", "REST APIs", "Authentication"],
    technicalNotes: [
      "Includes 5+ REST API endpoints supporting authentication and persistent multi-user data storage.",
      "Tested with 6-8 early users, incorporating feedback to improve workflows, interface usability, and user experience.",
    ],
  },
];

export const projectDetails: Record<string, ProjectDetail> = {
  "atmos-fc": {
    ...projects[0],
    problem:
      "Post-match football fan reactions are spread across YouTube comments and competition data rather than being presented as a usable match reaction summary.",
    solution:
      "Aggregate YouTube comments with fixture and match event data to produce interactive post-match fan sentiment summaries.",
    implementation:
      "Built as a full-stack web application with a Python FastAPI backend integrating Football-Data.org and YouTube Data APIs.",
  },
  nexa: {
    ...projects[1],
    problem:
      "Academic planning and assignment management often depends on multiple disconnected productivity tools.",
    solution:
      "Provide a student workload management dashboard that centralizes planning and assignment workflows.",
    implementation:
      "Built with Node.js, Express, and PostgreSQL, including 5+ REST API endpoints for authentication and persistent multi-user storage.",
    outcome:
      "Tested with 6-8 early users, with feedback incorporated into workflows, interface usability, and overall user experience.",
  },
};

export function getProjectBySlug(slug: string): ProjectDetail | undefined {
  return projectDetails[slug];
}
