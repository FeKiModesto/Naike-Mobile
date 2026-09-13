import AsyncStorage from '@react-native-async-storage/async-storage';
import { queryClient, keys } from './queryClient';
import type { Favorite } from '../services/shopService';
import { isRecord } from '../utils/errors';
const storageKey = (id: string) => 'naike.favorites.v1.' + id;
let stop: (() => void) | undefined;
let pending: Promise<unknown> = Promise.resolve();
export async function restoreFavorites(id: string) {
  if (!id) return;
  const raw = await AsyncStorage.getItem(storageKey(id));
  if (!raw) return;
  try {
    const value: unknown = JSON.parse(raw);
    if (isRecord(value) && typeof value.updatedAt === 'number' && Array.isArray(value.data) &&
      value.data.every(v => isRecord(v) && typeof v.variantId === 'string')) {
      queryClient.setQueryData(keys.favorites(id), value.data as Favorite[], { updatedAt: value.updatedAt });
    }
  } catch { await AsyncStorage.removeItem(storageKey(id)); }
}
export function watchFavorites(id: string) {
  stop?.();
  stop = queryClient.getQueryCache().subscribe(event => {
    const query = event.query;
    if (query.queryKey.join('|') !== keys.favorites(id).join('|') || query.state.status !== 'success' || !query.state.data) return;
    const value = JSON.stringify({ data: query.state.data, updatedAt: query.state.dataUpdatedAt });
    pending = pending.catch(() => undefined).then(() => AsyncStorage.setItem(storageKey(id), value));
    // Falha de cache não transforma uma ação já confirmada pela API em erro de compra.
    void pending.catch(() => undefined);
  });
}
export async function clearFavoritesCache() {
  stop?.(); stop = undefined;
  await pending.catch(() => undefined);
  const all = await AsyncStorage.getAllKeys();
  await AsyncStorage.multiRemove(all.filter(k => k.startsWith('naike.favorites.v1.')));
}
