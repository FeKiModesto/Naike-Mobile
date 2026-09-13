import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useProdutos, useCategorias } from '../hooks/useProdutos';
import { Button, Chip, Field, Notice, ProductImage, State } from '../components/UI';
import { colors, ui } from '../theme';
import { money } from '../utils/validation';
import type { RootStackParamList } from '../navigation/types';
export function Home() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [search, setSearch] = useState(''); const [term, setTerm] = useState(''); const [category, setCategory] = useState<string>();
  useEffect(() => { const timer = setTimeout(() => setTerm(search.trim()), 350); return () => clearTimeout(timer); }, [search]);
  const products = useProdutos(term, category); const categories = useCategorias();
  const all = products.data?.pages.flatMap(page => page.data) ?? [];
  const { width } = useWindowDimensions(); const columns = width >= 760 ? 3 : 2;
  return <View style={{ flex: 1, backgroundColor: colors.paper }}>
    <FlatList key={columns} numColumns={columns} data={all} keyExtractor={item => item.id}
      contentContainerStyle={{ padding: 20, gap: 18, width: '100%', maxWidth: 1000, alignSelf: 'center', flexGrow: 1 }}
      columnWrapperStyle={{ gap: 14 }} keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl refreshing={products.isRefetching} onRefresh={() => { void products.refetch(); void categories.refetch(); }} tintColor={colors.navy} />}
      ListHeaderComponent={<View style={{ gap: 22, marginBottom: 8 }}>
        <View style={ui.between}><View><Text style={ui.eyebrow}>VISTA O SEU RITMO</Text><Text style={ui.title}>Encontre seu estilo.</Text></View></View>
        <View style={{ backgroundColor: colors.navy, borderRadius: 24, padding: 24, minHeight: 215, overflow: 'hidden', gap: 14 }}>
          <View style={{ position: 'absolute', right: -55, top: -45, height: 240, width: 240, borderRadius: 120, borderWidth: 38, borderColor: '#1C1974' }} />
          <Text style={{ color: colors.lime, fontWeight: '700', fontSize: 11, letterSpacing: 2 }}>O ESSENCIAL É SER VOCÊ</Text>
          <Text style={{ color: colors.white, fontWeight: '800', fontSize: 35, lineHeight: 39, maxWidth: 260 }}>Da rua.{ '\n' }Para a sua vida.</Text>
          <Text style={{ color: '#DCDEF1', fontSize: 15, maxWidth: 250 }}>Explore roupas e tênis. Encontre o que combina com você.</Text>
        </View>
        <Field label="O que você procura?" placeholder="Busque tênis, camisetas…" value={search} onChangeText={setSearch} returnKeyType="search" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <Chip title="Todos" selected={!category} onPress={() => setCategory(undefined)} />
          {categories.data?.map(item => <Chip key={item.id} title={item.name} selected={item.id === category} onPress={() => setCategory(item.id)} />)}
        </ScrollView>
        {categories.error && <Notice text="As categorias não carregaram. Você ainda pode usar a busca." />}
        <View style={ui.between}><Text style={ui.heading}>{term ? 'Suas descobertas' : 'Nossa coleção'}</Text>
          {products.data && <Text style={ui.muted}>{products.data.pages[0].total} itens</Text>}</View>
      </View>}
      renderItem={({ item }) => {
        const price = item.variants.length ? Math.min(...item.variants.map(v => v.price)) : null;
        return <Pressable accessibilityRole="button" accessibilityLabel={'Ver ' + item.name}
          onPress={() => navigation.navigate('Detalhe', { id: item.id })}
          style={({ pressed }) => ({ flex: 1, maxWidth: ((Math.min(width, 1000) - 40 - 14 * (columns - 1)) / columns), gap: 9, opacity: pressed ? .7 : 1 })}>
          <ProductImage uri={item.images[0]} name={item.name} height={width < 400 ? 155 : 195} />
          <Text style={{ color: colors.ink, fontWeight: '700', fontSize: 15 }} numberOfLines={2}>{item.name}</Text>
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16 }}>{price === null ? 'Ver disponibilidade' : money(price)}</Text>
          <Text style={ui.muted}>{item.variants.some(v => v.stock > 0) ? 'Escolha sua variante' : 'Sem estoque'}</Text>
        </Pressable>;
      }}
      ListEmptyComponent={<State loading={products.isPending} error={products.error} title="Nenhuma peça por aqui ainda"
        text={term || category ? 'Tente outra busca ou explore todas as categorias.' : 'O catálogo da loja aparecerá aqui assim que houver produtos publicados.'}
        action={() => { if (term || category) { setSearch(''); setCategory(undefined); } else void products.refetch(); }}
        actionTitle={term || category ? 'Limpar filtros' : 'Atualizar coleção'} />}
      ListFooterComponent={<View style={{ paddingVertical: 16, gap: 12 }}>
        {!!all.length && products.error && <State error={products.error} action={() => void products.fetchNextPage()} />}
        {products.hasNextPage && <Button title="Ver mais peças" secondary loading={products.isFetchingNextPage} onPress={() => void products.fetchNextPage()} />}
      </View>}
    />
  </View>;
}
