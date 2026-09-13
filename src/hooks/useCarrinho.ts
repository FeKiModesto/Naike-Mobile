import { useQuery } from '@tanstack/react-query';
import { shopService } from '../services/shopService';
import { useAuth } from '../contexts/AuthContext';
import { keys, queryClient } from '../lib/queryClient';
import { useAction } from './useAction';
import type { AdicionarItemCarrinhoInput, Cart } from '../types';
export function useCarrinho() {
  const { customer } = useAuth();
  return useQuery({ queryKey: keys.cart(customer?.id ?? ''), queryFn: ({ signal }) => shopService.cart(signal), enabled: !!customer });
}
function useCartAction(fn: (value: AdicionarItemCarrinhoInput) => Promise<Cart>) {
  const { customer } = useAuth();
  return useAction({ mutationFn: fn, onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.cart(customer?.id ?? '') }) });
}
export function useAdicionarAoCarrinho() { return useCartAction(shopService.add); }
export function useAtualizarCarrinho() { return useCartAction(shopService.update); }
export function useRemoverCarrinho() {
  const { customer } = useAuth();
  return useAction({ mutationFn: shopService.remove, onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.cart(customer?.id ?? '') }) });
}
