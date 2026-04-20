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

import { clearSession, isUnauthorizedError } from '../../api';
import { SyncNowButton } from '../../components/SyncNowButton';
import { createStudentTheme } from '../../constants/tokens';
import { getFullName } from '../../lib/desbravadores';
import { dispatchStudentNotifications } from '../../lib/notifications';
import { describeBundleTimestamp, readCachedOrFetchStudentBundle, readStudentNotifications, syncStudentBundle, type StudentBundle } from '../../lib/student-cache';
import { calculateLevelProgress } from '../../lib/student-events';
import { useAppSync, useTheme } from '../_layout';

const { width } = Dimensions.get('window');

type HomeState = {
  desbravador: string;
  unidade: string;
  atividadesPendentes: number;
  groupTotalXp: number;
  personalTotalXp: number;
  level: number;
  currentXp: number;
  xpForNextLevel: number;
  xpToNextLevel: number;
  membros: number;
  proximaMissao: { id: number; title?: string | null; date?: string | null; time?: string | null } | null;
  lastSync: string;
};

const initialState: HomeState = {
  desbravador: 'Desbravador',
  unidade: 'Sem unidade atribuida',
  atividadesPendentes: 0,
  groupTotalXp: 0,
  personalTotalXp: 0,
  level: 1,
  currentXp: 0,
  xpForNextLevel: 100,
  xpToNextLevel: 100,
  membros: 0,
  proximaMissao: null,
  lastSync: 'sem sincronizacao',
};

function toHomeState(bundle: StudentBundle | null): HomeState {
  if (!bundle) {
    return initialState;
  }

  const profile = bundle.profile;
  const xpSummary = bundle.xpSummary;
  const group = bundle.groupDetails;
  const tasks = bundle.tasks || [];

  return {
    desbravador: getFullName(profile),
    unidade: group?.group?.name || profile?.group?.name || 'Sem unidade atribuida',
    atividadesPendentes: tasks.length,
    groupTotalXp: group?.totalXp || xpSummary?.totalXp || profile?.totalXp || 0,
    personalTotalXp: xpSummary?.totalXp || profile?.totalXp || 0,
    level: xpSummary?.level || profile?.level || 1,
    currentXp: xpSummary?.currentXp || profile?.xp || 0,
    xpForNextLevel: xpSummary?.xpForNextLevel || 100,
    xpToNextLevel: xpSummary?.xpToNextLevel || 100,
    membros: group?.members?.length || 0,
    proximaMissao: tasks[0] || null,
    lastSync: describeBundleTimestamp(bundle),
  };
}

export default function HomeScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { refreshVersion, triggerRefresh, isRefreshing } = useAppSync();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<HomeState>(initialState);
  const [unreadCount, setUnreadCount] = useState(0);

  const theme = createStudentTheme(isDarkMode);

  useEffect(() => {
    let active = true;

    const loadHome = async () => {
      try {
        const cachedBundle = await readCachedOrFetchStudentBundle({ notify: dispatchStudentNotifications });
        const notifications = await readStudentNotifications();

        if (active) {
          setInfo(toHomeState(cachedBundle));
          setUnreadCount(notifications.filter((item) => !item.read).length);
          setLoading(false);
        }

        const freshBundle = await syncStudentBundle({ notify: dispatchStudentNotifications });
        const nextNotifications = await readStudentNotifications();

        if (!active) {
          return;
        }

        setInfo(toHomeState(freshBundle));
        setUnreadCount(nextNotifications.filter((item) => !item.read).length);
      } catch (error) {
        if (isUnauthorizedError(error)) {
          await clearSession();
          router.replace('/');
          return;
        }

        if (active) {
          setLoading(false);
        }
      }
    };

    loadHome();

    return () => {
      active = false;
    };
  }, [refreshVersion, router]);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  const nextMissionText = info.proximaMissao
    ? `${info.proximaMissao.date || 'sem data'} as ${String(info.proximaMissao.time || '').slice(0, 5) || '--:--'}`
    : 'Nenhuma missao agendada para este mes';
  const levelProgressPercent = Math.max(6, calculateLevelProgress(info.currentXp, info.xpForNextLevel));

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
        <LinearGradient colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.7)']} style={styles.overlay}>
          <View style={styles.searchWrapper}>
            <Ionicons name="search" size={20} color="#AAA" style={styles.searchIcon} />
            <TextInput placeholder="Pesquisar atividades..." placeholderTextColor="#AAA" style={styles.searchInput} />
          </View>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.content}>
        <View style={styles.welcomeRow}>
          <View style={styles.welcomeCopy}>
            <Text style={[styles.welcomeText, { color: theme.text }]}>Ola, {info.desbravador.split(' ')[0]}!</Text>
            <Text style={[styles.lastSyncText, { color: theme.subText }]}>Ultima sincronizacao: {info.lastSync}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.notificationButton, { backgroundColor: theme.card }]} onPress={() => router.push('/notificacoes' as any)}>
              <Ionicons name="notifications-outline" size={20} color={theme.text} />
              {unreadCount > 0 ? (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>{Math.min(unreadCount, 9)}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
            <SyncNowButton label="Atualizar" onPress={triggerRefresh} loading={isRefreshing} accentColor={theme.accent} style={styles.syncButton} />
          </View>
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
                  {info.membros} membro(s) • {info.groupTotalXp} XP
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.3)" />
          </LinearGradient>
        </TouchableOpacity>

        <LinearGradient colors={['#6b8e23', '#3c5d12']} style={styles.progressCard}>
          <View style={styles.progressCardHeader}>
            <View>
              <Text style={styles.progressKicker}>SUA TRILHA</Text>
              <Text style={styles.progressTitle}>Nivel {info.level}</Text>
            </View>
            <TouchableOpacity style={styles.totalXpBadge} onPress={() => router.push('/xp' as any)}>
              <Text style={styles.totalXpValue}>{info.personalTotalXp}</Text>
              <Text style={styles.totalXpLabel}>XP total</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.levelBarTrack}>
            <View style={[styles.levelBarFill, { width: `${levelProgressPercent}%` }]} />
          </View>
          <View style={styles.levelMetaRow}>
            <Text style={styles.levelMetaText}>{info.currentXp} / {info.xpForNextLevel} XP no nivel</Text>
            <Text style={styles.levelMetaText}>{info.xpToNextLevel} XP restantes</Text>
          </View>
        </LinearGradient>

        <View style={[styles.missionCard, { backgroundColor: theme.card }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.missionLabel, { color: theme.subText }]}>PROXIMA MISSAO</Text>
            <Text style={[styles.missionTitle, { color: theme.text }]}>{info.proximaMissao?.title || 'Calendario em dia'}</Text>
            <Text style={[styles.missionSub, { color: theme.subText }]}>{nextMissionText}</Text>
          </View>
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>{info.atividadesPendentes}</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <ShortcutCard title="Unidade" icon="people" color="#FF9F43" onPress={() => router.push('/unidade' as any)} theme={theme} />
          <ShortcutCard title="Especialidades" icon="ribbon" color="#00D2D3" onPress={() => router.push('/especialidades' as any)} theme={theme} />
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
  content: { padding: 20, marginTop: 10, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  welcomeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, marginTop: 5 },
  welcomeCopy: { flex: 1, marginRight: 12 },
  welcomeText: { fontSize: 24, fontWeight: 'bold' },
  lastSyncText: { marginTop: 4, fontSize: 12, fontWeight: '600' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  notificationButton: { width: 42, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  notificationBadge: { position: 'absolute', top: 5, right: 5, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  notificationBadgeText: { color: 'white', fontSize: 10, fontWeight: '900' },
  syncButton: { minWidth: 112 },
  mainCardShadow: { borderRadius: 25, elevation: 8, marginBottom: 16 },
  mainCardGradient: { padding: 20, borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mainCardContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  shieldCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  mainCardTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  mainCardSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },
  progressCard: { borderRadius: 24, padding: 18, marginBottom: 18, elevation: 4 },
  progressCardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 },
  progressKicker: { color: 'rgba(255,255,255,0.72)', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  progressTitle: { color: 'white', fontSize: 22, fontWeight: '800', marginTop: 6 },
  totalXpBadge: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: 'rgba(255,255,255,0.14)', minWidth: 92, alignItems: 'center' },
  totalXpValue: { color: 'white', fontSize: 18, fontWeight: '900' },
  totalXpLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 10, fontWeight: '700', marginTop: 3 },
  levelBarTrack: { height: 12, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.18)', overflow: 'hidden' },
  levelBarFill: { height: '100%', borderRadius: 999, backgroundColor: '#FFD84D' },
  levelMetaRow: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  levelMetaText: { color: 'rgba(255,255,255,0.82)', fontSize: 11, fontWeight: '700' },
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
