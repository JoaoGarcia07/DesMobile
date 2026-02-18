import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../_layout'; 

export default function ChamadaScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    accent: '#6b8e23',
  };

  // Lista de exemplo dos escoteiros/desbravadores
  const [membros, setMembros] = useState([
    { id: '1', nome: 'Ana Silva', presente: false },
    { id: '2', nome: 'Bruno Oliveira', presente: false },
    { id: '3', nome: 'Carlos Souza', presente: false },
    { id: '4', nome: 'Daniela Lima', presente: false },
    { id: '5', nome: 'Eduardo Costa', presente: false },
  ]);

  const togglePresenca = (id: string) => {
    setMembros(prev => prev.map(m => 
      m.id === id ? { ...m, presente: !m.presente } : m
    ));
  };

  const finalizarChamada = () => {
    const presentes = membros.filter(m => m.presente).length;
    Alert.alert(
      "Chamada Finalizada", 
      `Você marcou ${presentes} presentes. +50 XP de Liderança ganhos!`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header Premium seguindo o padrão das outras telas */}
      <LinearGradient colors={[theme.accent, '#0F172A']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CHAMADA DA UNIDADE</Text>
      </LinearGradient>

      <View style={styles.infoSection}>
        <Text style={[styles.dateText, { color: theme.text }]}>Sábado, 18 de Fev</Text>
        <Text style={[styles.subText, { color: theme.subText }]}>Marque quem compareceu à reunião hoje.</Text>
      </View>

      <FlatList
        data={membros}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.memberCard, { backgroundColor: theme.card }]} 
            onPress={() => togglePresenca(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.memberInfo}>
              <View style={[styles.avatarCircle, { backgroundColor: theme.accent + '20' }]}>
                <Text style={{ color: theme.accent, fontWeight: 'bold' }}>{item.nome[0]}</Text>
              </View>
              <Text style={[styles.memberName, { color: theme.text }]}>{item.nome}</Text>
            </View>
            <Ionicons 
              name={item.presente ? "checkbox" : "square-outline"} 
              size={28} 
              color={item.presente ? theme.accent : theme.subText} 
            />
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.footerBtn} onPress={finalizarChamada}>
        <LinearGradient colors={['#6b8e23', '#4a6318']} style={styles.gradientBtn}>
          <Text style={styles.btnText}>SALVAR PRESENÇAS</Text>
          <Ionicons name="cloud-upload-outline" size={20} color="white" style={{ marginLeft: 10 }} />
        </LinearGradient>
      </TouchableOpacity>
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
  headerTitle: { color: 'white', fontSize: 16, fontWeight: '900', letterSpacing: 1.5 },
  infoSection: { padding: 25 },
  dateText: { fontSize: 22, fontWeight: 'bold' },
  subText: { fontSize: 14, marginTop: 5 },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  memberCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 15, 
    borderRadius: 20, 
    marginBottom: 10,
    elevation: 3
  },
  memberInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  memberName: { fontSize: 16, fontWeight: '600' },
  footerBtn: { position: 'absolute', bottom: 30, left: 20, right: 20, borderRadius: 20, overflow: 'hidden', elevation: 8 },
  gradientBtn: { padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }
});