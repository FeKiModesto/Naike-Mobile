import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useProdutos } from '../hooks/useProdutos';
import { Button, Chip, Field, State } from './UI';
import type { Variant } from '../types';
import { ui } from '../theme';
export function VariantPicker({ onSelect, selectedId, disabled }: { onSelect: (v: Variant) => void; selectedId?: string; disabled?: boolean }) {
  const [search, setSearch] = useState(''); const [term, setTerm] = useState('');
  useEffect(() => { const id = setTimeout(() => setTerm(search), 350); return () => clearTimeout(id); }, [search]);
  const products = useProdutos(term);
  return <View style={ui.section}><Field label="Buscar produto para selecionar a variante" value={search} onChangeText={setSearch} editable={!disabled} />
    {products.isPending || products.error ? <State loading={products.isPending} error={products.error} action={() => void products.refetch()} /> :
      !products.data?.pages[0].data.length ? <Text style={ui.muted}>Nenhum produto publicado encontrado.</Text> :
      products.data.pages.flatMap(page => page.data).map(product => <View key={product.id} style={ui.card}>
        <Text style={ui.heading}>{product.name}</Text>{product.variants.map(v => <Chip key={v.id}
          title={v.sku + ' · estoque: ' + v.stock} selected={selectedId === v.id} disabled={disabled} onPress={() => onSelect(v)} />)}
      </View>)}
    {products.hasNextPage && <Button title="Mais produtos" secondary disabled={disabled} loading={products.isFetchingNextPage} onPress={() => void products.fetchNextPage()} />}
  </View>;
}
