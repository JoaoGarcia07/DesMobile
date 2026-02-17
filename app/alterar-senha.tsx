import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from './_layout'; // Importação do tema global

export default function AlterarSenhaScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');

  const theme = {
    bg: isDarkMode ? '#121212' : '#F8F9FA',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#333333',
    input: isDarkMode ? '#2D2D2D' : '#F0F0F0'
  };

  const handleUpdatePassword = () => {
    if (novaSenha.length < 6) {
      Alert.alert("Erro", "A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    // Aqui no futuro faremos a chamada para o seu IP .85
    Alert.alert("Sucesso", "Senha alterada com sucesso!");
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color={theme.text} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: theme.text }]}>Alterar Senha</Text>
      
      {/* O erro sumiu porque agora 'form' existe no StyleSheet abaixo */}
      <View style={styles.form}>
        <Text style={[styles.label, { color: theme.text }]}>Senha Atual</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
          secureTextEntry
          placeholderTextColor="#888"
          value={senhaAtual}
          onChangeText={setSenhaAtual}
        />

        <Text style={[styles.label, { color: theme.text, marginTop: 20 }]}>Nova Senha</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
          secureTextEntry
          placeholderTextColor="#888"
          value={novaSenha}
          onChangeText={setNovaSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
          <Text style={styles.buttonText}>Atualizar Senha</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25 },
  backBtn: { marginTop: 40, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  form: { marginTop: 10 }, // ESSA LINHA CORRIGE O ERRO
  label: { fontSize: 16, marginBottom: 8, fontWeight: '500' },
  input: { padding: 15, borderRadius: 12, fontSize: 16 },
  button: { backgroundColor: '#6b8e23', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 40 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});