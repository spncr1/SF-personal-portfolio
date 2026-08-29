import type { NetworkConnection, SectorId, SectorNode } from "@/types/navigation";
import { getHexCornerPoint, type HexCorner, type NetworkPoint } from "@/lib/networkGeometry";

type OuterSectorId = Exclude<SectorId, "hub">;

export const networkNodeRadii = {
  hub: 16.7,
  node: 7.85,
} as const;

export const hubConnectionAnchors: Record<OuterSectorId, { from: HexCorner; to: HexCorner }> = {
  operations: { from: "top", to: "bottom" },
  capabilities: { from: "upperRight", to: "lowerLeft" },
  communications: { from: "lowerRight", to: "upperLeft" },
  personnel: { from: "lowerLeft", to: "upperRight" },
  projects: { from: "upperLeft", to: "lowerRight" },
};

const hubCoordinates = { x: 0.5, y: 0.53 };
const hubPoint = toNetworkPoint(hubCoordinates);
const nodeDistanceFromHubCorner = 15;

export const sectorCodes: Record<SectorId, string> = {
  hub: "HUB-00",
  operations: "SEC-01",
  capabilities: "SEC-02",
  communications: "SEC-03",
  personnel: "SEC-04",
  projects: "SEC-05",
};

export function getSectorFromPathname(pathname: string): SectorNode {
  const ranked = [...sectors]
    .filter((sector) => sector.route !== "/")
    .sort((a, b) => b.route.length - a.route.length);

  const match = ranked.find(
    (sector) => pathname === sector.route || pathname.startsWith(`${sector.route}/`),
  );

  return match ?? sectors.find((sector) => sector.id === "hub") ?? sectors[0];
}

export function formatSectorCoordinates(sector: SectorNode): string {
  const x = (sector.coordinates.x * 180).toFixed(2);
  const y = (sector.coordinates.y * 90).toFixed(2);
  return `${x} / ${y}`;
}

export const sectors: SectorNode[] = [
  {
    id: "hub",
    label: "Central Hub",
    shortLabel: "Hub",
    descriptor: "System overview",
    route: "/",
    coordinates: hubCoordinates,
  },
  {
    id: "operations",
    label: "Active Operations",
    shortLabel: "Operations",
    descriptor: "Current activities",
    route: "/operations",
    coordinates: getRayAlignedNodeCoordinates("operations"),
    icon: "/icons/sectors/active-operations.svg",
  },
  {
    id: "capabilities",
    label: "Capabilities",
    shortLabel: "Capabilities",
    descriptor: "Technical stack",
    route: "/capabilities",
    coordinates: getRayAlignedNodeCoordinates("capabilities"),
    icon: "/icons/sectors/capabilities.svg",
  },
  {
    id: "communications",
    label: "Communications",
    shortLabel: "Comms",
    descriptor: "Connect",
    route: "/communications",
    coordinates: getRayAlignedNodeCoordinates("communications"),
    icon: "/icons/sectors/communications.svg",
  },
  {
    id: "personnel",
    label: "Personnel",
    shortLabel: "Personnel",
    descriptor: "Operator profile",
    route: "/personnel",
    coordinates: getRayAlignedNodeCoordinates("personnel"),
    icon: "/icons/sectors/personnel.svg",
  },
  {
    id: "projects",
    label: "Project Systems",
    shortLabel: "Projects",
    descriptor: "Engineering work",
    route: "/projects",
    coordinates: getRayAlignedNodeCoordinates("projects"),
    icon: "/icons/sectors/project-systems.svg",
  },
];

export const connections: NetworkConnection[] = [
  { from: "hub", to: "operations" },
  { from: "hub", to: "capabilities" },
  { from: "hub", to: "communications" },
  { from: "hub", to: "personnel" },
  { from: "hub", to: "projects" },
];

function getRayAlignedNodeCoordinates(sectorId: OuterSectorId): { x: number; y: number } {
  const anchors = hubConnectionAnchors[sectorId];
  const hubCorner = getHexCornerPoint(hubPoint, networkNodeRadii.hub, anchors.from);
  const nodeCornerOffset = getHexCornerPoint({ x: 0, y: 0 }, networkNodeRadii.node, anchors.to);
  const cornerDirection = {
    x: (hubCorner.x - hubPoint.x) / networkNodeRadii.hub,
    y: (hubCorner.y - hubPoint.y) / networkNodeRadii.hub,
  };

  return toSectorCoordinates({
    x: hubCorner.x + cornerDirection.x * nodeDistanceFromHubCorner - nodeCornerOffset.x,
    y: hubCorner.y + cornerDirection.y * nodeDistanceFromHubCorner - nodeCornerOffset.y,
  });
}

function toNetworkPoint(coordinates: { x: number; y: number }): NetworkPoint {
  return {
    x: coordinates.x * 100,
    y: coordinates.y * 100,
  };
}

function toSectorCoordinates(point: NetworkPoint): { x: number; y: number } {
  return {
    x: point.x / 100,
    y: point.y / 100,
  };
}
