import { useAction } from './useAction';
import { shopService } from '../services/shopService';
export function useCotacaoFrete() { return useAction({ mutationFn: shopService.shipping }); }
