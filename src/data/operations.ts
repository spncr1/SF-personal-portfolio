import type { OperationRepositoryId } from "@/types/github";

export interface ActiveOperation {
  id: OperationRepositoryId;
  code: string;
  name: string;
  status: string;
  phase: string;
  currentThinking: string;
  screenshot: string | null;
}

export const activeOperations: ActiveOperation[] = [
  {
    id: "atmos-fc",
    code: "OPS-01",
    name: "Atmos FC",
    status: "In progress",
    phase: "Refining fixture intelligence and supporter reaction analysis.",
    currentThinking: "How can match context make supporter sentiment easier to trust at a glance?",
    screenshot: "/images/projects/atmos-fc/match-analysis.png",
  },
  {
    id: "nexa",
    code: "OPS-02",
    name: "Nexa",
    status: "In progress",
    phase: "Developing persistent, authenticated student workload workflows.",
    currentThinking: "Keeping complex study planning useful without making the interface feel heavy.",
    screenshot: "/images/projects/nexa/dashboard.png",
  },
  {
    id: "portfolio",
    code: "OPS-03",
    name: "Portfolio",
    status: "In progress",
    phase: "Building the unreleased operations and project record systems.",
    currentThinking: "Finding the point where motion adds life without distracting from the work.",
    screenshot: null,
  },
];
