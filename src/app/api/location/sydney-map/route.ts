export const dynamic = "force-dynamic";

function fallbackMap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" role="img" aria-label="Sydney location map standby">
  <defs>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#ffc93c" stroke-opacity=".08" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="640" height="320" fill="#070707"/>
  <rect width="640" height="320" fill="url(#grid)"/>
  <path d="M66 113c30-22 82-34 128-18 27 10 54 27 86 23 33-4 58-32 91-32 35 0 57 30 91 36 34 7 75-10 112 11" fill="none" stroke="#8c2f1c" stroke-opacity=".42" stroke-width="2"/>
  <path d="M64 176c45-18 85-18 118-4 38 16 58 45 102 41 39-4 62-31 98-31 44 0 65 42 109 42 31 0 55-18 86-25" fill="none" stroke="#ffc93c" stroke-opacity=".25" stroke-width="2"/>
  <path d="M424 196c22-10 55-15 79 0 20 12 19 38 46 46 20 6 37-3 56 7" fill="none" stroke="#e08a46" stroke-opacity=".42" stroke-width="3"/>
  <text x="34" y="44" fill="#a9874d" font-family="monospace" font-size="18" letter-spacing="4">MAP API STANDBY</text>
</svg>`;
}

export async function GET() {
  const token = process.env.MAPBOX_ACCESS_TOKEN ?? process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    return new Response(fallbackMap(), {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": "image/svg+xml; charset=utf-8",
        "X-Map-Source": "fallback",
      },
    });
  }

  const center = "22,2,0.78,0";
  const mapUrl = new URL(`https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${center}/640x320@2x`);
  mapUrl.searchParams.set("access_token", token);
  mapUrl.searchParams.set("attribution", "false");
  mapUrl.searchParams.set("logo", "false");

  try {
    const response = await fetch(mapUrl, {
      next: { revalidate: 86_400 },
    });

    if (!response.ok) throw new Error(`Mapbox request failed: ${response.status}`);

    return new Response(await response.arrayBuffer(), {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        "Content-Type": response.headers.get("content-type") ?? "image/png",
        "X-Map-Source": "mapbox",
      },
    });
  } catch {
    return new Response(fallbackMap(), {
      headers: {
        "Cache-Control": "public, max-age=300",
        "Content-Type": "image/svg+xml; charset=utf-8",
        "X-Map-Source": "fallback",
      },
    });
  }
}
