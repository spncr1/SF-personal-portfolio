import { describe, expect, it } from "vitest";

import {
  projectDevelopment,
  validateProjectDevelopmentProcess,
} from "@/data/projectDevelopment";
import { projects } from "@/data/projects";

describe("Project Systems development-process records", () => {
  it("provides a valid development process for every published project", () => {
    for (const project of projects) {
      expect(project.developmentProcess).toBe(
        projectDevelopment[project.slug as keyof typeof projectDevelopment],
      );
      expect(validateProjectDevelopmentProcess(project.developmentProcess)).toEqual([]);
    }
  });

  it("keeps milestone identifiers unique within each project", () => {
    for (const process of Object.values(projectDevelopment)) {
      const ids = process.milestones.map((milestone) => milestone.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("contains the six approved milestones for Nexa and Atmos FC", () => {
    expect(projectDevelopment.nexa.milestones).toHaveLength(6);
    expect(projectDevelopment["atmos-fc"].milestones).toHaveLength(6);
  });

  it("does not expose private planning links or secret configuration values", () => {
    const publicCopy = JSON.stringify(projectDevelopment);

    expect(publicCopy).not.toMatch(/notion\.com/i);
    expect(publicCopy).not.toMatch(/API[_-]?KEY/i);
    expect(publicCopy).not.toMatch(/DATABASE_URL/i);
    expect(publicCopy).not.toMatch(/VERCEL_TOKEN/i);
  });
});
