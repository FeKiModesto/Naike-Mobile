import React from 'react';
import { View, Text, ActivityIndicator, Button, StyleSheet } from 'react-native';
import { useProduto } from '../hooks/useProduto';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useAdicionarAoCarrinho } from '../hooks/useCarrinho';
import { useAuth } from '../contexts/AuthContext';
import { showAlert } from '../utils/alert';

export function Detalhe({ route, navigation }: any) {
  const { id } = route.params;
  const { data, isLoading, error, refetch } = useProduto(id);

  
  const [quantidade, setQuantidade] = useState(1);
  const { isLoggedIn } = useAuth();
  const { mutate: adicionarAoCarrinho, isPending } = useAdicionarAoCarrinho();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#050061" />
        <Text>Carregando detalhes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro: {error.message}</Text>
        <Button title="Tentar novamente" onPress={() => refetch()} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centered}>
        <Text>Produto não encontrado.</Text>
      </View>
    );
  }


function handleAdicionarAoCarrinho() {
  if (!isLoggedIn) {
    showAlert('Login necessário', 'Faça login para adicionar ao carrinho.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Entrar', onPress: () => navigation.navigate('Login') },
    ]);
    return;
  }
  if (!data) return; 
  const variantId = data.variants[0]?.id;
  if (!variantId) { showAlert('Erro', 'Produto sem variante disponível.'); return; }
  adicionarAoCarrinho({ variantId, quantity: quantidade }, {
    onSuccess: () => showAlert('Adicionado!', 'Item no carrinho.', [
      { text: 'Continuar', style: 'cancel' },
      { text: 'Ir para checkout', onPress: () => navigation.navigate('Checkout') },
    ]),
    onError: (e: any) => showAlert('Erro', e.message),
  });
}

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{data.name}</Text>
      <Text style={styles.description}>{data.description}</Text>
      <Text style={styles.price}>Preço: R$ {data.variants[0]?.price?.toFixed(2) ?? 'N/A'}</Text>
      {/* Seletor de quantidade */}
<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 16 }}>
  <TouchableOpacity onPress={() => setQuantidade(q => Math.max(1, q - 1))}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#050061' }}>−</Text>
  </TouchableOpacity>
  <Text style={{ fontSize: 18 }}>{quantidade}</Text>
  <TouchableOpacity onPress={() => setQuantidade(q => q + 1)}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#050061' }}>+</Text>
  </TouchableOpacity>
</View>

<TouchableOpacity
  style={{ backgroundColor: '#050061', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 16 }}
  onPress={handleAdicionarAoCarrinho}
  disabled={isPending}
>
  {isPending
    ? <ActivityIndicator color="#fff" />
    : <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Adicionar ao carrinho</Text>}
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', marginBottom: 10 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#050061', marginBottom: 8 },
  description: { fontSize: 16, marginBottom: 8 },
  price: { fontSize: 18, fontWeight: 'bold', color: '#050061' },
});