import { useAction } from './useAction';
import { shopService } from '../services/shopService';
export function useEmitirNFe() { return useAction({ mutationFn: shopService.invoice }); }
