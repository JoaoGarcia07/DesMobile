import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../_layout';
import api, { clearSession, isUnauthorizedError } from '../../api';

export default function AdicionarScreen() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    inputBg: isDarkMode ? '#2D3748' : '#F1F5F9',
    accent: '#6b8e23',
  };

  const salvarEvento = async () => {
    if (!titulo || !data || !hora) {
      Alert.alert("Erro", "Preencha pelo menos o título, a data e a hora.");
      return;
    }

    try {
      setSaving(true);

      await api.post('/api/tasks', {
        title: titulo,
        description: descricao,
        date: data,
        time: hora,
      });

      Alert.alert("Sucesso", "Missão cadastrada no sistema!");
      setTitulo('');
      setDescricao('');
      setData('');
      setHora('');
      router.push('/agenda');
    } catch (error: any) {
      if (isUnauthorizedError(error)) {
        await clearSession();
        router.replace('/');
        return;
      }

      const message = error?.response?.data || "Falha na comunicação com o backend.";
      Alert.alert("Erro", typeof message === 'string' ? message : "Falha na comunicação com o backend.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <LinearGradient colors={[theme.accent, '#0F172A']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NOVA MISSÃO</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <InputLabel theme={theme} label="Título da Atividade" value={titulo} onChange={setTitulo} icon="document-text-outline" placeholder="Ex: Acampamento de Unidade" />
          
          <InputLabel 
            theme={theme} 
            label="Descrição" 
            value={descricao} 
            onChange={setDescricao} 
            icon="chatbubble-ellipses-outline" 
            placeholder="Detalhes da missão..." 
            multiline 
          />

          <View style={styles.row}>
            <View style={{ flex: 1.2, marginRight: 15 }}>
              <InputLabel theme={theme} label="Data" value={data} onChange={setData} icon="calendar-outline" placeholder="AAAA-MM-DD" />
            </View>
            <View style={{ flex: 0.8 }}>
              <InputLabel theme={theme} label="Hora" value={hora} onChange={setHora} icon="time-outline" placeholder="HH:MM" />
            </View>
          </View>

          <TouchableOpacity style={[styles.button, saving && { opacity: 0.8 }]} onPress={salvarEvento} activeOpacity={0.8} disabled={saving}>
            <LinearGradient 
              colors={['#6b8e23', '#4a6318']} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 0 }} 
              style={styles.gradientButton}
            >
              <Ionicons name="add-circle-outline" size={24} color="white" />
              <Text style={styles.buttonText}>{saving ? 'Salvando...' : 'Cadastrar Missão'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function InputLabel({ theme, label, value, onChange, icon, placeholder, multiline }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.subText }]}>{label}</Text>
      <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg, alignItems: multiline ? 'flex-start' : 'center', paddingTop: multiline ? 15 : 0 }]}>
        <Ionicons name={icon} size={20} color={theme.subText} style={styles.inputIcon} />
        <TextInput 
          style={[styles.input, { color: theme.text, height: multiline ? 100 : 'auto', textAlignVertical: multiline ? 'top' : 'center' }]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={`${theme.subText}70`}
          multiline={multiline}
        />
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12, marginRight: 15 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  scrollContent: { padding: 25 },
  form: { marginTop: 10 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, marginBottom: 8, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrapper: { flexDirection: 'row', borderRadius: 18, paddingHorizontal: 15, elevation: 2 },
  inputIcon: { marginRight: 12, marginTop: 2 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16, fontWeight: '500' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { marginTop: 20, borderRadius: 20, overflow: 'hidden', elevation: 8, shadowColor: '#6b8e23', shadowOpacity: 0.3, shadowRadius: 10 },
  gradientButton: { flexDirection: 'row', padding: 18, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 10 }
});
