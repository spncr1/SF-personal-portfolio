import type { NetworkConnection, SectorId, SectorNode } from "@/types/navigation";

export const sectorCodes: Record<SectorId, string> = {
  hub: "HUB-00",
  projects: "SEC-01",
  capabilities: "SEC-02",
  personnel: "SEC-03",
  operations: "SEC-04",
  communications: "SEC-05",
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
  return `${x}° / ${y}°`;
}

export const sectors: SectorNode[] = [
  {
    id: "hub",
    label: "Central Hub",
    route: "/",
    coordinates: { x: 0.5, y: 0.5 },
  },
  {
    id: "projects",
    label: "Project Systems",
    route: "/projects",
    coordinates: { x: 0.2, y: 0.3 },
  },
  {
    id: "capabilities",
    label: "Capabilities",
    route: "/capabilities",
    coordinates: { x: 0.8, y: 0.25 },
  },
  {
    id: "personnel",
    label: "Personnel",
    route: "/personnel",
    coordinates: { x: 0.15, y: 0.7 },
  },
  {
    id: "operations",
    label: "Active Operations",
    route: "/operations",
    coordinates: { x: 0.5, y: 0.78 },
  },
  {
    id: "communications",
    label: "Communications",
    route: "/communications",
    coordinates: { x: 0.85, y: 0.75 },
  },
];

export const connections: NetworkConnection[] = [
  { from: "hub", to: "projects" },
  { from: "hub", to: "capabilities" },
  { from: "hub", to: "personnel" },
  { from: "hub", to: "operations" },
  { from: "hub", to: "communications" },
];
