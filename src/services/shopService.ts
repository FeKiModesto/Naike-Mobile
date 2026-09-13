import api from './api';
import type { AdicionarItemCarrinhoInput, Cart, Order, PagamentoInput, CotacaoFreteInput } from '../types';
import { responseList } from './catalogService';
import { AppError, isRecord } from '../utils/errors';
export interface Favorite { variantId: string; productId?: string; name?: string; sku?: string; price?: number }
export function favoritesFromResponse(value: unknown): Favorite[] {
  return responseList(value).map(item => {
    if (!isRecord(item) || typeof item.variantId !== 'string') throw new AppError('Não foi possível identificar a variante favorita na resposta da loja.', 0, 'CONTRACT_ERROR');
    const variant = isRecord(item.variant) ? item.variant : undefined;
    const product = variant && isRecord(variant.product) ? variant.product : undefined;
    return { variantId: item.variantId, productId: typeof variant?.productId === 'string' ? variant.productId : undefined,
      name: typeof product?.name === 'string' ? product.name : undefined,
      sku: typeof variant?.sku === 'string' ? variant.sku : undefined, price: typeof variant?.price === 'number' ? variant.price : undefined };
  });
}
export const shopService = {
  cart: async (signal?: AbortSignal) => (await api.get<Cart>('/cart', { signal })).data,
  add: async (input: AdicionarItemCarrinhoInput) => (await api.post<Cart>('/cart/items', input)).data,
  update: async ({ variantId, quantity }: AdicionarItemCarrinhoInput) => (await api.patch<Cart>('/cart/items/' + encodeURIComponent(variantId), { quantity })).data,
  remove: async (variantId: string) => (await api.delete<Cart>('/cart/items/' + encodeURIComponent(variantId))).data,
  favorites: async (signal?: AbortSignal) => favoritesFromResponse((await api.get<unknown>('/customers/me/favorites', { signal })).data),
  favorite: async (variantId: string) => { await api.post('/customers/me/favorites', { variantId }); },
  unfavorite: async (variantId: string) => { await api.delete('/customers/me/favorites/' + encodeURIComponent(variantId)); },
  checkout: async () => (await api.post<Order>('/orders/checkout')).data,
  orders: async (signal?: AbortSignal) => (await api.get<Order[]>('/orders', { signal })).data,
  order: async (id: string, signal?: AbortSignal) => (await api.get<Order>('/orders/' + encodeURIComponent(id), { signal })).data,
  pay: async ({ orderId, method, simulate }: PagamentoInput) => (await api.post<Order>('/orders/' + encodeURIComponent(orderId) + '/pay', { method, ...(simulate ? { simulate } : {}) })).data,
  // GET com efeito de emissão: invocado somente por mutation em botão explícito.
  invoice: async (id: string) => (await api.get<unknown>('/orders/' + encodeURIComponent(id) + '/invoice')).data,
  shipping: async (input: CotacaoFreteInput) => (await api.post<unknown>('/sandbox/shipping/quote', input)).data,
};
