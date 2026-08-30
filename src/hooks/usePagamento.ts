import { useMutation } from "@tanstack/react-query";
import api from "../services/api";
import { Order, PagamentoInput, ApiError } from "../types";

export function usePagamento() {
  return useMutation<Order, ApiError, PagamentoInput>({
    mutationFn: async ({ orderId, method, simulate }) => {
      const response = await api.post(`/orders/${orderId}/pay`, {
        method,
        ...(simulate ? { simulate } : {}),
      });
      return response.data;
    },
  });
}
