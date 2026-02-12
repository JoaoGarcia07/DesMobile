import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.100.90:3000/login', {
        // O .trim() remove espaços e o .toLowerCase() deixa tudo minúsculo
        email: email.trim().toLowerCase(), 
        senha: senha.trim()
      });
  
      if (response.data.auth) {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      // O ": any" avisa ao TypeScript para não reclamar
      const mensagemErro = error.response?.data?.message || "Erro desconhecido";
      console.log("Detalhes do erro no servidor:", mensagemErro);
      
      Alert.alert("Erro", "Acesso negado. Verifique e-mail e senha.");
  }
  };
  return (
    <View style={styles.container}>
      {/* Aqui você pode colocar o logo depois */}
      <View style={styles.logoCircle}>
         <Text style={styles.logoText}>D</Text>
      </View>

      <Text style={styles.welcomeText}>Bem-vindo, Desbravador!</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#999"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          onChangeText={setSenha}
          value={senha}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ENTRAR</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotText}>Esqueceu a senha?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#002a52', alignItems: 'center', justifyContent: 'center', padding: 30 },
  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  logoText: { fontSize: 50, fontWeight: 'bold', color: '#002a52' },
  welcomeText: { fontSize: 22, color: '#fff', fontWeight: 'bold', marginBottom: 30 },
  inputContainer: { width: '100%', marginBottom: 20 },
  input: { width: '100%', backgroundColor: '#fff', padding: 15, borderRadius: 5, marginBottom: 15, fontSize: 16 },
  button: { width: '100%', backgroundColor: '#ffcc00', padding: 15, borderRadius: 5, alignItems: 'center', elevation: 3 },
  buttonText: { color: '#002a52', fontWeight: 'bold', fontSize: 18 },
  forgotText: { color: '#fff', marginTop: 20, textDecorationLine: 'underline' }
});