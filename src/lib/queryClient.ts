import { QueryClient } from '@tanstack/react-query';
import { AppError } from '../utils/errors';
export const queryClient = new QueryClient({ defaultOptions: {
  queries: { staleTime: 60000, gcTime: 86400000, networkMode: 'always', retry: (count, error) => count < 1 && error instanceof AppError && error.status >= 500 },
  mutations: { retry: false, networkMode: 'always', gcTime: 0 },
} });
export const keys = {
  products: ['products'] as const,
  product: (id: string) => ['products', 'detail', id] as const,
  reviews: (productId: string) => ['products', 'detail', productId, 'reviews'] as const,
  canReview: (productId: string) => ['products', 'detail', productId, 'can-review'] as const,
  private: (id: string) => ['private', id] as const,
  cart: (id: string) => ['private', id, 'cart'] as const,
  favorites: (id: string) => ['private', id, 'favorites'] as const,
  orders: (id: string) => ['private', id, 'orders'] as const,
  order: (id: string, orderId: string) => ['private', id, 'orders', orderId] as const,
};