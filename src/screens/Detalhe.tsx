import React from 'react';
import { View, Text, ActivityIndicator, Button, StyleSheet } from 'react-native';
import { useProduto } from '../hooks/useProduto';

export function Detalhe({ route }: any) {
  const { id } = route.params;
  const { data, isLoading, error, refetch } = useProduto(id);

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

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{data.name}</Text>
      <Text style={styles.description}>{data.description}</Text>
      <Text style={styles.price}>Preço: R$ {data.variants[0]?.price?.toFixed(2) ?? 'N/A'}</Text>
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