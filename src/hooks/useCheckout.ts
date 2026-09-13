import { useAction } from './useAction';
import { shopService } from '../services/shopService';
import { useAuth } from '../contexts/AuthContext';
import { keys, queryClient } from '../lib/queryClient';
export function useCheckout() {
  const { customer } = useAuth();
  return useAction({ mutationFn: shopService.checkout, onSuccess: async () => {
    await Promise.all([queryClient.invalidateQueries({ queryKey: keys.private(customer?.id ?? '') }), queryClient.invalidateQueries({ queryKey: keys.products })]);
  } });
}
