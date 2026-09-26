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
    <svg className="capabilities-matrix__system-diagram-svg" viewBox="0 0 260 176" aria-hidden="true" focusable="false">
      <circle className="capabilities-matrix__system-diagram-orbit" cx="130" cy="88" r="57" />
      <circle className="capabilities-matrix__system-diagram-orbit capabilities-matrix__system-diagram-orbit--inner" cx="130" cy="88" r="41" />

      <path className="capabilities-matrix__system-diagram-link" d="M74 52H42v20" />
      <path className="capabilities-matrix__system-diagram-link" d="M186 52h32v20" />
      <path className="capabilities-matrix__system-diagram-link" d="M82 126H46v-20" />
      <path className="capabilities-matrix__system-diagram-link" d="M178 126h36v-20" />

      <g className="capabilities-matrix__system-diagram-server">
        <rect className="capabilities-matrix__system-diagram-node" x="20" y="71" width="44" height="34" rx="3" />
        <path className="capabilities-matrix__system-diagram-node" d="M20 82h44M20 94h44" />
        <circle className="capabilities-matrix__system-diagram-status" cx="28" cy="77" r="1.8" />
        <circle className="capabilities-matrix__system-diagram-status" cx="28" cy="88" r="1.8" />
        <circle className="capabilities-matrix__system-diagram-status" cx="28" cy="100" r="1.8" />
      </g>

      <path className="capabilities-matrix__system-diagram-node capabilities-matrix__system-diagram-node--accent" d="M130 54l29 17v34l-29 17-29-17V71z" />
      <path className="capabilities-matrix__system-diagram-glyph" d="M119 80l-9 8 9 8M141 80l9 8-9 8M135 73l-10 30" />

      <g className="capabilities-matrix__system-diagram-database">
        <ellipse className="capabilities-matrix__system-diagram-node" cx="224" cy="76" rx="18" ry="6" />
        <path className="capabilities-matrix__system-diagram-node" d="M206 76v25c0 3.4 8.1 6 18 6s18-2.6 18-6V76M206 88c0 3.4 8.1 6 18 6s18-2.6 18-6" />
      </g>

      <circle className="capabilities-matrix__system-diagram-packet" cx="74" cy="52" r="3" />
      <circle className="capabilities-matrix__system-diagram-packet capabilities-matrix__system-diagram-packet--late" cx="186" cy="52" r="3" />
      <text className="capabilities-matrix__system-diagram-label" x="130" y="155" textAnchor="middle">API / DATA / SERVICES</text>
    </svg>
  );
}
