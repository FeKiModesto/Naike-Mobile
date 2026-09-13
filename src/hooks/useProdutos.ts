import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { catalogService } from '../services/catalogService';
import { keys } from '../lib/queryClient';
export function useProdutos(search = '', categoryId?: string) {
  return useInfiniteQuery({ queryKey: [...keys.products, 'list', search, categoryId], initialPageParam: 1,
    queryFn: ({ pageParam, signal }) => catalogService.list(pageParam, search, categoryId, signal),
    getNextPageParam: last => last.page * last.pageSize < last.total ? last.page + 1 : undefined });
}
export function useCategorias() {
  return useQuery({ queryKey: ['categories'], queryFn: ({ signal }) => catalogService.categories(signal) });
}
