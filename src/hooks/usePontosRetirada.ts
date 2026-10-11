import { useQuery } from "@tanstack/react-query";
import { pickupService } from "../services/pickupService";
import { keys } from "../lib/queryClient";
import type { Coordenadas } from "../types";

/** `pronto` fica falso enquanto a localização ainda está sendo resolvida. */
export function usePontosRetirada(
  coords: Coordenadas | undefined,
  pronto: boolean,
) {
  return useQuery({
    queryKey: keys.pickup(coords?.latitude, coords?.longitude),
    queryFn: ({ signal }) => pickupService.list(coords, signal),
    enabled: pronto,
    staleTime: 30000,
  });
}
