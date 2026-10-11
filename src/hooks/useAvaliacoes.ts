import { useQuery } from "@tanstack/react-query";
import { useAction } from "./useAction";
import { reviewService } from "../services/reviewService";
import { uploadService } from "../services/uploadService";
import { keys, queryClient } from "../lib/queryClient";
import type { EnviarAvaliacaoInput } from "../types";

export function useAvaliacoes(productId: string) {
  return useQuery({
    queryKey: keys.reviews(productId),
    queryFn: ({ signal }) => reviewService.list(productId, signal),
    enabled: !!productId,
  });
}

export function useCanReview(productId: string) {
  return useQuery({
    queryKey: keys.canReview(productId),
    queryFn: ({ signal }) => reviewService.canReview(productId, signal),
    enabled: !!productId,
  });
}

export function useEnviarAvaliacao(productId: string) {
  return useAction({
    mutationFn: async ({ rating, comment, fotos }: EnviarAvaliacaoInput) => {
      const mediaIds: string[] = [];
      for (const foto of fotos) mediaIds.push(await uploadService.enviar(foto));
      await reviewService.create(productId, { rating, comment, mediaIds });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: keys.reviews(productId) });
      void queryClient.invalidateQueries({ queryKey: keys.product(productId) });
      void queryClient.invalidateQueries({
        queryKey: keys.canReview(productId),
      });
    },
  });
}
