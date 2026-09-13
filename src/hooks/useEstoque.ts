import { useAction } from './useAction';
import { groupService } from '../services/groupService';
import { keys, queryClient } from '../lib/queryClient';
export function useEstoque() {
  return useAction({ mutationFn: groupService.receive, onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.products }) });
}
