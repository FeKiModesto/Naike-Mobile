import axios from 'axios';
import Constants from 'expo-constants';
import { getAuthToken } from './authToken';
import { AppError, isRecord } from '../utils/errors';
const extra = Constants.expoConfig?.extra;
const baseURL: string = typeof extra?.apiBaseUrl === 'string' && extra.apiBaseUrl ? extra.apiBaseUrl.replace(/\/$/, '') : 'https://api.mockmerce.com.br/v1';
export const isApiConfigured = typeof extra?.apiKey === 'string' && Boolean(extra.apiKey.trim());
let onUnauthorized: (() => Promise<void>) | undefined;
export function subscribeUnauthorized(callback: () => Promise<void>) {
  onUnauthorized = callback;
  return () => { if (onUnauthorized === callback) onUnauthorized = undefined; };
}
export function isBuyerRoute(path: string): boolean {
  return path === '/auth/me' || /^\/cart(?:\/|$)/.test(path) ||
    /^\/customers\/me(?:\/|$)/.test(path) ||
    (/^\/orders(?:\/|$)/.test(path) && !/\/invoice$/.test(path));
}
const api = axios.create({ baseURL, timeout: 15000, headers: { 'Content-Type': 'application/json' } });
api.interceptors.request.use((config) => {
  if (!isApiConfigured) throw new AppError('A loja ainda precisa ser configurada. Preencha o arquivo de ambiente e reinicie o aplicativo.', 0, 'CONFIGURATION');
  if (!baseURL.startsWith('https://') || !baseURL.endsWith('/v1')) throw new AppError('A URL da loja deve usar HTTPS e terminar em /v1.', 0, 'CONFIGURATION');
  config.headers.set('X-API-Key', extra?.apiKey);
  config.headers.set('X-Student-RM', extra?.studentRm);
  const token = getAuthToken();
  if (token && isBuyerRoute(config.url ?? '')) config.headers.set('Authorization', 'Bearer ' + token);
  else config.headers.delete('Authorization');
  return config;
});
api.interceptors.response.use(response => response, async (error: unknown) => {
  if (error instanceof AppError) return Promise.reject(error);
  if (!axios.isAxiosError<unknown>(error)) return Promise.reject(new AppError('Não foi possível concluir a solicitação.'));
  if (axios.isCancel(error)) return Promise.reject(new AppError('Solicitação cancelada.', 0, 'CANCELLED'));
  const status = error.response?.status ?? 0;
  const sentToken = error.config?.headers.get('Authorization');
  if (status === 401 && isBuyerRoute(error.config?.url ?? '') && sentToken === 'Bearer ' + getAuthToken() && getAuthToken()) await onUnauthorized?.();
  const body = error.response?.data;
  const envelope = isRecord(body) && isRecord(body.error) ? body.error : undefined;
  const fallback: Record<number, string> = {
    401: 'Acesso não autorizado. Confira suas credenciais.', 403: 'Você não tem acesso a esta operação.',
    404: 'Este item não foi encontrado.', 409: 'Os dados entraram em conflito. Atualize e tente novamente.',
    422: 'Não foi possível continuar. Confira os itens, o estoque e os dados informados.',
  };
  const timedOut = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
  const message = typeof envelope?.message === 'string' ? envelope.message : timedOut ? 'A loja demorou para responder. Tente novamente.' :
    !error.response ? 'Sem conexão com a loja. Verifique sua internet.' : fallback[status] ?? 'A loja não conseguiu concluir. Tente novamente.';
  return Promise.reject(new AppError(message, status, typeof envelope?.code === 'string' ? envelope.code : timedOut ? 'TIMEOUT' : !error.response ? 'NETWORK_ERROR' : 'HTTP_ERROR', envelope?.details));
});
export default api;
