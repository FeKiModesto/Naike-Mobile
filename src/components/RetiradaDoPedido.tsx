import React from 'react';
import { Notice } from './UI';
import { usePontoDoPedido } from '../hooks/usePontoDoPedido';
import type { Order } from '../types';

export function RetiradaDoPedido({ order }: { order: Order }) {
  const ponto = usePontoDoPedido(order);
  if (!ponto.temRetirada) return null;
  const texto = ponto.nome
    ? 'Retirada em: ' + ponto.nome + (ponto.endereco ? ' · ' + ponto.endereco : '')
    : ponto.carregando ? 'Buscando o ponto de retirada…' : 'Pedido para retirada na loja.';
  return <Notice text={texto} />;
}