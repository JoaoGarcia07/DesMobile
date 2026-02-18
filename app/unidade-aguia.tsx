import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from './_layout'; //

export default function UnidadeAguiaScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const theme = {
    bg: isDarkMode ? '#121212' : '#F8F9FA',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#333333',
    subText: isDarkMode ? '#AAAAAA' : '#666666',
    accent: '#6b8e23'
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} showsVerticalScrollIndicator={false}>
      {/* Header com Botão Voltar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Unidade Águia</Text>
      </View>

      <View style={styles.content}>
        {/* Card do Grito de Guerra */}
        <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="megaphone-outline" size={24} color={theme.accent} />
            <Text style={[styles.cardTitle, { color: theme.text }]}>Grito de Guerra</Text>
          </View>
          <Text style={[styles.gritoText, { color: theme.subText }]}>
            "Nas alturas vamos voar, com a força de Deus vamos conquistar! Águia!"
          </Text>
        </View>

        {/* Card de Informações do ADM */}
        <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="ribbon-outline" size={24} color={theme.accent} />
            <Text style={[styles.cardTitle, { color: theme.text }]}>Objetivo da Unidade</Text>
          </View>
          <Text style={[styles.gritoText, { color: theme.subText }]}>
            Completar todas as classes regulares e avançadas até o Campori regional de 2026.
          </Text>
        </View>

        {/* Seção de Membros (Visão ADM) */}
        <Text style={[styles.sectionLabel, { color: theme.text }]}>Membros Ativos</Text>
        
        <MembroRow theme={theme} nome="João Garcia" cargo="Conselheiro" />
        <MembroRow theme={theme} nome="Arthur Vieira" cargo="Capitão" />
        <MembroRow theme={theme} nome="Silas Tristoni" cargo="Secretário" />
        <MembroRow theme={theme} nome="Felipe Fernando" cargo="Membro" />

      </View>
    </ScrollView>
  );
}

// Sub-componente para os membros
function MembroRow({ theme, nome, cargo }: any) {
  return (
    <View style={[styles.membroRow, { backgroundColor: theme.card }]}>
      <View style={styles.membroLeft}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={20} color="#999" />
        </View>
        <View>
          <Text style={[styles.membroNome, { color: theme.text }]}>{nome}</Text>
          <Text style={[styles.membroCargo, { color: theme.accent }]}>{cargo}</Text>
        </View>
      </View>
      <TouchableOpacity>
        <Ionicons name="ellipsis-vertical" size={20} color={theme.subText} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { marginTop: 60, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn: { marginRight: 15 },
  headerTitle: { fontSize: 26, fontWeight: 'bold' },
  content: { paddingHorizontal: 20 },
  infoCard: { padding: 20, borderRadius: 20, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardTitle: { marginLeft: 10, fontSize: 18, fontWeight: 'bold' },
  gritoText: { fontSize: 15, fontStyle: 'italic', lineHeight: 22 },
  sectionLabel: { fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 15 },
  membroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 15, marginBottom: 10 },
  membroLeft: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  membroNome: { fontSize: 16, fontWeight: 'bold' },
  membroCargo: { fontSize: 13, fontWeight: '600' }
});