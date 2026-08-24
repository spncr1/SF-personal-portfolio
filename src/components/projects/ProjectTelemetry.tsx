import type { Project } from "@/types/project";
import { HudPanel } from "@/components/ui/HudPanel";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { SystemLabel } from "@/components/ui/SystemLabel";

interface ProjectTelemetryProps {
  project: Project;
}

export function ProjectTelemetry({ project }: ProjectTelemetryProps) {
  const telemetry = [
    ["Slug", project.slug],
    ["Status", project.status],
    ["Category", project.category],
    ["Year", String(project.year)],
    ["Stack", `${project.stack.length} signals`],
  ];

  return (
    <HudPanel className="project-telemetry" label="Telemetry" tone="diagnostic">
      <div className="project-telemetry__status">
        <StatusIndicator status={project.status === "active" ? "active" : "idle"} label={project.status} />
      </div>

      <dl className="project-telemetry__list">
        {telemetry.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <div className="project-telemetry__tags">
        <SystemLabel variant="metadata">Sector tags</SystemLabel>
        <span>{project.category}</span>
        <span>{project.role ?? "Independent project"}</span>
      </div>
    </HudPanel>
  );
}
