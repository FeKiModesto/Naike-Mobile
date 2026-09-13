import { useAction } from './useAction';
import { catalogService } from '../services/catalogService';
import { keys, queryClient } from '../lib/queryClient';
export function useProdutoVariavel() {
  return useAction({ mutationFn: catalogService.create, onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.products }) });
}
