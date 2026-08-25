import type { NetworkConnection } from "@/types/navigation";
import { sectors } from "@/data/navigation";

interface NetworkPathProps {
  connection: NetworkConnection;
  active?: boolean;
}

export function NetworkPath({ connection, active = false }: NetworkPathProps) {
  const from = sectors.find((s) => s.id === connection.from);
  const to = sectors.find((s) => s.id === connection.to);

  if (!from || !to) return null;

  const x1 = from.coordinates.x * 100;
  const y1 = from.coordinates.y * 100;
  const x2 = to.coordinates.x * 100;
  const y2 = to.coordinates.y * 100;
  const d = `M ${x1} ${y1} L ${x2} ${y2}`;
  const stationTicks = [0.32, 0.66].map((progress) => ({
    x: x1 + (x2 - x1) * progress,
    y: y1 + (y2 - y1) * progress,
  }));

  return (
    <g className="network-path" data-active={active}>
      <path className="network-path__base" d={d} />
      <path className="network-path__signal" d={d} />
      {stationTicks.map((tick, index) => (
        <circle
          key={`${connection.to}-${index}`}
          className="network-path__station"
          cx={tick.x}
          cy={tick.y}
          r="0.55"
        />
      ))}
      {active && (
        <circle className="network-path__packet" r="0.75">
          <animateMotion dur="0.92s" repeatCount="indefinite" path={d} />
        </circle>
      )}
    </g>
  );
}
