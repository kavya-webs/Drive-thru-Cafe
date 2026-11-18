// Coordinates for Grey Dot Coffee Shop, ITC Mantra, Ram Chowk, Mota Varachha, Surat
export const GREY_DOT_COORDS = {
  lat: 21.2385,
  lng: 72.8788,
  address: 'ITC Mantra, Ram Chowk, Mota Varachha, Surat',
  maxAllowedDriveThruKm: 3.0,
};

// Haversine formula to calculate great-circle distance between two GPS coordinates
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Number(distance.toFixed(1));
}

export function isWithinGeofence(distanceKm: number, maxLimit = GREY_DOT_COORDS.maxAllowedDriveThruKm): boolean {
  return distanceKm <= maxLimit;
}
