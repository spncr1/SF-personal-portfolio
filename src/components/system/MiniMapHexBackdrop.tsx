import type { CSSProperties } from "react";
import { getMiniMapHexCells, getMiniMapHexTerminals } from "@/lib/minimapHexBackdrop";

type MiniMapHexStyle = CSSProperties & {
  "--minimap-hex-strength": number;
};

export function MiniMapHexBackdrop() {
  const cells = getMiniMapHexCells();
  const terminals = getMiniMapHexTerminals();

  return (
    <svg
      className="minimap-hex-backdrop"
      viewBox="0 0 100 78"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
      aria-hidden="true"
    >
      <g className="minimap-hex-backdrop__cells">
        {cells.map((cell) => (
          <polygon
            key={cell.key}
            className={`minimap-hex-backdrop__cell minimap-hex-backdrop__cell--${cell.layer}`}
            points={cell.points}
            data-cluster={cell.cluster}
            style={getMiniMapHexStyle(cell.intensity)}
          />
        ))}
      </g>
      <g className="minimap-hex-backdrop__terminals">
        {terminals.map((terminal) => (
          <g
            key={terminal.key}
            className={`minimap-hex-backdrop__terminal minimap-hex-backdrop__terminal--${terminal.tone}`}
            data-cluster={terminal.cluster}
            style={getMiniMapHexStyle(terminal.intensity)}
          >
            <polyline points={terminal.points.map((point) => `${point.x},${point.y}`).join(" ")} />
            <circle cx={terminal.terminalNode.x} cy={terminal.terminalNode.y} r={terminal.nodeRadius} />
          </g>
        ))}
      </g>
    </svg>
  );
}

function getMiniMapHexStyle(intensity = 0.5): MiniMapHexStyle {
  return {
    "--minimap-hex-strength": intensity,
  };
}
