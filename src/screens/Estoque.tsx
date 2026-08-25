import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, StyleSheet, Alert, ScrollView,
} from 'react-native';
import { useEstoque } from '../hooks/useEstoque';

export function Estoque() {
  const [variantId, setVariantId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [motivo, setMotivo] = useState('');

  const { mutate, isPending, data } = useEstoque();

  function enviar() {
    if (!variantId.trim() || !quantidade.trim()) {
      Alert.alert('Atenção', 'Preencha o ID da variante e a quantidade.');
      return;
    }

    mutate(
      {
        variantId: variantId.trim(),
        quantity: parseInt(quantidade, 10),
        reason: motivo.trim() || 'Entrada manual',
      },
      {
        onSuccess: (res) => {
          Alert.alert(
            'Estoque atualizado!',
            `Antes: ${res.quantityBefore} → Depois: ${res.quantityAfter}`
          );
        },
        onError: (erro) => {
          Alert.alert('Erro', erro.message);
        },
      }
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>Gerenciar Estoque</Text>
      <Text style={styles.subtitulo}>Registre uma entrada de estoque para uma variante</Text>

      <Text style={styles.label}>ID da variante</Text>
      <TextInput
        style={styles.input}
        value={variantId}
        onChangeText={setVariantId}
        placeholder="ex: variant_abc123"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Quantidade a adicionar</Text>
      <TextInput
        style={styles.input}
        value={quantidade}
        onChangeText={setQuantidade}
        placeholder="ex: 50"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Motivo (opcional)</Text>
      <TextInput
        style={styles.input}
        value={motivo}
        onChangeText={setMotivo}
        placeholder="ex: Reposição de lote"
      />

      {data && (
        <View style={styles.resultado}>
          <Text style={styles.resultadoTitulo}>Última entrada registrada</Text>
          <Text style={styles.resultadoTexto}>Variante: {data.variantId}</Text>
          <Text style={styles.resultadoTexto}>
            Estoque: {data.quantityBefore} → {data.quantityAfter}
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.btnEnviar} onPress={enviar} disabled={isPending}>
        {isPending
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnEnviarTexto}>Registrar entrada</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#050061', marginTop: 8 },
  subtitulo: { fontSize: 14, color: '#666', marginBottom: 20 },
  label: { fontSize: 13, color: '#333', marginBottom: 4, marginTop: 12 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    borderRadius: 8, padding: 10, fontSize: 14,
  },
  resultado: {
    backgroundColor: '#e8f5e9', borderRadius: 8, padding: 12,
    marginTop: 20, borderWidth: 1, borderColor: '#a5d6a7',
  },
  resultadoTitulo: { fontWeight: 'bold', color: '#2e7d32', marginBottom: 6 },
  resultadoTexto: { color: '#333', fontSize: 14 },
  btnEnviar: {
    backgroundColor: '#050061', borderRadius: 8,
    padding: 14, alignItems: 'center', marginTop: 24,
  },
  btnEnviarTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});