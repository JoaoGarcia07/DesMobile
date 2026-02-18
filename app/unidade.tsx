import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from './_layout'; // Caminho corrigido para evitar erros de importação

const { width } = Dimensions.get('window');

export default function UnidadeScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    accent: '#6b8e23',
    border: isDarkMode ? '#334155' : '#E2E8F0',
  };

  const membros = [
    { id: '1', nome: 'João Garcia', cargo: 'Conselheiro (ADM)', foto: 'https://avatar.iran.liara.run/public/boy?1', color: '#EF4444' },
    { id: '2', nome: 'Arthur Vieira', cargo: 'Capitão', foto: 'https://avatar.iran.liara.run/public/boy?2', color: '#F59E0B' },
    { id: '3', nome: 'Silas Tristoni', cargo: 'Secretário', foto: 'https://avatar.iran.liara.run/public/boy?3', color: '#10B981' },
    { id: '4', nome: 'Felipe Fernando', cargo: 'Tesoureiro', foto: 'https://avatar.iran.liara.run/public/boy?4', color: '#3B82F6' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header Elite - Título no topo */}
      <LinearGradient colors={[theme.accent, '#0F172A']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MINHA UNIDADE</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Card de Status da Unidade Gamificado */}
        <View style={[styles.statsRow, { backgroundColor: theme.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.accent }]}>4</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>MEMBROS</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.accent }]}>1.250</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>PONTOS XP</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Membros da Equipe</Text>

        <FlatList
          data={membros}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.membroCard, { backgroundColor: theme.card }]}
              activeOpacity={0.8}
            >
              <View style={styles.membroInfo}>
                <View style={[styles.avatarWrapper, { borderColor: item.color }]}>
                  <Image source={{ uri: item.foto }} style={styles.avatar} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={[styles.nome, { color: theme.text }]}>{item.nome}</Text>
                  <Text style={[styles.cargo, { color: item.color }]}>{item.cargo}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.chatBtn}>
                <Ionicons name="chatbubble-ellipses" size={20} color={theme.accent} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    height: 120, 
    paddingTop: 15, 
    paddingHorizontal: 20, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12, marginRight: 15 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  content: { flex: 1, padding: 20 },
  statsRow: { 
    flexDirection: 'row', 
    padding: 22, 
    borderRadius: 25, 
    marginBottom: 30, 
    elevation: 8, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10,
    marginTop: -40, // Efeito de flutuação sobre o header
    alignItems: 'center'
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '900' },
  statLabel: { fontSize: 10, fontWeight: '800', marginTop: 4, letterSpacing: 1 },
  statDivider: { width: 1, height: '60%' },
  sectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 15, marginLeft: 5, textTransform: 'uppercase', letterSpacing: 1 },
  list: { paddingBottom: 20 },
  membroCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 15, 
    borderRadius: 22, 
    marginBottom: 12, 
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05
  },
  membroInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarWrapper: { padding: 2, borderRadius: 30, borderWidth: 2 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EEE' },
  textContainer: { marginLeft: 15 },
  nome: { fontSize: 16, fontWeight: 'bold' },
  cargo: { fontSize: 12, marginTop: 2, fontWeight: '800', textTransform: 'uppercase' },
  chatBtn: { padding: 10, backgroundColor: 'rgba(107, 142, 35, 0.1)', borderRadius: 12 }
});