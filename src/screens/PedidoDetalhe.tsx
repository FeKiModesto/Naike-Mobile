import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';
import { usePedido } from '../hooks/usePedidos';
import { useEmitirNFe } from '../hooks/useNFe';
import { Button, ErrorNotice, Notice, Page, State, StatusBadge } from '../components/UI';
import { useAuth } from '../contexts/AuthContext';
import { CotacaoFrete } from './CotacaoFrete';
import { ui } from '../theme';
import { dateLabel, money } from '../utils/validation';
import { isRecord } from '../utils/errors';
import type { RootStackParamList } from '../navigation/types';
export function PedidoDetalhe() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'PedidoDetalhe'>>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); const order = usePedido(params.id); const invoice = useEmitirNFe(); const { offline } = useAuth();
  if (order.isPending || order.error || !order.data) return <Page><State loading={order.isPending} error={order.error} action={() => void order.refetch()} /></Page>;
  const item = order.data; const nota = isRecord(invoice.data) ? invoice.data : undefined;
  return <Page><Text style={ui.eyebrow}>FEITO PARA VOCÊ</Text><Text style={ui.title}>Pedido #{item.id.slice(-8).toUpperCase()}</Text>
    <Text style={ui.muted}>{dateLabel(item.createdAt)}</Text><StatusBadge status={item.status} />
    {item.items.map(line => <View key={line.variantId} style={ui.card}><Text style={ui.heading}>{line.productName}</Text>
      {line.variantName && <Text style={ui.body}>{line.variantName}</Text>}<Text style={ui.muted}>SKU {line.sku} · {line.quantity} unidades</Text><Text style={ui.heading}>{money(line.subtotal)}</Text></View>)}
    <View style={ui.between}><Text style={ui.heading}>Total do pedido</Text><Text style={ui.title}>{money(item.total)}</Text></View>
    {item.status === 'PENDING' && <Button title="Continuar pagamento" onPress={() => navigation.navigate('Pagamento', { orderId: item.id })} />}
    {item.status === 'PAID' && <View style={ui.card}><Text style={ui.heading}>Sua nota fiscal</Text><Text style={ui.muted}>Solicite a NF-e de demonstração deste pedido.</Text>
      <Button title={invoice.isSuccess ? 'NF-e solicitada' : 'Emitir NF-e'} disabled={invoice.isSuccess || offline} loading={invoice.isPending} onPress={() => invoice.mutate(item.id)} />
      <ErrorNotice error={invoice.error} />
      {invoice.isSuccess && <Notice tone="success" text="Solicitação de NF-e concluída pela API." />}
      {nota && (['number', 'key', 'issuedAt'] as const).map(key => typeof nota[key] === 'string' || typeof nota[key] === 'number' ?
        <Text selectable key={key} style={ui.body}>{({ number: 'Número', key: 'Chave', issuedAt: 'Emissão' })[key]}: {String(nota[key])}</Text> : null)}
    </View>}
    <CotacaoFrete orderId={item.id} disabled={offline} />
    <Button title="Atualizar pedido" secondary loading={order.isFetching} onPress={() => void order.refetch()} />
  </Page>;
}
