"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { connections, sectors } from "@/data/navigation";
import { HudPanel } from "@/components/ui/HudPanel";
import { SystemLabel } from "@/components/ui/SystemLabel";
import { getHexBoundaryPoint, hexPoints } from "@/lib/networkGeometry";

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
          <SystemLabel variant="secondary">{active ? active.label : "Unknown"}</SystemLabel>
        </div>

        <NetworkCanvas activeSector={activeSector} compact />

        <div className="minimap__actions">
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
              <SystemLabel>Section Network</SystemLabel>
              <button type="button" onClick={() => setExpanded(false)}>
                Close
              </button>
            </div>
            <NetworkCanvas activeSector={activeSector} />
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
  const substrateRoutes = [
    "M 8 24 L 24 24 L 39 39",
    "M 92 24 L 76 24 L 61 39",
    "M 8 76 L 24 76 L 39 61",
    "M 92 76 L 76 76 L 61 61",
    "M 18 50 L 34 50 L 42 58",
    "M 82 50 L 66 50 L 58 42",
  ];
  const substrateStops = [
    { x: 24, y: 24 },
    { x: 76, y: 24 },
    { x: 24, y: 76 },
    { x: 76, y: 76 },
    { x: 34, y: 50 },
    { x: 66, y: 50 },
    { x: 50, y: 18 },
    { x: 50, y: 82 },
  ];

  const returnToHub = () => router.push("/");

  return (
    <svg
      className={compact ? "minimap__canvas minimap__canvas--compact" : "minimap__canvas minimap__canvas--expanded"}
      viewBox="0 0 100 100"
      aria-label="Section network map"
    >
      {!compact && (
        <g className="minimap__substrate" aria-hidden="true">
          {substrateRoutes.map((route) => (
            <path key={route} d={route} />
          ))}
          {substrateStops.map((stop) => (
            <circle key={`${stop.x}-${stop.y}`} cx={stop.x} cy={stop.y} r="0.72" />
          ))}
        </g>
      )}

      {hub &&
        connections.map((conn) => {
          const from = sectors.find((s) => s.id === conn.from);
          const to = sectors.find((s) => s.id === conn.to);
          if (!from || !to) return null;
          const fromCenter = { x: from.coordinates.x * 100, y: from.coordinates.y * 100 };
          const toCenter = { x: to.coordinates.x * 100, y: to.coordinates.y * 100 };
          const start = getHexBoundaryPoint(fromCenter, toCenter, compact ? 5 : 7);
          const end = getHexBoundaryPoint(toCenter, fromCenter, compact ? 4 : 5);

          return (
            <line
              key={`${conn.from}-${conn.to}`}
              className="minimap__path"
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
            />
          );
        })}

      {hub && (
        <g
          aria-label="Central Hub"
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
