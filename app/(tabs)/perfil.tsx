import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useTheme } from '../_layout'; 

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
      
      {/* HEADER: STATUS DE JOGADOR COM XP DETALHADO */}
      <LinearGradient colors={['#6b8e23', '#0F172A']} style={styles.headerGradient}>
        <View style={styles.avatarWrapper}>
          <Image 
            source={{ uri: 'https://avatar.iran.liara.run/public/boy?username=Joao' }} 
            style={styles.profileImage} 
          />
          <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.levelBadge}>
            <Text style={styles.levelText}>LVL 5</Text>
          </LinearGradient>
        </View>
        
        <Text style={styles.userName}>João Garcia</Text>
        
        <View style={styles.xpContainer}>
          <View style={styles.xpBarBackground}>
            <View style={[styles.xpBarFill, { width: '75%' }]} />
          </View>
          <View style={styles.xpInfo}>
            <Text style={styles.xpText}>750 XP</Text>
            <Text style={styles.xpText}>1000 XP</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        
        {/* STATS DE ATRIBUTOS ESTILO DASHBOARD */}
        <View style={[styles.statsRow, { backgroundColor: theme.card }]}>
          <StatBox value="12" label="Especialid." theme={theme} />
          <View style={styles.divider} />
          <StatBox value="4" label="Classes" theme={theme} />
          <View style={styles.divider} />
          <StatBox value="A+" label="Sangue" theme={theme} />
        </View>

        {/* SEÇÃO DE MEDALHAS PROFISSIONAIS COM GRADIENTE METÁLICO */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Medalhas de Conquista</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScroll}>
          <ProfessionalBadge icon="flame" colors={['#FF416C', '#FF4B2B']} label="Fogo do Conselho" />
          <ProfessionalBadge icon="leaf" colors={['#00b09b', '#96c93d']} label="Ecovida" />
          <ProfessionalBadge icon="star" colors={['#f8ad42', '#d47e00']} label="Líder" />
          <ProfessionalBadge icon="shield-checkmark" colors={['#4facfe', '#00f2fe']} label="Sentinela" />
          <ProfessionalBadge icon="ribbon" colors={['#667eea', '#764ba2']} label="Mestre" />
        </ScrollView>

        {/* SEÇÃO DE MISSÕES COM DESCRIÇÃO E PROGRESSO */}
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>Missões da Jornada</Text>
            <Text style={{ color: theme.accent, fontWeight: 'bold' }}>Ver todas</Text>
        </View>
        
        <MissionItem 
            title="Leitura da Bíblia" 
            desc="Leia 5 capítulos de Gênesis" 
            progress={0.8} 
            icon="book" 
            theme={theme} 
        />
        <MissionItem 
            title="Especialidade de Nós" 
            desc="Complete os 10 nós básicos" 
            progress={0.4} 
            icon="infinite" 
            theme={theme} 
        />
        <MissionItem 
            title="Caminhada Noturna" 
            desc="Participe do percurso de 5km" 
            progress={1} 
            icon="walk" 
            theme={theme} 
            completed 
        />
        <MissionItem 
            title="Uniforme Impecável" 
            desc="Mantenha o lenço alinhado" 
            progress={0.1} 
            icon="shirt" 
            theme={theme} 
        />

        <TouchableOpacity style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Encerrar Sessão</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// COMPONENTES AUXILIARES

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
        <View style={styles.badgeInnerCircle}>
          <Ionicons name={icon} size={28} color="white" />
        </View>
      </LinearGradient>
      <Text style={styles.badgeLabel} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function MissionItem({ title, desc, progress, icon, theme, completed }: any) {
  return (
    <TouchableOpacity style={[styles.missionCard, { backgroundColor: theme.card }]}>
      <View style={[styles.missionIconBox, { backgroundColor: completed ? '#6b8e23' : 'rgba(107, 142, 35, 0.1)' }]}>
        <Ionicons name={icon} size={22} color={completed ? 'white' : '#6b8e23'} />
      </View>
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={[styles.missionTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.missionDesc, { color: theme.subText }]}>{desc}</Text>
        <View style={styles.miniBarBG}>
            <View style={[styles.miniBarFill, { width: `${progress * 100}%`, backgroundColor: completed ? '#6b8e23' : '#FFD700' }]} />
        </View>
      </View>
      {completed && <Ionicons name="checkmark-circle" size={24} color="#6b8e23" />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: { 
    height: 320, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderBottomLeftRadius: 50, 
    borderBottomRightRadius: 50 
  },
  avatarWrapper: { position: 'relative', elevation: 20 },
  profileImage: { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: 'white' },
  levelBadge: { 
    position: 'absolute', 
    bottom: -5, 
    right: -5, 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12, 
    borderWidth: 3, 
    borderColor: '#0F172A' 
  },
  levelText: { fontSize: 12, fontWeight: '900', color: '#000' },
  userName: { color: 'white', fontSize: 28, fontWeight: 'bold', marginTop: 15 },
  xpContainer: { width: '75%', marginTop: 20 },
  xpBarBackground: { 
    width: '100%', 
    height: 12, 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    borderRadius: 6, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.2)' 
  },
  xpBarFill: { height: '100%', backgroundColor: '#FFD700' },
  xpInfo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  xpText: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 'bold' },
  content: { padding: 20, marginTop: -40 },
  statsRow: { 
    flexDirection: 'row', 
    borderRadius: 25, 
    padding: 20, 
    elevation: 15, 
    shadowColor: '#000', 
    shadowOpacity: 0.2, 
    marginBottom: 30 
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold' },
  statLabel: { fontSize: 11, marginTop: 4, fontWeight: '600' },
  divider: { width: 1, height: '70%', backgroundColor: 'rgba(0,0,0,0.05)', alignSelf: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: '900', marginBottom: 15, marginLeft: 5 },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 30, 
    marginBottom: 15 
  },
  badgeScroll: { paddingBottom: 10 },
  badgeWrapper: { alignItems: 'center', marginRight: 18, width: 80 },
  badgeCircle: { width: 70, height: 70, borderRadius: 35, padding: 3, elevation: 8 },
  badgeInnerCircle: { 
    flex: 1, 
    borderRadius: 32, 
    backgroundColor: 'rgba(0,0,0,0.1)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.3)' 
  },
  badgeLabel: { fontSize: 10, color: '#888', fontWeight: 'bold', marginTop: 8, textAlign: 'center' },
  missionCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 22, 
    marginBottom: 12, 
    elevation: 4 
  },
  missionIconBox: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  missionTitle: { fontSize: 16, fontWeight: 'bold' },
  missionDesc: { fontSize: 12, marginBottom: 8 },
  miniBarBG: { width: '100%', height: 6, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 3, overflow: 'hidden' },
  miniBarFill: { height: '100%', borderRadius: 3 },
  logoutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 35, 
    paddingBottom: 30 
  },
  logoutText: { color: '#EF4444', fontWeight: 'bold', marginLeft: 10, fontSize: 16 }
});