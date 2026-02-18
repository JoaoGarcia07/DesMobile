import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useTheme } from '../_layout'; // Ajustado para buscar no local correto

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
      {/* Topo com Gradiente e LVL Badge */}
      <LinearGradient colors={['#6b8e23', '#1E293B']} style={styles.headerGradient}>
        <View style={styles.avatarWrapper}>
          <Image 
            source={{ uri: 'https://avatar.iran.liara.run/public/boy?username=Joao' }} 
            style={styles.profileImage} 
          />
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>LVL 5</Text>
          </View>
        </View>
        <Text style={styles.userName}>João Garcia</Text>
        
        {/* BARRA DE XP (ESTILO GAME) */}
        <View style={styles.xpContainer}>
          <View style={styles.xpBarBackground}>
            <View style={[styles.xpBarFill, { width: '70%' }]} />
          </View>
          <Text style={styles.xpText}>750 / 1000 XP para LVL 6</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Atributos do Jogador */}
        <View style={[styles.statsRow, { backgroundColor: theme.card }]}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Especialidades</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.text }]}>4</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Classes</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.text }]}>A+</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Sangue</Text>
          </View>
        </View>

        {/* Cards de Missão/Info */}
        <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
          <Ionicons name="shield-half" size={24} color={theme.accent} />
          <View style={styles.infoTexts}>
            <Text style={[styles.infoLabel, { color: theme.subText }]}>Unidade</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>Águia</Text>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
          <Ionicons name="ribbon-outline" size={24} color={theme.accent} />
          <View style={styles.infoTexts}>
            <Text style={[styles.infoLabel, { color: theme.subText }]}>Cargo</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>Conselheiro</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Encerrar Sessão</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: { height: 300, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  avatarWrapper: { position: 'relative' },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: 'white' },
  levelBadge: { position: 'absolute', bottom: -2, right: -2, backgroundColor: '#FFD700', paddingHorizontal: 6, borderRadius: 8, borderWidth: 2, borderColor: 'white' },
  levelText: { fontSize: 10, fontWeight: 'bold', color: '#000' },
  userName: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  xpContainer: { width: '60%', marginTop: 15, alignItems: 'center' },
  xpBarBackground: { width: '100%', height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' },
  xpBarFill: { height: '100%', backgroundColor: '#FFD700' },
  xpText: { color: 'rgba(255,255,255,0.8)', fontSize: 10, marginTop: 5, fontWeight: 'bold' },
  content: { padding: 20, marginTop: -35 },
  statsRow: { flexDirection: 'row', borderRadius: 25, padding: 20, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, marginBottom: 20 },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 10, marginTop: 2 },
  divider: { width: 1, height: '70%', backgroundColor: 'rgba(0,0,0,0.05)', alignSelf: 'center' },
  infoCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 20, marginBottom: 12, elevation: 3 },
  infoTexts: { marginLeft: 15 },
  infoLabel: { fontSize: 11, fontWeight: 'bold' },
  infoValue: { fontSize: 15, fontWeight: '600' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, padding: 10 },
  logoutText: { color: '#EF4444', fontWeight: 'bold', marginLeft: 8 }
});