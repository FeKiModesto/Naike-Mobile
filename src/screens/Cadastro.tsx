import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, StyleSheet,
} from 'react-native';
import { useCadastroCliente } from '../hooks/useCadastroCliente';
import { showAlert } from '../utils/alert';
import { ApiError } from '../types';

export function Cadastro({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: cadastrar, isPending } = useCadastroCliente();

  function enviar() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      showAlert('Atenção', 'Preencha nome, e-mail e senha.');
      return;
    }

    cadastrar(
      { name: name.trim(), email: email.trim(), password },
      {
        onSuccess: () => {
          showAlert('Cadastro realizado!', 'Agora faça login para continuar.', [
            { text: 'OK', onPress: () => navigation.replace('Login') },
          ]);
        },
        onError: (erro) => {
          showAlert('Erro ao cadastrar', (erro as ApiError).message ?? 'Tente novamente.');
        },
      }
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Criar conta</Text>
      <Text style={styles.subtitulo}>
        Cadastre-se para comprar na loja.
      </Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Seu nome"
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="cliente@email.com"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
      />

      <TouchableOpacity style={styles.btn} onPress={enviar} disabled={isPending}>
        {isPending
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnTexto}>Cadastrar</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Já tenho conta — entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#050061', marginTop: 8 },
  subtitulo: { fontSize: 14, color: '#666', marginBottom: 24 },
  label: { fontSize: 13, color: '#333', marginBottom: 4, marginTop: 12 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    borderRadius: 8, padding: 10, fontSize: 14,
  },
  btn: {
    backgroundColor: '#050061', borderRadius: 8,
    padding: 14, alignItems: 'center', marginTop: 24,
  },
  btnTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { color: '#050061', textAlign: 'center', marginTop: 16, fontSize: 13 },
});