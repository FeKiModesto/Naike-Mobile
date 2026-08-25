import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, StyleSheet, Alert,
} from 'react-native';
import { useProdutoVariavel } from '../hooks/useProdutoVariavel';

export function ProdutoVariavel({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [variantes, setVariantes] = useState([
    { sku: '', price: '', stock: '', cor: '', tamanho: '' },
  ]);

  const { mutate, isPending } = useProdutoVariavel();

  function atualizarVariante(index: number, campo: string, valor: string) {
    const novas = [...variantes];
    novas[index] = { ...novas[index], [campo]: valor };
    setVariantes(novas);
  }

  function adicionarVariante() {
    setVariantes([...variantes, { sku: '', price: '', stock: '', cor: '', tamanho: '' }]);
  }

  function removerVariante(index: number) {
    if (variantes.length === 1) return;
    setVariantes(variantes.filter((_, i) => i !== index));
  }

  function enviar() {
    if (!nome.trim() || !descricao.trim()) {
      Alert.alert('Atenção', 'Preencha nome e descrição.');
      return;
    }

    const variantesFormatadas = variantes.map((v) => ({
      sku: v.sku,
      price: parseFloat(v.price),
      stock: parseInt(v.stock, 10),
      attributes: { cor: v.cor, tamanho: v.tamanho },
    }));

    mutate(
      { name: nome, description: descricao, variants: variantesFormatadas },
      {
        onSuccess: (produto) => {
          Alert.alert('Sucesso!', `Produto "${produto.name}" criado com ${produto.variants.length} variante(s).`);
          navigation.goBack();
        },
        onError: (erro) => {
          Alert.alert('Erro', erro.message);
        },
      }
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>Produto Variável</Text>
      <Text style={styles.subtitulo}>Cadastre um produto com cor e tamanho</Text>

      <Text style={styles.label}>Nome do produto</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="ex: Tênis Air Force"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.inputMultiline]}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Descreva o produto..."
        multiline
        numberOfLines={3}
      />

      <Text style={styles.sectionTitle}>Variantes</Text>

      {variantes.map((v, index) => (
        <View key={index} style={styles.varianteCard}>
          <Text style={styles.varianteLabel}>Variante {index + 1}</Text>

          <Text style={styles.label}>SKU</Text>
          <TextInput
            style={styles.input}
            value={v.sku}
            onChangeText={(val) => atualizarVariante(index, 'sku', val)}
            placeholder="ex: SKU-AF-BRN-42"
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Preço (R$)</Text>
              <TextInput
                style={styles.input}
                value={v.price}
                onChangeText={(val) => atualizarVariante(index, 'price', val)}
                placeholder="299.90"
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Estoque</Text>
              <TextInput
                style={styles.input}
                value={v.stock}
                onChangeText={(val) => atualizarVariante(index, 'stock', val)}
                placeholder="10"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Cor</Text>
              <TextInput
                style={styles.input}
                value={v.cor}
                onChangeText={(val) => atualizarVariante(index, 'cor', val)}
                placeholder="Branco"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Tamanho</Text>
              <TextInput
                style={styles.input}
                value={v.tamanho}
                onChangeText={(val) => atualizarVariante(index, 'tamanho', val)}
                placeholder="42"
              />
            </View>
          </View>

          {variantes.length > 1 && (
            <TouchableOpacity onPress={() => removerVariante(index)} style={styles.btnRemover}>
              <Text style={styles.btnRemoverTexto}>Remover variante</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.btnAdicionar} onPress={adicionarVariante}>
        <Text style={styles.btnAdicionarTexto}>+ Adicionar variante</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnEnviar} onPress={enviar} disabled={isPending}>
        {isPending
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnEnviarTexto}>Criar produto</Text>}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#050061', marginTop: 8 },
  subtitulo: { fontSize: 14, color: '#666', marginBottom: 20 },
  label: { fontSize: 13, color: '#333', marginBottom: 4, marginTop: 8 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    borderRadius: 8, padding: 10, fontSize: 14,
  },
  inputMultiline: { height: 80, textAlignVertical: 'top' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#050061', marginTop: 24, marginBottom: 8 },
  varianteCard: {
    backgroundColor: '#fff', borderRadius: 10, padding: 12,
    marginBottom: 12, borderWidth: 1, borderColor: '#e0e0e0',
  },
  varianteLabel: { fontSize: 14, fontWeight: 'bold', color: '#444', marginBottom: 4 },
  row: { flexDirection: 'row', gap: 8 },
  halfInput: { flex: 1 },
  btnRemover: { marginTop: 10, alignSelf: 'flex-end' },
  btnRemoverTexto: { color: '#cc0000', fontSize: 13 },
  btnAdicionar: {
    borderWidth: 1, borderColor: '#050061', borderRadius: 8,
    padding: 12, alignItems: 'center', marginBottom: 12,
  },
  btnAdicionarTexto: { color: '#050061', fontWeight: 'bold' },
  btnEnviar: {
    backgroundColor: '#050061', borderRadius: 8,
    padding: 14, alignItems: 'center', marginTop: 8,
  },
  btnEnviarTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});