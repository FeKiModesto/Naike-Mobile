import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Product, PaginatedResponse, ApiError } from '../types';

export function useProdutos(page: number = 1, search: string = '') {
  return useQuery<PaginatedResponse<Product>, ApiError>({
    queryKey: ['produtos', page, search],
    queryFn: async () => {
      const response = await api.get('/products', {
        params: { page, pageSize: 10, search },
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}