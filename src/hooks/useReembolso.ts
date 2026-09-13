import { useAction } from './useAction';
import { groupService } from '../services/groupService';
import { queryClient } from '../lib/queryClient';
export function useReembolso() {
  return useAction({ mutationFn: ({ orderId }: { orderId: string }) => groupService.refund(orderId),
    onSuccess: () => queryClient.invalidateQueries() });
}
