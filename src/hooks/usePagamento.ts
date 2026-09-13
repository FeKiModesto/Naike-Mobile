import { useAction } from './useAction';
import { shopService } from '../services/shopService';
import { keys, queryClient } from '../lib/queryClient';
import { useAuth } from '../contexts/AuthContext';
export function usePagamento() {
  const { customer } = useAuth();
  return useAction({ mutationFn: shopService.pay, onSettled: async () => {
    await Promise.all([queryClient.invalidateQueries({ queryKey: keys.orders(customer?.id ?? '') }), queryClient.invalidateQueries({ queryKey: keys.products })]);
  } });
}
