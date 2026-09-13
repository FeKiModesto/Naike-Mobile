import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useProdutoVariavel } from '../hooks/useProdutoVariavel';
import { useCategorias } from '../hooks/useProdutos';
import { Button, Chip, ErrorNotice, Field, Notice, Page } from '../components/UI';
import { ui } from '../theme';
import { moneyValue, nonNegativeInteger } from '../utils/validation';
interface VariantForm { key: number; sku: string; price: string; stock: string; cor: string; tamanho: string }
const emptyVariant = (key: number): VariantForm => ({ key, sku: '', price: '', stock: '', cor: '', tamanho: '' });
export function ProdutoVariavel() {
  const [type, setType] = useState<'SIMPLE' | 'VARIABLE'>('VARIABLE');
  const [name, setName] = useState(''); const [description, setDescription] = useState(''); const [categoryId, setCategoryId] = useState<string>();
  const [variants, setVariants] = useState<VariantForm[]>([emptyVariant(0)]); const [nextKey, setNextKey] = useState(1); const [validation, setValidation] = useState('');
  const create = useProdutoVariavel(); const categories = useCategorias();
  function update(key: number, field: keyof Omit<VariantForm, 'key'>, value: string) { setVariants(all => all.map(v => v.key === key ? { ...v, [field]: value } : v)); }
  function submit() {
    const active = type === 'SIMPLE' ? variants.slice(0, 1) : variants;
    if (!name.trim() || active.some(v => !v.sku.trim() || moneyValue(v.price) === null || !nonNegativeInteger(v.stock) || (type === 'VARIABLE' && (!v.cor.trim() || !v.tamanho.trim())))) {
      setValidation('Informe nome, SKU, preço válido e estoque inteiro não negativo. Cada variante deve ter cor e tamanho.'); return;
    }
    if (new Set(active.map(v => v.sku.trim().toLowerCase())).size !== active.length ||
      (type === 'VARIABLE' && new Set(active.map(v => v.cor.trim().toLowerCase() + '|' + v.tamanho.trim().toLowerCase())).size !== active.length)) {
      setValidation('Cada SKU e cada combinação de cor e tamanho devem ser únicos.'); return;
    }
    const cores = [...new Set(active.map(v => v.cor.trim()))]; const tamanhos = [...new Set(active.map(v => v.tamanho.trim()))];
    if (cores.length > 50 || tamanhos.length > 50) { setValidation('Cada opção aceita no máximo 50 valores.'); return; }
    setValidation('');
    const base = { name: name.trim(), description: description.trim(), state: 'PUBLISHED' as const, ...(categoryId ? { categoryId } : {}) };
    if (type === 'SIMPLE') create.mutate({ ...base, type, sku: active[0].sku.trim(), price: moneyValue(active[0].price)!, stock: Number(active[0].stock) });
    else create.mutate({ ...base, type, options: [{ name: 'cor', values: cores }, { name: 'tamanho', values: tamanhos }],
      variants: active.map(v => ({ sku: v.sku.trim(), price: moneyValue(v.price)!, stock: Number(v.stock), options: { cor: v.cor.trim(), tamanho: v.tamanho.trim() } })) });
  }
  return <Page><Text style={ui.title}>Uma nova peça</Text><Text style={ui.muted}>Cadastre um produto original para a coleção da Naike. O botão publica o produto na loja.</Text>
    <View style={ui.row}><Chip title="Variável" selected={type === 'VARIABLE'} disabled={create.isPending} onPress={() => setType('VARIABLE')} />
      <Chip title="Simples" selected={type === 'SIMPLE'} disabled={create.isPending} onPress={() => setType('SIMPLE')} /></View>
    <Field label="Nome do produto" value={name} onChangeText={setName} editable={!create.isPending} />
    <Field label="Descrição" value={description} onChangeText={setDescription} multiline editable={!create.isPending} />
    <Text style={ui.heading}>Categoria (opcional)</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      <Chip title="Sem categoria" selected={!categoryId} disabled={create.isPending} onPress={() => setCategoryId(undefined)} />
      {categories.data?.map(c => <Chip key={c.id} title={c.name} selected={c.id === categoryId} disabled={create.isPending} onPress={() => setCategoryId(c.id)} />)}</View>
    <ErrorNotice error={categories.error} />
    {(type === 'SIMPLE' ? variants.slice(0, 1) : variants).map((v, index) => <View key={v.key} style={ui.card}>
      <Text style={ui.heading}>{type === 'VARIABLE' ? 'Variante ' + (index + 1) : 'Dados de venda'}</Text>
      <Field label="SKU único" value={v.sku} onChangeText={s => update(v.key, 'sku', s)} autoCapitalize="characters" editable={!create.isPending} />
      <Field label="Preço (R$)" value={v.price} onChangeText={s => update(v.key, 'price', s)} keyboardType="decimal-pad" editable={!create.isPending} />
      <Field label="Estoque inicial" value={v.stock} onChangeText={s => update(v.key, 'stock', s)} keyboardType="number-pad" editable={!create.isPending} />
      {type === 'VARIABLE' && <><Field label="Cor" value={v.cor} onChangeText={s => update(v.key, 'cor', s)} editable={!create.isPending} />
        <Field label="Tamanho" value={v.tamanho} onChangeText={s => update(v.key, 'tamanho', s)} editable={!create.isPending} /></>}
      {type === 'VARIABLE' && variants.length > 1 && <Button title="Remover variante" secondary disabled={create.isPending} onPress={() => setVariants(all => all.filter(item => item.key !== v.key))} />}
    </View>)}
    {type === 'VARIABLE' && <Button title="Adicionar outra variante" secondary disabled={create.isPending} onPress={() => { setVariants(all => [...all, emptyVariant(nextKey)]); setNextKey(k => k + 1); }} />}
    {validation && <Notice tone="error" text={validation} />}<ErrorNotice error={create.error} />
    {create.isSuccess && <Notice tone="success" text={'Produto “' + create.data.name + '” cadastrado. Adicione imagens pelo painel da loja para completar a apresentação.'} />}
    <Button title={create.isSuccess ? 'Produto cadastrado' : 'Publicar produto'} loading={create.isPending} disabled={create.isSuccess} onPress={submit} />
    {create.isSuccess && <Button title="Cadastrar outro produto" secondary onPress={() => { create.reset(); setName(''); setDescription(''); setVariants([emptyVariant(0)]); setNextKey(1); }} />}
  </Page>;
}
