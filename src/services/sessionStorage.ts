import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { LoginResponse } from '../types';
import { AppError, isRecord } from '../utils/errors';
const KEY = 'naike_session_v2';
export async function readSession(): Promise<LoginResponse | null> {
  if (Platform.OS === 'web') return null;
  const value = await SecureStore.getItemAsync(KEY);
  if (!value) {
    const legacyToken = await SecureStore.getItemAsync('naike_cliente_token');
    return legacyToken ? { token: legacyToken, customer: { id: '', name: '', email: '' } } : null;
  }
  const parsed: unknown = JSON.parse(value);
  if (!isRecord(parsed) || typeof parsed.token !== 'string' || !isRecord(parsed.customer) ||
    typeof parsed.customer.id !== 'string' || typeof parsed.customer.name !== 'string' || typeof parsed.customer.email !== 'string') {
    throw new AppError('Não foi possível ler sua sessão. Entre novamente.');
  }
  return { token: parsed.token, customer: { id: parsed.customer.id, name: parsed.customer.name, email: parsed.customer.email } };
}
export async function saveSession(value: LoginResponse): Promise<void> {
  if (Platform.OS === 'web') throw new AppError('Use o app Android ou iOS para entrar com armazenamento seguro. A versão web permite visualizar a loja.');
  await SecureStore.setItemAsync(KEY, JSON.stringify(value));
}
export async function deleteSession(): Promise<void> {
  if (Platform.OS === 'web') {
    // Apenas remoção da credencial legada, sem persistência nova no navegador.
    if (typeof localStorage !== 'undefined') localStorage.removeItem('naike_cliente_token');
    return;
  }
  await Promise.all([KEY, 'naike_cliente_token', 'naike_cadastro_token'].map(key => SecureStore.deleteItemAsync(key)));
}
