import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { usePedidos } from '../hooks/usePedidos';
import { Button, Page, State, StatusBadge } from '../components/UI';
import { ui } from '../theme';
import { dateLabel, money } from '../utils/validation';
import type { RootStackParamList } from '../navigation/types';
export function Pedidos() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); const orders = usePedidos();
  return <Page><Text style={ui.eyebrow}>CADA ESCOLHA TEM UMA HISTÓRIA</Text><Text style={ui.title}>Meus pedidos</Text>
    {orders.isPending || orders.error ? <State loading={orders.isPending} error={orders.error} action={() => void orders.refetch()} /> :
      !orders.data?.length ? <State icon="receipt-outline" title="Seu primeiro pedido começa aqui" text="Encontre suas peças e acompanhe cada compra neste espaço." actionTitle="Explorar coleção" action={() => navigation.navigate('Loja', { screen: 'Home' })} /> :
      orders.data.map(order => <View key={order.id} style={ui.card}>
        <View style={ui.between}><Text style={ui.heading}>#{order.id.slice(-8).toUpperCase()}</Text><Text style={ui.muted}>{dateLabel(order.createdAt)}</Text></View>
        <StatusBadge status={order.status} /><Text style={ui.heading}>{money(order.total)}</Text>
        <Text style={ui.muted}>{order.items.map(item => item.productName).join(' · ')}</Text>
        <Button title="Ver detalhes" secondary onPress={() => navigation.navigate('PedidoDetalhe', { id: order.id })} />
      </View>)}
    <Button title="Atualizar pedidos" secondary loading={orders.isFetching} onPress={() => void orders.refetch()} />
  </Page>;
}
