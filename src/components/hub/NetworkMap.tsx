"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NetworkNode } from "./NetworkNode";
import { NetworkPath } from "./NetworkPath";
import { connections, formatSectorCoordinates, sectors } from "@/data/navigation";
import type { SectorId } from "@/types/navigation";

export function NetworkMap() {
  const router = useRouter();
  const hub = sectors.find((sector) => sector.id === "hub");
  const sectorNodes = sectors.filter((sector) => sector.id !== "hub");
  const [activeSector, setActiveSector] = useState<SectorId | null>(null);
  const activeNode = sectorNodes.find((sector) => sector.id === activeSector);

  return (
    <div className="network-map-shell">
      <div className="network-map-shell__hud network-map-shell__hud--left" aria-hidden="true">
        <span>SYS READY</span>
        <span>TOPOLOGY / 05</span>
      </div>
      <div className="network-map-shell__hud network-map-shell__hud--right" aria-hidden="true">
        <span>HUB-00</span>
        <span>{activeNode ? formatSectorCoordinates(activeNode) : hub ? formatSectorCoordinates(hub) : "00.00° / 00.00°"}</span>
      </div>

      <svg
        className="network-map"
        viewBox="0 0 100 100"
        aria-label="Central Hub network"
        onPointerLeave={() => setActiveSector(null)}
      >
        <defs>
          <filter id="network-node-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0.96  0 1 0 0 0.76  0 0 1 0 0  0 0 0 0.72 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="network-path-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(245, 196, 0, 0.18)" />
            <stop offset="55%" stopColor="rgba(245, 196, 0, 0.78)" />
            <stop offset="100%" stopColor="rgba(58, 212, 255, 0.28)" />
          </linearGradient>
        </defs>

        <g className="network-map__field" aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => (
            <line key={`x-${index}`} x1={12 + index * 9.5} y1="8" x2={12 + index * 9.5} y2="92" />
          ))}
          {Array.from({ length: 7 }, (_, index) => (
            <line key={`y-${index}`} x1="8" y1={13 + index * 11} x2="92" y2={13 + index * 11} />
          ))}
        </g>

        <g className="network-map__paths">
          {connections.map((conn) => (
            <NetworkPath
              key={`${conn.from}-${conn.to}`}
              connection={conn}
              active={activeSector === conn.to}
            />
          ))}
        </g>

        {hub && (
          <g
            className="network-core"
            transform={`translate(${hub.coordinates.x * 100}, ${hub.coordinates.y * 100})`}
          >
            <polygon className="network-core__outer" points={hexPoints(0, 0, 9.2)} />
            <polygon className="network-core__inner" points={hexPoints(0, 0, 5.4)} />
            <text className="network-core__mark" textAnchor="middle" dominantBaseline="middle">
              SF
            </text>
            <text className="network-core__label" textAnchor="middle" y="13">
              HUB-00
            </text>
          </g>
        )}

        <g className="network-map__nodes">
          {sectorNodes.map((sector) => (
            <NetworkNode
              key={sector.id}
              sector={sector}
              active={activeSector === sector.id}
              onActivate={() => setActiveSector(sector.id)}
              onClear={() => setActiveSector(null)}
              onNavigate={() => router.push(sector.route)}
            />
          ))}
        </g>
      </svg>

      <aside className="network-readout" aria-live="polite">
        <span className="network-readout__kicker">Active vector</span>
        <strong>{activeNode?.label ?? "Central Hub"}</strong>
        <span>{activeNode ? formatSectorCoordinates(activeNode) : "Network ready"}</span>
      </aside>
    </div>
  );
}

function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}
