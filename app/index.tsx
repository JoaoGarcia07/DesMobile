import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import api, { clearSession, getCachedApiBaseUrl, resolveApiBaseUrl, restoreSession, setAuthToken } from '../api';
import { buildLoginPayload } from '../lib/student-events';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const bootstrapSession = async () => {
      try {
        const token = await restoreSession();

        if (token) {
          await api.get('/api/profile/me');

          if (active) {
            router.replace('/(tabs)');
            return;
          }
        }
      } catch {
        await clearSession();
      } finally {
        if (active) {
          setCheckingSession(false);
        }
      }
    };

    bootstrapSession();

    return () => {
      active = false;
    };
  }, [router]);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Aviso', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      setSubmitting(true);
      await resolveApiBaseUrl(true);

      const response = await api.post('/auth/login', buildLoginPayload(identifier, password));
      if (!response.data?.token) {
        throw new Error('Resposta de autenticacao invalida.');
      }

      await setAuthToken(response.data.token);
      router.replace('/(tabs)');
    } catch (error: any) {
      await clearSession();

      if (error?.response?.status === 401) {
        Alert.alert('Acesso negado', 'Usuario ou senha invalidos.');
      } else {
        const apiHost = getCachedApiBaseUrl() || 'http://<host>:8080';
        Alert.alert(
          'Erro de conexao',
          `Nao foi possivel localizar o backend do DesbravadoresTeste em ${apiHost}. Inicie a API web na maquina host e tente novamente.`
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingSession) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6b8e23" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000' }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="shield-checkmark" size={60} color="white" />
          </View>
          <Text style={styles.title}>Desbravadores</Text>
          <Text style={styles.subtitle}>Painel do Desbravador</Text>
        </View>

        <View style={styles.loginCard}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="usuario"
              style={styles.input}
              onChangeText={setIdentifier}
              value={identifier}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="senha"
              style={styles.input}
              secureTextEntry
              onChangeText={setPassword}
              value={password}
            />
          </View>

          <TouchableOpacity style={styles.forgotPass} onPress={() => router.push('/recuperar')}>
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, submitting && styles.buttonDisabled]} onPress={handleLogin} disabled={submitting}>
            {submitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text style={styles.buttonText}>ENTRAR</Text>
                <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.registerText}>
          O cadastro do aluno e feito no <Text style={styles.boldText}>DesbravadoresTeste</Text> pelo administrador.
        </Text>

        <TouchableOpacity style={styles.helperButton} onPress={() => router.push('/cadastro')}>
          <Text style={styles.helperText}>Como cadastrar um novo usuario</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#6b8e23', justifyContent: 'center', alignItems: 'center', elevation: 10, marginBottom: 20 },
  title: { fontSize: 36, fontWeight: 'bold', color: 'white', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 },
  subtitle: { fontSize: 16, color: '#ddd', marginTop: 5 },
  loginCard: { backgroundColor: 'white', width: width * 0.85, padding: 25, borderRadius: 25, elevation: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f4f8', borderRadius: 15, marginBottom: 15, paddingHorizontal: 15 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#333' },
  forgotPass: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: { color: '#666', fontSize: 14 },
  button: { backgroundColor: '#6b8e23', flexDirection: 'row', padding: 18, borderRadius: 15, alignItems: 'center', justifyContent: 'center', elevation: 5 },
  buttonDisabled: { opacity: 0.8 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  buttonIcon: { marginLeft: 10 },
  registerText: { color: 'white', fontSize: 15, marginTop: 30, textAlign: 'center' },
  boldText: { fontWeight: 'bold', textDecorationLine: 'underline' },
  helperButton: { marginTop: 10 },
  helperText: { color: '#E2E8F0', fontSize: 14, textDecorationLine: 'underline' },
});
