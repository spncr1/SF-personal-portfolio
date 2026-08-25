"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { connections, sectors } from "@/data/navigation";
import { HudPanel } from "@/components/ui/HudPanel";
import { SystemLabel } from "@/components/ui/SystemLabel";

interface MiniMapProps {
  activeSector?: string;
}

export function MiniMap({ activeSector }: MiniMapProps) {
  const nodes = sectors.filter((sector) => sector.id !== "hub");
  const active = nodes.find((sector) => sector.id === activeSector);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <HudPanel className="minimap">
        <div className="minimap__title">
          <SystemLabel variant="metadata">Minimap</SystemLabel>
          <SystemLabel variant="secondary">
            {active ? active.id.toUpperCase() : "UNKNOWN"}
          </SystemLabel>
        </div>

        <NetworkCanvas activeSector={activeSector} compact />

        <div className="minimap__actions">
          <Link href="/" className="minimap__hub-link">
            Return to Central Hub
          </Link>
          <button
            className="minimap__expand"
            type="button"
            aria-label="Expand network map"
            onClick={() => setExpanded(true)}
          >
            <span aria-hidden="true" />
          </button>
        </div>
      </HudPanel>

      {expanded && (
        <div className="minimap-modal" role="dialog" aria-modal="true" aria-label="Expanded network map">
          <button
            className="minimap-modal__backdrop"
            type="button"
            aria-label="Close network map"
            onClick={() => setExpanded(false)}
          />
          <div className="minimap-modal__panel">
            <div className="minimap-modal__header">
              <SystemLabel>Sector Network</SystemLabel>
              <button type="button" onClick={() => setExpanded(false)}>
                Close
              </button>
            </div>
            <NetworkCanvas activeSector={activeSector} />
            <div className="minimap-modal__actions">
              <Link href="/" className="minimap-modal__hub-link" onClick={() => setExpanded(false)}>
                Return to Central Hub
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NetworkCanvas({ activeSector, compact = false }: MiniMapProps & { compact?: boolean }) {
  const router = useRouter();
  const nodes = sectors.filter((sector) => sector.id !== "hub");
  const hub = sectors.find((sector) => sector.id === "hub");

  const returnToHub = () => router.push("/");

  return (
    <svg
      className={compact ? "minimap__canvas minimap__canvas--compact" : "minimap__canvas minimap__canvas--expanded"}
      viewBox="0 0 100 100"
      aria-label="Sector network map"
    >
      {hub &&
        connections.map((conn) => {
          const from = sectors.find((s) => s.id === conn.from);
          const to = sectors.find((s) => s.id === conn.to);
          if (!from || !to) return null;
          return (
            <line
              key={`${conn.from}-${conn.to}`}
              className="minimap__path"
              x1={from.coordinates.x * 100}
              y1={from.coordinates.y * 100}
              x2={to.coordinates.x * 100}
              y2={to.coordinates.y * 100}
            />
          );
        })}

      {hub && (
        <g
          aria-label="Return to Central Hub"
          className="minimap__core-link"
          role="link"
          tabIndex={0}
          onClick={returnToHub}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              returnToHub();
            }
          }}
        >
          <polygon
            className="minimap__core"
            points={hexPoints(hub.coordinates.x * 100, hub.coordinates.y * 100, compact ? 5 : 7)}
          />
          {!compact && (
            <text
              className="minimap__core-label"
              x={hub.coordinates.x * 100}
              y={hub.coordinates.y * 100 - 9}
              textAnchor="middle"
            >
              Hub
            </text>
          )}
        </g>
      )}

      {nodes.map((sector) => {
        const cx = sector.coordinates.x * 100;
        const cy = sector.coordinates.y * 100;
        const isActive = activeSector === sector.id;
        return (
          <a
            key={sector.id}
            href={sector.route}
            aria-label={sector.label}
            aria-current={isActive ? "page" : undefined}
            className="minimap__node-link"
          >
            <polygon
              className={isActive ? "minimap__node minimap__node--active" : "minimap__node"}
              points={hexPoints(cx, cy, compact ? 4 : 5)}
              data-sector={sector.id}
            />
            {!compact && (
              <text className="minimap__node-label" x={cx} y={cy + 8} textAnchor="middle">
                {sector.shortLabel}
              </text>
            )}
          </a>
        );
      })}
    </svg>
  );
}

function hexPoints(cx: number, cy: number, r: number): string {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = ((Math.PI / 3) * i - Math.PI / 6);
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  });
  return points.join(" ");
}
