import type { SectorNode } from "@/types/navigation";
import { formatSectorCoordinates, sectorCodes } from "@/data/navigation";

interface NetworkNodeProps {
  sector: SectorNode;
  active?: boolean;
  onActivate?: () => void;
  onClear?: () => void;
  onNavigate?: () => void;
}

export function NetworkNode({ sector, active = false, onActivate, onClear, onNavigate }: NetworkNodeProps) {
  const { x, y } = sector.coordinates;

  return (
    <g
      className="network-node"
      data-active={active}
      transform={`translate(${x * 100}, ${y * 100})`}
      role="link"
      tabIndex={0}
      aria-label={sector.label}
      onClick={onNavigate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onNavigate?.();
        }
      }}
      onPointerEnter={onActivate}
      onPointerLeave={onClear}
      onFocus={onActivate}
      onBlur={onClear}
    >
      <circle className="network-node__halo" r="9.5" />
      <polygon className="network-node__hex" points={hexPoints(0, 0, 5.2)} />
      <circle className="network-node__pin" r="1.45" />
      <text className="network-node__code" textAnchor="middle" y="-8.4">
        {sectorCodes[sector.id]}
      </text>
      <text className="network-node__label" textAnchor="middle" dominantBaseline="middle" y="9.8">
        {sector.label}
      </text>
      <text className="network-node__coord" textAnchor="middle" y="15.1">
        {formatSectorCoordinates(sector)}
      </text>
    </g>
  );
}

function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}
