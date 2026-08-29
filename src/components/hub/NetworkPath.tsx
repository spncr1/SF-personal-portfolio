import type { NetworkConnection } from "@/types/navigation";
import { hubConnectionAnchors, networkNodeRadii, sectors } from "@/data/navigation";
import { getHexBoundaryPoint, getHexCornerPoint, type HexCorner, type NetworkPoint } from "@/lib/networkGeometry";

interface NetworkPathProps {
  connection: NetworkConnection;
  active?: boolean;
}

const PACKET_DURATION_SECONDS = 0.72;

export function NetworkPath({ connection, active = false }: NetworkPathProps) {
  const from = sectors.find((s) => s.id === connection.from);
  const to = sectors.find((s) => s.id === connection.to);

  if (!from || !to) return null;

  const { d } = getNetworkPathGeometry(connection);

  return (
    <g className="network-path" data-active={active}>
      <path className="network-path__base" d={d} />
      <path className="network-path__signal" d={d} />
      {active && (
        <circle className="network-path__packet" r="1.05">
          <animateMotion dur={`${PACKET_DURATION_SECONDS}s`} repeatCount="indefinite" path={d} />
        </circle>
      )}
    </g>
  );
}

export function NetworkStation({ connection }: { connection: NetworkConnection }) {
  const from = sectors.find((s) => s.id === connection.from);
  const to = sectors.find((s) => s.id === connection.to);

  if (!from || !to) return null;

  const { station } = getNetworkPathGeometry(connection);

  return (
    <circle
      className="network-path__station"
      cx={station.x}
      cy={station.y}
      r="0.9"
      pointerEvents="none"
    />
  );
}

function getNetworkPathGeometry(connection: NetworkConnection): {
  d: string;
  station: NetworkPoint;
} {
  const from = sectors.find((s) => s.id === connection.from);
  const to = sectors.find((s) => s.id === connection.to);

  if (!from || !to) {
    return { d: "", station: { x: 0, y: 0 } };
  }

  const fromCenter = { x: from.coordinates.x * 100, y: from.coordinates.y * 100 };
  const toCenter = { x: to.coordinates.x * 100, y: to.coordinates.y * 100 };
  const anchors = getHubConnectionAnchors(connection);
  const startRadius = from.id === "hub" ? networkNodeRadii.hub : networkNodeRadii.node;
  const endRadius = to.id === "hub" ? networkNodeRadii.hub : networkNodeRadii.node;
  const start = anchors
    ? getHexCornerPoint(fromCenter, startRadius, anchors.from)
    : getHexBoundaryPoint(fromCenter, toCenter, startRadius);
  const end = anchors
    ? getHexCornerPoint(toCenter, endRadius, anchors.to)
    : getHexBoundaryPoint(toCenter, fromCenter, endRadius);

  return {
    d: `M ${start.x} ${start.y} L ${end.x} ${end.y}`,
    station: getStationPoint(connection, start, end),
  };
}

function getHubConnectionAnchors(connection: NetworkConnection): { from: HexCorner; to: HexCorner } | null {
  if (connection.from === "hub" && connection.to !== "hub") {
    return hubConnectionAnchors[connection.to] ?? null;
  }

  if (connection.to === "hub" && connection.from !== "hub") {
    const anchors = hubConnectionAnchors[connection.from];
    return anchors ? { from: anchors.to, to: anchors.from } : null;
  }

  return null;
}

function getStationPoint(connection: NetworkConnection, start: NetworkPoint, end: NetworkPoint): NetworkPoint {
  return connection.to === "hub" ? start : end;
}
