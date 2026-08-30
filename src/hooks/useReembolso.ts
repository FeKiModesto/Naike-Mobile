import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { ReembolsoInput, ReembolsoResponse, ApiError } from '../types';

// CONFERIR: path exato do endpoint de reembolso na doc da Mockmerce.
export function useReembolso() {
  return useMutation<ReembolsoResponse, ApiError, ReembolsoInput>({
    mutationFn: async (dados) => {
      const response = await api.post(`/orders/${dados.orderId}/refund`, {
        amount: dados.amount,
        reason: dados.reason,
      });
      return response.data;
    },
  });
}