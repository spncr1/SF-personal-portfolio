import Link from "next/link";
import type { Project } from "@/types/project";
import { HudPanel } from "@/components/ui/HudPanel";
import { SystemLabel } from "@/components/ui/SystemLabel";

interface ProjectDisplayProps {
  project: Project | null;
}

export function ProjectDisplay({ project }: ProjectDisplayProps) {
  if (!project) {
    return <div className="project-display project-display--empty">No project selected</div>;
  }

  return (
    <article className="project-display" aria-labelledby="project-display-title">
      <div className="project-display__hero">
        <div>
          <SystemLabel variant="metadata">{project.category}</SystemLabel>
          <h2 id="project-display-title">{project.title}</h2>
          <p>{project.description}</p>
        </div>

        <Link className="project-display__inspect" href={`/projects/${project.slug}`}>
          Inspect
        </Link>
      </div>

      <div className="project-display__grid">
        <HudPanel className="project-display__image-well" label="Visual record" tone="accent">
          <span>Image pending</span>
        </HudPanel>

        <HudPanel className="project-display__brief" label="Technical signal">
          <dl className="project-display__facts">
            <div>
              <dt>Role</dt>
              <dd>{project.role ?? "Record incomplete"}</dd>
            </div>
            <div>
              <dt>Range</dt>
              <dd>{project.dateRange ?? "Record incomplete"}</dd>
            </div>
            <div>
              <dt>Deployment</dt>
              <dd>{project.deployment ?? "Record incomplete"}</dd>
            </div>
            <div>
              <dt>Repository</dt>
              <dd>{project.github ?? "Record incomplete"}</dd>
            </div>
            <div>
              <dt>Live app</dt>
              <dd>{project.live ?? "Record incomplete"}</dd>
            </div>
          </dl>
        </HudPanel>
      </div>

      <section className="project-display__stack" aria-label="Technology stack">
        {project.stack.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>

      {project.technicalNotes && project.technicalNotes.length > 0 && (
        <section className="project-display__notes" aria-label="Technical notes">
          {project.technicalNotes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </section>
      )}
    </article>
  );
}
