import Link from "next/link";
import { connections, sectors } from "@/data/navigation";
import { HudPanel } from "@/components/ui/HudPanel";
import { SystemLabel } from "@/components/ui/SystemLabel";

interface MiniMapProps {
  activeSector?: string;
}

export function MiniMap({ activeSector }: MiniMapProps) {
  const nodes = sectors.filter((sector) => sector.id !== "hub");
  const hub = sectors.find((sector) => sector.id === "hub");
  const active = nodes.find((sector) => sector.id === activeSector);

  return (
    <HudPanel className="minimap" label="Nav net">
      <div className="minimap__title">
        <SystemLabel variant="metadata">Minimap</SystemLabel>
        <SystemLabel variant="secondary">
          {active ? active.id.toUpperCase() : "UNKNOWN"}
        </SystemLabel>
      </div>

      <svg className="minimap__canvas" viewBox="0 0 100 100" aria-label="Sector minimap">
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
          <polygon
            className="minimap__core"
            points={hexPoints(hub.coordinates.x * 100, hub.coordinates.y * 100, 5)}
          />
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
                points={hexPoints(cx, cy, 4)}
                data-sector={sector.id}
              />
            </a>
          );
        })}
      </svg>

      <Link href="/" className="minimap__hub-link">
        Return to hub
      </Link>
    </HudPanel>
  );
}

function hexPoints(cx: number, cy: number, r: number): string {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = ((Math.PI / 3) * i - Math.PI / 6);
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  });
  return points.join(" ");
}
