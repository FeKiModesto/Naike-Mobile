import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Product, ApiError } from '../types';

export function useProduto(id: string) {
  return useQuery<Product, ApiError>({
    queryKey: ['produto', id],
    queryFn: async () => {
      const response = await api.get(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}