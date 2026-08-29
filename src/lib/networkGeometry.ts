export interface NetworkPoint {
  x: number;
  y: number;
}

export type HexCorner = "upperRight" | "lowerRight" | "bottom" | "lowerLeft" | "upperLeft" | "top";

const HEX_CORNER_INDEX: Record<HexCorner, number> = {
  upperRight: 0,
  lowerRight: 1,
  bottom: 2,
  lowerLeft: 3,
  upperLeft: 4,
  top: 5,
};

const EPSILON = 0.000001;

export function hexPoints(cx: number, cy: number, r: number): string {
  return getHexVertices(cx, cy, r)
    .map((point) => `${point.x},${point.y}`)
    .join(" ");
}

export function getHexBoundaryPoint(center: NetworkPoint, target: NetworkPoint, radius: number): NetworkPoint {
  const vertices = getHexVertices(center.x, center.y, radius);
  const rayEnd = {
    x: center.x + (target.x - center.x) * 100,
    y: center.y + (target.y - center.y) * 100,
  };

  let closestPoint: NetworkPoint | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  vertices.forEach((vertex, index) => {
    const next = vertices[(index + 1) % vertices.length];
    const point = getSegmentIntersection(center, rayEnd, vertex, next);

    if (!point) return;

    const distance = Math.hypot(point.x - center.x, point.y - center.y);
    if (distance < closestDistance) {
      closestPoint = point;
      closestDistance = distance;
    }
  });

  if (closestPoint) return closestPoint;

  const dx = target.x - center.x;
  const dy = target.y - center.y;
  const length = Math.hypot(dx, dy) || 1;

  return {
    x: center.x + (dx / length) * radius,
    y: center.y + (dy / length) * radius,
  };
}

export function getHexCornerPoint(center: NetworkPoint, radius: number, corner: HexCorner): NetworkPoint {
  return getHexVertices(center.x, center.y, radius)[HEX_CORNER_INDEX[corner]];
}

function getHexVertices(cx: number, cy: number, r: number): NetworkPoint[] {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });
}

function getSegmentIntersection(
  a: NetworkPoint,
  b: NetworkPoint,
  c: NetworkPoint,
  d: NetworkPoint,
): NetworkPoint | null {
  const r = { x: b.x - a.x, y: b.y - a.y };
  const s = { x: d.x - c.x, y: d.y - c.y };
  const denominator = cross(r, s);

  if (Math.abs(denominator) < EPSILON) return null;

  const cMinusA = { x: c.x - a.x, y: c.y - a.y };
  const t = cross(cMinusA, s) / denominator;
  const u = cross(cMinusA, r) / denominator;

  if (t < -EPSILON || t > 1 + EPSILON || u < -EPSILON || u > 1 + EPSILON) {
    return null;
  }

  return {
    x: a.x + t * r.x,
    y: a.y + t * r.y,
  };
}

function cross(a: NetworkPoint, b: NetworkPoint): number {
  return a.x * b.y - a.y * b.x;
}
