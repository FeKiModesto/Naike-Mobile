import React, { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';
import { usePedido } from '../hooks/usePedidos';
import { usePagamento } from '../hooks/usePagamento';
import { useAuth } from '../contexts/AuthContext';
import { Button, Chip, ErrorNotice, Notice, Page, State, StatusBadge } from '../components/UI';
import { ui, colors } from '../theme';
import { money } from '../utils/validation';
import type { MetodoPagamento } from '../types';
import type { RootStackParamList } from '../navigation/types';
export function Pagamento() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'Pagamento'>>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); const order = usePedido(params.orderId); const pay = usePagamento(); const { offline } = useAuth();
  const [method, setMethod] = useState<MetodoPagamento>('PIX'); const [decline, setDecline] = useState(false);
  const current = order.data;
  const declined = current?.status === 'PENDING' && (current.payment?.status === 'DECLINED' || (pay.isSuccess && pay.data?.status === 'PENDING'));
  return <Page><Text style={ui.eyebrow}>ÚLTIMO PASSO</Text><Text style={ui.title}>Seu pagamento</Text>
    {order.isPending || order.error || !current ? <State loading={order.isPending} error={order.error} action={() => void order.refetch()} /> : <>
      <View style={ui.card}><Text style={ui.muted}>Pedido #{current.id.slice(-8).toUpperCase()}</Text><Text style={ui.title}>{money(current.total)}</Text><StatusBadge status={current.status} /></View>
      {current.status === 'PAID' ? <><Notice tone="success" text="Pagamento aprovado! Seu pedido já está no histórico." />
        <Button title="Ver pedido e emitir NF-e" onPress={() => navigation.navigate('PedidoDetalhe', { id: current.id })} /></> :
      current.status === 'PENDING' ? <>
        {declined && <Notice tone="error" text="Pagamento recusado. Seu pedido continua aguardando pagamento. Escolha outro método ou desative a simulação para tentar novamente." />}
        <Text style={ui.heading}>Como deseja pagar?</Text>
        {([['PIX', 'Pix'], ['CREDIT_CARD', 'Cartão de crédito'], ['BOLETO', 'Boleto']] as const).map(([value, label]) =>
          <Chip key={value} title={label} selected={method === value} disabled={pay.isPending} onPress={() => setMethod(value)} />)}
        <View style={ui.card}><View style={ui.between}><Text style={[ui.body, { flex: 1 }]}>Simular pagamento recusado</Text>
          <Switch accessibilityLabel="Simular pagamento recusado" value={decline} onValueChange={setDecline} disabled={pay.isPending} trackColor={{ true: colors.navy }} /></View>
          <Text style={ui.muted}>Ambiente de demonstração. Não são solicitados dados reais de cartão.</Text></View>
        <ErrorNotice error={pay.error} />
        <Button title={decline ? 'Testar pagamento recusado' : 'Confirmar pagamento'} loading={pay.isPending} disabled={offline || order.isFetching}
          onPress={() => pay.mutate({ orderId: current.id, method, simulate: decline ? 'decline' : 'approve' })} />
      </> : <Notice text="Este pedido não está disponível para pagamento." />}
      <Button title="Acompanhar meus pedidos" secondary disabled={pay.isPending} onPress={() => navigation.navigate('Loja', { screen: 'Pedidos' })} />
    </>}
  </Page>;
}
