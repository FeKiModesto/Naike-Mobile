import { useMutation } from "@tanstack/react-query";
import api from "../services/api";
import { Order, ApiError } from "../types";

export function useCheckout() {
  return useMutation<Order, ApiError, void>({
    mutationFn: async () => {
      const response = await api.post("/orders/checkout");
      return response.data;
    },
  });
}
