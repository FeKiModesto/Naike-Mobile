import api from './api';
import type { ConfigurarWebhookInput, EntradaEstoque } from '../types';
import { responseList } from './catalogService';
import { AppError, isRecord } from '../utils/errors';
export interface WebhookEndpoint { id: string; url: string; description?: string }
export interface Delivery { id: string; status: string; attempts?: number; createdAt?: string }
function endpoint(value: unknown): WebhookEndpoint {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.url !== 'string') throw new AppError('Não foi possível ler o webhook retornado.', 0, 'CONTRACT_ERROR');
  // Whitelist impede que signingSecret entre no cache de queries.
  return { id: value.id, url: value.url, description: typeof value.description === 'string' ? value.description : undefined };
}
export const groupService = {
  receive: async ({ variantId, quantity, reason }: EntradaEstoque) => (await api.post<unknown>('/variants/' + encodeURIComponent(variantId) + '/stock/receive', { quantity, reason })).data,
  webhooks: async (signal?: AbortSignal) => responseList((await api.get<unknown>('/webhooks', { signal })).data).map(endpoint),
  createWebhook: async (input: ConfigurarWebhookInput, receiveSecret: (secret: string) => void) => {
    const { data } = await api.post<unknown>('/webhooks', input);
    if (isRecord(data) && typeof data.signingSecret === 'string') {
      receiveSecret(data.signingSecret);
      delete data.signingSecret; // Não permanece na mutation ou no cache.
    }
    return endpoint(data);
  },
  ping: async (id: string) => { await api.post('/webhooks/' + encodeURIComponent(id) + '/ping'); },
  deliveries: async (endpointId: string, page: number, signal?: AbortSignal) => {
    const { data } = await api.get<unknown>('/webhooks/deliveries', { params: { endpointId, page, pageSize: 20 }, signal });
    return responseList(data).map((d): Delivery => {
      if (!isRecord(d) || typeof d.id !== 'string' || typeof d.status !== 'string') throw new AppError('Não foi possível ler o status das entregas.', 0, 'CONTRACT_ERROR');
      return { id: d.id, status: d.status, attempts: typeof d.attempts === 'number' ? d.attempts : undefined, createdAt: typeof d.createdAt === 'string' ? d.createdAt : undefined };
    });
  },
  refund: async (orderId: string) => { await api.post('/store/orders/' + encodeURIComponent(orderId) + '/refund'); },
};
