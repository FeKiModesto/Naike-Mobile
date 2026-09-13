import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useCarrinho } from '../hooks/useCarrinho';
import { useCheckout } from '../hooks/useCheckout';
import { useAuth } from '../contexts/AuthContext';
import { Button, ErrorNotice, Page, State } from '../components/UI';
import { CotacaoFrete } from './CotacaoFrete';
import { ui } from '../theme';
import { money } from '../utils/validation';
import type { RootStackParamList } from '../navigation/types';
export function Checkout() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); const cart = useCarrinho(); const checkout = useCheckout(); const { offline } = useAuth();
  return <Page><Text style={ui.eyebrow}>1. REVISÃO  /  2. PAGAMENTO</Text><Text style={ui.title}>Tudo pronto?</Text>
    {cart.isPending || cart.error ? <State loading={cart.isPending} error={cart.error} action={() => void cart.refetch()} /> :
      !cart.data?.items.length ? <State title="Sua sacola está vazia" text="Escolha uma peça antes de finalizar." actionTitle="Ir para a coleção" action={() => navigation.navigate('Loja', { screen: 'Home' })} /> : <>
        <View style={ui.card}><Text style={ui.heading}>Resumo da compra</Text>{cart.data.items.map(item => <View key={item.variantId} style={ui.between}>
          <Text style={[ui.body, { flex: 1 }]}>{item.quantity} × {item.name}</Text><Text style={ui.body}>{money(item.subtotal)}</Text></View>)}
          <View style={ui.separator} /><View style={ui.between}><Text style={ui.heading}>Total do pedido</Text><Text style={ui.heading}>{money(cart.data.total)}</Text></View>
        </View>
        <CotacaoFrete disabled={checkout.isPending || offline} />
        <Text style={ui.muted}>Ao confirmar, suas peças serão reservadas. Você escolhe o pagamento na próxima tela.</Text>
        <ErrorNotice error={checkout.error} />
        <Button title="Confirmar pedido e continuar" icon="arrow-forward" loading={checkout.isPending} disabled={offline || cart.isFetching}
          onPress={() => checkout.mutate(undefined, { onSuccess: order => navigation.reset({ index: 1, routes: [{ name: 'Loja' }, { name: 'Pagamento', params: { orderId: order.id } }] }) })} />
      </>}
  </Page>;
}
