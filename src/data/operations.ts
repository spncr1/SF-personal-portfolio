import type { OperationRepositoryId } from "@/types/github";

export interface ActiveOperation {
  id: OperationRepositoryId;
  code: string;
  name: string;
  logo: {
    src: string;
    width: number;
    height: number;
  };
  status: string;
  phase: string;
  currentThinking: string;
  screenshot: string;
}

export const activeOperations: ActiveOperation[] = [
  {
    id: "nexa",
    code: "OPS-01",
    name: "Nexa",
    logo: {
      src: "/brand/nexa-v1.png",
      width: 494,
      height: 548,
    },
    status: "In progress",
    phase: "Developing persistent, authenticated student workload workflows.",
    currentThinking: "Keeping complex study planning useful without making the interface feel heavy.",
    screenshot: "/images/projects/nexa/product-landing-page.png",
  },
  {
    id: "atmos-fc",
    code: "OPS-02",
    name: "Atmos FC",
    logo: {
      src: "/brand/atmosfc-logo-v2.svg",
      width: 180,
      height: 90,
    },
    status: "In progress",
    phase: "Refining fixture intelligence and supporter reaction analysis.",
    currentThinking: "How can match context make supporter sentiment easier to trust at a glance?",
    screenshot: "/images/projects/atmos-fc/main-dashboard.png",
  },
  {
    id: "portfolio",
    code: "OPS-03",
    name: "Portfolio",
    logo: {
      src: "/brand/spencer-fisher-logo.png",
      width: 855,
      height: 1149,
    },
    status: "In progress",
    phase: "Building the unreleased operations and project record systems.",
    currentThinking: "Finding the point where motion adds life without distracting from the work.",
    screenshot: "/images/projects/personal-portfolio/central-hub.png",
  },
];
