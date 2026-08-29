export type MapCoordinates = {
  latitude: number;
  longitude: number;
};

const COORD_PAIR = /(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)/;

function isAllowedMapsHost(hostname: string) {
  const host = hostname.toLowerCase();
  if (host === "maps.app.goo.gl" || host === "goo.gl") return true;
  if (host === "maps.google.com" || host.endsWith(".maps.google.com")) return true;
  return /(^|\.)google\./.test(host);
}

function toCoords(latRaw: string, lngRaw: string): MapCoordinates | null {
  const latitude = Number(latRaw);
  const longitude = Number(lngRaw);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;
  return { latitude, longitude };
}

function parseCoordString(value: string): MapCoordinates | null {
  const cleaned = value.replace(/^loc:/i, "");
  const match = cleaned.match(COORD_PAIR);
  if (!match) return null;
  return toCoords(match[1], match[2]);
}

export function isGoogleMapsLink(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    if (!isAllowedMapsHost(url.hostname)) return false;
    const host = url.hostname.toLowerCase();
    const path = url.pathname.toLowerCase();
    if (host === "maps.app.goo.gl") return true;
    if (host === "goo.gl") return path.startsWith("/maps") || path.length > 1;
    if (host === "maps.google.com" || host.endsWith(".maps.google.com")) return true;
    return path.includes("/maps");
  } catch {
    return false;
  }
}

export function isShortGoogleMapsLink(value: string) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return host === "maps.app.goo.gl" || host === "goo.gl";
  } catch {
    return false;
  }
}

export function parseGoogleMapsCoords(urlString: string): MapCoordinates | null {
  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    return null;
  }

  if (!isAllowedMapsHost(url.hostname)) return null;

  const pin = url.href.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (pin) {
    const coords = toCoords(pin[1], pin[2]);
    if (coords) return coords;
  }

  const at = url.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (at) {
    const coords = toCoords(at[1], at[2]);
    if (coords) return coords;
  }

  for (const key of ["q", "query", "ll", "center", "destination", "origin"]) {
    const value = url.searchParams.get(key);
    if (!value) continue;
    const coords = parseCoordString(value);
    if (coords) return coords;
  }

  const place = url.pathname.match(
    /\/(?:place|dir|search)\/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
  );
  if (place) {
    const coords = toCoords(place[1], place[2]);
    if (coords) return coords;
  }

  return null;
}

async function expandGoogleMapsShortLink(urlString: string): Promise<string | null> {
  try {
    const response = await fetch(urlString, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "Mozilla/5.0 Evento" },
    });
    const finalUrl = response.url;
    const hostname = new URL(finalUrl).hostname;
    if (!isAllowedMapsHost(hostname)) return null;
    return finalUrl;
  } catch {
    return null;
  }
}

export async function resolveGoogleMapsLocation(
  urlString: string,
): Promise<MapCoordinates | null> {
  const direct = parseGoogleMapsCoords(urlString);
  if (direct) return direct;
  if (!isShortGoogleMapsLink(urlString)) return null;
  const expanded = await expandGoogleMapsShortLink(urlString);
  if (!expanded) return null;
  return parseGoogleMapsCoords(expanded);
}

export function googleMapsSearchUrl(latitude: number, longitude: number) {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}
