import { useMutation } from "@tanstack/react-query";
import api from "../services/api";
import { Cart, AdicionarItemCarrinhoInput, ApiError } from "../types";

export function useAdicionarAoCarrinho() {
  return useMutation<Cart, ApiError, AdicionarItemCarrinhoInput>({
    mutationFn: async (dados) => {
      const response = await api.post("/cart/items", dados);
      return response.data;
    },
  });
}
