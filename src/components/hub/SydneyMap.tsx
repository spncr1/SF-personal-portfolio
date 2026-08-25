import { SydneyMapExplorer } from "./SydneyMapExplorer";

const sydney = {
  latitude: "33.8688° S",
  longitude: "151.2093° E",
};

export function SydneyMap() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? null;
  const publicMapboxToken = mapboxToken?.startsWith("pk.") ? mapboxToken : null;

  return (
    <section className="central-hub__map-card" aria-label="Sydney location signal">
      <SydneyMapExplorer accessToken={publicMapboxToken} />

      <dl className="central-hub__map-meta">
        <div>
          <dt>Coordinates</dt>
          <dd>
            {sydney.latitude} / {sydney.longitude}
          </dd>
        </div>
      </dl>
    </section>
  );
}
