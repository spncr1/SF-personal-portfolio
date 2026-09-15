export interface ProjectDetail {
  slug: string;
  recordCode: string;
  title: string;
  description: string;
  category: string;
  stack: string[];
  problemSolved: string;
  architectureSummary: string;
  keyFeatures: string[];
  verifiedStats: ProjectStat[];
  visualRecords: [ProjectVisualRecord, ...ProjectVisualRecord[]];
  timeline: string;
  github: string | null;
  live: string | null;
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
