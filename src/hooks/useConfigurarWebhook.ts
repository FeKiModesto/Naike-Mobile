import { useQuery } from '@tanstack/react-query';
import { useAction } from './useAction';
import { groupService } from '../services/groupService';
import type { ConfigurarWebhookInput } from '../types';
import { queryClient } from '../lib/queryClient';
export function useConfigurarWebhook(receiveSecret: (secret: string) => void) {
  return useAction({ mutationFn: (input: ConfigurarWebhookInput) => groupService.createWebhook(input, receiveSecret),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['group', 'webhooks'] }) });
}
export function useWebhooks() {
  return useQuery({ queryKey: ['group', 'webhooks'], queryFn: ({ signal }) => groupService.webhooks(signal) });
}
export function useEntregas(endpointId: string, page: number) {
  return useQuery({ queryKey: ['group', 'deliveries', endpointId, page],
    queryFn: ({ signal }) => groupService.deliveries(endpointId, page, signal), enabled: !!endpointId });
}
export function usePingWebhook() {
  return useAction({ mutationFn: groupService.ping,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['group', 'deliveries'] }) });
}
