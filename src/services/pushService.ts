import api from './api';
import { responseList } from './catalogService';
import { isRecord } from '../utils/errors';
import type { MensagemPush } from '../types';

const POR_PAGINA = 20;

function texto(valor: unknown): string | undefined {
  return typeof valor === 'string' && valor.trim() !== '' ? valor : undefined;
}

function dadosComoTexto(valor: unknown): Record<string, string> {
  if (!isRecord(valor)) return {};
  const saida: Record<string, string> = {};
  for (const [chave, v] of Object.entries(valor)) {
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') saida[chave] = String(v);
  }
  return saida;
}

export function mensagemFromResponse(item: unknown): MensagemPush | undefined {
  if (!isRecord(item)) return undefined;
  const id = typeof item.id === 'string' ? item.id : typeof item.id === 'number' ? String(item.id) : undefined;
  if (!id) return undefined;
  const payload = isRecord(item.payload) ? item.payload : item;
  const notificacao = isRecord(payload.notification) ? payload.notification : payload;
  return {
    id,
    customerId: texto(item.customerId),
    status: texto(item.status),
    errorCode: texto(item.errorCode),
    title: texto(notificacao.title) ?? texto(item.title),
    body: texto(notificacao.body) ?? texto(item.body),
    data: dadosComoTexto(isRecord(payload.data) ? payload.data : item.data),
  };
}

export const pushService = {
  listarEnviadas: async (signal?: AbortSignal): Promise<MensagemPush[]> => {
    const { data } = await api.get<unknown>('/push/messages', { params: { pageSize: POR_PAGINA }, signal });
    return responseList(data).flatMap(item => {
      const mensagem = mensagemFromResponse(item);
      return mensagem ? [mensagem] : [];
    });
  },
};