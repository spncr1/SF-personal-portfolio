export interface Profile {
  name: string;
  title: string;
  education: string;
  summary: string;
  experience: string[];
  careerDirection: string;
  technicalInterests: string[];
  personalInterests: string[];
  portrait?: string;
}

export const profile: Profile = {
  name: "Spencer Fisher",
  title: "Software Engineer • Builder • Problem Solver",
  education: "Bachelor of Engineering (Honors), Software Engineering, UTS - graduating 2026",
  summary:
    "Final-year UTS Software Engineering student focused on backend development and scalable system design, with experience building full-stack applications and data-driven systems.",
  experience: [
    "IT Support and Administration, Daluch Global Recruitment Pty Ltd - Dec 2021 - Present",
    "Online Customer Service Consultant, Endeavour Group - Oct 2025 - Present",
  ],
  careerDirection:
    "Seeking real-world opportunities to contribute to backend systems, API development, and practical software projects while continuing to develop production-level engineering skills.",
  technicalInterests: [
    "Python",
    "Java",
    "C#",
    "C++",
    "SQL",
    "HTML",
    "CSS",
    "JavaScript",
    "MongoDB",
    "SQLite",
    "PostgreSQL",
    "Express (Node.js)",
    "Git/GitHub",
    "Jira",
    "Confluence",
  ],
  personalInterests: [],
  portrait: "/images/profile/spencer-fisher.jpg",
};
