import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { EntradaEstoque, RespostaEstoque, ApiError } from '../types';

export function useEstoque() {
  return useMutation<RespostaEstoque, ApiError, EntradaEstoque>({
    mutationFn: async (dados) => {
      const response = await api.post(`/inventory/${dados.variantId}/add`, {
        quantity: dados.quantity,
        reason: dados.reason ?? 'Entrada manual',
      });
      return response.data;
    },
  });
}