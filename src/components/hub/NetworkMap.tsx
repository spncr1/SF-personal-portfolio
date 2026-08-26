"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NetworkNode } from "./NetworkNode";
import { NetworkPath } from "./NetworkPath";
import { connections, formatSectorCoordinates, sectorCodes, sectors } from "@/data/navigation";
import { profile } from "@/data/profile";
import type { SectorId } from "@/types/navigation";

export function NetworkMap() {
  const router = useRouter();
  const hub = sectors.find((sector) => sector.id === "hub");
  const sectorNodes = sectors.filter((sector) => sector.id !== "hub");
  const [activeSector, setActiveSector] = useState<SectorId | null>(null);
  const activeNode = sectorNodes.find((sector) => sector.id === activeSector);
  const previewNode = activeNode ?? hub;

  const updateActiveSector = (sectorId: SectorId | null) => {
    setActiveSector(sectorId);
    window.dispatchEvent(new CustomEvent("sf-ops-section-preview", { detail: sectorId }));
  };

  return (
    <div className="network-map-shell">
      <div className="network-map-shell__hud network-map-shell__hud--left" aria-hidden="true">
        <span>SYS READY</span>
        <span>SECTIONS: 05</span>
      </div>
      <div className="network-map-shell__hud network-map-shell__hud--right" aria-hidden="true">
        <span>{previewNode ? sectorCodes[previewNode.id] : "HUB-00"}</span>
        <span>Coordinates {previewNode ? formatSectorCoordinates(previewNode) : "00.00 / 00.00"}</span>
      </div>

      <svg
        className="network-map"
        viewBox="10 8 80 88"
        aria-label="Central Hub network"
        onPointerLeave={() => updateActiveSector(null)}
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
          <filter id="network-portrait-grade">
            <feColorMatrix
              type="matrix"
              values="0.72 0.18 0.06 0 0.05  0.2 0.68 0.08 0 0.02  0.08 0.12 0.5 0 0  0 0 0 0.86 0"
            />
            <feComponentTransfer>
              <feFuncR type="linear" slope="0.78" intercept="0.03" />
              <feFuncG type="linear" slope="0.72" intercept="0.02" />
              <feFuncB type="linear" slope="0.54" />
            </feComponentTransfer>
          </filter>
          <linearGradient id="network-path-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--palette-ember)" stopOpacity="0.16" />
            <stop offset="55%" stopColor="var(--palette-gold-soft)" stopOpacity="0.82" />
            <stop offset="100%" stopColor="var(--palette-rust)" stopOpacity="0.28" />
          </linearGradient>
          <clipPath id="network-portrait-clip">
            <polygon points={hexPoints(0, 0, 12.25)} />
          </clipPath>
          <radialGradient id="network-core-aura" cx="50%" cy="45%" r="58%">
            <stop offset="0%" stopColor="var(--palette-gold-soft)" stopOpacity="0.38" />
            <stop offset="58%" stopColor="var(--palette-neon-ember)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="var(--palette-charcoal-deep)" stopOpacity="0" />
          </radialGradient>
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
            <circle className="network-core__aura" r="23" />
            <circle className="network-core__orbit network-core__orbit--outer" r="17.2" />
            <circle className="network-core__orbit network-core__orbit--inner" r="14.1" />
            <polygon className="network-core__outer" points={hexPoints(0, 0, 12.9)} />
            <polygon className="network-core__portrait-backdrop" points={hexPoints(0, 0, 12.05)} />
            <image
              className="network-core__portrait"
              href={profile.portrait}
              x="-12.2"
              y="-12.2"
              width="24.4"
              height="24.4"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#network-portrait-clip)"
            />
            <polygon className="network-core__portrait-ring" points={hexPoints(0, 0, 12.05)} />
            <polygon className="network-core__portrait-scan" points={hexPoints(0, 0, 10.35)} />
            <text className="network-core__label" textAnchor="middle" y="18.9">
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
              onActivate={() => updateActiveSector(sector.id)}
              onClear={() => updateActiveSector(null)}
              onNavigate={() => router.push(sector.route)}
            />
          ))}
        </g>
      </svg>

      <aside className="network-readout" aria-live="polite">
        <span className="network-readout__kicker">Active section</span>
        <strong>{activeNode?.label ?? "Central Hub"}</strong>
        <span>Coordinates {activeNode ? formatSectorCoordinates(activeNode) : hub ? formatSectorCoordinates(hub) : "00.00 / 00.00"}</span>
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
