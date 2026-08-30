import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, StyleSheet, Alert, ScrollView,
} from 'react-native';
import { useConfigurarWebhook } from '../hooks/useConfigurarWebhook';

const URL_REGEX = /^https?:\/\/[^\s]+\.[^\s]+$/i;

export function ConfigurarWebhook() {
  const [url, setUrl] = useState('');
  const [descricao, setDescricao] = useState('');

  const { mutate, isPending, data } = useConfigurarWebhook();

  function enviar() {
    if (!url.trim()) {
      Alert.alert('Atenção', 'Informe a URL do webhook.');
      return;
    }

    if (!URL_REGEX.test(url.trim())) {
      Alert.alert('Atenção', 'Informe uma URL válida (ex: https://seusite.com/webhook).');
      return;
    }

    mutate(
      {
        url: url.trim(),
        description: descricao.trim() || undefined,
      },
      {
        onSuccess: () => {
          Alert.alert('Webhook registrado!', 'Seu webhook foi cadastrado com sucesso.');
        },
        onError: (erro) => {
          Alert.alert('Erro ao registrar webhook', erro.message);
        },
      }
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>Configurar Webhook</Text>
      <Text style={styles.subtitulo}>Registre a URL pública que receberá os eventos</Text>

      <Text style={styles.label}>URL pública do webhook</Text>
      <TextInput
        style={styles.input}
        value={url}
        onChangeText={setUrl}
        placeholder="https://seusite.com/webhook"
        autoCapitalize="none"
        keyboardType="url"
      />

      <Text style={styles.label}>Descrição (opcional)</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="ex: Notificações de pedidos"
      />

      {data && (
        <View style={styles.resultado}>
          <Text style={styles.resultadoTitulo}>Webhook registrado</Text>
          {data.url && <Text style={styles.resultadoTexto}>URL: {data.url}</Text>}
          {data.description && <Text style={styles.resultadoTexto}>Descrição: {data.description}</Text>}
          {typeof data.signingSecret === 'string' && (
            <>
              <Text style={styles.resultadoTexto}>Chave de assinatura: {data.signingSecret}</Text>
              <Text style={styles.avisoTexto}>
                Guarde essa chave agora: ela é exibida apenas uma vez e não poderá ser recuperada depois.
              </Text>
            </>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.btnEnviar} onPress={enviar} disabled={isPending}>
        {isPending
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnEnviarTexto}>Registrar webhook</Text>}
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
  avisoTexto: { color: '#b26a00', fontSize: 12, marginTop: 8, fontStyle: 'italic' },
  btnEnviar: {
    backgroundColor: '#050061', borderRadius: 8,
    padding: 14, alignItems: 'center', marginTop: 24,
  },
  btnEnviarTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
