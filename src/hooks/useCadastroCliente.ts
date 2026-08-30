import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { salvarTokenCadastro } from '../services/clienteToken';
import { CadastroClienteInput, CadastroClienteResponse, ApiError } from '../types';

export function useCadastroCliente() {
  return useMutation<CadastroClienteResponse, ApiError, CadastroClienteInput>({
    mutationFn: async (dados) => {
      const response = await api.post('/auth/register', dados);
      return response.data;
    },
    onSuccess: async (data) => {
      if (data?.token) {
        await salvarTokenCadastro(data.token);
      }
    },
  });
}
