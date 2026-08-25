import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { Product, ApiError, CriarProdutoVariavelInput } from '../types';

export function useProdutoVariavel() {
  return useMutation<Product, ApiError, CriarProdutoVariavelInput>({
    mutationFn: async (dados) => {
      const response = await api.post('/products', dados);
      return response.data;
    },
  });
}