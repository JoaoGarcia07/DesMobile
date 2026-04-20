import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from './_layout';
import api, { clearSession, isUnauthorizedError } from '../api';

export default function AlterarSenhaScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [saving, setSaving] = useState(false);

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    inputBg: isDarkMode ? '#2D3748' : '#F1F5F9',
    accent: '#6b8e23',
  };

  const handleUpdatePassword = async () => {
    if (!senhaAtual || !novaSenha || !confirmacao) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (novaSenha !== confirmacao) {
      Alert.alert("Erro", "A confirmação da senha não confere.");
      return;
    }

    if (novaSenha.length < 8) {
      Alert.alert("Erro", "A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    try {
      setSaving(true);
      await api.post('/api/profile/me/change-password', {
        currentPassword: senhaAtual,
        newPassword: novaSenha,
      });

      Alert.alert("Sucesso", "Sua senha foi atualizada no sistema.");
      router.back();
    } catch (error: any) {
      if (isUnauthorizedError(error)) {
        await clearSession();
        router.replace('/');
        return;
      }

      const message = error?.response?.data || "Não foi possível atualizar a senha.";
      Alert.alert("Erro", message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <LinearGradient colors={[theme.accent, '#0F172A']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SEGURANÇA</Text>
        <View style={{ width: 40 }} /> 
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.introSection}>
          <View style={[styles.iconCircle, { backgroundColor: `${theme.accent}20` }]}>
            <Ionicons name="lock-closed" size={32} color={theme.accent} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>Alterar sua Senha</Text>
          <Text style={[styles.subtitle, { color: theme.subText }]}>
            Mantenha sua conta protegida com uma senha forte.
          </Text>
        </View>

        <View style={styles.form}>
          <PasswordField theme={theme} label="Senha Atual" value={senhaAtual} onChange={setSenhaAtual} />
          <PasswordField theme={theme} label="Nova Senha" value={novaSenha} onChange={setNovaSenha} />
          <PasswordField theme={theme} label="Confirmar Nova Senha" value={confirmacao} onChange={setConfirmacao} />

          <TouchableOpacity style={[styles.button, saving && { opacity: 0.8 }]} onPress={handleUpdatePassword} activeOpacity={0.8} disabled={saving}>
            <LinearGradient 
              colors={['#6b8e23', '#4a6318']} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 0 }} 
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>{saving ? 'Atualizando...' : 'Atualizar Senha'}</Text>
              <Ionicons name="checkmark-circle" size={20} color="white" style={{ marginLeft: 10 }} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function PasswordField({ theme, label, value, onChange }: any) {
  const [show, setShow] = useState(false);

  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.subText }]}>{label}</Text>
      <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg }]}>
        <Ionicons name="key-outline" size={20} color={theme.subText} style={styles.inputIcon} />
        <TextInput 
          style={[styles.input, { color: theme.text }]}
          secureTextEntry={!show}
          placeholder="••••••••"
          placeholderTextColor={`${theme.subText}70`}
          value={value}
          onChangeText={onChange}
        />
        <TouchableOpacity onPress={() => setShow(!show)}>
          <Ionicons name={show ? "eye-off-outline" : "eye-outline"} size={20} color={theme.subText} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    height: 120, 
    paddingTop: 45, 
    paddingHorizontal: 20, 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12 },
  headerTitle: { color: 'white', fontSize: 16, fontWeight: '900', letterSpacing: 1.5 },
  content: { flex: 1, paddingHorizontal: 25 },
  introSection: { alignItems: 'center', marginTop: 30, marginBottom: 20 },
  iconCircle: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  form: { marginTop: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, marginBottom: 8, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 15 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16, fontWeight: '500' },
  button: { marginTop: 30, borderRadius: 18, overflow: 'hidden', elevation: 5, shadowColor: '#6b8e23', shadowOpacity: 0.3, shadowRadius: 10 },
  gradientButton: { flexDirection: 'row', padding: 18, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
