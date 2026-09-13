import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { usePedidos } from '../hooks/usePedidos';
import { useReembolso } from '../hooks/useReembolso';
import { Button, ErrorNotice, Notice, Page, State, StatusBadge } from '../components/UI';
import { ui } from '../theme';
import { money } from '../utils/validation';
export function Reembolso() {
  const orders = usePedidos(); const refund = useReembolso(); const [selected, setSelected] = useState<string>(); const [completed, setCompleted] = useState<string>();
  return <Page><Text style={ui.title}>Reembolsar pedido</Text><Text style={ui.muted}>Selecione um pedido pago da conta atual. O reembolso é integral e reverte o estoque conforme a API.</Text>
    {orders.isPending || orders.error ? <State loading={orders.isPending} error={orders.error} action={() => void orders.refetch()} /> :
      !orders.data?.some(o => o.status === 'PAID') ? <Notice text="Não há pedidos pagos disponíveis para reembolso nesta conta." /> :
      orders.data.filter(o => o.status === 'PAID').map(order => <View key={order.id} style={ui.card}>
        <Text style={ui.heading}>#{order.id.slice(-8).toUpperCase()} · {money(order.total)}</Text><StatusBadge status={order.status} />
        <Button title={selected === order.id ? 'Selecionado' : 'Selecionar para reembolso'} secondary disabled={refund.isPending} onPress={() => { setSelected(order.id); refund.reset(); }} />
      </View>)}
    {selected && orders.data?.some(o => o.id === selected && o.status === 'PAID') && <View style={ui.card}>
      <Notice text="Ao confirmar, a API executa o reembolso integral deste pedido. Esta ação registra a missão com sua configuração local." />
      <Button title="Confirmar reembolso integral" loading={refund.isPending} onPress={() => refund.mutate({ orderId: selected }, { onSuccess: () => { setCompleted(selected); setSelected(undefined); } })} />
    </View>}
    <ErrorNotice error={refund.error} />
    {completed && <Notice tone="success" text="Reembolso confirmado pela API. Pedidos, carrinho e catálogo foram solicitados novamente para atualizar os dados." />}
    {completed && orders.data?.find(o => o.id === completed) && <StatusBadge status={orders.data.find(o => o.id === completed)!.status} />}
  </Page>;
}
