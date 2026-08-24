export interface OperationsData {
  building: string[];
  learning: string[];
  activeProjects: string[];
  universityWork: string[];
  phases: string[];
  milestones: string[];
  objectives: string[];
  currentRoles: string[];
  implementationNotes: string[];
}

export const operations: OperationsData = {
  building: [
    "Atmos FC - football fan sentiment analysis platform, Apr 2026 - Present",
    "Nexa - student workload management dashboard, Dec 2025 - Present",
  ],
  learning: [],
  activeProjects: ["Atmos FC", "Nexa"],
  universityWork: [
    "Bachelor of Engineering (Honors), Software Engineering, UTS - graduating 2026",
  ],
  phases: [],
  milestones: [
    "Atmos FC integrates Football-Data.org and YouTube Data APIs for fixture, match event, and fan discussion data.",
    "Nexa includes 5+ REST API endpoints for authentication and persistent multi-user data storage.",
    "Nexa tested with 6-8 early users and improved using feedback on workflows, usability, and user experience.",
  ],
  objectives: [
    "Contribute to backend systems, API development, and practical software projects while continuing to develop production-level engineering skills.",
  ],
  currentRoles: [
    "IT Support and Administration, Daluch Global Recruitment Pty Ltd - Dec 2021 - Present",
    "Online Customer Service Consultant, Endeavour Group - Oct 2025 - Present",
  ],
  implementationNotes: [
    "Atmos FC: Python FastAPI backend with Football-Data.org and YouTube Data API integrations.",
    "Nexa: Node.js, Express, PostgreSQL, REST API endpoints, authentication, and persistent multi-user storage.",
  ],
};
