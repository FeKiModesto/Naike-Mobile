import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { CotacaoFreteInput, OpcaoFrete, ApiError } from '../types';

export function useCotacaoFrete() {
  return useMutation<OpcaoFrete[], ApiError, CotacaoFreteInput>({
    mutationFn: async (dados) => {
      const response = await api.post('/sandbox/shipping/quote', dados);
      const resultado = response.data;
      if (Array.isArray(resultado)) {
        return resultado;
      }
      return resultado?.options ?? resultado?.quotes ?? [];
    },
  });
}
