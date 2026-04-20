import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import api, { clearSession, isUnauthorizedError } from '../../api';
import { useAppSync, useTheme } from '../_layout';
import { SyncNowButton } from '../../components/SyncNowButton';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { refreshVersion, triggerRefresh, isRefreshing } = useAppSync();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({
    desbravador: 'Desbravador',
    unidade: 'Sem unidade atribuida',
    atividadesPendentes: 0,
    totalXp: 0,
    membros: 0,
    proximaMissao: null as any,
  });

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    accent: '#6b8e23',
  };

  useEffect(() => {
    let active = true;

    const loadHome = async () => {
      try {
        const now = new Date();
        const [profileResponse, groupResponse, tasksResponse] = await Promise.all([
          api.get('/api/profile/me'),
          api.get('/api/groups/me').catch((error) => {
            if (error?.response?.status === 404) {
              return { data: null };
            }

            throw error;
          }),
          api.get(`/api/tasks?year=${now.getFullYear()}&month=${now.getMonth() + 1}&size=10&sort=date,asc&sort=time,asc`),
        ]);

        if (!active) {
          return;
        }

        const profile = profileResponse.data || {};
        const groupPayload = groupResponse.data;
        const tasks = tasksResponse.data?.content || [];
        const fullName = [profile.name, profile.surname].filter(Boolean).join(' ') || profile.username || 'Desbravador';

        setInfo({
          desbravador: fullName,
          unidade: groupPayload?.group?.name || profile.group?.name || 'Sem unidade atribuida',
          atividadesPendentes: tasks.length,
          totalXp: groupPayload?.totalXp || profile.xp || 0,
          membros: groupPayload?.members?.length || 0,
          proximaMissao: tasks[0] || null,
        });
      } catch (error) {
        console.log('Erro na Home:', error);

        if (isUnauthorizedError(error)) {
          await clearSession();
          router.replace('/');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadHome();

    return () => {
      active = false;
    };
  }, [router, refreshVersion]);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  const nextMissionText = info.proximaMissao
    ? `${info.proximaMissao.date} as ${String(info.proximaMissao.time || '').slice(0, 5)}`
    : 'Nenhuma missao agendada para este mes';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={triggerRefresh} tintColor={theme.accent} />}
    >
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000' }}
        style={styles.headerImage}
      >
        <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']} style={styles.overlay}>
          <View style={styles.searchWrapper}>
            <Ionicons name="search" size={20} color="#AAA" style={styles.searchIcon} />
            <TextInput placeholder="Pesquisar atividades..." placeholderTextColor="#AAA" style={styles.searchInput} />
          </View>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.content}>
        <View style={styles.welcomeRow}>
          <Text style={[styles.welcomeText, { color: theme.text }]}>Ola, {info.desbravador.split(' ')[0]}!</Text>
          <SyncNowButton
            label="Atualizar"
            onPress={triggerRefresh}
            loading={isRefreshing}
            accentColor={theme.accent}
            style={styles.syncButton}
          />
        </View>

        <TouchableOpacity style={styles.mainCardShadow} activeOpacity={0.9} onPress={() => router.push('/unidade-aguia' as any)}>
          <LinearGradient colors={['#2C3E50', '#000000']} style={styles.mainCardGradient}>
            <View style={styles.mainCardContent}>
              <View style={styles.shieldCircle}>
                <Ionicons name="shield-half" size={40} color="white" />
              </View>
              <View>
                <Text style={styles.mainCardTitle}>{info.unidade}</Text>
                <Text style={styles.mainCardSub}>
                  {info.membros} membro(s) • {info.totalXp} XP
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.3)" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={[styles.missionCard, { backgroundColor: theme.card }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.missionLabel, { color: theme.subText }]}>PROXIMA MISSAO</Text>
            <Text style={[styles.missionTitle, { color: theme.text }]}>
              {info.proximaMissao?.title || 'Calendario em dia'}
            </Text>
            <Text style={[styles.missionSub, { color: theme.subText }]}>{nextMissionText}</Text>
          </View>
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>{info.atividadesPendentes}</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <ShortcutCard title="Unidade" icon="people" color="#FF9F43" onPress={() => router.push('/unidade' as any)} theme={theme} />
          <ShortcutCard
            title="Especialidades"
            icon="ribbon"
            color="#00D2D3"
            onPress={() => router.push('/especialidades' as any)}
            theme={theme}
          />
          <ShortcutCard title="Agenda" icon="calendar" color="#54A0FF" onPress={() => router.push('/agenda' as any)} theme={theme} />
          <ShortcutCard title="Requisitos" icon="list" color="#10AC84" onPress={() => router.push('/requisitos' as any)} theme={theme} />
        </View>
      </View>
    </ScrollView>
  );
}

function ShortcutCard({ title, icon, color, onPress, theme }: any) {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: theme.card }]} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconBox, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={[styles.cardText, { color: theme.text }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerImage: { width: '100%', height: 260 },
  overlay: { flex: 1, justifyContent: 'center', padding: 20 },
  searchWrapper: { backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', borderRadius: 15, paddingHorizontal: 15, height: 50, elevation: 5 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#333', fontSize: 16 },
  content: {
    padding: 20,
    marginTop: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  syncButton: { minWidth: 112 },
  mainCardShadow: { borderRadius: 25, elevation: 8, marginBottom: 20 },
  mainCardGradient: { padding: 20, borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mainCardContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  shieldCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  mainCardTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  mainCardSub: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 },
  missionCard: { borderRadius: 22, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 20, elevation: 3 },
  missionLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  missionTitle: { fontSize: 17, fontWeight: 'bold', marginTop: 6 },
  missionSub: { marginTop: 6, fontSize: 13 },
  pendingBadge: { width: 54, height: 54, borderRadius: 18, backgroundColor: 'rgba(107, 142, 35, 0.15)', justifyContent: 'center', alignItems: 'center', marginLeft: 16 },
  pendingText: { color: '#6b8e23', fontSize: 20, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: (width - 55) / 2, height: 130, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 3 },
  iconBox: { width: 55, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  cardText: { fontWeight: 'bold', fontSize: 14 },
});
