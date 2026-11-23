export interface GeoPoint {
  latitude: number
  longitude: number
}

const EARTH_RADIUS_KM = 6371

export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180
  const dLat = toRad(b.latitude - a.latitude)
  const dLng = toRad(b.longitude - a.longitude)
  const lat1 = toRad(a.latitude)
  const lat2 = toRad(b.latitude)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

export interface PlannedRoute<T extends GeoPoint> {
  stops: T[]
  totalKm: number
}

/** Nearest-neighbor route. Deterministic: ties keep the earlier stop. */
export function planVisitRoute<T extends GeoPoint>(
  start: GeoPoint,
  stops: T[],
): PlannedRoute<T> {
  const remaining = [...stops]
  const ordered: T[] = []
  let cursor = start
  let totalKm = 0
  while (remaining.length > 0) {
    let nearest = 0
    let nearestKm = Infinity
    for (let i = 0; i < remaining.length; i++) {
      const km = haversineKm(cursor, remaining[i])
      if (km < nearestKm) {
        nearestKm = km
        nearest = i
      }
    }
    const [next] = remaining.splice(nearest, 1)
    ordered.push(next)
    totalKm += nearestKm
    cursor = next
  }
  return { stops: ordered, totalKm }
}
