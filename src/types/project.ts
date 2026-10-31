export interface ProjectDetail {
  slug: string;
  recordCode: string;
  title: string;
  description: string;
  category: string;
  brand: ProjectBrand;
  stack: string[];
  problemSolved: string;
  architectureSummary: string;
  engineering: ProjectEngineering;
  developmentProcess: ProjectDevelopmentProcess;
  architectureLayers: [
    ProjectArchitectureLayer,
    ProjectArchitectureLayer,
    ...ProjectArchitectureLayer[],
  ];
  keyFeatures: string[];
  verifiedStats: ProjectStat[];
  visualRecords: [ProjectVisualRecord, ...ProjectVisualRecord[]];
  timeline: string;
  github: string | null;
  live: string | null;
}

export type ProjectEngineering = {
  objective: ProjectEngineeringObjective;
  decisions: readonly [
    ProjectEngineeringDecision,
    ...ProjectEngineeringDecision[],
  ];
  challenges: readonly [
    ProjectEngineeringChallenge,
    ...ProjectEngineeringChallenge[],
  ];
};

export interface ProjectDevelopmentProcess {
  summary: string;
  milestones: readonly [
    ProjectDevelopmentMilestone,
    ...ProjectDevelopmentMilestone[],
  ];
}

export interface ProjectDevelopmentMilestone {
  id: string;
  title: string;
  period: string;
  objective?: string;
  keyDevelopment?: readonly [string, ...string[]];
  outcome?: string;
  keyChanges?: readonly [string, ...string[]];
  nextSteps?: readonly [string, ...string[]];
  evidence: readonly [ProjectDevelopmentEvidence, ...ProjectDevelopmentEvidence[]];
}

export interface ProjectDevelopmentEvidence {
  source: "commit" | "documentation" | "configuration" | "test";
  reference: string;
}

export interface ProjectEngineeringObjective {
  problem: string;
  opportunity: string;
  goal: string;
}

export interface ProjectEngineeringDecision {
  id: string;
  label: string;
  choice: string;
  icon: ProjectEngineeringIcon;
  context: string;
  alternatives: readonly [
    ProjectEngineeringAlternative,
    ...ProjectEngineeringAlternative[],
  ];
  reasoning: string;
  tradeoffs: readonly [ProjectEngineeringTradeoff, ...ProjectEngineeringTradeoff[]];
  outcome: string;
}

export interface ProjectEngineeringAlternative {
  label: string;
  status: "selected" | "replaced" | "retained";
}

export interface ProjectEngineeringTradeoff {
  effect: "benefit" | "cost";
  text: string;
}

export interface ProjectEngineeringChallenge {
  id: string;
  label: string;
  icon: ProjectEngineeringIcon;
  constraint: string;
  investigation: string;
  solution: string;
  outcome: string;
}

export type ProjectEngineeringIcon =
  | "api"
  | "code"
  | "database"
  | "description"
  | "git"
  | "mail"
  | "school"
  | "vercel";

export interface ProjectBrand {
  src: string;
  alt: string;
}

export interface ProjectArchitectureLayer {
  category: ProjectArchitectureCategoryId;
  technologies: [
    ProjectArchitectureTechnology,
    ...ProjectArchitectureTechnology[],
  ];
  responsibility: string;
  uncertainty?: string;
}

export interface ProjectArchitectureTechnology {
  name: string;
  responsibility: string;
}

export type ProjectArchitectureCategoryId =
  | "presentation"
  | "application"
  | "identity-security"
  | "data-persistence"
  | "integrations"
  | "infrastructure";

export interface ProjectArchitectureCategoryDefinition {
  label: string;
  definition: string;
}

export interface ProjectVisualRecord {
  src: string;
  alt: string;
  label: string;
}

export interface ProjectStat {
  value: string;
  label: string;
  evidence: string;
}
