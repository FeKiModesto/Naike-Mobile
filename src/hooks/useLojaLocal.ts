import { useQuery } from "@tanstack/react-query";
import { lojaService } from "../services/lojaService";
import { keys } from "../lib/queryClient";

export function useLojaLocal() {
  return useQuery({
    queryKey: keys.storeLocal,
    queryFn: ({ signal }) => lojaService.local(signal),
    staleTime: 300000,
  });
}
