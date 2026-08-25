export type SectorId =
  | "hub"
  | "projects"
  | "capabilities"
  | "personnel"
  | "operations"
  | "communications";

export interface SectorNode {
  id: SectorId;
  label: string;
  shortLabel: string;
  descriptor: string;
  route: string;
  coordinates: { x: number; y: number };
  icon?: string;
}

export interface NetworkConnection {
  from: SectorId;
  to: SectorId;
}
