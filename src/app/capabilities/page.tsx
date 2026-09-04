import type { Metadata } from "next";
import { HudPanel } from "@/components/ui/HudPanel";
import { SystemLabel } from "@/components/ui/SystemLabel";
import { capabilities } from "@/data/capabilities";

export const metadata: Metadata = {
  title: "Capabilities | Spencer Fisher",
};

const capabilityGroups = [
  {
    id: "languages",
    label: "Languages",
    capabilityIds: ["languages"],
  },
  {
    id: "web",
    label: "Web Development",
    capabilityIds: ["web"],
  },
  {
    id: "backend-data",
    label: "Backend & Data",
    capabilityIds: ["backend-data"],
  },
  {
    id: "delivery",
    label: "Delivery & Operations",
    capabilityIds: ["delivery"],
  },
] as const;

export default function CapabilitiesPage() {
  return (
    <section className="sector sector--capabilities sector-frame">
      <div className="sector-frame__masthead">
        <div>
          <SystemLabel>Skills</SystemLabel>
          <h1>Capability Matrix</h1>
        </div>
      </div>

      <div className="capabilities-matrix">
        <HudPanel className="sector-frame__primary capabilities-matrix__overview" label="Engineering focus" tone="diagnostic">
          <strong>Backend Systems</strong>
          <p>Final-year UTS Software Engineering student focused on backend development, API development, and scalable system design.</p>
          <div className="capabilities-matrix__system-diagram" aria-hidden="true">
            <SystemDiagram />
          </div>
        </HudPanel>

        <div className="capabilities-matrix__nodes">
          {capabilityGroups.map((group) => (
            <HudPanel key={group.id}>
              <h2 className="capabilities-matrix__group-title">{group.label}</h2>
              {group.capabilityIds.map((capabilityId) => {
                const capability = capabilities.find((item) => item.id === capabilityId);

                if (!capability) {
                  return null;
                }

                return (
                  <div className="capabilities-matrix__entry" key={capability.id}>
                    <div className="capabilities-matrix__technologies" aria-label={`${capability.category} technologies`}>
                      {capability.technologies.map((technology) => (
                        <span className="capabilities-matrix__tech" key={technology}>
                          <TechIcon technology={technology} />
                          {technology}
                        </span>
                      ))}
                    </div>
                    <p>{capability.details}</p>
                    <dl className="capabilities-matrix__links">
                      <div>
                        <dt>Applied to</dt>
                        <dd className="capabilities-matrix__applied">
                          {capability.relatedProjects.map((project) => (
                            <span className="capabilities-matrix__tech" key={project}>
                              <ProjectIcon project={project} />
                              {project}
                            </span>
                          ))}
                        </dd>
                      </div>
                    </dl>
                  </div>
                );
              })}
            </HudPanel>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechIcon({ technology }: { technology: string }) {
  return (
    <svg className="capabilities-matrix__tech-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {technology === "Python" && (
        <>
          <path d="M8 4h5a2 2 0 0 1 2 2v3.5a2 2 0 0 1-2 2H9a2 2 0 0 0-2 2V17" />
          <path d="M16 20h-5a2 2 0 0 1-2-2v-3.5a2 2 0 0 1 2-2h4a2 2 0 0 0 2-2V7" />
        </>
      )}
      {technology === "Java" && (
        <>
          <path d="M6.5 10h9v4.5a3.5 3.5 0 0 1-3.5 3.5h-2a3.5 3.5 0 0 1-3.5-3.5z" />
          <path d="M15.5 11h1.2a1.8 1.8 0 1 1 0 3.6h-1.2" />
          <path d="M9.5 8c0-1 1-1 1-2s-1-1-1-2" />
          <path d="M13 8c0-1 1-1 1-2s-1-1-1-2" />
        </>
      )}
      {technology === "C#" && (
        <>
          <path d="M14 5a7 7 0 1 0 0 14" />
          <path d="M16.5 9.5v7" />
          <path d="M19 9.5v7" />
          <path d="M15 12h5.5" />
          <path d="M15 15h5.5" />
        </>
      )}
      {technology === "C++" && (
        <>
          <path d="M13 5a7 7 0 1 0 0 14" />
          <path d="M15.8 10.8h3" />
          <path d="M17.3 9.3v3" />
          <path d="M15.8 15.8h3" />
        </>
      )}
      {technology === "SQL" && (
        <>
          <ellipse cx="12" cy="6" rx="6" ry="2.2" />
          <path d="M6 6v12c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2V6" />
          <path d="M18 12c0 1.2-2.7 2.2-6 2.2S6 13.2 6 12" />
        </>
      )}
      {technology === "HTML" && (
        <>
          <path d="M8 8 4.5 12 8 16" />
          <path d="M16 8l3.5 4-3.5 4" />
          <path d="M13.5 6.5l-3 11" />
        </>
      )}
      {technology === "CSS" && (
        <>
          <path d="M9 4c-1.5 0-2 1-2 2.2v2.6c0 1-1 1.2-1.5 1.2.5 0 1.5.2 1.5 1.2v2.6c0 1.2.5 2.2 2 2.2" />
          <path d="M15 4c1.5 0 2 1 2 2.2v2.6c0 1 1 1.2 1.5 1.2-.5 0-1.5.2-1.5 1.2v2.6c0 1.2-.5 2.2-2 2.2" />
        </>
      )}
      {technology === "JavaScript" && (
        <>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 16c0 1.2 1 2 2.3 2 1.4 0 2.2-.8 2.2-1.8 0-2.6-4.5-1.6-4.5-4.4 0-1 .9-1.8 2.1-1.8 1 0 1.7.4 2.1 1.1" />
        </>
      )}
      {technology === "Node.js" && <path d="M12 3l7 4v10l-7 4-7-4V7z" />}
      {technology === "Express" && (
        <>
          <path d="M6 12h9" />
          <path d="M11 7l5 5-5 5" />
        </>
      )}
      {technology === "PostgreSQL" && (
        <>
          <path d="M9 3v4" />
          <path d="M15 3v4" />
          <path d="M6 7h12v4a6 6 0 0 1-12 0z" />
          <path d="M12 17v4" />
        </>
      )}
      {technology === "MongoDB" && (
        <>
          <path d="M12 3c4 3 6 7 6 10a6 6 0 0 1-12 0c0-3 2-7 6-10z" />
          <path d="M12 13v6" />
        </>
      )}
      {technology === "SQLite" && (
        <>
          <path d="M8 3h6l4 4v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          <path d="M14 3v4h4" />
        </>
      )}
      {technology === "FastAPI" && <path d="M13 3 7 13h4l-1 8 7-11h-4z" />}
      {technology === "REST" && (
        <>
          <path d="M4.5 12a7.5 7.5 0 0 1 12.8-5.3" />
          <path d="M17.5 3.5v4h-4" />
          <path d="M19.5 12a7.5 7.5 0 0 1-12.8 5.3" />
          <path d="M6.5 20.5v-4h4" />
        </>
      )}
      {technology === "Git" && (
        <>
          <circle cx="6" cy="6" r="2" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="12" r="2" />
          <path d="M6 8v8" />
          <path d="M6 12h6a4 4 0 0 0 4-4" />
        </>
      )}
      {technology === "GitHub" && (
        <>
          <path d="M9 18.5c-3.2 1-3.2-1.55-4.5-2" />
          <path d="M15 21v-3.1c0-.9-.3-1.5-.8-1.8 2.7-.3 5.3-1.3 5.3-5.8 0-1.3-.45-2.3-1.2-3.15.1-.3.5-1.55-.15-3.15 0 0-1-.32-3.15 1.2a10.4 10.4 0 0 0-5.7 0C7.15 3.68 6.15 4 6.15 4c-.65 1.6-.25 2.85-.15 3.15a4.55 4.55 0 0 0-1.2 3.15c0 4.45 2.6 5.5 5.3 5.8-.35.3-.65.85-.75 1.55V21" />
        </>
      )}
      {technology === "Confluence" && (
        <>
          <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          <path d="M13 3v4h4" />
          <path d="M9 12h6" />
          <path d="M9 15h6" />
        </>
      )}
      {technology === "Vercel" && <path d="M12 4l9 15H3z" />}
    </svg>
  );
}

function ProjectIcon({ project }: { project: string }) {
  return (
    <svg className="capabilities-matrix__tech-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {project === "Atmos FC" && (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8l3 2-1 3h-4l-1-3z" />
        </>
      )}
      {project === "Nexa" && (
        <>
          <path d="M12 5 22 10 12 15 2 10z" />
          <path d="M6 12.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" />
          <path d="M22 10v5.5" />
        </>
      )}
    </svg>
  );
}

function SystemDiagram() {
  return (
    <svg className="capabilities-matrix__system-diagram-svg" viewBox="0 0 220 150" aria-hidden="true" focusable="false">
      <rect className="capabilities-matrix__system-diagram-node" x="16" y="18" width="36" height="24" rx="3" />
      <path className="capabilities-matrix__system-diagram-node" d="M16 34h36" />
      <path className="capabilities-matrix__system-diagram-node" d="M30 42v6" />
      <path className="capabilities-matrix__system-diagram-node" d="M24 48h12" />

      <path className="capabilities-matrix__system-diagram-link" d="M54 36l44 28" />
      <path className="capabilities-matrix__system-diagram-link" d="M92 59l8 5-3 8" />

      <path className="capabilities-matrix__system-diagram-node capabilities-matrix__system-diagram-node--accent" d="M115 55l18 10v20l-18 10-18-10V65z" />

      <path className="capabilities-matrix__system-diagram-link" d="M133 85l36 22" />
      <path className="capabilities-matrix__system-diagram-link" d="M162 102l8 5-3 8" />

      <ellipse className="capabilities-matrix__system-diagram-node" cx="195" cy="112" rx="17" ry="6" />
      <path className="capabilities-matrix__system-diagram-node" d="M178 112v16c0 3.3 7.6 6 17 6s17-2.7 17-6v-16" />
    </svg>
  );
}
