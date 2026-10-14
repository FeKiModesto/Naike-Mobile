import { useQuery } from "@tanstack/react-query";
import { pickupService } from "../services/pickupService";
import { isRecord } from "../utils/errors";
import type { Order } from "../types";

function texto(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v : undefined;
}

export function infoRetirada(order: Order): { id?: string; nome?: string } {
  const bruto: Record<string, unknown> = { ...order };
  for (const candidato of [
    bruto.pickupPoint,
    bruto.pickup,
    bruto.pickupLocation,
  ]) {
    if (isRecord(candidato)) {
      const nome = texto(candidato.name);
      const id = texto(candidato.id);
      if (nome || id) return { id, nome };
    }
  }
  return { id: texto(bruto.pickupPointId) };
}

export function usePontoDoPedido(order: Order) {
  const { id, nome } = infoRetirada(order);
  const lista = useQuery({
    queryKey: ["pickup", "todos"],
    queryFn: ({ signal }) => pickupService.list(undefined, signal),
    enabled: !!id && !nome,
    staleTime: 60000,
  });
  const achado = lista.data?.find((p) => p.id === id);
  return {
    temRetirada: !!(id || nome),
    nome: nome ?? achado?.name,
    endereco: achado?.address,
    carregando: !!id && !nome && lista.isPending,
  };
}
