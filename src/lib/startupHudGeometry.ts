import { Grid, Orientation, defineHex, fromCoordinates, type Hex, type Point } from "honeycomb-grid";

export type StartupHudHexSide = "left" | "right";
export type StartupHudHexLayer = "primary" | "secondary" | "peripheral";
export type StartupHudInterfaceTone = "primary" | "secondary";
export type StartupHudBranchTone = "secondary" | "peripheral";
export type StartupHudBranchDirection = "outward" | "upper" | "lower";
export type StartupHudBranchAnchor = "outer" | "upperOuter" | "lowerOuter";
export type StartupHudGlowTone = "interface" | "terminal";

export interface StartupHudHexCoordinate {
  q: number;
  r: number;
  layer: StartupHudHexLayer;
}

export interface StartupHudHexCell extends StartupHudHexCoordinate {
  side: StartupHudHexSide;
  key: string;
  intensity: number;
  center: Point;
  corners: Point[];
  points: string;
}

export interface StartupHudInterfaceLink {
  side: StartupHudHexSide;
  key: string;
  tone: StartupHudInterfaceTone;
  intensity: number;
  start: Point;
  end: Point;
}

export interface StartupHudTerminalBranch {
  side: StartupHudHexSide;
  key: string;
  tone: StartupHudBranchTone;
  intensity: number;
  points: Point[];
  terminalNode: Point;
  nodeRadius: number;
}

export interface StartupHudGlowPoint {
  side: StartupHudHexSide;
  key: string;
  tone: StartupHudGlowTone;
  intensity: number;
  radius: number;
  center: Point;
}

export const startupHudHexConfig = {
  hexSize: 17,
  centralInterfaceRadius: 72,
  sideOrigins: {
    left: { x: -86, y: 0 },
    right: { x: 86, y: 0 },
  },
  precision: 2,
} as const;

export const startupHudHexComposition = {
  left: [
    { q: 0, r: 0, layer: "primary" },
    { q: 1, r: -1, layer: "primary" },
    { q: 2, r: -1, layer: "primary" },
    { q: 3, r: -2, layer: "secondary" },
    { q: 4, r: -2, layer: "secondary" },
    { q: 5, r: -3, layer: "peripheral" },
    { q: 6, r: -3, layer: "peripheral" },
    { q: 1, r: 0, layer: "secondary" },
    { q: 2, r: 0, layer: "secondary" },
    { q: 3, r: 0, layer: "secondary" },
    { q: 4, r: -1, layer: "peripheral" },
    { q: 5, r: -1, layer: "peripheral" },
    { q: 2, r: -2, layer: "secondary" },
    { q: 3, r: -3, layer: "peripheral" },
  ],
  right: [
    { q: 0, r: 0, layer: "primary" },
    { q: 1, r: 0, layer: "primary" },
    { q: 1, r: -1, layer: "primary" },
    { q: 2, r: -1, layer: "secondary" },
    { q: 3, r: -1, layer: "secondary" },
    { q: 4, r: -2, layer: "peripheral" },
    { q: 2, r: 0, layer: "secondary" },
    { q: 3, r: 0, layer: "secondary" },
    { q: 4, r: 0, layer: "peripheral" },
    { q: 5, r: -1, layer: "peripheral" },
    { q: 6, r: -2, layer: "peripheral" },
    { q: 2, r: -2, layer: "secondary" },
    { q: 3, r: -3, layer: "peripheral" },
    { q: 4, r: -3, layer: "peripheral" },
    { q: 5, r: 0, layer: "peripheral" },
  ],
} satisfies Record<StartupHudHexSide, StartupHudHexCoordinate[]>;

const startupHudTerminalBranchConfig = [
  {
    side: "left",
    q: 2,
    r: -1,
    anchor: "upperOuter",
    tone: "secondary",
    intensity: 0.64,
    segments: [
      { direction: "upper", length: 19 },
      { direction: "outward", length: 10 },
    ],
    nodeRadius: 1.65,
  },
  {
    side: "left",
    q: 3,
    r: 0,
    anchor: "lowerOuter",
    tone: "peripheral",
    intensity: 0.42,
    segments: [
      { direction: "lower", length: 15 },
      { direction: "outward", length: 7 },
    ],
    nodeRadius: 1.35,
  },
  {
    side: "left",
    q: 4,
    r: -2,
    anchor: "outer",
    tone: "peripheral",
    intensity: 0.32,
    segments: [{ direction: "outward", length: 15 }],
    nodeRadius: 1.3,
  },
  {
    side: "right",
    q: 2,
    r: -1,
    anchor: "upperOuter",
    tone: "secondary",
    intensity: 0.64,
    segments: [
      { direction: "upper", length: 17 },
      { direction: "outward", length: 6 },
    ],
    nodeRadius: 1.65,
  },
  {
    side: "right",
    q: 3,
    r: 0,
    anchor: "lowerOuter",
    tone: "peripheral",
    intensity: 0.42,
    segments: [{ direction: "lower", length: 16 }],
    nodeRadius: 1.35,
  },
  {
    side: "right",
    q: 4,
    r: -2,
    anchor: "outer",
    tone: "peripheral",
    intensity: 0.32,
    segments: [
      { direction: "outward", length: 12 },
      { direction: "upper", length: 10 },
    ],
    nodeRadius: 1.3,
  },
] satisfies Array<{
  side: StartupHudHexSide;
  q: number;
  r: number;
  anchor: StartupHudBranchAnchor;
  tone: StartupHudBranchTone;
  intensity: number;
  segments: Array<{ direction: StartupHudBranchDirection; length: number }>;
  nodeRadius: number;
}>;

const StartupHudHex = defineHex({
  dimensions: startupHudHexConfig.hexSize,
  orientation: Orientation.FLAT,
  origin: { x: 0, y: 0 },
});

export function createStartupHudHexGrid(coordinates: StartupHudHexCoordinate[]) {
  return new Grid(StartupHudHex, fromCoordinates(...coordinates));
}

export function getStartupHudHexCells(side: StartupHudHexSide, coordinates: StartupHudHexCoordinate[]) {
  const coordinateLayers = new Map(coordinates.map((coordinate) => [coordinateKey(coordinate), coordinate.layer]));

  return createStartupHudHexGrid(coordinates)
    .toArray()
    .map((hex) => toStartupHudHexCell(side, hex, coordinateLayers.get(coordinateKey(hex)) ?? "secondary"));
}

export function getStartupHudInterfaceLinks() {
  const sides: StartupHudHexSide[] = ["left", "right"];

  return sides.flatMap((side) => {
    const cells = getStartupHudHexCells(side, startupHudHexComposition[side]);
    const anchor = cells.find((cell) => cell.q === 0 && cell.r === 0);

    if (!anchor) return [];

    const innerVertex = getCentralFacingCorner(side, anchor.corners);
    const upperShoulder = getCentralFacingShoulder(side, anchor.corners, "upper");
    const lowerShoulder = getCentralFacingShoulder(side, anchor.corners, "lower");

    return [
      createInterfaceLink(side, "core", "primary", 0, innerVertex, 7),
      createInterfaceLink(side, "upper", "secondary", upperShoulder.y, upperShoulder, 4, 0.76),
      createInterfaceLink(side, "lower", "secondary", lowerShoulder.y, lowerShoulder, 4, 0.76),
    ];
  });
}

export function getStartupHudTerminalBranches() {
  const cellsByKey = new Map(
    (["left", "right"] as const)
      .flatMap((side) => getStartupHudHexCells(side, startupHudHexComposition[side]))
      .map((cell) => [cell.key, cell]),
  );

  return startupHudTerminalBranchConfig.flatMap<StartupHudTerminalBranch>((branch) => {
    const cell = cellsByKey.get(`${branch.side}-${branch.q}-${branch.r}`);

    if (!cell) return [];

    const start = getBranchAnchorPoint(branch.side, cell.corners, branch.anchor);
    const points = branch.segments.reduce<Point[]>(
      (branchPoints, segment) => {
        const previous = branchPoints[branchPoints.length - 1];
        const next = addPoints(previous, getBranchVector(branch.side, segment.direction, segment.length));

        return [...branchPoints, next];
      },
      [start],
    );

    return [
      {
        side: branch.side,
        key: `${branch.side}-branch-${branch.q}-${branch.r}-${branch.anchor}`,
        tone: branch.tone,
        intensity: branch.intensity,
        points,
        terminalNode: points[points.length - 1],
        nodeRadius: branch.nodeRadius,
      },
    ];
  });
}

export function getStartupHudGlowPoints() {
  const interfaceGlows = getStartupHudInterfaceLinks()
    .filter((link) => link.tone === "primary")
    .flatMap<StartupHudGlowPoint>((link) => [
      {
        side: link.side,
        key: `${link.key}-ring-glow`,
        tone: "interface",
        intensity: 0.78,
        radius: 3.2,
        center: link.start,
      },
      {
        side: link.side,
        key: `${link.key}-hex-glow`,
        tone: "interface",
        intensity: 0.62,
        radius: 2.35,
        center: link.end,
      },
    ]);

  const terminalGlows = getStartupHudTerminalBranches()
    .filter((branch) => branch.tone === "secondary")
    .map<StartupHudGlowPoint>((branch) => ({
      side: branch.side,
      key: `${branch.key}-terminal-glow`,
      tone: "terminal",
      intensity: 0.48,
      radius: branch.nodeRadius * 1.8,
      center: branch.terminalNode,
    }));

  return [...interfaceGlows, ...terminalGlows];
}

function toStartupHudHexCell(side: StartupHudHexSide, hex: Hex, layer: StartupHudHexLayer): StartupHudHexCell {
  const center = toHudPoint(side, { x: hex.x, y: hex.y });
  const corners = hex.corners.map((corner) => toHudPoint(side, corner));

  return {
    q: hex.q,
    r: hex.r,
    layer,
    side,
    key: `${side}-${hex.q}-${hex.r}`,
    intensity: getCellIntensity(layer, hex.q),
    center,
    corners,
    points: corners.map((corner) => `${corner.x},${corner.y}`).join(" "),
  };
}

function coordinateKey(coordinate: Pick<StartupHudHexCoordinate, "q" | "r">) {
  return `${coordinate.q},${coordinate.r}`;
}

function toHudPoint(side: StartupHudHexSide, point: Point): Point {
  const origin = startupHudHexConfig.sideOrigins[side];
  const sideDirection = side === "left" ? -1 : 1;

  return {
    x: round(origin.x + point.x * sideDirection),
    y: round(origin.y + point.y),
  };
}

function round(value: number) {
  const scale = 10 ** startupHudHexConfig.precision;

  return Math.round(value * scale) / scale;
}

function createInterfaceLink(
  side: StartupHudHexSide,
  id: string,
  tone: StartupHudInterfaceTone,
  y: number,
  end: Point,
  ringInset: number,
  intensity = tone === "primary" ? 1 : 0.72,
): StartupHudInterfaceLink {
  return {
    side,
    key: `${side}-interface-${id}`,
    tone,
    intensity,
    start: pointOnCentralInterface(side, y, ringInset),
    end,
  };
}

function pointOnCentralInterface(side: StartupHudHexSide, y: number, inset: number): Point {
  const direction = side === "left" ? -1 : 1;
  const radius = startupHudHexConfig.centralInterfaceRadius;
  const radiusAtY = Math.sqrt(Math.max(radius ** 2 - y ** 2, 0));

  return {
    x: round(direction * (radiusAtY - inset)),
    y: round(y),
  };
}

function getCentralFacingCorner(side: StartupHudHexSide, corners: Point[]) {
  return corners.reduce((selected, corner) => (isCloserToCenter(side, corner, selected) ? corner : selected));
}

function getCentralFacingShoulder(side: StartupHudHexSide, corners: Point[], verticalSide: "upper" | "lower") {
  const candidates = corners.filter((corner) => (verticalSide === "upper" ? corner.y < 0 : corner.y > 0));

  return candidates.reduce((selected, corner) => (isCloserToCenter(side, corner, selected) ? corner : selected));
}

function isCloserToCenter(side: StartupHudHexSide, point: Point, selected: Point) {
  return side === "left" ? point.x > selected.x : point.x < selected.x;
}

function getBranchAnchorPoint(side: StartupHudHexSide, corners: Point[], anchor: StartupHudBranchAnchor) {
  if (anchor === "upperOuter") {
    return getOuterFacingShoulder(side, corners, "upper");
  }

  if (anchor === "lowerOuter") {
    return getOuterFacingShoulder(side, corners, "lower");
  }

  return getOuterFacingCorner(side, corners);
}

function getOuterFacingCorner(side: StartupHudHexSide, corners: Point[]) {
  return corners.reduce((selected, corner) => (isFartherFromCenter(side, corner, selected) ? corner : selected));
}

function getOuterFacingShoulder(side: StartupHudHexSide, corners: Point[], verticalSide: "upper" | "lower") {
  const candidates = corners.filter((corner) => (verticalSide === "upper" ? corner.y < 0 : corner.y > 0));

  return candidates.reduce((selected, corner) => (isFartherFromCenter(side, corner, selected) ? corner : selected));
}

function isFartherFromCenter(side: StartupHudHexSide, point: Point, selected: Point) {
  return side === "left" ? point.x < selected.x : point.x > selected.x;
}

function getBranchVector(side: StartupHudHexSide, direction: StartupHudBranchDirection, length: number): Point {
  const outward = side === "left" ? -1 : 1;
  const diagonalX = round((length / 2) * outward);
  const diagonalY = round((Math.sqrt(3) / 2) * length);

  if (direction === "upper") {
    return { x: diagonalX, y: -diagonalY };
  }

  if (direction === "lower") {
    return { x: diagonalX, y: diagonalY };
  }

  return { x: round(length * outward), y: 0 };
}

function addPoints(point: Point, vector: Point): Point {
  return {
    x: round(point.x + vector.x),
    y: round(point.y + vector.y),
  };
}

function getCellIntensity(layer: StartupHudHexLayer, q: number) {
  const baseByLayer = {
    primary: 0.92,
    secondary: 0.62,
    peripheral: 0.34,
  } satisfies Record<StartupHudHexLayer, number>;

  const falloff = Math.max(0.38, 1 - Math.max(q - 1, 0) * 0.11);

  return round(baseByLayer[layer] * falloff);
}
