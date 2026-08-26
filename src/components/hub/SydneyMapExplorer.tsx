"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import mapboxgl from "mapbox-gl";

const sydneyLngLat: [number, number] = [151.2093, -33.8688];

interface SydneyMapExplorerProps {
  accessToken: string | null;
}

export function SydneyMapExplorer({ accessToken }: SydneyMapExplorerProps) {
  const [expanded, setExpanded] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const portalSync = window.setTimeout(() => setPortalRoot(document.body), 0);

    return () => window.clearTimeout(portalSync);
  }, []);

  useEffect(() => {
    if (!expanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expanded]);

  useEffect(() => {
    if (!expanded || !accessToken || mapFailed || !mapContainerRef.current || mapRef.current) return;

    const mapContainer = mapContainerRef.current;

    if (!mapboxgl.supported(true)) {
      const fallbackSync = window.setTimeout(() => setMapFailed(true), 0);

      return () => window.clearTimeout(fallbackSync);
    }

    const beacon = document.createElement("span");
    beacon.className = "central-hub__mapbox-beacon";

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

    mapContainer.addEventListener("wheel", handleWheel, { passive: false });
    map.touchZoomRotate.disableRotation();
    new mapboxgl.Marker({ anchor: "center", element: beacon }).setLngLat(sydneyLngLat).addTo(map);
    mapRef.current = map;

    const resize = window.setTimeout(() => map.resize(), 120);

    return () => {
      window.clearTimeout(resize);
      mapContainer.removeEventListener("wheel", handleWheel);
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

      {expanded && portalRoot
        ? createPortal(
        <div className="central-hub__map-modal" role="dialog" aria-modal="true" aria-label="Interactive Sydney map">
          <button className="central-hub__map-modal-backdrop" type="button" aria-label="Close map" onClick={() => setExpanded(false)} />

          <div className="central-hub__map-modal-panel">
            <div className="central-hub__map-modal-header">
              <button type="button" onClick={() => setExpanded(false)}>
                Close
              </button>
            </div>

            {accessToken && !mapFailed ? (
              <div className="central-hub__mapbox-canvas" ref={mapContainerRef} />
            ) : (
              <div className="central-hub__mapbox-fallback">
                <Image
                  src="/api/location/sydney-map"
                  alt="World map with Sydney, Australia marked as Spencer Fisher's location"
                  width={1280}
                  height={640}
                  unoptimized
                />
                <span className="central-hub__map-beacon" aria-hidden="true" />
              </div>
            )}
          </div>
        </div>,
          portalRoot,
        )
        : null}
    </>
  );
}
