import Link from "next/link";
import { getProjectBySlug } from "@/data/projects";
import { HudPanel } from "@/components/ui/HudPanel";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { SystemLabel } from "@/components/ui/SystemLabel";
import { notFound } from "next/navigation";

interface ProjectInspectionPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectInspectionPage({
  params,
}: ProjectInspectionPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const filledSections = [
    ["Problem", project.problem],
    ["Solution", project.solution],
    ["Implementation", project.implementation],
    ["Outcome", project.outcome],
  ].filter(([, value]) => Boolean(value));

  const incompleteSections = [
    ["Architecture", project.architecture],
    ["Engineering decisions", project.decisions?.join(" ")],
    ["Challenges", project.challenges?.join(" ")],
    ["Screenshots", project.screenshots?.join(" ")],
  ].filter(([, value]) => !value);

  return (
    <section className="sector sector--project-inspection project-inspection">
      <div className="project-inspection__masthead">
        <div>
          <SystemLabel>Project Inspection</SystemLabel>
          <h1>{project.title}</h1>
        </div>
        <Link className="project-inspection__back" href="/projects">
          Back to database
        </Link>
      </div>

      <div className="project-inspection__grid">
        <article className="project-inspection__primary">
          <div className="project-inspection__summary">
            <SystemLabel variant="metadata">{project.category}</SystemLabel>
            <p>{project.description}</p>
          </div>

          <div className="project-inspection__sections">
            {filledSections.map(([label, value]) => (
              <HudPanel key={label} label={label}>
                <p>{value}</p>
              </HudPanel>
            ))}
          </div>

          <HudPanel label="Technical notes" tone="accent">
            {project.technicalNotes && project.technicalNotes.length > 0 ? (
              <ul className="project-inspection__notes">
                {project.technicalNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            ) : (
              <p className="project-inspection__incomplete">Record incomplete</p>
            )}
          </HudPanel>
        </article>

        <aside className="project-inspection__side">
          <HudPanel label="Record state" tone="diagnostic">
            <div className="project-inspection__status">
              <StatusIndicator status={project.status === "active" ? "active" : "idle"} label={project.status} />
            </div>
            <dl className="project-inspection__facts">
              <div>
                <dt>Role</dt>
                <dd>{project.role ?? "Record incomplete"}</dd>
              </div>
              <div>
                <dt>Date range</dt>
                <dd>{project.dateRange ?? "Record incomplete"}</dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd>{project.year}</dd>
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

          <HudPanel label="Stack">
            <div className="project-inspection__stack">
              {project.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </HudPanel>

          <HudPanel label="Incomplete records">
            <ul className="project-inspection__incomplete-list">
              {incompleteSections.map(([label]) => (
                <li key={label}>
                  <span>{label}</span>
                  <strong>Not in resume</strong>
                </li>
              ))}
            </ul>
          </HudPanel>
        </aside>
      </div>
    </section>
  );
}
