import type { SectorNode } from "@/types/navigation";

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
      <circle className="network-node__halo" r="10.4" />
      <polygon className="network-node__hex" points={hexPoints(0, 0, 6.15)} />
      {sector.icon ? (
        <image
          className="network-node__icon"
          href={sector.icon}
          x="-3.35"
          y="-3.35"
          width="6.7"
          height="6.7"
          preserveAspectRatio="xMidYMid meet"
        />
      ) : (
        <circle className="network-node__pin" r="1.7" />
      )}
      <text className="network-node__label" textAnchor="middle" dominantBaseline="middle" y="12.6">
        {sector.label}
      </text>
      <text className="network-node__descriptor" textAnchor="middle" y="16.4">
        {sector.descriptor}
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
