import api from "./api";
import { isRecord } from "../utils/errors";
import type { Coordenadas, LojaLocal } from "../types";

function numero(valor: unknown): number | undefined {
  return typeof valor === "number" && Number.isFinite(valor)
    ? valor
    : undefined;
}

function acharCoordenadas(valor: unknown, nivel = 0): Coordenadas | undefined {
  if (!isRecord(valor) || nivel > 3) return undefined;
  const latitude = numero(valor.latitude);
  const longitude = numero(valor.longitude);
  if (latitude !== undefined && longitude !== undefined)
    return { latitude, longitude };
  for (const filho of Object.values(valor)) {
    const achado = acharCoordenadas(filho, nivel + 1);
    if (achado) return achado;
  }
  return undefined;
}

function acharNome(valor: Record<string, unknown>): string | undefined {
  for (const origem of [valor, valor.identity, valor.store, valor.branding]) {
    if (!isRecord(origem)) continue;
    for (const chave of ["storeName", "name", "displayName"]) {
      const texto = origem[chave];
      if (typeof texto === "string" && texto.trim() !== "") return texto;
    }
  }
  return undefined;
}

export const lojaService = {
  local: async (signal?: AbortSignal): Promise<LojaLocal | null> => {
    const { data } = await api.get<unknown>("/store/settings", { signal });
    const corpo = isRecord(data) && isRecord(data.data) ? data.data : data;
    const coords = acharCoordenadas(corpo);
    if (!coords) return null;
    return { name: (isRecord(corpo) && acharNome(corpo)) || "Loja", coords };
  },
};
