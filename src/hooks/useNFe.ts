import { useMutation } from "@tanstack/react-query";
import api from "../services/api";
import { NotaFiscal, ApiError } from "../types";

export function useEmitirNFe() {
  return useMutation<NotaFiscal, ApiError, string>({
    mutationFn: async (orderId) => {
      const response = await api.get(`/orders/${orderId}/invoice`);
      return response.data;
    },
  });
}
