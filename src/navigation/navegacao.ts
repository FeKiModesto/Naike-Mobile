import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export const navegacaoRef = createNavigationContainerRef<RootStackParamList>();

let produtoPendente: string | null = null;

export function abrirProduto(id: string): void {
  if (!navegacaoRef.isReady()) {
    produtoPendente = id;
    return;
  }
  navegacaoRef.navigate('Detalhe', { id });
}

export function consumirNavegacaoPendente(): void {
  if (!produtoPendente) return;
  const id = produtoPendente;
  produtoPendente = null;
  navegacaoRef.navigate('Detalhe', { id });
}