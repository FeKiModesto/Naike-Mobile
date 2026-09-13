import { useRef } from 'react';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { AppError } from '../utils/errors';
/** Guarda síncrona contra dois toques no mesmo frame, sem enfileirar ações duplicadas. */
export function useAction<T, V>(options: UseMutationOptions<T, Error, V>) {
  const locked = useRef(false);
  const mutation = useMutation<T, Error, V>({ ...options, retry: false });
  const mutate: typeof mutation.mutate = (...args) => {
    if (locked.current || mutation.isPending) return;
    locked.current = true;
    void mutation.mutateAsync(...args).catch(() => undefined).finally(() => { locked.current = false; });
  };
  const mutateAsync: typeof mutation.mutateAsync = async (...args) => {
    if (locked.current || mutation.isPending) throw new AppError('Aguarde a operação em andamento.');
    locked.current = true;
    try { return await mutation.mutateAsync(...args); } finally { locked.current = false; }
  };
  return { ...mutation, mutate, mutateAsync };
}
