import Image from "next/image";
import {
  createStartupHudHexGrid,
  startupHudHexConfig,
  type StartupHudHexCoordinate,
  type StartupHudHexLayer,
} from "@/lib/startupHudGeometry";

interface PersonnelPortraitProps {
  portrait: string;
}

const interestTerminalCells = new Set(["5,-1", "4,1", "2,3", "0,5"]);

function getTopologyLayer(radius: number): StartupHudHexLayer {
  if (radius > 126) return "peripheral";
  if (radius > 106) return "secondary";
  return "primary";
}

const portraitTopologyCoordinates = (() => {
  const coordinates: StartupHudHexCoordinate[] = [];
  const size = startupHudHexConfig.hexSize;

  for (let q = -5; q <= 6; q += 1) {
    for (let r = -7; r <= 7; r += 1) {
      const x = 1.5 * size * q;
      const y = Math.sqrt(3) * size * (r + q / 2);
      const radius = Math.hypot(x, y);
      const followsLeftArc = x <= -38 && radius >= 78 && radius <= 148 && y >= -105 && y <= 112;
      const followsLowerRightArc = x >= -38 && y >= -8 && radius >= 78 && radius <= 170;

      if (!followsLeftArc && !followsLowerRightArc) continue;

      coordinates.push({ q, r, layer: getTopologyLayer(radius) });
    }
  }

  return coordinates;
})();

const portraitTopologyLayers = new Map(
  portraitTopologyCoordinates.map(({ q, r, layer }) => [`${q},${r}`, layer]),
);

const portraitTopologyCells = createStartupHudHexGrid(portraitTopologyCoordinates)
  .toArray()
  .map((hex) => ({
    key: `${hex.q},${hex.r}`,
    layer: portraitTopologyLayers.get(`${hex.q},${hex.r}`) ?? "secondary",
    points: hex.corners.map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" "),
    terminal: interestTerminalCells.has(`${hex.q},${hex.r}`),
  }));

export function PersonnelPortrait({ portrait }: PersonnelPortraitProps) {
  return (
    <figure className="personnel-portrait">
      <div className="personnel-portrait__topology" aria-hidden="true">
        <svg
          className="personnel-portrait__topology-svg"
          viewBox="-260 -120 520 240"
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
        >
          {portraitTopologyCells.map((cell) => (
            <polygon
              className={`startup-hud__hex-cell startup-hud__hex-cell--${cell.layer}`}
              data-terminal={cell.terminal || undefined}
              key={cell.key}
              points={cell.points}
            />
          ))}
        </svg>
      </div>

      <div className="personnel-portrait__frame">
        <div className="personnel-portrait__clip">
          <Image
            src={portrait}
            alt="Portrait of Spencer Fisher"
            fill
            sizes="(max-width: 720px) 13.5rem, (max-width: 1180px) 15rem, 18rem"
          />
        </div>
      </div>
    </figure>
  );
}
