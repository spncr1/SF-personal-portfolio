"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { hexPoints } from "@/lib/networkGeometry";
import { HudModal } from "@/components/ui/HudModal";

const sydneyLngLat: [number, number] = [151.2093, -33.8688];

type GlobeHexLayer = "primary" | "secondary" | "peripheral" | "edge" | "ghost";

interface GlobeHexCoordinate {
  q: number;
  r: number;
  layer: GlobeHexLayer;
  strength: number;
}

interface GlobeHexComposition {
  origin: { x: number; y: number };
  radius: number;
  cells: GlobeHexCoordinate[];
}

const globeHexComposition = {
  left: {
    origin: { x: -5.1, y: 3.1 },
    radius: 1.52,
    cells: [
      { q: 0, r: 0, layer: "edge", strength: 0.34 },
      { q: 1, r: 0, layer: "peripheral", strength: 0.38 },
      { q: 2, r: 0, layer: "secondary", strength: 0.5 },
      { q: 3, r: 0, layer: "secondary", strength: 0.48 },
      { q: 4, r: 0, layer: "peripheral", strength: 0.36 },
      { q: 5, r: 0, layer: "ghost", strength: 0.24 },
      { q: 0, r: 1, layer: "edge", strength: 0.3 },
      { q: 1, r: 1, layer: "peripheral", strength: 0.42 },
      { q: 2, r: 1, layer: "secondary", strength: 0.56 },
      { q: 3, r: 1, layer: "primary", strength: 0.78 },
      { q: 4, r: 1, layer: "secondary", strength: 0.54 },
      { q: 5, r: 1, layer: "peripheral", strength: 0.38 },
      { q: 6, r: 1, layer: "ghost", strength: 0.24 },
      { q: -1, r: 2, layer: "ghost", strength: 0.26 },
      { q: 0, r: 2, layer: "edge", strength: 0.32 },
      { q: 1, r: 2, layer: "peripheral", strength: 0.4 },
      { q: 2, r: 2, layer: "secondary", strength: 0.55 },
      { q: 3, r: 2, layer: "secondary", strength: 0.5 },
      { q: 4, r: 2, layer: "peripheral", strength: 0.36 },
      { q: 5, r: 2, layer: "ghost", strength: 0.28 },
      { q: 6, r: 2, layer: "ghost", strength: 0.22 },
      { q: -1, r: 3, layer: "edge", strength: 0.28 },
      { q: 0, r: 3, layer: "peripheral", strength: 0.34 },
      { q: 1, r: 3, layer: "secondary", strength: 0.45 },
      { q: 2, r: 3, layer: "peripheral", strength: 0.36 },
      { q: 3, r: 3, layer: "ghost", strength: 0.28 },
      { q: 4, r: 3, layer: "peripheral", strength: 0.3 },
      { q: 5, r: 3, layer: "ghost", strength: 0.22 },
      { q: 0, r: 4, layer: "edge", strength: 0.26 },
      { q: 1, r: 4, layer: "ghost", strength: 0.24 },
      { q: 2, r: 4, layer: "peripheral", strength: 0.32 },
      { q: 3, r: 4, layer: "ghost", strength: 0.24 },
      { q: 4, r: 4, layer: "ghost", strength: 0.22 },
      { q: 0, r: 5, layer: "ghost", strength: 0.2 },
      { q: 1, r: 5, layer: "peripheral", strength: 0.24 },
      { q: 2, r: 5, layer: "ghost", strength: 0.2 },
    ],
  },
  right: {
    origin: { x: 79.4, y: 15.3 },
    radius: 1.5,
    cells: [
      { q: 3, r: 0, layer: "ghost", strength: 0.24 },
      { q: 4, r: 0, layer: "peripheral", strength: 0.34 },
      { q: 5, r: 0, layer: "secondary", strength: 0.48 },
      { q: 6, r: 0, layer: "peripheral", strength: 0.36 },
      { q: 7, r: 0, layer: "edge", strength: 0.3 },
      { q: 1, r: 1, layer: "peripheral", strength: 0.36 },
      { q: 2, r: 1, layer: "secondary", strength: 0.5 },
      { q: 3, r: 1, layer: "primary", strength: 0.74 },
      { q: 4, r: 1, layer: "secondary", strength: 0.54 },
      { q: 5, r: 1, layer: "secondary", strength: 0.5 },
      { q: 6, r: 1, layer: "peripheral", strength: 0.38 },
      { q: 7, r: 1, layer: "edge", strength: 0.28 },
      { q: 8, r: 1, layer: "ghost", strength: 0.22 },
      { q: 0, r: 2, layer: "ghost", strength: 0.26 },
      { q: 1, r: 2, layer: "peripheral", strength: 0.38 },
      { q: 2, r: 2, layer: "secondary", strength: 0.52 },
      { q: 3, r: 2, layer: "secondary", strength: 0.5 },
      { q: 4, r: 2, layer: "peripheral", strength: 0.38 },
      { q: 5, r: 2, layer: "ghost", strength: 0.28 },
      { q: 6, r: 2, layer: "peripheral", strength: 0.34 },
      { q: 7, r: 2, layer: "edge", strength: 0.26 },
      { q: 0, r: 3, layer: "peripheral", strength: 0.34 },
      { q: 1, r: 3, layer: "secondary", strength: 0.44 },
      { q: 2, r: 3, layer: "peripheral", strength: 0.34 },
      { q: 3, r: 3, layer: "secondary", strength: 0.46 },
      { q: 4, r: 3, layer: "peripheral", strength: 0.36 },
      { q: 5, r: 3, layer: "ghost", strength: 0.24 },
      { q: 6, r: 3, layer: "edge", strength: 0.26 },
      { q: 0, r: 4, layer: "ghost", strength: 0.24 },
      { q: 1, r: 4, layer: "ghost", strength: 0.22 },
      { q: 2, r: 4, layer: "peripheral", strength: 0.3 },
      { q: 3, r: 4, layer: "ghost", strength: 0.22 },
      { q: 4, r: 4, layer: "ghost", strength: 0.24 },
      { q: 5, r: 4, layer: "edge", strength: 0.24 },
      { q: 0, r: 5, layer: "ghost", strength: 0.2 },
      { q: 1, r: 5, layer: "peripheral", strength: 0.24 },
      { q: 2, r: 5, layer: "peripheral", strength: 0.26 },
      { q: 3, r: 5, layer: "ghost", strength: 0.22 },
    ],
  },
} satisfies Record<"left" | "right", GlobeHexComposition>;

const globeHexBackplaneComposition = {
  left: {
    origin: { x: -8.1, y: 0.8 },
    radius: 1.16,
    cells: [
      { q: 2, r: 0, layer: "ghost", strength: 0.18 },
      { q: 3, r: 0, layer: "peripheral", strength: 0.26 },
      { q: 4, r: 0, layer: "ghost", strength: 0.2 },
      { q: 5, r: 0, layer: "edge", strength: 0.24 },
      { q: 6, r: 0, layer: "ghost", strength: 0.16 },
      { q: 1, r: 1, layer: "ghost", strength: 0.2 },
      { q: 2, r: 1, layer: "peripheral", strength: 0.28 },
      { q: 3, r: 1, layer: "secondary", strength: 0.34 },
      { q: 4, r: 1, layer: "peripheral", strength: 0.3 },
      { q: 5, r: 1, layer: "ghost", strength: 0.2 },
      { q: 6, r: 1, layer: "edge", strength: 0.22 },
      { q: 7, r: 1, layer: "ghost", strength: 0.16 },
      { q: 0, r: 2, layer: "ghost", strength: 0.18 },
      { q: 1, r: 2, layer: "peripheral", strength: 0.26 },
      { q: 2, r: 2, layer: "secondary", strength: 0.32 },
      { q: 3, r: 2, layer: "secondary", strength: 0.36 },
      { q: 4, r: 2, layer: "peripheral", strength: 0.3 },
      { q: 5, r: 2, layer: "peripheral", strength: 0.26 },
      { q: 6, r: 2, layer: "ghost", strength: 0.2 },
      { q: 1, r: 3, layer: "ghost", strength: 0.2 },
      { q: 2, r: 3, layer: "peripheral", strength: 0.28 },
      { q: 3, r: 3, layer: "secondary", strength: 0.34 },
      { q: 4, r: 3, layer: "peripheral", strength: 0.28 },
      { q: 5, r: 3, layer: "ghost", strength: 0.2 },
      { q: 6, r: 3, layer: "edge", strength: 0.22 },
      { q: 0, r: 4, layer: "ghost", strength: 0.18 },
      { q: 1, r: 4, layer: "peripheral", strength: 0.24 },
      { q: 2, r: 4, layer: "peripheral", strength: 0.28 },
      { q: 3, r: 4, layer: "ghost", strength: 0.2 },
      { q: 4, r: 4, layer: "edge", strength: 0.22 },
      { q: 5, r: 4, layer: "ghost", strength: 0.16 },
      { q: 1, r: 5, layer: "ghost", strength: 0.18 },
      { q: 2, r: 5, layer: "peripheral", strength: 0.24 },
      { q: 3, r: 5, layer: "ghost", strength: 0.18 },
      { q: 4, r: 5, layer: "ghost", strength: 0.16 },
    ],
  },
  right: {
    origin: { x: 76.9, y: 12.7 },
    radius: 1.12,
    cells: [
      { q: 3, r: 0, layer: "ghost", strength: 0.18 },
      { q: 4, r: 0, layer: "peripheral", strength: 0.25 },
      { q: 5, r: 0, layer: "secondary", strength: 0.32 },
      { q: 6, r: 0, layer: "peripheral", strength: 0.26 },
      { q: 7, r: 0, layer: "edge", strength: 0.22 },
      { q: 2, r: 1, layer: "ghost", strength: 0.18 },
      { q: 3, r: 1, layer: "peripheral", strength: 0.28 },
      { q: 4, r: 1, layer: "secondary", strength: 0.34 },
      { q: 5, r: 1, layer: "peripheral", strength: 0.3 },
      { q: 6, r: 1, layer: "ghost", strength: 0.2 },
      { q: 7, r: 1, layer: "edge", strength: 0.22 },
      { q: 1, r: 2, layer: "ghost", strength: 0.18 },
      { q: 2, r: 2, layer: "peripheral", strength: 0.26 },
      { q: 3, r: 2, layer: "secondary", strength: 0.32 },
      { q: 4, r: 2, layer: "secondary", strength: 0.35 },
      { q: 5, r: 2, layer: "peripheral", strength: 0.28 },
      { q: 6, r: 2, layer: "ghost", strength: 0.2 },
      { q: 7, r: 2, layer: "edge", strength: 0.2 },
      { q: 2, r: 3, layer: "ghost", strength: 0.2 },
      { q: 3, r: 3, layer: "peripheral", strength: 0.28 },
      { q: 4, r: 3, layer: "secondary", strength: 0.32 },
      { q: 5, r: 3, layer: "peripheral", strength: 0.26 },
      { q: 6, r: 3, layer: "ghost", strength: 0.2 },
      { q: 0, r: 4, layer: "edge", strength: 0.2 },
      { q: 1, r: 4, layer: "ghost", strength: 0.18 },
      { q: 2, r: 4, layer: "peripheral", strength: 0.24 },
      { q: 3, r: 4, layer: "ghost", strength: 0.2 },
      { q: 4, r: 4, layer: "ghost", strength: 0.18 },
      { q: 5, r: 4, layer: "peripheral", strength: 0.22 },
      { q: 6, r: 4, layer: "ghost", strength: 0.16 },
      { q: 0, r: 5, layer: "ghost", strength: 0.16 },
      { q: 1, r: 5, layer: "ghost", strength: 0.16 },
      { q: 2, r: 5, layer: "peripheral", strength: 0.22 },
      { q: 3, r: 5, layer: "ghost", strength: 0.18 },
      { q: 4, r: 5, layer: "peripheral", strength: 0.2 },
      { q: 5, r: 5, layer: "ghost", strength: 0.16 },
    ],
  },
} satisfies Record<"left" | "right", GlobeHexComposition>;

function getGlobeHexCenter(composition: GlobeHexComposition, cell: GlobeHexCoordinate) {
  const x = composition.origin.x + Math.sqrt(3) * composition.radius * (cell.q + cell.r / 2);
  const y = composition.origin.y + composition.radius * 1.5 * cell.r;

  return {
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
  };
}

function renderGlobeHexCells(side: "left" | "right", plane: "backplane" | "foreground") {
  const composition = plane === "backplane" ? globeHexBackplaneComposition[side] : globeHexComposition[side];

  return composition.cells.map((cell) => {
    const center = getGlobeHexCenter(composition, cell);

    return (
      <polygon
        className={`central-hub__mapbox-hex-cell central-hub__mapbox-hex-cell--${cell.layer}`}
        key={`${side}-${plane}-${cell.q}-${cell.r}`}
        points={hexPoints(center.x, center.y, composition.radius)}
        style={{ "--mapbox-hex-strength": cell.strength } as CSSProperties}
      />
    );
  });
}

interface SydneyMapExplorerProps {
  accessToken: string | null;
}

export function SydneyMapExplorer({ accessToken }: SydneyMapExplorerProps) {
  const [expanded, setExpanded] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapBeaconRef = useRef<HTMLSpanElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapHexesHiddenRef = useRef(false);

  useEffect(() => {
    if (!expanded || !accessToken || mapFailed || !mapContainerRef.current || mapRef.current) return;

    const mapContainer = mapContainerRef.current;

    if (!mapboxgl.supported(true)) {
      const fallbackSync = window.setTimeout(() => setMapFailed(true), 0);

      return () => window.clearTimeout(fallbackSync);
    }

    let map: mapboxgl.Map;

    try {
      map = new mapboxgl.Map({
        accessToken,
        attributionControl: false,
        center: sydneyLngLat,
        cooperativeGestures: true,
        container: mapContainer,
        dragRotate: false,
        maxZoom: 8,
        minZoom: 0.65,
        pitchWithRotate: false,
        projection: "globe",
        scrollZoom: false,
        style: "mapbox://styles/mapbox/dark-v11",
        touchZoomRotate: true,
        zoom: 1.35,
      });
    } catch {
      const fallbackSync = window.setTimeout(() => setMapFailed(true), 0);

      return () => window.clearTimeout(fallbackSync);
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      if (event.ctrlKey || event.metaKey) {
        const nextZoom = Math.max(0.65, Math.min(8, map.getZoom() - event.deltaY * 0.01));
        map.zoomTo(nextZoom, {
          duration: 0,
        });
        return;
      }

      map.panBy([event.deltaX, event.deltaY], {
        duration: 0,
      });
    };
    const disableGlobeAtmosphere = () => {
      if (!map.isStyleLoaded() || !map.getFog()) return;

      map.setFog(null);
    };
    const syncBeaconPosition = () => {
      const beacon = mapBeaconRef.current;
      if (!beacon) return;

      const point = map.project(sydneyLngLat);
      const canvas = map.getCanvas();
      const isVisible =
        point.x >= 0 &&
        point.y >= 0 &&
        point.x <= canvas.clientWidth &&
        point.y <= canvas.clientHeight;

      beacon.style.setProperty("--mapbox-beacon-x", `${point.x}px`);
      beacon.style.setProperty("--mapbox-beacon-y", `${point.y}px`);
      beacon.dataset.visible = isVisible ? "true" : "false";
    };
    const syncHexOverlayState = () => {
      const canvas = map.getCanvas();
      const center = map.getCenter();
      const zoom = map.getZoom();
      const hideZoom = canvas.clientWidth < 760 ? 1.82 : 2.08;
      const showZoom = hideZoom - 0.24;
      const leftLimb = map.project([center.lng - 90, Math.max(-60, Math.min(60, center.lat))]);
      const rightLimb = map.project([center.lng + 90, Math.max(-60, Math.min(60, center.lat))]);
      const projectedLeft = Math.min(leftLimb.x, rightLimb.x);
      const projectedRight = Math.max(leftLimb.x, rightLimb.x);
      const sideRoomRatio = Math.min(projectedLeft, canvas.clientWidth - projectedRight) / canvas.clientWidth;
      const roomThreshold = mapHexesHiddenRef.current ? 0.09 : 0.065;
      const shouldHide =
        !Number.isFinite(sideRoomRatio) ||
        sideRoomRatio <= roomThreshold ||
        zoom >= (mapHexesHiddenRef.current ? showZoom : hideZoom);

      mapHexesHiddenRef.current = shouldHide;
      mapContainer.dataset.hexDensity = shouldHide ? "filled" : "open";
    };
    const handleMapLoad = () => {
      disableGlobeAtmosphere();
      syncBeaconPosition();
      syncHexOverlayState();
    };

    mapContainer.addEventListener("wheel", handleWheel, { passive: false });
    map.touchZoomRotate.disableRotation();
    mapContainer.dataset.hexDensity = "open";
    map.once("load", handleMapLoad);
    map.on("styledata", disableGlobeAtmosphere);
    map.on("move", syncHexOverlayState);
    map.on("resize", syncHexOverlayState);
    map.on("render", syncBeaconPosition);
    map.on("zoom", syncHexOverlayState);
    mapRef.current = map;

    const resize = window.setTimeout(() => {
      map.resize();
      syncHexOverlayState();
      syncBeaconPosition();
    }, 120);

    return () => {
      window.clearTimeout(resize);
      mapContainer.removeEventListener("wheel", handleWheel);
      map.off("styledata", disableGlobeAtmosphere);
      map.off("move", syncHexOverlayState);
      map.off("resize", syncHexOverlayState);
      map.off("render", syncBeaconPosition);
      map.off("zoom", syncHexOverlayState);
      mapHexesHiddenRef.current = false;
      map.remove();
      mapRef.current = null;
    };
  }, [accessToken, expanded, mapFailed]);

  return (
    <>
      <button
        className="central-hub__map-frame central-hub__map-frame--interactive"
        type="button"
        aria-label="Expand interactive Sydney map"
        onClick={() => {
          setMapFailed(false);
          setExpanded(true);
        }}
      >
        <Image
          src="/api/location/sydney-map"
          alt="World map with Sydney, Australia marked as Spencer Fisher's location"
          width={640}
          height={320}
          unoptimized
        />
        <span className="central-hub__map-beacon" aria-hidden="true" />
      </button>

      <HudModal
        open={expanded}
        title="Spencer's Geographic Location"
        ariaLabel="Interactive Sydney map"
        onClose={() => setExpanded(false)}
        size="wide"
      >
        {accessToken && !mapFailed ? (
          <div className="central-hub__mapbox-canvas" ref={mapContainerRef}>
            <svg className="central-hub__mapbox-hex-overlay" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="mapbox-left-hex-fade" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                  <stop offset="12%" stopColor="white" stopOpacity="1" />
                  <stop offset="74%" stopColor="white" stopOpacity="0.72" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="mapbox-right-hex-fade" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                  <stop offset="12%" stopColor="white" stopOpacity="1" />
                  <stop offset="74%" stopColor="white" stopOpacity="0.72" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <mask id="mapbox-left-hex-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="50">
                  <rect x="0" y="0" width="28" height="50" fill="url(#mapbox-left-hex-fade)" />
                </mask>
                <mask id="mapbox-right-hex-mask" maskUnits="userSpaceOnUse" x="72" y="0" width="28" height="50">
                  <rect x="72" y="0" width="28" height="50" fill="url(#mapbox-right-hex-fade)" />
                </mask>
              </defs>
              <g
                className="central-hub__mapbox-hex-layer central-hub__mapbox-hex-layer--backplane central-hub__mapbox-hex-layer--left"
                mask="url(#mapbox-left-hex-mask)"
              >
                {renderGlobeHexCells("left", "backplane")}
              </g>
              <g className="central-hub__mapbox-hex-layer central-hub__mapbox-hex-layer--left" mask="url(#mapbox-left-hex-mask)">
                {renderGlobeHexCells("left", "foreground")}
              </g>
              <g
                className="central-hub__mapbox-hex-layer central-hub__mapbox-hex-layer--backplane central-hub__mapbox-hex-layer--right"
                mask="url(#mapbox-right-hex-mask)"
              >
                {renderGlobeHexCells("right", "backplane")}
              </g>
              <g className="central-hub__mapbox-hex-layer central-hub__mapbox-hex-layer--right" mask="url(#mapbox-right-hex-mask)">
                {renderGlobeHexCells("right", "foreground")}
              </g>
            </svg>
            <span className="central-hub__mapbox-beacon" ref={mapBeaconRef} aria-hidden="true" />
          </div>
        ) : (
          <div className="central-hub__mapbox-fallback">
            <Image
              src="/api/location/sydney-map"
              alt="World map with Sydney, Australia marked as Spencer Fisher's location"
              width={1280}
              height={640}
              unoptimized
            />
          </div>
        )}
      </HudModal>
    </>
  );
}
