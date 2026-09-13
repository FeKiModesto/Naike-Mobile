import { useQuery } from '@tanstack/react-query';
import { catalogService } from '../services/catalogService';
import { keys } from '../lib/queryClient';
export function useProduto(id: string) {
  return useQuery({ queryKey: keys.product(id), queryFn: ({ signal }) => catalogService.detail(id, signal), enabled: !!id });
}
