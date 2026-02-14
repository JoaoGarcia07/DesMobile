import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../api'; // Importa sua configuração centralizada

const { width } = Dimensions.get('window');

export default function RecuperarSenhaScreen() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleRecuperar = async () => {
    if (!email) {
      Alert.alert("Aviso", "Por favor, digite seu e-mail.");
      return;
    }

    try {
      // Faz a chamada para a nova rota que criamos no server.js
      const response = await api.post('/recuperar-senha', { 
        email: email.trim().toLowerCase() 
      });

      if (response.data.success) {
        Alert.alert("Sucesso", "Se este e-mail estiver cadastrado, você receberá as instruções em breve.");
        router.back(); // Volta para a tela de Login
      }
    } catch (error) {
      console.error("Erro na recuperação:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000' }} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        {/* BOTÃO VOLTAR */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <View style={styles.header}>
           <View style={styles.logoCircle}>
            <Ionicons name="key-outline" size={50} color="white" />
          </View>
          <Text style={styles.title}>Recuperar</Text>
          <Text style={styles.subtitle}>Esqueceu sua senha?</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.infoText}>
            Informe seu e-mail abaixo. Enviaremos um link para você redefinir sua senha com segurança.
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
            <TextInput 
              placeholder="exemplo@email.com" 
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRecuperar}>
            <Text style={styles.buttonText}>ENVIAR INSTRUÇÕES</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  backButton: { position: 'absolute', top: 50, left: 20, padding: 10 },
  header: { alignItems: 'center', marginBottom: 30 },
  logoCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#6b8e23', justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 5 },
  title: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  subtitle: { fontSize: 16, color: '#ddd' },
  card: { backgroundColor: 'white', width: width * 0.85, padding: 25, borderRadius: 25, elevation: 20 },
  infoText: { color: '#666', fontSize: 14, textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f4f8', borderRadius: 15, paddingHorizontal: 15, marginBottom: 20 },
  icon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16 },
  button: { backgroundColor: '#6b8e23', padding: 18, borderRadius: 15, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});