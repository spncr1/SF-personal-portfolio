import { describe, expect, it } from "vitest";

import {
  projectEngineering,
  validateProjectEngineering,
} from "@/data/projectEngineering";
import { projects } from "@/data/projects";

describe("Project Systems engineering records", () => {
  it("provides a valid engineering record for every published project", () => {
    for (const project of projects) {
      expect(project.engineering).toBe(projectEngineering[project.slug as keyof typeof projectEngineering]);
      expect(validateProjectEngineering(project.engineering)).toEqual([]);
    }
  });

  it("keeps decision and challenge identifiers unique within each project", () => {
    for (const engineering of Object.values(projectEngineering)) {
      const decisionIds = engineering.decisions.map((decision) => decision.id);
      const challengeIds = engineering.challenges.map((challenge) => challenge.id);

      expect(new Set(decisionIds).size).toBe(decisionIds.length);
      expect(new Set(challengeIds).size).toBe(challengeIds.length);
    }
  });

  it("provides the complete objective progression for every project", () => {
    for (const engineering of Object.values(projectEngineering)) {
      expect(engineering.objective.problem.trim()).not.toBe("");
      expect(engineering.objective.opportunity.trim()).not.toBe("");
      expect(engineering.objective.goal.trim()).not.toBe("");
    }
  });

  it("does not expose secret values or configuration names in public engineering copy", () => {
    const publicCopy = JSON.stringify(projectEngineering);

    expect(publicCopy).not.toMatch(/API[_-]?KEY/i);
    expect(publicCopy).not.toMatch(/DATABASE_URL/i);
    expect(publicCopy).not.toMatch(/SESSION_SECRET/i);
    expect(publicCopy).not.toMatch(/VERCEL_TOKEN/i);
  });
});
