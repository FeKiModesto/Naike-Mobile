import type { ApiError } from '../types';
export class AppError extends Error implements ApiError {
  constructor(message: string, public status = 0, public code = 'UNKNOWN', public details?: unknown) {
    super(message); this.name = 'AppError';
  }
}
export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Não foi possível concluir. Tente novamente.';
}
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
export function isOfflineError(error: unknown): boolean {
  return error instanceof AppError && ['NETWORK_ERROR', 'TIMEOUT'].includes(error.code);
}
