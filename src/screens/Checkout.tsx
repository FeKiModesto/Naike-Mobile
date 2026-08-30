import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  StyleSheet, Alert,
} from 'react-native';
import { useCheckout } from '../hooks/useCheckout';
import { usePagamento } from '../hooks/usePagamento';
import { useEmitirNFe } from '../hooks/useNFe';
import { Order, MetodoPagamento, NotaFiscal, ApiError } from '../types';

export function Checkout({ navigation }: any) {
  const [pedido, setPedido] = useState<Order | null>(null);
  const [nfe, setNfe] = useState<NotaFiscal | null>(null);
  const { mutate: fazerCheckout, isPending: carregandoCheckout } = useCheckout();
  const { mutate: pagar, isPending: carregandoPagamento } = usePagamento();
  const { mutate: emitirNFe, isPending: carregandoNFe } = useEmitirNFe();

  function iniciarCheckout() {
    fazerCheckout(undefined, {
      onSuccess: (novoPedido) => {
        setPedido(novoPedido);
      },
      onError: (erro) => {
        Alert.alert('Erro no checkout', (erro as ApiError).message ?? 'Verifique se há itens no carrinho.');
      },
    });
  }

  function pagarPedido(method: MetodoPagamento) {
    if (!pedido) return;

    pagar(
      { orderId: pedido.id, method },
      {
        onSuccess: (pedidoAtualizado) => {
          setPedido(pedidoAtualizado);
          if (pedidoAtualizado.status !== 'PAID') {
            Alert.alert('Pagamento não aprovado', `Status do pedido: ${pedidoAtualizado.status}`);
          }
        },
        onError: (erro) => {
          Alert.alert('Erro ao pagar', (erro as ApiError).message);
        },
      }
    );
  }

  function emitirNota() {
    if (!pedido) return;

    emitirNFe(pedido.id, {
      onSuccess: (notaFiscal) => {
        setNfe(notaFiscal);
        Alert.alert('NF-e emitida!', `Número: ${notaFiscal.number ?? notaFiscal.orderId}`);
      },
      onError: (erro) => {
        Alert.alert('Erro ao emitir NF-e', (erro as ApiError).message);
      },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Finalizar compra</Text>

      {!pedido && (
        <>
          <Text style={styles.texto}>
            O checkout cria o pedido a partir do seu carrinho e reserva o estoque.
          </Text>
          <TouchableOpacity style={styles.btn} onPress={iniciarCheckout} disabled={carregandoCheckout}>
            {carregandoCheckout
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnTexto}>Fazer checkout</Text>}
          </TouchableOpacity>
        </>
      )}

      {pedido && (
        <View style={styles.pedidoBox}>
          <Text style={styles.pedidoTitulo}>Pedido #{pedido.id}</Text>
          <Text style={styles.pedidoStatus}>Status: {pedido.status}</Text>

          {pedido.status === 'PENDING' && (
            <>
              <Text style={styles.texto}>Escolha a forma de pagamento:</Text>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => pagarPedido('PIX')}
                disabled={carregandoPagamento}
              >
                {carregandoPagamento
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.btnTexto}>Pagar com PIX</Text>}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnSecundario]}
                onPress={() => pagarPedido('CREDIT_CARD')}
                disabled={carregandoPagamento}
              >
                <Text style={styles.btnTexto}>Pagar com cartão</Text>
              </TouchableOpacity>
            </>
          )}

          {pedido.status === 'PAID' && !nfe && (
            <TouchableOpacity style={styles.btn} onPress={emitirNota} disabled={carregandoNFe}>
              {carregandoNFe
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnTexto}>Emitir NF-e</Text>}
            </TouchableOpacity>
          )}

          {nfe && (
            <View style={styles.nfeBox}>
              <Text style={styles.nfeTitulo}>NF-e emitida</Text>
              {nfe.number && <Text style={styles.texto}>Número: {nfe.number}</Text>}
              {nfe.key && <Text style={styles.texto}>Chave: {nfe.key}</Text>}
              <TouchableOpacity
                style={[styles.btn, styles.btnSecundario]}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.btnTexto}>Voltar para a home</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#050061', marginBottom: 16 },
  texto: { fontSize: 14, color: '#444', marginBottom: 16 },
  btn: {
    backgroundColor: '#050061', borderRadius: 8,
    padding: 14, alignItems: 'center', marginBottom: 12,
  },
  btnSecundario: { backgroundColor: '#333' },
  btnTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  pedidoBox: { marginTop: 12 },
  pedidoTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  pedidoStatus: { fontSize: 14, color: '#666', marginBottom: 16 },
  nfeBox: { marginTop: 16, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 16 },
  nfeTitulo: { fontSize: 16, fontWeight: 'bold', color: '#050061', marginBottom: 8 },
});