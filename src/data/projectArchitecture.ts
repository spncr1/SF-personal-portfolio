import type {
  ProjectArchitectureCategoryDefinition,
  ProjectArchitectureCategoryId,
  ProjectArchitectureLayer,
} from "@/types/project";

export const projectArchitectureCategories = {
  presentation: {
    label: "Presentation",
    definition: "User interface and interactions.",
  },
  application: {
    label: "Application",
    definition: "Business logic, APIs and request handling.",
  },
  "identity-security": {
    label: "Identity & Security",
    definition: "Authentication, authorisation and sessions.",
  },
  "data-persistence": {
    label: "Data & Persistence",
    definition: "Databases, storage and data access.",
  },
  integrations: {
    label: "Integrations",
    definition: "External APIs and third-party services.",
  },
  infrastructure: {
    label: "Infrastructure",
    definition: "Hosting, deployment and runtime.",
  },
} as const satisfies Record<
  ProjectArchitectureCategoryId,
  ProjectArchitectureCategoryDefinition
>;

export function getProjectArchitectureCategory(
  category: ProjectArchitectureCategoryId,
): ProjectArchitectureCategoryDefinition {
  return projectArchitectureCategories[category];
}

export function formatProjectArchitectureLayer(
  layer: ProjectArchitectureLayer,
): string {
  const technologyNames = layer.technologies
    .map((technology) => technology.name)
    .join(", ");
  const detail = `${technologyNames} — ${layer.responsibility}`;

  return layer.uncertainty
    ? `${detail} Uncertainty: ${layer.uncertainty}`
    : detail;
}
