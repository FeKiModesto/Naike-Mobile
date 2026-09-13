import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useFavoritos, useFavoritar } from '../hooks/useFavoritos';
import { useAdicionarAoCarrinho } from '../hooks/useCarrinho';
import { useAuth } from '../contexts/AuthContext';
import { Button, ErrorNotice, Notice, Page, State } from '../components/UI';
import { ui } from '../theme';
import { money } from '../utils/validation';
import type { RootStackParamList } from '../navigation/types';
export function Favoritos() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const favorites = useFavoritos(); const favorite = useFavoritar(); const cart = useAdicionarAoCarrinho(); const { offline } = useAuth();
  const busy = favorite.isPending || cart.isPending || offline || !!favorites.error;
  return <Page><Text style={ui.eyebrow}>PARA VOLTAR DEPOIS</Text><Text style={ui.title}>Seus favoritos</Text>
    <Text style={ui.muted}>As variantes que você salvou, com suas escolhas de cor e tamanho.</Text>
    {favorites.data && (favorites.error || offline) && <Notice text="Você está vendo favoritos salvos neste aparelho. Eles podem estar desatualizados. Conecte-se para atualizar." />}
    {!favorites.data ? <State loading={favorites.isPending} error={favorites.error} action={() => void favorites.refetch()} /> :
      !favorites.data.length ? <State icon="heart-outline" title="O que combina com você?" text="Abra uma peça, escolha a variante e toque em salvar nos favoritos." actionTitle="Explorar coleção" action={() => navigation.navigate('Loja', { screen: 'Home' })} /> :
      favorites.data.map(item => <View key={item.variantId} style={ui.card}>
        <Text style={ui.heading}>{item.name ?? 'Sua variante favorita'}</Text>
        <Text style={ui.muted}>{item.sku ? 'SKU ' + item.sku : 'Variante ' + item.variantId}</Text>
        {item.price !== undefined && <Text style={ui.heading}>{money(item.price)}</Text>}
        {item.productId && <Button title="Ver peça e opções" secondary onPress={() => navigation.navigate('Detalhe', { id: item.productId! })} />}
        <Button title="Adicionar esta variante à sacola" icon="bag-add-outline" disabled={busy} onPress={() => cart.mutate({ variantId: item.variantId, quantity: 1 })} />
        <Button title="Remover favorito" secondary disabled={busy} onPress={() => favorite.mutate({ variantId: item.variantId, remove: true })} />
      </View>)}
    <ErrorNotice error={favorite.error || cart.error} />{cart.isSuccess && <Notice tone="success" text="Variante adicionada à sacola." />}
    <Button title="Atualizar favoritos" secondary loading={favorites.isFetching} onPress={() => void favorites.refetch()} />
  </Page>;
}
