import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, StyleSheet, Alert, ScrollView,
} from 'react-native';
import { useProcessarPagamento } from '../hooks/useProcessarPagamento';
import { useReembolso } from '../hooks/useReembolso';
import { MetodoPagamento } from '../types';

const METODOS: MetodoPagamento[] = ['PIX', 'CREDIT_CARD', 'BOLETO'];

export function Pagamento({ route }: any) {
  const { orderId } = route.params ?? {};
  const [metodo, setMetodo] = useState<MetodoPagamento>('CREDIT_CARD');
  const [simularRecusa, setSimularRecusa] = useState(false);

  const pagamento = useProcessarPagamento();
  const reembolso = useReembolso();

  function pagar() {
    if (!orderId) {
      Alert.alert('Atenção', 'orderId não informado.');
      return;
    }

    pagamento.mutate(
      {
        orderId,
        method: metodo,
        simulate: simularRecusa ? 'decline' : undefined,
      },
      {
        onSuccess: (resposta) => {
          if (resposta.status === 'DECLINED') {
            // Tratamento da recusa: mostra motivo e oferece nova tentativa
            Alert.alert(
              'Pagamento recusado',
              resposta.declineReason ?? 'O pagamento não foi aprovado. Tente outro método.'
            );
          } else {
            Alert.alert('Pagamento aprovado!', `Pedido ${resposta.orderId} confirmado.`);
          }
        },
        onError: (erro) => {
          Alert.alert('Erro ao processar pagamento', erro.message);
        },
      }
    );
  }

  function reembolsar() {
    if (!orderId) return;

    reembolso.mutate(
      { orderId },
      {
        onSuccess: (resposta) => {
          Alert.alert('Reembolso solicitado', `Status: ${resposta.status}`);
        },
        onError: (erro) => {
          Alert.alert('Erro ao reembolsar', erro.message);
        },
      }
    );
  }

  const recusado = pagamento.data?.status === 'DECLINED';

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>Pagamento</Text>
      <Text style={styles.subtitulo}>Pedido: {orderId ?? '—'}</Text>

      <Text style={styles.label}>Método de pagamento</Text>
      <View style={styles.metodosRow}>
        {METODOS.map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.metodoBtn, metodo === m && styles.metodoBtnAtivo]}
            onPress={() => setMetodo(m)}
          >
            <Text style={[styles.metodoTexto, metodo === m && styles.metodoTextoAtivo]}>
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setSimularRecusa((v) => !v)}
      >
        <View style={[styles.checkbox, simularRecusa && styles.checkboxAtivo]} />
        <Text style={styles.checkboxLabel}>Simular pagamento recusado (teste)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnPagar} onPress={pagar} disabled={pagamento.isPending}>
        {pagamento.isPending
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnTexto}>Pagar</Text>}
      </TouchableOpacity>

      {recusado && (
        <View style={styles.avisoRecusa}>
          <Text style={styles.avisoTitulo}>Pagamento recusado</Text>
          <Text style={styles.avisoTexto}>
            {pagamento.data?.declineReason ?? 'Tente outro método de pagamento.'}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.btnReembolso}
        onPress={reembolsar}
        disabled={reembolso.isPending || !orderId}
      >
        {reembolso.isPending
          ? <ActivityIndicator color="#050061" />
          : <Text style={styles.btnReembolsoTexto}>Reembolsar pedido</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#050061', marginTop: 8 },
  subtitulo: { fontSize: 14, color: '#666', marginBottom: 20 },
  label: { fontSize: 13, color: '#333', marginBottom: 8, marginTop: 12 },
  metodosRow: { flexDirection: 'row', gap: 8 },
  metodoBtn: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#fff',
  },
  metodoBtnAtivo: { backgroundColor: '#050061', borderColor: '#050061' },
  metodoTexto: { color: '#333', fontSize: 13 },
  metodoTextoAtivo: { color: '#fff', fontWeight: 'bold' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 1,
    borderColor: '#999', marginRight: 8,
  },
  checkboxAtivo: { backgroundColor: '#050061', borderColor: '#050061' },
  checkboxLabel: { color: '#333', fontSize: 13 },
  btnPagar: {
    backgroundColor: '#050061', borderRadius: 8,
    padding: 14, alignItems: 'center', marginTop: 24,
  },
  btnTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  avisoRecusa: {
    backgroundColor: '#ffebee', borderRadius: 8, padding: 12,
    marginTop: 16, borderWidth: 1, borderColor: '#ef9a9a',
  },
  avisoTitulo: { fontWeight: 'bold', color: '#c62828', marginBottom: 4 },
  avisoTexto: { color: '#333', fontSize: 14 },
  btnReembolso: {
    borderWidth: 1, borderColor: '#050061', borderRadius: 8,
    padding: 14, alignItems: 'center', marginTop: 16,
  },
  btnReembolsoTexto: { color: '#050061', fontSize: 15, fontWeight: 'bold' },
});