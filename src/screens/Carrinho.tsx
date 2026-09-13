import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useCarrinho, useAtualizarCarrinho, useRemoverCarrinho } from '../hooks/useCarrinho';
import { useAuth } from '../contexts/AuthContext';
import { Button, ErrorNotice, Page, State } from '../components/UI';
import { ui } from '../theme';
import { money } from '../utils/validation';
import type { RootStackParamList } from '../navigation/types';
export function Carrinho() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); const cart = useCarrinho();
  const update = useAtualizarCarrinho(); const remove = useRemoverCarrinho(); const { offline } = useAuth();
  const busy = update.isPending || remove.isPending || offline;
  return <Page><Text style={ui.eyebrow}>SUAS ESCOLHAS</Text><Text style={ui.title}>Minha sacola</Text>
    {cart.isPending || cart.error ? <State loading={cart.isPending} error={cart.error} action={() => void cart.refetch()} /> :
      !cart.data?.items.length ? <State title="Sua sacola está esperando" text="Explore a coleção e encontre sua próxima peça favorita." actionTitle="Explorar coleção" action={() => navigation.navigate('Loja', { screen: 'Home' })} /> : <>
        {cart.data.items.map(item => <View key={item.variantId} style={ui.card}>
          <Text style={ui.heading}>{item.name}</Text><Text style={ui.muted}>SKU {item.sku}</Text>
          <View style={ui.between}><Text style={ui.body}>{money(item.unitPrice)} por unidade</Text><Text style={ui.heading}>{money(item.subtotal)}</Text></View>
          <View style={ui.between}><View style={ui.row}>
            <Button title="−" secondary disabled={busy || item.quantity <= 1} onPress={() => update.mutate({ variantId: item.variantId, quantity: item.quantity - 1 })} />
            <Text style={ui.heading}>{item.quantity}</Text><Button title="+" secondary disabled={busy} onPress={() => update.mutate({ variantId: item.variantId, quantity: item.quantity + 1 })} />
          </View><Button title="Remover" secondary disabled={busy} onPress={() => remove.mutate(item.variantId)} /></View>
        </View>)}
        <ErrorNotice error={update.error || remove.error} />
        <View style={ui.card}><View style={ui.between}><Text style={ui.body}>Subtotal · {cart.data.itemCount} itens</Text><Text style={ui.heading}>{money(cart.data.total)}</Text></View>
          <Text style={ui.muted}>Consulte a entrega na próxima etapa.</Text></View>
        <Button title="Continuar para checkout" icon="arrow-forward" disabled={busy || cart.isFetching} onPress={() => navigation.navigate('Checkout')} />
      </>}
  </Page>;
}
