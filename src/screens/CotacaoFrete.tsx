import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, StyleSheet, Alert, ScrollView,
} from 'react-native';
import { useCotacaoFrete } from '../hooks/useCotacaoFrete';
import { OpcaoFrete } from '../types';

function nomeOpcao(opcao: OpcaoFrete): string {
  return opcao.service ?? opcao.name ?? opcao.carrier ?? 'Opção de frete';
}

function precoOpcao(opcao: OpcaoFrete): string | null {
  const preco = opcao.price ?? opcao.value;
  if (typeof preco !== 'number') return null;
  return `R$ ${preco.toFixed(2).replace('.', ',')}`;
}

function prazoOpcao(opcao: OpcaoFrete): string | null {
  const prazo = opcao.estimatedDays ?? opcao.deliveryDays ?? opcao.deadline;
  if (prazo === undefined || prazo === null) return null;
  return typeof prazo === 'number' ? `${prazo} dia(s) útil(eis)` : String(prazo);
}

export function CotacaoFrete() {
  const [cep, setCep] = useState('');

  const { mutate, isPending, data } = useCotacaoFrete();

  function enviar() {
    const somenteNumeros = cep.replace(/\D/g, '');

    if (somenteNumeros.length !== 8) {
      Alert.alert('Atenção', 'Informe um CEP válido com 8 dígitos.');
      return;
    }

    mutate(
      { cepDestino: somenteNumeros },
      {
        onError: (erro) => {
          Alert.alert('Erro ao calcular frete', erro.message);
        },
      }
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>Cotar Frete</Text>
      <Text style={styles.subtitulo}>Consulte as opções de entrega para um CEP</Text>

      <Text style={styles.label}>CEP de destino</Text>
      <TextInput
        style={styles.input}
        value={cep}
        onChangeText={setCep}
        placeholder="ex: 01310930"
        keyboardType="numeric"
        maxLength={9}
      />

      {data && data.length > 0 && (
        <View style={styles.resultado}>
          <Text style={styles.resultadoTitulo}>Opções de frete</Text>
          {data.map((opcao, indice) => (
            <View key={indice} style={styles.opcaoFrete}>
              <Text style={styles.opcaoFreteNome}>{nomeOpcao(opcao)}</Text>
              {precoOpcao(opcao) !== null && (
                <Text style={styles.resultadoTexto}>Valor: {precoOpcao(opcao)}</Text>
              )}
              {prazoOpcao(opcao) !== null && (
                <Text style={styles.resultadoTexto}>Prazo: {prazoOpcao(opcao)}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {data && data.length === 0 && (
        <View style={styles.resultado}>
          <Text style={styles.resultadoTexto}>Nenhuma opção de frete encontrada para este CEP.</Text>
        </View>
      )}

      <TouchableOpacity style={styles.btnEnviar} onPress={enviar} disabled={isPending}>
        {isPending
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnEnviarTexto}>Calcular frete</Text>}
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
  opcaoFrete: {
    marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#c8e6c9',
  },
  opcaoFreteNome: { fontWeight: 'bold', color: '#2e7d32', fontSize: 15 },
  btnEnviar: {
    backgroundColor: '#050061', borderRadius: 8,
    padding: 14, alignItems: 'center', marginTop: 24,
  },
  btnEnviarTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
