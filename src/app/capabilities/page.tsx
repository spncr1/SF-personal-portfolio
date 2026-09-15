import type { Metadata } from "next";
import { HudPanel } from "@/components/ui/HudPanel";
import { SystemLabel } from "@/components/ui/SystemLabel";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { TechnologyBadge } from "@/components/ui/TechnologyBadge";
import { capabilities } from "@/data/capabilities";

export const metadata: Metadata = {
  title: "Skills | Spencer Fisher",
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
          <SystemLabel>Capability Matrix</SystemLabel>
          <h1>Skills</h1>
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
                        <TechnologyBadge key={technology} technology={technology} />
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

function ProjectIcon({ project }: { project: string }) {
  return <SiteIcon className="capabilities-matrix__tech-icon" name={project === "Atmos FC" ? "soccer" : "school"} />;
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
