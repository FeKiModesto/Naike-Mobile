import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, ActivityIndicator, RefreshControl, Button, StyleSheet } from 'react-native';
import { useProdutos } from '../hooks/useProdutos';

export function Listagem({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch, isFetching } = useProdutos(page, search);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#050061" />
        <Text>Carregando produtos...</Text>
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

  if (!data?.data.length) {
    return (
      <View style={styles.centered}>
        <Text>Nenhum produto encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Naike</Text>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar produtos..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={() => setPage(1)}
      />
      <FlatList
        data={data.data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text>{item.description?.slice(0, 80)}...</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={() => refetch()} />
        }
        onEndReached={() => {
          if (data.page < Math.ceil(data.total / data.pageSize)) {
            setPage(page + 1);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#050061', padding: 20, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  searchInput: { margin: 10, padding: 10, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', marginBottom: 10 },
  card: { backgroundColor: '#fff', margin: 10, padding: 15, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#050061' },
});