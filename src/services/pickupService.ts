import api from "./api";
import { responseList } from "./catalogService";
import { AppError, isRecord } from "../utils/errors";
import type { Coordenadas, PickupPoint } from "../types";

function numero(valor: unknown): number | undefined {
  if (typeof valor === "number" && Number.isFinite(valor)) return valor;
  if (
    typeof valor === "string" &&
    valor.trim() !== "" &&
    Number.isFinite(Number(valor))
  )
    return Number(valor);
  return undefined;
}

function enderecoTexto(valor: unknown): string {
  if (typeof valor === "string") return valor;
  if (!isRecord(valor)) return "";
  return [
    valor.street,
    valor.number,
    valor.neighborhood,
    valor.city,
    valor.state,
  ]
    .filter(
      (p): p is string | number =>
        typeof p === "string" || typeof p === "number",
    )
    .join(", ");
}

export function pickupFromResponse(value: unknown): PickupPoint {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.name !== "string"
  ) {
    throw new AppError(
      "Ponto de retirada retornado em formato inválido.",
      0,
      "CONTRACT_ERROR",
    );
  }
  const local = isRecord(value.location) ? value.location : value;
  const metros = numero(value.distanceMeters);
  return {
    id: value.id,
    name: value.name,
    address: enderecoTexto(value.address),
    latitude: numero(local.latitude),
    longitude: numero(local.longitude),
    distanceKm:
      numero(value.distanceKm) ??
      (metros !== undefined ? metros / 1000 : numero(value.distance)),
  };
}

export const pickupService = {
  /** Sem coords a API devolve a ordem de cadastro. Isso é esperado, não é bug. */
  list: async (
    coords?: Coordenadas,
    signal?: AbortSignal,
  ): Promise<PickupPoint[]> => {
    const { data } = await api.get<unknown>("/pickup-points", {
      params: coords
        ? { latitude: coords.latitude, longitude: coords.longitude }
        : undefined,
      signal,
    });
    return responseList(data).map(pickupFromResponse);
  },
};
