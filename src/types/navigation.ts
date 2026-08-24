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
  route: string;
  coordinates: { x: number; y: number };
}

export interface NetworkConnection {
  from: SectorId;
  to: SectorId;
}
