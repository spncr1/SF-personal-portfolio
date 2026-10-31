"use client";

import { useState } from "react";
import type { CSSProperties, FocusEvent, PointerEvent, ReactNode } from "react";

import { TechnologyBadge } from "@/components/ui/TechnologyBadge";
import { getProjectArchitectureCategory } from "@/data/projectArchitecture";
import type {
  ProjectArchitectureCategoryId,
  ProjectDetail,
} from "@/types/project";

interface ProjectArchitectureVisualisationProps {
  project: ProjectDetail;
  reduceMotion: boolean;
}

type PlaneStyle = CSSProperties & {
  "--plane-compact-y": string;
  "--plane-expanded-y": string;
  "--plane-depth": string;
};

function ArchitectureCategoryIcon({
  category,
}: {
  category: ProjectArchitectureCategoryId;
}) {
  const paths: Record<ProjectArchitectureCategoryId, ReactNode> = {
    presentation: (
      <>
        <rect x="3.5" y="4.5" width="17" height="12" rx="1.5" />
        <path d="M8 20h8M12 16.5V20M7.5 8.5l2.2 2.2-2.2 2.2M12 13h4.5" />
      </>
    ),
    application: (
      <>
        <rect x="3.5" y="4" width="6" height="6" rx="1" />
        <rect x="14.5" y="14" width="6" height="6" rx="1" />
        <path d="M9.5 7h4a3 3 0 0 1 3 3v4M7 10v3a4 4 0 0 0 4 4h3.5" />
      </>
    ),
    "identity-security": (
      <>
        <path d="M12 2.8 19 5.7v5.1c0 4.5-2.7 8.3-7 10.4-4.3-2.1-7-5.9-7-10.4V5.7L12 2.8Z" />
        <circle cx="12" cy="10" r="2" />
        <path d="M12 12v3" />
      </>
    ),
    "data-persistence": (
      <>
        <ellipse cx="12" cy="5.5" rx="7.5" ry="3" />
        <path d="M4.5 5.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6M4.5 11.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
      </>
    ),
    integrations: (
      <>
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
        <path d="m8.6 10.5 6.8-3M8.6 13.5l6.8 3" />
      </>
    ),
    infrastructure: (
      <>
        <path d="M7.5 18.5h10a4 4 0 0 0 .8-7.9A6.5 6.5 0 0 0 6 8.8a5 5 0 0 0 1.5 9.7Z" />
        <path d="M9 14h6M10 11h4" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className="architecture-model__plane-icon"
      fill="none"
      viewBox="0 0 24 24"
    >
      {paths[category]}
    </svg>
  );
}

export function ProjectArchitectureVisualisation({
  project,
  reduceMotion,
}: ProjectArchitectureVisualisationProps) {
  const [hoverExpanded, setHoverExpanded] = useState(false);
  const [focusExpanded, setFocusExpanded] = useState(false);
  const [pinnedOpen, setPinnedOpen] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<ProjectArchitectureCategoryId | null>(null);
  const expanded = hoverExpanded || focusExpanded || pinnedOpen;
  const activeLayer = project.architectureLayers.find(
    (layer) => layer.category === activeCategory,
  );
  const activeLayerIndex = activeLayer
    ? project.architectureLayers.findIndex(
        (layer) => layer.category === activeLayer.category,
      )
    : -1;
  function handlePointerEnter(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") {
      setHoverExpanded(true);
    }
  }

  function handlePointerLeave(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    setHoverExpanded(false);
    if (!pinnedOpen && !focusExpanded) {
      setActiveCategory(null);
    }
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }

    setFocusExpanded(false);
    if (!pinnedOpen && !hoverExpanded) {
      setActiveCategory(null);
    }
  }

  function inspectLayer(category: ProjectArchitectureCategoryId) {
    if (pinnedOpen && activeCategory === category) {
      setPinnedOpen(false);
      setActiveCategory(null);
      return;
    }

    setPinnedOpen(true);
    setActiveCategory(category);
  }

  return (
    <div
      className="architecture-visualisation"
      data-expanded={expanded ? "true" : undefined}
      data-focused={activeLayer ? "true" : undefined}
      data-project={project.slug}
      data-reduced-motion={reduceMotion ? "true" : undefined}
      onBlur={handleBlur}
      onFocus={() => setFocusExpanded(true)}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div className="architecture-visualisation__stage">
        <div className="architecture-model">
          <span className="architecture-model__aura" aria-hidden="true" />

          {project.architectureLayers.map((layer, index) => {
            const category = getProjectArchitectureCategory(layer.category);
            const midpoint = (project.architectureLayers.length - 1) / 2;
            const offset = index - midpoint;
            const planeStyle: PlaneStyle = {
              "--plane-compact-y": `${offset * 5}px`,
              "--plane-expanded-y": `${offset * 39}px`,
              "--plane-depth": `${(project.architectureLayers.length - index) * 3}px`,
              zIndex: project.architectureLayers.length - index,
            };
            const isActive = activeCategory === layer.category;

            return (
              <button
                aria-label={`Inspect ${category.label}: ${layer.technologies
                  .map((technology) => technology.name)
                  .join(", ")}`}
                aria-pressed={pinnedOpen && isActive}
                className="architecture-model__plane"
                data-active={isActive ? "true" : undefined}
                data-tone={index % 2 === 0 ? "blue" : "gold"}
                key={layer.category}
                onClick={() => inspectLayer(layer.category)}
                onFocus={() => setActiveCategory(layer.category)}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") {
                    setActiveCategory(layer.category);
                  }
                }}
                style={planeStyle}
                type="button"
              >
                <span className="architecture-model__plane-content">
                  <ArchitectureCategoryIcon category={layer.category} />
                  <strong>{category.label}</strong>
                </span>
                <span className="architecture-model__plane-grid" aria-hidden="true" />
              </button>
            );
          })}
        </div>

      </div>

      {activeLayer ? (
        <div className="architecture-inspection-slot">
          <aside
            aria-live="polite"
            className="architecture-inspection"
            key={activeLayer.category}
          >
            <div className="architecture-inspection__heading">
              <span>{String(activeLayerIndex + 1).padStart(2, "0")}</span>
              <div>
                <strong>
                  {getProjectArchitectureCategory(activeLayer.category).label}
                </strong>
              </div>
            </div>

            <p className="architecture-inspection__description">
              {getProjectArchitectureCategory(activeLayer.category).definition}
            </p>

            <section className="architecture-inspection__section">
              <h4>Technologies</h4>
              <ul className="architecture-inspection__technologies">
                {activeLayer.technologies.map((technology) => (
                  <li key={technology.name}>
                    <TechnologyBadge technology={technology.name} />
                    <span className="architecture-inspection__technology-responsibility">
                      {technology.responsibility}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="architecture-inspection__section architecture-inspection__section--responsibilities">
              <h4>Key responsibilities</h4>
              <p>{activeLayer.responsibility}</p>
            </section>

            {activeLayer.uncertainty ? (
              <p className="architecture-inspection__uncertainty">
                Evidence note: {activeLayer.uncertainty}
              </p>
            ) : null}
          </aside>
        </div>
      ) : null}
    </div>
  );
}
