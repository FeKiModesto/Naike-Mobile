import { useQuery } from '@tanstack/react-query';
import { shopService } from '../services/shopService';
import { useAuth } from '../contexts/AuthContext';
import { keys } from '../lib/queryClient';
export function usePedidos() {
  const { customer } = useAuth();
  return useQuery({ queryKey: keys.orders(customer?.id ?? ''), queryFn: ({ signal }) => shopService.orders(signal), enabled: !!customer });
}
export function usePedido(id: string) {
  const { customer } = useAuth();
  return useQuery({ queryKey: keys.order(customer?.id ?? '', id), queryFn: ({ signal }) => shopService.order(id, signal), enabled: !!customer && !!id });
}
