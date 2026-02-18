import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from './_layout'; //

export default function UnidadeScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const theme = {
    overlay: isDarkMode ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.88)',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    accent: '#6b8e23',
    border: isDarkMode ? '#334155' : '#E2E8F0',
  };

  // Dados fictícios dos membros (No futuro virão do seu IP .85)
  const membros = [
    { id: '1', nome: 'João Garcia', cargo: 'Conselheiro (ADM)', foto: 'https://avatar.iran.liara.run/public/boy?1' },
    { id: '2', nome: 'Arthur Vieira', cargo: 'Capitão', foto: 'https://avatar.iran.liara.run/public/boy?2' },
    { id: '3', nome: 'Silas Tristoni', cargo: 'Secretário', foto: 'https://avatar.iran.liara.run/public/boy?3' },
    { id: '4', nome: 'Felipe Fernando', cargo: 'Tesoureiro', foto: 'https://avatar.iran.liara.run/public/boy?4' },
  ];

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1523733232020-a883f3e4c59e?q=80&w=1000' }} 
      style={styles.container}
    >
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.card }]}>
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Minha Unidade</Text>
            <Text style={[styles.headerSub, { color: theme.subText }]}>Unidade Águia</Text>
          </View>
        </View>

        {/* Resumo da Unidade */}
        <View style={[styles.statsRow, { backgroundColor: theme.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.accent }]}>4</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Membros</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.accent }]}>1.250</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Pontos</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Membros da Equipe</Text>

        <FlatList
          data={membros}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.membroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.membroInfo}>
                <Image source={{ uri: item.foto }} style={styles.avatar} />
                <View style={styles.textContainer}>
                  <Text style={[styles.nome, { color: theme.text }]}>{item.nome}</Text>
                  <Text style={[styles.cargo, { color: theme.subText }]}>{item.cargo}</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="chatbubble-ellipses-outline" size={22} color={theme.accent} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, paddingHorizontal: 20 },
  header: { marginTop: 60, flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  backBtn: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15, elevation: 4 },
  headerTitle: { fontSize: 26, fontWeight: 'bold' },
  headerSub: { fontSize: 14, fontWeight: '600' },
  statsRow: { flexDirection: 'row', padding: 20, borderRadius: 20, marginBottom: 25, elevation: 5, alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold' },
  statLabel: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  statDivider: { width: 1, height: '70%' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginLeft: 5 },
  list: { paddingBottom: 40 },
  membroCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 18, marginBottom: 12, borderWidth: 1, elevation: 2 },
  membroInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#EEE' },
  textContainer: { marginLeft: 15 },
  nome: { fontSize: 16, fontWeight: 'bold' },
  cargo: { fontSize: 13, marginTop: 2, fontWeight: '500' }
});