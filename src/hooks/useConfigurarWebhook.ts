import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { ConfigurarWebhookInput, ConfigurarWebhookResponse, ApiError } from '../types';

export function useConfigurarWebhook() {
  return useMutation<ConfigurarWebhookResponse, ApiError, ConfigurarWebhookInput>({
    mutationFn: async (dados) => {
      const response = await api.post('/webhooks', dados);
      return response.data;
    },
  });
}
