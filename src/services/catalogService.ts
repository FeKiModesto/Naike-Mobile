import api from './api';
import type { Category, Product, PaginatedResponse, CriarProdutoVariavelInput, CriarProdutoSimplesInput } from '../types';
import { AppError, isRecord } from '../utils/errors';
export function responseList(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (isRecord(value) && Array.isArray(value.data)) return value.data;
  throw new AppError('A loja retornou uma lista em formato não reconhecido.', 0, 'CONTRACT_ERROR');
}
export function productFromResponse(value: unknown): Product {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.name !== 'string' || !Array.isArray(value.variants)) {
    throw new AppError('O produto retornado não contém os dados necessários.', 0, 'CONTRACT_ERROR');
  }
  const variants = value.variants.map(v => {
    if (!isRecord(v) || typeof v.id !== 'string' || typeof v.sku !== 'string' ||
      typeof v.price !== 'number' || typeof v.stock !== 'number') throw new AppError('A variante retornada está incompleta.', 0, 'CONTRACT_ERROR');
    const options: Record<string, string> = {};
    if (isRecord(v.options)) for (const [k, item] of Object.entries(v.options)) if (typeof item === 'string') options[k] = item;
    return { id: v.id, sku: v.sku, price: v.price, stock: v.stock, options };
  });
  // Imagens opcionais: só utiliza URLs presentes na resposta, nunca inventa uma foto do produto.
  const images = Array.isArray(value.images) ? value.images.flatMap(i => typeof i === 'string' ? [i] : isRecord(i) && typeof i.url === 'string' ? [i.url] : []) : [];
  const optionNames = [...new Set(variants.flatMap(v => Object.keys(v.options)))];
  return { id: value.id, name: value.name, description: typeof value.description === 'string' ? value.description : '',
    variants, images, categoryId: typeof value.categoryId === 'string' ? value.categoryId : undefined,
    options: optionNames.map(name => ({ name, values: [...new Set(variants.map(v => v.options[name]).filter(Boolean))] })) };
}
export const catalogService = {
  list: async (page: number, search: string, categoryId?: string, signal?: AbortSignal): Promise<PaginatedResponse<Product>> => {
    const { data } = await api.get<unknown>('/products', { params: { page, pageSize: 12, search, categoryId, state: 'PUBLISHED' }, signal });
    if (!isRecord(data) || !Array.isArray(data.data) || typeof data.page !== 'number' || typeof data.pageSize !== 'number' || typeof data.total !== 'number') {
      throw new AppError('A paginação do catálogo não pôde ser lida.', 0, 'CONTRACT_ERROR');
    }
    // A listagem pode trazer só o resumo. O preço vem sempre das variantes do detalhe.
    const products = await Promise.all(data.data.map(async item => {
      if (!isRecord(item) || typeof item.id !== 'string') throw new AppError('Produto sem identificação.', 0, 'CONTRACT_ERROR');
      return Array.isArray(item.variants) ? productFromResponse(item) : catalogService.detail(item.id, signal);
    }));
    return { data: products, page: data.page, pageSize: data.pageSize, total: data.total };
  },
  detail: async (id: string, signal?: AbortSignal) => productFromResponse((await api.get<unknown>('/products/' + encodeURIComponent(id), { signal })).data),
  categories: async (signal?: AbortSignal): Promise<Category[]> => responseList((await api.get<unknown>('/categories', { signal })).data).map(item => {
    if (!isRecord(item) || typeof item.id !== 'string' || typeof item.name !== 'string') throw new AppError('Categoria inválida na resposta.', 0, 'CONTRACT_ERROR');
    return { id: item.id, name: item.name };
  }),
  create: async (input: CriarProdutoVariavelInput | CriarProdutoSimplesInput) => {
    const { data } = await api.post<unknown>('/products', input);
    if (!isRecord(data) || typeof data.id !== 'string') throw new AppError('A API recebeu o cadastro, mas não retornou a identificação. Confira o catálogo antes de repetir.', 0, 'CONTRACT_ERROR');
    return { id: data.id, name: typeof data.name === 'string' ? data.name : input.name };
  },
};
