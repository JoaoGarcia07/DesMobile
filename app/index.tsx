import React, { useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, 
  ImageBackground, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Lembra de conferir se seu IP continua 192.168.100.90
      const response = await axios.post('http://192.168.100.90:3000/login', {
        email: email.trim().toLowerCase(),
        senha: senha.trim()
      });

      if (response.data.auth) {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erro ao conectar com o servidor.";
      Alert.alert("Acesso Negado", msg);
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000' }} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          {/* LOGO E TÍTULO */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons name="shield-checkmark" size={60} color="white" />
            </View>
            <Text style={styles.title}>Desbravadores</Text>
            <Text style={styles.subtitle}>Painel do Desbravador</Text>
          </View>

          {/* FORMULÁRIO */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#6b8e23" style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#6b8e23" style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#999"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.forgotPass}>
              <Text style={styles.forgotPassText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>ENTRAR</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* RODAPÉ */}
          <TouchableOpacity style={styles.footer}>
            <Text style={styles.footerText}>
              Não tem uma conta? <Text style={styles.footerLink}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center' },
  container: { paddingHorizontal: 30 },
  header: { alignItems: 'center', marginBottom: 50 },
  logoCircle: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: 'rgba(107, 142, 35, 0.9)', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'white'
  },
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', letterSpacing: 1 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 5 },
  form: { backgroundColor: 'white', padding: 25, borderRadius: 20, elevation: 10 },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F5F5F5', 
    borderRadius: 12, 
    marginBottom: 15,
    paddingHorizontal: 15
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, color: '#333', fontSize: 16 },
  forgotPass: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotPassText: { color: '#666', fontSize: 14 },
  button: { 
    backgroundColor: '#6b8e23', 
    height: 55, 
    borderRadius: 12, 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 3
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
  footer: { marginTop: 30, alignItems: 'center' },
  footerText: { color: 'white', fontSize: 14 },
  footerLink: { fontWeight: 'bold', textDecorationLine: 'underline' }
});