import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, StyleSheet, Alert, ScrollView,
} from 'react-native';
import { useCadastroCliente } from '../hooks/useCadastroCliente';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CadastroCliente() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [documento, setDocumento] = useState('');

  const { mutate, isPending } = useCadastroCliente();

  function enviar() {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha nome, e-mail e senha.');
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      Alert.alert('Atenção', 'Informe um e-mail válido.');
      return;
    }

    mutate(
      {
        name: nome.trim(),
        email: email.trim(),
        password: senha,
        document: documento.trim() || undefined,
      },
      {
        onSuccess: () => {
          Alert.alert('Conta criada!', 'Cadastro realizado com sucesso.');
          setNome('');
          setEmail('');
          setSenha('');
          setDocumento('');
        },
        onError: (erro) => {
          Alert.alert('Erro ao cadastrar', erro.message);
        },
      }
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>Cadastrar Cliente</Text>
      <Text style={styles.subtitulo}>Crie sua conta de cliente final</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="ex: Maria Silva"
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="ex: maria@email.com"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        placeholder="Crie uma senha"
        secureTextEntry
      />

      <Text style={styles.label}>Documento (opcional)</Text>
      <TextInput
        style={styles.input}
        value={documento}
        onChangeText={setDocumento}
        placeholder="CPF ou CNPJ"
      />

      <TouchableOpacity style={styles.btnEnviar} onPress={enviar} disabled={isPending}>
        {isPending
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnEnviarTexto}>Criar conta</Text>}
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
  btnEnviar: {
    backgroundColor: '#050061', borderRadius: 8,
    padding: 14, alignItems: 'center', marginTop: 24,
  },
  btnEnviarTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
