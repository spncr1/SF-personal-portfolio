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
  const isLowerNode = y > 0.7;
  const labelY = isLowerNode ? 13.8 : 15.8;
  const descriptorY = isLowerNode ? 17.8 : 20.1;

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
      <circle className="network-node__halo" r="13.2" />
      <polygon className="network-node__hex" points={hexPoints(0, 0, 7.85)} />
      {sector.icon ? (
        <image
          className="network-node__icon"
          href={sector.icon}
          x="-4.35"
          y="-4.35"
          width="8.7"
          height="8.7"
          preserveAspectRatio="xMidYMid meet"
        />
      ) : (
        <circle className="network-node__pin" r="2.2" />
      )}
      <text className="network-node__label" textAnchor="middle" dominantBaseline="middle" y={labelY}>
        {sector.label}
      </text>
      <text className="network-node__descriptor" textAnchor="middle" y={descriptorY}>
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
