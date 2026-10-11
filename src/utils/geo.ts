import type { Coordenadas } from "../types";

const rad = (graus: number) => (graus * Math.PI) / 180;

export function haversineKm(a: Coordenadas, b: Coordenadas): number {
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.latitude)) *
      Math.cos(rad(b.latitude)) *
      Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function distanciaLabel(km: number): string {
  return km < 1
    ? `${Math.round(km * 1000)} m`
    : `${km.toFixed(1).replace(".", ",")} km`;
}
