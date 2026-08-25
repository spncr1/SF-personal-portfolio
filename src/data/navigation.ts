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
  return `${x} / ${y}`;
}

export const sectors: SectorNode[] = [
  {
    id: "hub",
    label: "Central Hub",
    shortLabel: "Hub",
    descriptor: "System overview",
    route: "/",
    coordinates: { x: 0.5, y: 0.53 },
  },
  {
    id: "projects",
    label: "Project Systems",
    shortLabel: "Projects",
    descriptor: "Engineering work",
    route: "/projects",
    coordinates: { x: 0.25, y: 0.35 },
    icon: "/icons/sectors/project-systems.svg",
  },
  {
    id: "capabilities",
    label: "Capabilities",
    shortLabel: "Capabilities",
    descriptor: "Technical stack",
    route: "/capabilities",
    coordinates: { x: 0.75, y: 0.35 },
    icon: "/icons/sectors/capabilities.svg",
  },
  {
    id: "personnel",
    label: "Personnel",
    shortLabel: "Personnel",
    descriptor: "Operator profile",
    route: "/personnel",
    coordinates: { x: 0.25, y: 0.75 },
    icon: "/icons/sectors/personnel.svg",
  },
  {
    id: "operations",
    label: "Active Operations",
    shortLabel: "Operations",
    descriptor: "Current activity",
    route: "/operations",
    coordinates: { x: 0.5, y: 0.2 },
    icon: "/icons/sectors/active-operations.svg",
  },
  {
    id: "communications",
    label: "Communications",
    shortLabel: "Comms",
    descriptor: "Connect",
    route: "/communications",
    coordinates: { x: 0.75, y: 0.75 },
    icon: "/icons/sectors/communications.svg",
  },
];

export const connections: NetworkConnection[] = [
  { from: "hub", to: "projects" },
  { from: "hub", to: "capabilities" },
  { from: "hub", to: "personnel" },
  { from: "hub", to: "operations" },
  { from: "hub", to: "communications" },
];
