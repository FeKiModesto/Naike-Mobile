import api from './api';
import { AppError, isRecord } from '../utils/errors';
import type { Review, CanReviewResponse, CriarAvaliacaoInput, CanReviewMotivo } from '../types';

function reviewFromResponse(value: unknown): Review {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.rating !== 'number' ||
    typeof value.comment !== 'string' ||
    typeof value.createdAt !== 'string' ||
    !isRecord(value.customer) ||
    typeof value.customer.name !== 'string'
  ) {
    throw new AppError('Avaliação retornada em formato inválido.', 0, 'CONTRACT_ERROR');
  }
  const mediaIds = Array.isArray(value.mediaIds)
    ? value.mediaIds.filter((m): m is string => typeof m === 'string')
    : [];
  return {
    id: value.id,
    rating: value.rating,
    comment: value.comment,
    mediaIds,
    createdAt: value.createdAt,
    customer: { name: value.customer.name },
  };
}

export const reviewService = {
  list: async (productId: string, signal?: AbortSignal): Promise<Review[]> => {
    const { data } = await api.get<unknown>(`/products/${encodeURIComponent(productId)}/reviews`, { signal });
    const items = Array.isArray(data) ? data : isRecord(data) && Array.isArray(data.data) ? data.data : [];
    return items.map(reviewFromResponse);
  },

  canReview: async (productId: string, signal?: AbortSignal): Promise<CanReviewResponse> => {
    const { data } = await api.get<unknown>(`/products/${encodeURIComponent(productId)}/reviews/can-review`, { signal });
    if (!isRecord(data) || typeof data.canReview !== 'boolean') {
      throw new AppError('Resposta de can-review inesperada.', 0, 'CONTRACT_ERROR');
    }
    const reason = typeof data.reason === 'string' ? (data.reason as CanReviewMotivo) : 'allowed';
    return { canReview: data.canReview, reason };
  },

  create: async (productId: string, input: CriarAvaliacaoInput): Promise<void> => {
    await api.post(`/products/${encodeURIComponent(productId)}/reviews`, input);
  },
};