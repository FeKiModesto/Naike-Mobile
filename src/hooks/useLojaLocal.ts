import { useQuery } from "@tanstack/react-query";
import { lojaService } from "../services/lojaService";
import { keys } from "../lib/queryClient";

/** Falhar aqui não derruba a tela: o mapa só fica sem o marcador da loja. */
export function useLojaLocal() {
  return useQuery({
    queryKey: keys.storeLocal,
    queryFn: ({ signal }) => lojaService.local(signal),
    staleTime: 300000,
  });
}
