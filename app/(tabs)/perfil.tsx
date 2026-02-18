import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useTheme } from '../_layout'; // Caminho corrigido para subir um nível

const { width } = Dimensions.get('window');

export default function PerfilScreen() {
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
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} showsVerticalScrollIndicator={false}>
      
      {/* HEADER GAMER COM XP */}
      <LinearGradient colors={['#6b8e23', '#0F172A']} style={styles.headerGradient}>
        <View style={styles.avatarWrapper}>
          <View style={styles.profileImagePlaceholder}>
             <Ionicons name="person" size={50} color="white" />
          </View>
          <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.levelBadge}>
            <Text style={styles.levelText}>LVL 5</Text>
          </LinearGradient>
        </View>
        <Text style={styles.userName}>João Garcia</Text>
        
        <View style={styles.xpContainer}>
          <View style={styles.xpBarBackground}>
            <View style={[styles.xpBarFill, { width: '75%' }]} />
          </View>
          <Text style={styles.xpText}>750 / 1000 XP para LVL 6</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* STATS DE ATRIBUTOS */}
        <View style={[styles.statsRow, { backgroundColor: theme.card }]}>
          <StatBox value="12" label="Especialid." theme={theme} />
          <View style={styles.divider} />
          <StatBox value="4" label="Classes" theme={theme} />
          <View style={styles.divider} />
          <StatBox value="A+" label="Sangue" theme={theme} />
        </View>

        {/* MEDALHAS PROFISSIONAIS COM GRADIENTE */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Medalhas de Honra</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScroll}>
          <ProfessionalBadge icon="flame" colors={['#FF416C', '#FF4B2B']} label="Fogo" />
          <ProfessionalBadge icon="leaf" colors={['#00b09b', '#96c93d']} label="Natureza" />
          <ProfessionalBadge icon="star" colors={['#f8ad42', '#d47e00']} label="Líder" />
          <ProfessionalBadge icon="shield-checkmark" colors={['#4facfe', '#00f2fe']} label="Guarda" />
        </ScrollView>

        {/* MISSÕES DE JORNADA */}
        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 25 }]}>Missões Ativas</Text>
        
        <MissionItem title="Leitura Bíblica" progress={0.8} icon="book" theme={theme} />
        <MissionItem title="Especialidade de Nós" progress={0.4} icon="infinite" theme={theme} />
        <MissionItem title="Caminhada 5km" progress={1} icon="walk" theme={theme} completed />

        <TouchableOpacity style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Encerrar Sessão</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Componentes Auxiliares Estilizados
function StatBox({ value, label, theme }: any) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.subText }]}>{label}</Text>
    </View>
  );
}

function ProfessionalBadge({ icon, colors, label }: any) {
  return (
    <View style={styles.badgeWrapper}>
      <LinearGradient colors={colors} style={styles.badgeCircle}>
        <Ionicons name={icon} size={28} color="white" />
      </LinearGradient>
      <Text style={styles.badgeLabel}>{label}</Text>
    </View>
  );
}

function MissionItem({ title, progress, icon, theme, completed }: any) {
  return (
    <View style={[styles.missionCard, { backgroundColor: theme.card }]}>
      <View style={[styles.missionIconBox, { backgroundColor: completed ? '#6b8e23' : 'rgba(107,142,35,0.1)' }]}>
        <Ionicons name={icon} size={22} color={completed ? 'white' : '#6b8e23'} />
      </View>
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={[styles.missionTitle, { color: theme.text }]}>{title}</Text>
        <View style={styles.miniBarBG}>
          <View style={[styles.miniBarFill, { width: `${progress * 100}%`, backgroundColor: completed ? '#6b8e23' : '#FFD700' }]} />
        </View>
      </View>
      {completed && <Ionicons name="checkmark-circle" size={20} color="#6b8e23" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: { height: 300, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  avatarWrapper: { position: 'relative' },
  profileImagePlaceholder: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  levelBadge: { position: 'absolute', bottom: -5, right: -5, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, borderWidth: 2, borderColor: '#0F172A' },
  levelText: { fontSize: 10, fontWeight: 'bold', color: '#000' },
  userName: { color: 'white', fontSize: 26, fontWeight: 'bold', marginTop: 10 },
  xpContainer: { width: '70%', marginTop: 15, alignItems: 'center' },
  xpBarBackground: { width: '100%', height: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 5, overflow: 'hidden' },
  xpBarFill: { height: '100%', backgroundColor: '#FFD700' },
  xpText: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 6, fontWeight: 'bold' },
  content: { padding: 20, marginTop: -35 },
  statsRow: { flexDirection: 'row', borderRadius: 25, padding: 20, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, marginBottom: 25 },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 10, marginTop: 2, fontWeight: '600' },
  divider: { width: 1, height: '70%', backgroundColor: 'rgba(0,0,0,0.05)', alignSelf: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginLeft: 5 },
  badgeScroll: { flexDirection: 'row' },
  badgeWrapper: { alignItems: 'center', marginRight: 20 },
  badgeCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  badgeLabel: { fontSize: 11, color: '#888', fontWeight: 'bold', marginTop: 8 },
  missionCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 20, marginBottom: 10, elevation: 3 },
  missionIconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  missionTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 5 },
  miniBarBG: { width: '100%', height: 6, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 3, overflow: 'hidden' },
  miniBarFill: { height: '100%', borderRadius: 3 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30 },
  logoutText: { color: '#EF4444', fontWeight: 'bold', marginLeft: 10, fontSize: 16 }
});