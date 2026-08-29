export function haversineKm(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number },
) {
  const earthKm = 6371;
  const dLat = toRadians(to.latitude - from.latitude);
  const dLng = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * earthKm * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function formatDistanceKm(km: number, locale: "ar" | "en") {
  if (km < 1) {
    const meters = Math.max(1, Math.round(km * 1000));
    return locale === "ar" ? `${meters} م` : `${meters} m`;
  }

  const value = km < 10 ? km.toFixed(1) : Math.round(km).toString();
  return locale === "ar" ? `${value} كم` : `${value} km`;
}

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}
