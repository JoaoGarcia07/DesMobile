import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from './_layout'; // Caminho corrigido para evitar erro de cascata

const { width } = Dimensions.get('window');

export default function UnidadeAguiaScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    accent: '#6b8e23'
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header Premium com Título Elevado */}
      <LinearGradient colors={[theme.accent, '#0F172A']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>UNIDADE ÁGUIA</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          
          {/* Card do Grito de Guerra Estilizado */}
          <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBadge, { backgroundColor: theme.accent + '20' }]}>
                <Ionicons name="megaphone" size={22} color={theme.accent} />
              </View>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Grito de Guerra</Text>
            </View>
            <Text style={[styles.gritoText, { color: theme.subText }]}>
              "Nas alturas vamos voar, com a força de Deus vamos conquistar! Águia!"
            </Text>
          </View>

          {/* Card de Objetivo da Unidade */}
          <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBadge, { backgroundColor: '#3B82F620' }]}>
                <Ionicons name="ribbon" size={22} color="#3B82F6" />
              </View>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Objetivo da Unidade</Text>
            </View>
            <Text style={[styles.gritoText, { color: theme.subText }]}>
              Completar todas as classes regulares e avançadas até o Campori regional de 2026.
            </Text>
          </View>

          {/* Seção de Membros */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>Membros Ativos</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>4 Membros</Text>
            </View>
          </View>
          
          <MembroRow theme={theme} nome="João Garcia" cargo="Conselheiro" icon="shield-half" color="#EF4444" />
          <MembroRow theme={theme} nome="Arthur Vieira" cargo="Capitão" icon="star" color="#F59E0B" />
          <MembroRow theme={theme} nome="Silas Tristoni" cargo="Secretário" icon="document-text" color="#10B981" />
          <MembroRow theme={theme} nome="Felipe Fernando" cargo="Membro" icon="person" color="#94A3B8" />

        </View>
      </ScrollView>
    </View>
  );
}

function MembroRow({ theme, nome, cargo, icon, color }: any) {
  return (
    <TouchableOpacity style={[styles.membroRow, { backgroundColor: theme.card }]} activeOpacity={0.7}>
      <View style={styles.membroLeft}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <View>
          <Text style={[styles.membroNome, { color: theme.text }]}>{nome}</Text>
          <Text style={[styles.membroCargo, { color: color }]}>{cargo}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.subText} />
    </TouchableOpacity>
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
  scrollContent: { paddingBottom: 40 },
  content: { padding: 20 },
  infoCard: { padding: 20, borderRadius: 25, marginBottom: 15, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBadge: { padding: 8, borderRadius: 12, marginRight: 12 },
  cardTitle: { fontSize: 17, fontWeight: 'bold' },
  gritoText: { fontSize: 15, fontStyle: 'italic', lineHeight: 24, paddingLeft: 5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 15 },
  sectionLabel: { fontSize: 18, fontWeight: '900', marginLeft: 5 },
  countBadge: { backgroundColor: 'rgba(107, 142, 35, 0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  countText: { color: '#6b8e23', fontSize: 12, fontWeight: 'bold' },
  membroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 22, marginBottom: 10, elevation: 2 },
  membroLeft: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: { width: 46, height: 46, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  membroNome: { fontSize: 16, fontWeight: 'bold' },
  membroCargo: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', marginTop: 2 }
});