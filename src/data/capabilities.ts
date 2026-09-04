export interface CapabilityNode {
  id: string;
  category: string;
  technologies: string[];
  details: string;
  relatedProjects: string[];
  connections: string[];
}

export const capabilities: CapabilityNode[] = [
  {
    id: "languages",
    category: "Languages",
    technologies: ["Python", "Java", "C#", "C++", "SQL"],
    details:
      "Core languages carried across UTS coursework and independent projects, from FastAPI services to systems-level assignments.",
    relatedProjects: ["Atmos FC", "Nexa"],
    connections: ["Web Development", "Backend & Data"],
  },
  {
    id: "web",
    category: "Web Development",
    technologies: ["HTML", "CSS", "JavaScript"],
    details:
      "Front-end fundamentals used to ship interactive dashboards and match-reaction summaries on top of backend APIs.",
    relatedProjects: ["Nexa", "Atmos FC"],
    connections: ["Languages", "Backend & Data"],
  },
  {
    id: "backend-data",
    category: "Backend & Data",
    technologies: ["Node.js", "Express", "PostgreSQL", "MongoDB", "SQLite", "FastAPI", "REST"],
    details:
      "Designed REST APIs and persistent data layers, from a Node.js/Express/PostgreSQL system behind Nexa's workload management to a Python FastAPI backend aggregating fixture and fan-sentiment data for Atmos FC.",
    relatedProjects: ["Nexa", "Atmos FC"],
    connections: ["Languages", "Delivery"],
  },
  {
    id: "delivery",
    category: "Delivery",
    technologies: ["Git", "GitHub", "Confluence", "Vercel"],
    details:
      "Version control and documentation with Git, GitHub, and Confluence, deploying independent projects to production on Vercel.",
    relatedProjects: ["Atmos FC", "Nexa"],
    connections: ["Backend & Data"],
  },
];
