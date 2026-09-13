import { useQuery } from '@tanstack/react-query';
import { shopService } from '../services/shopService';
import { useAuth } from '../contexts/AuthContext';
import { keys, queryClient } from '../lib/queryClient';
import { useAction } from './useAction';
export function useFavoritos() {
  const { customer } = useAuth();
  return useQuery({ queryKey: keys.favorites(customer?.id ?? ''), queryFn: ({ signal }) => shopService.favorites(signal), enabled: !!customer, staleTime: 0 });
}
export function useFavoritar() {
  const { customer } = useAuth();
  return useAction({ mutationFn: ({ variantId, remove }: { variantId: string; remove: boolean }) => remove ? shopService.unfavorite(variantId) : shopService.favorite(variantId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.favorites(customer?.id ?? '') }) });
}
