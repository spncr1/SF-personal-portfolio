export type ServiceLogKind = "project" | "education" | "employment";

export interface ServiceLogEntry {
  id: string;
  date: string;
  title: string;
  summary: string;
  kind: ServiceLogKind;
}

export type PersonalInterestIcon = "football" | "gym" | "music" | "drawing";

export interface PersonalInterest {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: PersonalInterestIcon;
}

export interface Profile {
  name: string;
  title: string;
  education: string;
  summary: string;
  experience: string[];
  serviceLog: ServiceLogEntry[];
  careerDirection: string;
  technicalInterests: string[];
  personalInterests: PersonalInterest[];
  portrait?: string;
  personnelPortrait: string;
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
  serviceLog: [
    {
      id: "backend-focus",
      date: "2026",
      title: "Final Year // Backend Focus",
      summary: "Current focus on backend systems, APIs, and production-ready engineering work.",
      kind: "education",
    },
    {
      id: "reno-spares",
      date: "AUG 2026",
      title: "Reno Spares // AI & Automation Intern",
      summary: "Joined Reno Spares as a Computer Science Intern working across AI and automation.",
      kind: "employment",
    },
    {
      id: "atmos-fc",
      date: "APR 2026",
      title: "Atmos FC // Software Developer",
      summary: "Began developing a football fan platform focused on match events and sentiment data.",
      kind: "project",
    },
    {
      id: "nexa",
      date: "DEC 2025",
      title: "Nexa // Software Developer",
      summary: "Started building a student productivity platform for academic planning and workload management.",
      kind: "project",
    },
    {
      id: "uts-software-engineering",
      date: "2022",
      title: "UTS Software Engineering // Enrolled",
      summary: "Began a Bachelor of Engineering (Honors), Software Engineering at UTS.",
      kind: "education",
    },
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
  personalInterests: [
    {
      id: "football",
      code: "PERSONAL INTEREST // 01",
      name: "Football",
      description:
        "I enjoy football for its tactical detail, competitive energy, and the community that surrounds the game.",
      icon: "football",
    },
    {
      id: "gym",
      code: "PERSONAL INTEREST // 02",
      name: "Gym",
      description:
        "Strength training is a regular part of my routine and provides a practical counterbalance to focused engineering work.",
      icon: "gym",
    },
    {
      id: "music",
      code: "PERSONAL INTEREST // 03",
      name: "Music",
      description:
        "Music is a constant source of focus and creative energy while working, training, or unwinding.",
      icon: "music",
    },
    {
      id: "drawing",
      code: "PERSONAL INTEREST // 04",
      name: "Drawing",
      description:
        "Drawing provides a hands-on creative outlet and helps me explore ideas visually outside software.",
      icon: "drawing",
    },
  ],
  portrait: "/images/profile/spencer-fisher.jpg",
  personnelPortrait: "/images/profile/spencer-fisher-2.jpg",
};
