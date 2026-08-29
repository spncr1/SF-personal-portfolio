"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { SVG, type G, type Svg } from "@svgdotjs/svg.js";
import {
  getStartupHudGlowPoints,
  getStartupHudHexCells,
  getStartupHudInterfaceLinks,
  getStartupHudTerminalBranches,
  startupHudHexComposition,
} from "@/lib/startupHudGeometry";

type RingConfig = {
  radius: number;
  layer: "outer" | "segmented" | "inner";
  className: string;
  strokeWidth: number;
  opacity: number;
};

type ArcConfig = RingConfig & {
  start: number;
  end: number;
};

type TickConfig = {
  angle: number;
  innerRadius: number;
  outerRadius: number;
  className: string;
  strokeWidth: number;
  opacity: number;
};

type SpokeConfig = {
  angle: number;
  innerRadius: number;
  outerRadius: number;
  className: string;
  strokeWidth: number;
  opacity: number;
};

type GlowConfig = {
  angle: number;
  radius: number;
  size: number;
  opacity: number;
};

const centralHudConfig = {
  guideRadius: 72,
  haloRadius: 59,
  rings: [
    { radius: 69, layer: "outer", className: "startup-hud__ring startup-hud__ring--outer startup-hud__ring--faint", strokeWidth: 0.8, opacity: 0.34 },
    { radius: 60, layer: "outer", className: "startup-hud__ring startup-hud__ring--outer startup-hud__ring--medium", strokeWidth: 1.1, opacity: 0.44 },
    { radius: 47, layer: "inner", className: "startup-hud__ring startup-hud__ring--inner startup-hud__ring--faint", strokeWidth: 0.75, opacity: 0.26 },
    { radius: 35, layer: "inner", className: "startup-hud__ring startup-hud__ring--inner startup-hud__ring--medium", strokeWidth: 0.9, opacity: 0.32 },
    { radius: 24, layer: "inner", className: "startup-hud__ring startup-hud__ring--inner startup-hud__ring--faint", strokeWidth: 0.65, opacity: 0.2 },
  ] satisfies RingConfig[],
  arcs: [
    { radius: 66, layer: "segmented", start: 312, end: 36, className: "startup-hud__arc startup-hud__arc--bright", strokeWidth: 1.8, opacity: 0.78 },
    { radius: 66, layer: "segmented", start: 132, end: 222, className: "startup-hud__arc startup-hud__arc--bright", strokeWidth: 1.8, opacity: 0.64 },
    { radius: 57, layer: "segmented", start: 14, end: 82, className: "startup-hud__arc startup-hud__arc--hot", strokeWidth: 2.2, opacity: 0.7 },
    { radius: 57, layer: "segmented", start: 188, end: 266, className: "startup-hud__arc startup-hud__arc--hot", strokeWidth: 2.2, opacity: 0.52 },
    { radius: 51, layer: "segmented", start: 278, end: 332, className: "startup-hud__arc startup-hud__arc--medium", strokeWidth: 1, opacity: 0.48 },
    { radius: 51, layer: "segmented", start: 42, end: 108, className: "startup-hud__arc startup-hud__arc--medium", strokeWidth: 1, opacity: 0.38 },
    { radius: 42, layer: "segmented", start: 112, end: 174, className: "startup-hud__arc startup-hud__arc--faint", strokeWidth: 0.85, opacity: 0.3 },
    { radius: 42, layer: "segmented", start: 224, end: 282, className: "startup-hud__arc startup-hud__arc--faint", strokeWidth: 0.85, opacity: 0.28 },
  ] satisfies ArcConfig[],
  ticks: [4, 22, 48, 73, 96, 126, 151, 184, 207, 236, 261, 288, 318, 342].map<TickConfig>((angle, index) => ({
    angle,
    innerRadius: index % 3 === 0 ? 52 : 55,
    outerRadius: index % 4 === 0 ? 64 : 61,
    className: index % 4 === 0 ? "startup-hud__tick startup-hud__tick--primary" : "startup-hud__tick startup-hud__tick--secondary",
    strokeWidth: index % 4 === 0 ? 1.2 : 0.75,
    opacity: index % 4 === 0 ? 0.58 : 0.32,
  })),
  spokes: [
    { angle: 0, innerRadius: 27, outerRadius: 55, className: "startup-hud__spoke startup-hud__spoke--right", strokeWidth: 0.9, opacity: 0.34 },
    { angle: 90, innerRadius: 29, outerRadius: 47, className: "startup-hud__spoke", strokeWidth: 0.65, opacity: 0.18 },
    { angle: 180, innerRadius: 27, outerRadius: 55, className: "startup-hud__spoke startup-hud__spoke--left", strokeWidth: 0.9, opacity: 0.28 },
    { angle: 270, innerRadius: 29, outerRadius: 47, className: "startup-hud__spoke", strokeWidth: 0.65, opacity: 0.2 },
    { angle: 34, innerRadius: 38, outerRadius: 62, className: "startup-hud__spoke startup-hud__spoke--short", strokeWidth: 0.65, opacity: 0.22 },
    { angle: 214, innerRadius: 38, outerRadius: 62, className: "startup-hud__spoke startup-hud__spoke--short", strokeWidth: 0.65, opacity: 0.2 },
  ] satisfies SpokeConfig[],
  glows: [
    { angle: 0, radius: 67, size: 5.5, opacity: 0.72 },
    { angle: 180, radius: 67, size: 4.5, opacity: 0.52 },
    { angle: 54, radius: 58, size: 2.3, opacity: 0.4 },
    { angle: 236, radius: 58, size: 2.2, opacity: 0.34 },
  ] satisfies GlowConfig[],
};

function pointOnCircle(radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;

  return {
    x: Number((Math.cos(radians) * radius).toFixed(2)),
    y: Number((Math.sin(radians) * radius).toFixed(2)),
  };
}

function describeArc(radius: number, startAngle: number, endAngle: number) {
  const start = pointOnCircle(radius, endAngle);
  const end = pointOnCircle(radius, startAngle);
  const sweep = (endAngle - startAngle + 360) % 360;
  const largeArcFlag = sweep > 180 ? 1 : 0;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function getLayer(draw: Svg, selector: string) {
  const layer = draw.findOne(selector);

  return layer ? (layer as G) : null;
}

function renderCentralHud(draw: Svg) {
  const outer = getLayer(draw, ".startup-hud__outer-rings");
  const segmented = getLayer(draw, ".startup-hud__segmented-rings");
  const inner = getLayer(draw, ".startup-hud__inner-rings");
  const ticks = getLayer(draw, ".startup-hud__radial-ticks");
  const glow = getLayer(draw, ".startup-hud__glow-elements");

  if (!outer || !segmented || !inner || !ticks || !glow) return;

  const layers = { outer, segmented, inner, ticks, glow };

  Object.values(layers).forEach((layer) => layer.clear());

  layers.glow
    .circle(centralHudConfig.haloRadius * 2)
    .center(0, 0)
    .addClass("startup-hud__halo");

  layers.outer
    .circle(centralHudConfig.guideRadius * 2)
    .center(0, 0)
    .addClass("startup-hud__guide-ring")
    .attr({ "stroke-width": 0.55, opacity: 0.18 });

  centralHudConfig.rings.forEach((ring) => {
    const layer = layers[ring.layer];
    layer
      .circle(ring.radius * 2)
      .center(0, 0)
      .addClass(ring.className)
      .attr({ "stroke-width": ring.strokeWidth, opacity: ring.opacity });
  });

  centralHudConfig.arcs.forEach((arc) => {
    const layer = layers[arc.layer];
    layer
      .path(describeArc(arc.radius, arc.start, arc.end))
      .addClass(arc.className)
      .attr({ "stroke-width": arc.strokeWidth, opacity: arc.opacity });
  });

  centralHudConfig.spokes.forEach((spoke) => {
    const start = pointOnCircle(spoke.innerRadius, spoke.angle);
    const end = pointOnCircle(spoke.outerRadius, spoke.angle);
    layers.inner
      .line(start.x, start.y, end.x, end.y)
      .addClass(spoke.className)
      .attr({ "stroke-width": spoke.strokeWidth, opacity: spoke.opacity });
  });

  centralHudConfig.ticks.forEach((tick) => {
    const start = pointOnCircle(tick.innerRadius, tick.angle);
    const end = pointOnCircle(tick.outerRadius, tick.angle);
    layers.ticks
      .line(start.x, start.y, end.x, end.y)
      .addClass(tick.className)
      .attr({ "stroke-width": tick.strokeWidth, opacity: tick.opacity });
  });

  centralHudConfig.glows.forEach((glow) => {
    const point = pointOnCircle(glow.radius, glow.angle);
    layers.glow
      .circle(glow.size)
      .center(point.x, point.y)
      .addClass("startup-hud__node-glow")
      .attr({ opacity: glow.opacity });
  });

  getStartupHudGlowPoints().forEach((glow) => {
    layers.glow
      .circle(glow.radius * 2)
      .center(glow.center.x, glow.center.y)
      .addClass(`startup-hud__topology-glow startup-hud__topology-glow--${glow.tone}`)
      .attr({
        "data-side": glow.side,
        "data-glow": glow.key,
        style: `--startup-hud-strength: ${glow.intensity}`,
      });
  });
}

function renderHexCompositions(draw: Svg) {
  const peripheral = getLayer(draw, ".startup-hud__peripheral-hexes");
  const secondary = getLayer(draw, ".startup-hud__secondary-hexes");
  const primary = getLayer(draw, ".startup-hud__primary-hexes");

  if (!peripheral || !secondary || !primary) return;

  peripheral.clear();
  secondary.clear();
  primary.clear();

  const layers = { primary, secondary, peripheral };
  const cells = [
    ...getStartupHudHexCells("left", startupHudHexComposition.left),
    ...getStartupHudHexCells("right", startupHudHexComposition.right),
  ];

  cells.forEach((cell) => {
    layers[cell.layer]
      .polygon(cell.points)
      .addClass(`startup-hud__hex-cell startup-hud__hex-cell--${cell.layer}`)
      .attr({
        "data-side": cell.side,
        "data-q": cell.q,
        "data-r": cell.r,
        style: `--startup-hud-strength: ${cell.intensity}`,
      });
  });
}

function renderHudBranches(draw: Svg) {
  const branches = getLayer(draw, ".startup-hud__branches");
  const nodes = getLayer(draw, ".startup-hud__junction-nodes");

  if (!branches || !nodes) return;

  branches.clear();
  nodes.clear();

  getStartupHudInterfaceLinks().forEach((link) => {
    branches
      .line(link.start.x, link.start.y, link.end.x, link.end.y)
      .addClass(`startup-hud__interface-link startup-hud__interface-link--${link.tone}`)
      .attr({
        "data-side": link.side,
        "data-link": link.key,
        style: `--startup-hud-strength: ${link.intensity}`,
      });
  });

  getStartupHudTerminalBranches().forEach((branch) => {
    branches
      .polyline(branch.points.map((point) => `${point.x},${point.y}`).join(" "))
      .addClass(`startup-hud__terminal-branch startup-hud__terminal-branch--${branch.tone}`)
      .attr({
        "data-side": branch.side,
        "data-branch": branch.key,
        style: `--startup-hud-strength: ${branch.intensity}`,
      });

    nodes
      .circle(branch.nodeRadius * 2)
      .center(branch.terminalNode.x, branch.terminalNode.y)
      .addClass(`startup-hud__terminal-node startup-hud__terminal-node--${branch.tone}`)
      .attr({
        "data-side": branch.side,
        "data-branch": branch.key,
        style: `--startup-hud-strength: ${branch.intensity}`,
      });
  });
}

function renderStartupHud(svg: SVGSVGElement) {
  const draw = SVG(svg) as Svg;

  renderHexCompositions(draw);
  renderHudBranches(draw);
  renderCentralHud(draw);
}

export function StartupHudGraphic() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    renderStartupHud(svg);
  }, []);

  return (
    <div className="boot-sequence__mark" aria-hidden="true">
      <svg
        ref={svgRef}
        className="boot-sequence__hud-svg"
        viewBox="-260 -120 520 240"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        <defs>
          <linearGradient id="startup-hud-edge-fade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="7%" stopColor="white" stopOpacity="1" />
            <stop offset="93%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="startup-hud-edge-mask" maskUnits="userSpaceOnUse" x="-260" y="-120" width="520" height="240">
            <rect x="-260" y="-120" width="520" height="240" fill="url(#startup-hud-edge-fade)" />
          </mask>
        </defs>
        <g className="startup-hud" mask="url(#startup-hud-edge-mask)">
          <g className="startup-hud__peripheral-hexes" />
          <g className="startup-hud__secondary-hexes" />
          <g className="startup-hud__primary-hexes" />
          <g className="startup-hud__branches" />
          <g className="startup-hud__junction-nodes" />
          <g className="startup-hud__central-hud">
            <g className="startup-hud__outer-rings" />
            <g className="startup-hud__segmented-rings" />
            <g className="startup-hud__inner-rings" />
            <g className="startup-hud__radial-ticks" />
          </g>
          <g className="startup-hud__glow-elements" />
        </g>
      </svg>
      <span className="boot-sequence__ring" />
      <span className="boot-sequence__vault">
        <span className="boot-sequence__vault-ring boot-sequence__vault-ring--outer" />
        <span className="boot-sequence__vault-ring boot-sequence__vault-ring--inner" />
        <span className="boot-sequence__vault-door boot-sequence__vault-door--left" />
        <span className="boot-sequence__vault-door boot-sequence__vault-door--right" />
        <span className="boot-sequence__vault-lock">
          <span className="boot-sequence__vault-bar" />
          <span className="boot-sequence__vault-bar" />
          <span className="boot-sequence__vault-bar" />
        </span>
      </span>
      <span className="boot-sequence__monogram">
        <Image
          src="/brand/spencer-fisher-logo.png"
          alt=""
          width={160}
          height={160}
          style={{ width: "100%", height: "100%" }}
          priority
        />
      </span>
    </div>
  );
}
