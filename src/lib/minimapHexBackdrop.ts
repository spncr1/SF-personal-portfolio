import { Grid, Orientation, defineHex, fromCoordinates, type Hex, type Point } from "honeycomb-grid";

export type MiniMapHexClusterId = "top-edge" | "right-edge" | "left-edge" | "bottom-left-edge";
export type MiniMapHexLayer = "primary" | "secondary" | "peripheral";

export interface MiniMapHexCoordinate {
  q: number;
  r: number;
  layer: MiniMapHexLayer;
  intensity?: number;
}

export interface MiniMapHexCell extends MiniMapHexCoordinate {
  cluster: MiniMapHexClusterId;
  key: string;
  center: Point;
  corners: Point[];
  points: string;
}

export interface MiniMapHexTerminal {
  cluster: MiniMapHexClusterId;
  key: string;
  tone: MiniMapHexLayer;
  intensity: number;
  points: Point[];
  terminalNode: Point;
  nodeRadius: number;
}

interface MiniMapHexCluster {
  id: MiniMapHexClusterId;
  origin: Point;
  cells: MiniMapHexCoordinate[];
}

interface MiniMapTerminalConfig {
  cluster: MiniMapHexClusterId;
  q: number;
  r: number;
  cornerIndex: number;
  tone: MiniMapHexLayer;
  intensity: number;
  segments: Point[];
  nodeRadius: number;
}

const minimapHexConfig = {
  hexSize: 5.2,
  precision: 2,
} as const;

export const minimapHexClusters = [
  {
    id: "top-edge",
    origin: { x: 39, y: 5 },
    cells: [
      { q: 0, r: 0, layer: "peripheral", intensity: 0.28 },
      { q: 1, r: -1, layer: "secondary", intensity: 0.42 },
      { q: 1, r: 0, layer: "primary", intensity: 0.58 },
      { q: 2, r: -1, layer: "secondary", intensity: 0.38 },
      { q: 3, r: -1, layer: "peripheral", intensity: 0.24 },
    ],
  },
  {
    id: "right-edge",
    origin: { x: 87, y: 26 },
    cells: [
      { q: 0, r: 0, layer: "secondary", intensity: 0.46 },
      { q: 0, r: 1, layer: "primary", intensity: 0.66 },
      { q: 1, r: 0, layer: "secondary", intensity: 0.52 },
      { q: 1, r: 1, layer: "secondary", intensity: 0.42 },
      { q: 1, r: -1, layer: "peripheral", intensity: 0.3 },
      { q: 2, r: 0, layer: "peripheral", intensity: 0.28 },
      { q: 2, r: 1, layer: "peripheral", intensity: 0.24 },
    ],
  },
  {
    id: "left-edge",
    origin: { x: 1, y: 31 },
    cells: [
      { q: 0, r: 0, layer: "secondary", intensity: 0.42 },
      { q: 0, r: 1, layer: "secondary", intensity: 0.36 },
      { q: 1, r: -1, layer: "primary", intensity: 0.58 },
      { q: 1, r: 0, layer: "secondary", intensity: 0.5 },
      { q: 1, r: 1, layer: "peripheral", intensity: 0.3 },
      { q: 2, r: -1, layer: "peripheral", intensity: 0.26 },
    ],
  },
  {
    id: "bottom-left-edge",
    origin: { x: 10, y: 59 },
    cells: [
      { q: 0, r: 0, layer: "secondary", intensity: 0.46 },
      { q: 1, r: -1, layer: "primary", intensity: 0.68 },
      { q: 1, r: 0, layer: "secondary", intensity: 0.58 },
      { q: 2, r: -1, layer: "secondary", intensity: 0.42 },
      { q: 2, r: 0, layer: "peripheral", intensity: 0.3 },
      { q: 3, r: -1, layer: "peripheral", intensity: 0.24 },
    ],
  },
] satisfies MiniMapHexCluster[];

const minimapTerminalConfig = [
  {
    cluster: "top-edge",
    q: 3,
    r: -1,
    cornerIndex: 0,
    tone: "peripheral",
    intensity: 0.34,
    segments: [
      { x: 4.6, y: -2.7 },
      { x: 3.2, y: 0 },
    ],
    nodeRadius: 0.46,
  },
] satisfies MiniMapTerminalConfig[];

const MiniMapHex = defineHex({
  dimensions: minimapHexConfig.hexSize,
  orientation: Orientation.FLAT,
  origin: { x: 0, y: 0 },
});

export function getMiniMapHexCells() {
  return minimapHexClusters.flatMap((cluster) => {
    const coordinateLayers = new Map(cluster.cells.map((coordinate) => [coordinateKey(coordinate), coordinate]));

    return new Grid(MiniMapHex, fromCoordinates(...cluster.cells))
      .toArray()
      .map((hex) => toMiniMapHexCell(cluster, hex, coordinateLayers.get(coordinateKey(hex))));
  });
}

export function getMiniMapHexTerminals() {
  const cellsByKey = new Map(getMiniMapHexCells().map((cell) => [cell.key, cell]));

  return minimapTerminalConfig.flatMap<MiniMapHexTerminal>((terminal) => {
    const cell = cellsByKey.get(`${terminal.cluster}-${terminal.q}-${terminal.r}`);
    if (!cell) return [];

    const start = cell.corners[terminal.cornerIndex % cell.corners.length];
    const points = terminal.segments.reduce<Point[]>(
      (terminalPoints, segment) => {
        const previous = terminalPoints[terminalPoints.length - 1];
        return [...terminalPoints, addPoints(previous, segment)];
      },
      [start],
    );

    return [
      {
        cluster: terminal.cluster,
        key: `${terminal.cluster}-terminal-${terminal.q}-${terminal.r}-${terminal.cornerIndex}`,
        tone: terminal.tone,
        intensity: terminal.intensity,
        points,
        terminalNode: points[points.length - 1],
        nodeRadius: terminal.nodeRadius,
      },
    ];
  });
}

function toMiniMapHexCell(
  cluster: MiniMapHexCluster,
  hex: Hex,
  coordinate: MiniMapHexCoordinate | undefined,
): MiniMapHexCell {
  const corners = hex.corners.map((corner) => toPanelPoint(cluster.origin, corner));

  return {
    q: hex.q,
    r: hex.r,
    layer: coordinate?.layer ?? "secondary",
    intensity: coordinate?.intensity ?? getFallbackIntensity(coordinate?.layer ?? "secondary"),
    cluster: cluster.id,
    key: `${cluster.id}-${hex.q}-${hex.r}`,
    center: toPanelPoint(cluster.origin, { x: hex.x, y: hex.y }),
    corners,
    points: corners.map((corner) => `${corner.x},${corner.y}`).join(" "),
  };
}

function toPanelPoint(origin: Point, point: Point): Point {
  return {
    x: round(origin.x + point.x),
    y: round(origin.y + point.y),
  };
}

function addPoints(point: Point, vector: Point): Point {
  return {
    x: round(point.x + vector.x),
    y: round(point.y + vector.y),
  };
}

function getFallbackIntensity(layer: MiniMapHexLayer) {
  if (layer === "primary") return 0.72;
  if (layer === "secondary") return 0.52;
  return 0.32;
}

function coordinateKey(coordinate: Pick<MiniMapHexCoordinate, "q" | "r">) {
  return `${coordinate.q},${coordinate.r}`;
}

function round(value: number) {
  const scale = 10 ** minimapHexConfig.precision;

  return Math.round(value * scale) / scale;
}
