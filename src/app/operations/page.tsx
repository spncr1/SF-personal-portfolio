import { HudPanel } from "@/components/ui/HudPanel";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { SystemLabel } from "@/components/ui/SystemLabel";
import { operations } from "@/data/operations";

const operationPanels = [
  {
    id: "building",
    label: "Currently building",
    items: operations.building,
    tone: "accent" as const,
  },
  {
    id: "implementation",
    label: "Implementation notes",
    items: operations.implementationNotes,
    tone: "default" as const,
  },
  {
    id: "university",
    label: "University",
    items: operations.universityWork,
    tone: "diagnostic" as const,
  },
  {
    id: "roles",
    label: "Current roles",
    items: operations.currentRoles,
    tone: "default" as const,
  },
  {
    id: "learning",
    label: "Currently learning",
    items: operations.learning,
    tone: "default" as const,
  },
  {
    id: "phases",
    label: "Implementation phases",
    items: operations.phases,
    tone: "default" as const,
  },
];

export default function OperationsPage() {
  return (
    <section className="sector sector--operations operations-dashboard">
      <div className="operations-dashboard__masthead">
        <div>
          <SystemLabel>Active Operations</SystemLabel>
          <h1>Live Workstream</h1>
        </div>
        <StatusIndicator status="active" label="Resume-backed" />
      </div>

      <div className="operations-dashboard__grid">
        <HudPanel className="operations-dashboard__hero" label="Current objective" tone="accent">
          {operations.objectives.map((objective) => (
            <p key={objective}>{objective}</p>
          ))}
        </HudPanel>

        <HudPanel className="operations-dashboard__active" label="Active projects" tone="diagnostic">
          <div className="operations-dashboard__project-count">
            <strong>{operations.activeProjects.length.toString().padStart(2, "0")}</strong>
            <span>systems active</span>
          </div>
          <ul className="operations-dashboard__chips" aria-label="Active projects">
            {operations.activeProjects.map((project) => (
              <li key={project}>{project}</li>
            ))}
          </ul>
        </HudPanel>

        <div className="operations-dashboard__panels">
          {operationPanels.map((panel) => (
            <HudPanel key={panel.id} label={panel.label} tone={panel.tone}>
              {panel.items.length > 0 ? (
                <ul className="operations-dashboard__list">
                  {panel.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="operations-dashboard__empty">Record incomplete</p>
              )}
            </HudPanel>
          ))}
        </div>

        <HudPanel className="operations-dashboard__timeline" label="Recent milestones">
          <ol>
            {operations.milestones.map((milestone, index) => (
              <li key={milestone}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{milestone}</p>
              </li>
            ))}
          </ol>
        </HudPanel>
      </div>
    </section>
  );
}
