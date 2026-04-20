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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import api from '../api';
import { createStudentTheme } from '../constants/tokens';
import { PasswordResetStatusDTO } from '../lib/desbravadores';
import { dispatchStudentNotifications } from '../lib/notifications';
import { readPasswordResetStatus, syncPasswordResetStatus } from '../lib/student-cache';
import { validateResetConfirmation } from '../lib/student-events';
import { useTheme } from './_layout';

const { width } = Dimensions.get('window');

type ResetMode = 'request' | 'confirm';

function statusLabel(status?: string | null) {
  switch (status) {
    case 'APPROVED':
      return 'Aprovado';
    case 'PENDING':
      return 'Aguardando aprovacao';
    case 'USED':
      return 'Concluido';
    case 'REJECTED':
      return 'Recusado';
    case 'EXPIRED':
      return 'Expirado';
    default:
      return 'Sem solicitacao';
  }
}

function statusColor(status?: string | null) {
  switch (status) {
    case 'APPROVED':
      return '#10B981';
    case 'PENDING':
      return '#F59E0B';
    case 'REJECTED':
      return '#EF4444';
    case 'USED':
      return '#3B82F6';
    default:
      return '#94A3B8';
  }
}

export default function RecuperarSenhaScreen() {
  const [mode, setMode] = useState<ResetMode>('request');
  const [username, setUsername] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [status, setStatus] = useState<PasswordResetStatusDTO | null>(null);
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const theme = createStudentTheme(isDarkMode);

  useEffect(() => {
    let active = true;
    const normalizedUsername = username.trim().toLowerCase();

    if (!normalizedUsername) {
      setStatus(null);
      return;
    }

    readPasswordResetStatus(normalizedUsername).then((value) => {
      if (active) {
        setStatus(value);
      }
    });

    return () => {
      active = false;
    };
  }, [username]);

  const handleCheckStatus = async () => {
    if (!username.trim()) {
      Alert.alert('Aviso', 'Informe seu identificador primeiro.');
      return;
    }

    try {
      setCheckingStatus(true);
      const nextStatus = await syncPasswordResetStatus(username, { notify: dispatchStudentNotifications });
      setStatus(nextStatus);
    } catch {
      Alert.alert('Erro', 'Nao foi possivel consultar o status da solicitacao agora.');
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleRequestReset = async () => {
    if (!username.trim()) {
      Alert.alert('Aviso', 'Por favor, digite seu identificador.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post('/auth/password-resets/request', {
        username: username.trim(),
      });

      const nextStatus = await syncPasswordResetStatus(username, { notify: dispatchStudentNotifications });
      setStatus(nextStatus);
      Alert.alert('Solicitacao enviada', response.data?.message || 'Aguardando aprovacao do diretor.');
      setMode('confirm');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Nao foi possivel enviar a solicitacao de redefinicao.';
      Alert.alert('Erro', message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmReset = async () => {
    if (!username.trim() || !resetCode.trim() || !newPassword || !confirmPassword) {
      Alert.alert('Aviso', 'Preencha identificador, codigo e a nova senha.');
      return;
    }

    const validation = validateResetConfirmation(newPassword, confirmPassword);
    if (validation) {
      Alert.alert('Erro', validation);
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post('/auth/password-resets/confirm', {
        username: username.trim(),
        resetCode: resetCode.trim().toUpperCase(),
        newPassword,
      });

      const nextStatus = await syncPasswordResetStatus(username, { notify: dispatchStudentNotifications });
      setStatus(nextStatus);

      Alert.alert('Senha redefinida', response.data?.message || 'Sua senha foi atualizada com sucesso.', [
        {
          text: 'Voltar ao login',
          onPress: () => router.replace('/'),
        },
      ]);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Nao foi possivel redefinir a senha.';
      Alert.alert('Erro', message);
    } finally {
      setSubmitting(false);
    }
  };

  const currentStatusColor = statusColor(status?.status);

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000' }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={[styles.logoCircle, { backgroundColor: theme.accent }]}>
            <Ionicons name="key-outline" size={50} color="white" />
          </View>
          <Text style={styles.title}>Recuperar acesso</Text>
          <Text style={styles.subtitle}>Solicite o codigo, acompanhe a aprovacao e redefina sua senha</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.tabRow}>
            <TouchableOpacity style={[styles.tabButton, mode === 'request' && styles.tabButtonActive]} onPress={() => setMode('request')}>
              <Text style={[styles.tabText, mode === 'request' && styles.tabTextActive]}>Solicitar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabButton, mode === 'confirm' && styles.tabButtonActive]} onPress={() => setMode('confirm')}>
              <Text style={[styles.tabText, mode === 'confirm' && styles.tabTextActive]}>Redefinir</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.infoText}>
            {mode === 'request'
              ? 'Informe seu identificador para que um diretor aprove a redefinicao e gere o codigo temporario.'
              : 'Com o codigo gerado pelo diretor, voce ja pode definir uma nova senha pelo app.'}
          </Text>

          <View style={[styles.statusCard, { borderColor: `${currentStatusColor}50` }]}>
            <View style={styles.statusHeader}>
              <Text style={styles.statusLabel}>Status atual</Text>
              <View style={[styles.statusBadge, { backgroundColor: `${currentStatusColor}20` }]}>
                <Text style={[styles.statusBadgeText, { color: currentStatusColor }]}>{statusLabel(status?.status)}</Text>
              </View>
            </View>
            <Text style={styles.statusCopy}>
              {status?.approvedAt
                ? `Aprovado em ${status.approvedAt}.`
                : status?.requestedAt
                  ? `Solicitado em ${status.requestedAt}.`
                  : 'Nenhuma solicitacao registrada ainda para este identificador.'}
            </Text>
            {status?.expiresAt ? <Text style={styles.statusCopy}>Expira em {status.expiresAt}.</Text> : null}
            <TouchableOpacity style={[styles.secondaryButton, checkingStatus && { opacity: 0.82 }]} onPress={handleCheckStatus} disabled={checkingStatus}>
              {checkingStatus ? <ActivityIndicator size="small" color={theme.accent} /> : <Text style={[styles.secondaryButtonText, { color: theme.accent }]}>Verificar aprovacao</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder="identificador"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {mode === 'confirm' ? (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  placeholder="codigo temporario"
                  style={styles.input}
                  value={resetCode}
                  onChangeText={setResetCode}
                  autoCapitalize="characters"
                  maxLength={10}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                <TextInput placeholder="nova senha" style={styles.input} value={newPassword} onChangeText={setNewPassword} secureTextEntry />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="checkmark-done-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  placeholder="confirmar nova senha"
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            </>
          ) : null}

          <TouchableOpacity
            style={[styles.button, submitting && { opacity: 0.82 }, { backgroundColor: theme.accent }]}
            onPress={mode === 'request' ? handleRequestReset : handleConfirmReset}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>{mode === 'request' ? 'SOLICITAR APROVACAO' : 'SALVAR NOVA SENHA'}</Text>
            )}
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
  header: { alignItems: 'center', marginBottom: 24 },
  logoCircle: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 5 },
  title: { fontSize: 30, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#ddd', textAlign: 'center', marginTop: 4 },
  card: { backgroundColor: 'white', width: width * 0.88, padding: 25, borderRadius: 25, elevation: 20 },
  tabRow: { flexDirection: 'row', backgroundColor: '#eef2f7', borderRadius: 16, padding: 4, marginBottom: 16 },
  tabButton: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  tabButtonActive: { backgroundColor: '#6b8e23' },
  tabText: { color: '#64748B', fontWeight: '800', fontSize: 13 },
  tabTextActive: { color: 'white' },
  infoText: { color: '#666', fontSize: 14, textAlign: 'center', marginBottom: 16, lineHeight: 20 },
  statusCard: { borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 16, backgroundColor: '#F8FAFC' },
  statusHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  statusLabel: { color: '#334155', fontWeight: '900', fontSize: 12, textTransform: 'uppercase' },
  statusBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  statusBadgeText: { fontSize: 11, fontWeight: '800' },
  statusCopy: { color: '#64748B', fontSize: 13, lineHeight: 18, marginTop: 2 },
  secondaryButton: { marginTop: 12, alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: '#EEF6E5' },
  secondaryButtonText: { fontSize: 12, fontWeight: '900' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f4f8', borderRadius: 15, paddingHorizontal: 15, marginBottom: 14 },
  icon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16 },
  button: { padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 8 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
});
