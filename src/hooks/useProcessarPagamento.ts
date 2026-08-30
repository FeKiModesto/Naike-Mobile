import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { PagamentoInput, PagamentoResponse, ApiError } from '../types';

// CONFERIR: path exato do endpoint de pagamento na doc da Mockmerce.
// Segue o padrão dos outros endpoints de sandbox (ex: /sandbox/shipping/quote).
export function useProcessarPagamento() {
  return useMutation<PagamentoResponse, ApiError, PagamentoInput>({
    mutationFn: async (dados) => {
      const response = await api.post('/sandbox/payments', dados);
      return response.data;
    },
  });
}