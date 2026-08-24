export type ProjectStatus = "active" | "completed" | "archived";

export interface Project {
  slug: string;
  title: string;
  description: string;
  status: ProjectStatus;
  category: string;
  year: number;
  role?: string;
  dateRange?: string;
  stack: string[];
  technicalNotes?: string[];
  image?: string;
  github?: string;
  live?: string;
  deployment?: string;
}

export interface ProjectDetail extends Project {
  problem?: string;
  solution?: string;
  architecture?: string;
  decisions?: string[];
  implementation?: string;
  challenges?: string[];
  screenshots?: string[];
  outcome?: string;
}
