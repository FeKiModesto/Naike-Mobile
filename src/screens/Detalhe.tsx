import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';
import { useProduto } from '../hooks/useProduto';
import { useAdicionarAoCarrinho } from '../hooks/useCarrinho';
import { useFavoritar, useFavoritos } from '../hooks/useFavoritos';
import { useAuth } from '../contexts/AuthContext';
import { Button, Chip, ErrorNotice, Notice, Page, ProductImage, State } from '../components/UI';
import { colors, ui } from '../theme';
import { money } from '../utils/validation';
import type { RootStackParamList } from '../navigation/types';
export function Detalhe() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'Detalhe'>>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const product = useProduto(params.id); const cart = useAdicionarAoCarrinho(); const favorites = useFavoritos(); const favorite = useFavoritar();
  const { isLoggedIn, offline } = useAuth();
  const [variantId, setVariantId] = useState<string>(); const [quantity, setQuantity] = useState(1); const [success, setSuccess] = useState('');
  if (product.isPending || product.error || !product.data) return <Page><State loading={product.isPending} error={product.error} title="Produto indisponível" action={() => void product.refetch()} /></Page>;
  const item = product.data; const variant = item.variants.find(v => v.id === variantId);
  const isFavorite = favorites.data?.some(v => v.variantId === variantId) ?? false;
  const pending = cart.isPending || favorite.isPending;
  function login() { navigation.navigate('Login'); }
  return <Page><ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
      {(item.images.length ? item.images : [undefined]).map((uri, i) => <View key={uri ?? i} style={{ width: 300 }}><ProductImage uri={uri} name={item.name} height={300} /></View>)}
    </ScrollView>
    <View style={ui.section}><Text style={ui.eyebrow}>FEITO PARA O SEU DIA</Text><Text style={ui.title}>{item.name}</Text>
      <Text style={{ color: colors.navy, fontSize: 27, fontWeight: '800' }}>{variant ? money(variant.price) : item.variants.length ? 'A partir de ' + money(Math.min(...item.variants.map(v => v.price))) : 'Indisponível'}</Text>
      <Text style={ui.body}>{item.description || 'Confira as opções disponíveis e escolha a que combina com você.'}</Text></View>
    <Text style={ui.heading}>Escolha sua variante</Text>
    <Text style={ui.muted}>Selecione a combinação de cor e tamanho antes de adicionar ou favoritar.</Text>
    <View style={{ gap: 10 }}>{item.variants.map(v => <Chip key={v.id} title={(Object.entries(v.options).map(([k, value]) => k + ': ' + value).join(' · ') || v.sku) + (v.stock <= 0 ? ' · Sem estoque' : '')}
      selected={v.id === variantId} disabled={pending} onPress={() => { setVariantId(v.id); setQuantity(1); setSuccess(''); }} />)}</View>
    {variant && <Text style={ui.muted}>SKU {variant.sku} · {variant.stock > 0 ? variant.stock + ' disponíveis' : 'Sem estoque no momento'}</Text>}
    <View style={ui.between}><Text style={ui.body}>Quantidade</Text><View style={ui.row}>
      <Button title="−" secondary disabled={quantity <= 1 || pending} onPress={() => setQuantity(q => q - 1)} />
      <Text accessibilityLabel={'Quantidade ' + quantity} style={ui.heading}>{quantity}</Text>
      <Button title="+" secondary disabled={!variant || quantity >= variant.stock || pending} onPress={() => setQuantity(q => q + 1)} />
    </View></View>
    <ErrorNotice error={cart.error || favorite.error} />{success && <Notice tone="success" text={success} />}
    {!isLoggedIn ? <Button title="Entrar para comprar" onPress={login} /> : <>
      <Button title={variant?.stock === 0 ? 'Sem estoque' : 'Adicionar à sacola'} icon="bag-add-outline" loading={cart.isPending}
        disabled={!variant || variant.stock < quantity || pending || offline}
        onPress={() => variant && cart.mutate({ variantId: variant.id, quantity }, { onSuccess: () => setSuccess('Sua escolha já está na sacola.') })} />
      <Button title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'} secondary icon={isFavorite ? 'heart' : 'heart-outline'}
        loading={favorite.isPending} disabled={!variant || pending || favorites.isPending || !!favorites.error || offline}
        onPress={() => variant && favorite.mutate({ variantId: variant.id, remove: isFavorite }, { onSuccess: () => setSuccess(isFavorite ? 'Variante removida dos favoritos.' : 'Variante salva nos favoritos.') })} />
      {success && <Button title="Ir para a sacola" secondary onPress={() => navigation.navigate('Loja', { screen: 'Carrinho' })} />}
    </>}
  </Page>;
}
