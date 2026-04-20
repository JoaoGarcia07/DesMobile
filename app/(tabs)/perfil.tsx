import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { clearSession, isUnauthorizedError, resolveAssetUrl } from '../../api';
import { createStudentTheme, studentGradients } from '../../constants/tokens';
import { AchievementItem, formatDateTime, formatXpAmount, getFullName, translateXpSource } from '../../lib/desbravadores';
import { dispatchStudentNotifications } from '../../lib/notifications';
import { describeBundleTimestamp, readCachedOrFetchStudentBundle, readStudentNotifications, syncStudentBundle, type StudentBundle } from '../../lib/student-cache';
import { calculateLevelProgress } from '../../lib/student-events';
import { useAppSync, useTheme } from '../_layout';

type ProfileViewState = {
  bundle: StudentBundle | null;
  avatarUrl: string | null;
  achievementIcons: Record<number, string>;
  unreadCount: number;
};

const initialState: ProfileViewState = {
  bundle: null,
  avatarUrl: null,
  achievementIcons: {},
  unreadCount: 0,
};

async function buildViewState(bundle: StudentBundle | null): Promise<Pick<ProfileViewState, 'bundle' | 'avatarUrl' | 'achievementIcons'>> {
  const profile = bundle?.profile;
  const achievements = profile?.achievements || [];
  const resolvedIcons = await Promise.all(
    achievements.map(async (achievement: AchievementItem) => ([
      achievement.id,
      achievement.icon ? await resolveAssetUrl(achievement.icon) : null,
    ] as const))
  );

  return {
    bundle,
    avatarUrl: await resolveAssetUrl(profile?.avatar),
    achievementIcons: resolvedIcons.reduce<Record<number, string>>((accumulator, [id, url]) => {
      if (id && url) {
        accumulator[id] = url;
      }
      return accumulator;
    }, {}),
  };
}

export default function PerfilScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { refreshVersion, isRefreshing, triggerRefresh } = useAppSync();
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<ProfileViewState>(initialState);

  const theme = createStudentTheme(isDarkMode);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const cachedBundle = await readCachedOrFetchStudentBundle({ notify: dispatchStudentNotifications });
        const cachedViewState = await buildViewState(cachedBundle);
        const notifications = await readStudentNotifications();

        if (active) {
          setState({
            ...cachedViewState,
            unreadCount: notifications.filter((item) => !item.read).length,
          });
          setLoading(false);
        }

        const freshBundle = await syncStudentBundle({ notify: dispatchStudentNotifications });
        const freshViewState = await buildViewState(freshBundle);
        const nextNotifications = await readStudentNotifications();

        if (!active) {
          return;
        }

        setState({
          ...freshViewState,
          unreadCount: nextNotifications.filter((item) => !item.read).length,
        });
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

    loadProfile();

    return () => {
      active = false;
    };
  }, [refreshVersion, router]);

  const handleLogout = async () => {
    await clearSession();
    router.replace('/');
  };

  if (loading) {
    return (
      <View style={[styles.loaderArea, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  const bundle = state.bundle;
  const profile = bundle?.profile || null;
  const xpSummary = bundle?.xpSummary || null;
  const requirements = bundle?.requirementsProgress;
  const specialties = bundle?.specialtiesProgress;
  const achievements = profile?.achievements || [];
  const fullName = getFullName(profile);
  const level = xpSummary?.level || profile?.level || 1;
  const currentXp = xpSummary?.currentXp || profile?.xp || 0;
  const xpForNextLevel = xpSummary?.xpForNextLevel || 100;
  const progressPercent = Math.max(8, calculateLevelProgress(currentXp, xpForNextLevel));
  const avatarSource = state.avatarUrl
    ? { uri: state.avatarUrl }
    : { uri: `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(profile?.username || 'desbravador')}` };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={triggerRefresh} tintColor={theme.accent} />}
    >
      <LinearGradient colors={studentGradients.hero} style={styles.headerGradient}>
        <View style={styles.topActions}>
          <TouchableOpacity style={styles.topAction} onPress={() => router.push('/notificacoes' as any)}>
            <Ionicons name="notifications-outline" size={20} color="white" />
            {state.unreadCount > 0 ? (
              <View style={styles.topActionBadge}>
                <Text style={styles.topActionBadgeText}>{Math.min(state.unreadCount, 9)}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity style={styles.topAction} onPress={() => router.push('/xp' as any)}>
            <Ionicons name="stats-chart-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.avatarWrapper}>
          <Image source={avatarSource} style={styles.profileImage} />
          <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.levelBadge}>
            <Text style={styles.levelText}>LVL {level}</Text>
          </LinearGradient>
        </View>

        <Text style={styles.userName}>{fullName}</Text>
        <Text style={styles.userRole}>{profile?.role || 'DESBRAVADOR'} • {bundle?.groupDetails?.group?.name || profile?.group?.name || 'Sem unidade'}</Text>

        <View style={styles.xpContainer}>
          <View style={styles.xpBarBackground}>
            <View style={[styles.xpBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <View style={styles.xpInfo}>
            <Text style={styles.xpText}>{currentXp} / {xpForNextLevel} XP</Text>
            <Text style={styles.xpText}>{xpSummary?.xpToNextLevel || 0} XP para subir</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={[styles.statsRow, { backgroundColor: theme.card }]}>
          <StatBox value={String(xpSummary?.totalXp || profile?.totalXp || 0)} label="XP Total" theme={theme} />
          <View style={styles.divider} />
          <StatBox value={String(requirements?.completedRequirements || 0)} label="Req. Feitos" theme={theme} />
          <View style={styles.divider} />
          <StatBox value={String(achievements.length)} label="Conquistas" theme={theme} />
        </View>

        <View style={[styles.summaryBar, { backgroundColor: theme.card }]}>
          <View>
            <Text style={[styles.summaryTitle, { color: theme.text }]}>Jornada sincronizada</Text>
            <Text style={[styles.summaryCopy, { color: theme.subText }]}>Ultima atualizacao: {describeBundleTimestamp(bundle || null)}</Text>
          </View>
          <TouchableOpacity style={[styles.summaryLink, { backgroundColor: `${theme.accent}18` }]} onPress={() => router.push('/xp' as any)}>
            <Text style={[styles.summaryLinkText, { color: theme.accent }]}>Extrato</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.xpInsightGrid}>
          <InsightCard title="Conquistas" value={`${xpSummary?.achievementXp || 0} XP`} detail="Liberadas automaticamente" theme={theme} />
          <InsightCard title="Ajustes" value={`${xpSummary?.manualXp || 0} XP`} detail="Correcao e moderacao" theme={theme} />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Conquistas desbloqueadas</Text>
        {achievements.length === 0 ? (
          <View style={[styles.emptyBadgeState, { backgroundColor: theme.card }]}>
            <Text style={{ color: theme.subText }}>Nenhuma conquista liberada ainda.</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScroll}>
            {achievements.map((achievement, index) => (
              <AchievementBadge
                key={achievement.id || index}
                achievement={achievement}
                iconUrl={achievement.id ? state.achievementIcons[achievement.id] : undefined}
                theme={theme}
              />
            ))}
          </ScrollView>
        )}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>Historico recente</Text>
          <TouchableOpacity onPress={() => router.push('/xp' as any)}>
            <Text style={{ color: theme.accent, fontWeight: '800' }}>Ver tudo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.historyList}>
          {(xpSummary?.history || []).length > 0 ? (
            xpSummary?.history.slice(0, 6).map((item) => (
              <View key={item.id} style={[styles.historyCard, { backgroundColor: theme.card }]}>
                <View style={styles.historyValueBox}>
                  <Text style={[styles.historyValue, { color: item.amount >= 0 ? theme.accent : theme.danger }]}>
                    {formatXpAmount(item.amount)}
                  </Text>
                </View>
                <View style={styles.historyCopy}>
                  <Text style={[styles.historyTitle, { color: theme.text }]}>{item.reason}</Text>
                  <Text style={[styles.historyDesc, { color: theme.subText }]}>
                    {translateXpSource(item.sourceType)}
                    {item.referenceLabel ? ` • ${item.referenceLabel}` : ''}
                  </Text>
                  <Text style={[styles.historyMeta, { color: theme.subText }]}>
                    Saldo {item.balanceAfter} XP • {formatDateTime(item.createdAt)}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={[styles.emptyBadgeState, { backgroundColor: theme.card }]}>
              <Text style={{ color: theme.subText }}>Ainda nao existe historico de XP para mostrar.</Text>
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>Resumo da jornada</Text>
          <Text style={{ color: theme.accent, fontWeight: 'bold' }}>{xpSummary?.totalXp || 0} XP</Text>
        </View>

        <MissionItem
          title="Especialidades concluidas"
          desc={`${specialties?.completedSpecialties || 0} especialidade(s) ja foram fechadas.`}
          progress={Math.min(1, (specialties?.completedSpecialties || 0) / 10 || 0)}
          icon="book"
          theme={theme}
          completed={(specialties?.completedSpecialties || 0) > 0}
        />
        <MissionItem
          title="Requisitos concluidos"
          desc={`${requirements?.completedRequirements || 0} requisito(s) confirmados pelo sistema.`}
          progress={Math.min(1, (requirements?.completedRequirements || 0) / 10 || 0)}
          icon="list"
          theme={theme}
          completed={(requirements?.completedRequirements || 0) > 0}
        />
        <MissionItem
          title="Conquistas liberadas"
          desc={`${achievements.length} conquista(s) registradas no perfil.`}
          progress={achievements.length > 0 ? 1 : 0.1}
          icon="ribbon"
          theme={theme}
          completed={achievements.length > 0}
        />
        <MissionItem
          title="Cargo na unidade"
          desc={profile?.unitRole || 'Sem cargo definido no momento.'}
          progress={profile?.unitRole ? 1 : 0.1}
          icon="shield"
          theme={theme}
          completed={Boolean(profile?.unitRole)}
        />

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={theme.danger} />
          <Text style={styles.logoutText}>Encerrar sessao</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function StatBox({ value, label, theme }: any) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.subText }]}>{label}</Text>
    </View>
  );
}

function InsightCard({ title, value, detail, theme }: any) {
  return (
    <View style={[styles.insightCard, { backgroundColor: theme.card }]}>
      <Text style={[styles.insightTitle, { color: theme.subText }]}>{title}</Text>
      <Text style={[styles.insightValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.insightDetail, { color: theme.subText }]}>{detail}</Text>
    </View>
  );
}

function AchievementBadge({ achievement, iconUrl, theme }: { achievement: AchievementItem; iconUrl?: string; theme: any }) {
  return (
    <View style={styles.badgeWrapper}>
      <LinearGradient colors={studentGradients.achievement} style={styles.badgeCircle}>
        <View style={styles.badgeInnerCircle}>
          {iconUrl ? (
            <Image source={{ uri: iconUrl }} style={styles.badgeImage} />
          ) : (
            <Ionicons name="ribbon" size={28} color="white" />
          )}
        </View>
      </LinearGradient>
      <Text style={[styles.badgeLabel, { color: theme.subText }]} numberOfLines={1}>{achievement.name}</Text>
      <Text style={styles.badgeXp}>{achievement.xpReward || 0} XP</Text>
    </View>
  );
}

function MissionItem({ title, desc, progress, icon, theme, completed }: any) {
  return (
    <TouchableOpacity style={[styles.missionCard, { backgroundColor: theme.card }]}>
      <View style={[styles.missionIconBox, { backgroundColor: completed ? theme.accent : 'rgba(107, 142, 35, 0.1)' }]}>
        <Ionicons name={icon} size={22} color={completed ? 'white' : theme.accent} />
      </View>
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={[styles.missionTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.missionDesc, { color: theme.subText }]}>{desc}</Text>
        <View style={styles.miniBarBG}>
          <View style={[styles.miniBarFill, { width: `${progress * 100}%`, backgroundColor: completed ? theme.accent : '#FFD700' }]} />
        </View>
      </View>
      {completed && <Ionicons name="checkmark-circle" size={24} color={theme.accent} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: { height: 340, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 50, borderBottomRightRadius: 50 },
  topActions: { position: 'absolute', top: 52, right: 20, flexDirection: 'row' },
  topAction: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.16)', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  topActionBadge: { position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  topActionBadgeText: { color: 'white', fontSize: 10, fontWeight: '900' },
  avatarWrapper: { position: 'relative', elevation: 20 },
  profileImage: { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: 'white' },
  levelBadge: { position: 'absolute', bottom: -5, right: -5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 3, borderColor: '#0F172A' },
  levelText: { fontSize: 12, fontWeight: '900', color: '#000' },
  userName: { color: 'white', fontSize: 28, fontWeight: 'bold', marginTop: 15 },
  userRole: { color: 'rgba(255,255,255,0.74)', fontSize: 13, fontWeight: '700', marginTop: 6 },
  xpContainer: { width: '75%', marginTop: 20 },
  xpBarBackground: { width: '100%', height: 12, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 6, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  xpBarFill: { height: '100%', backgroundColor: '#FFD700' },
  xpInfo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  xpText: { color: 'rgba(255,255,255,0.72)', fontSize: 11, fontWeight: 'bold' },
  content: { padding: 20, marginTop: -40 },
  statsRow: { flexDirection: 'row', borderRadius: 25, padding: 20, elevation: 15, shadowColor: '#000', shadowOpacity: 0.2, marginBottom: 16 },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 11, marginTop: 4, fontWeight: '600' },
  divider: { width: 1, height: '70%', backgroundColor: 'rgba(0,0,0,0.05)', alignSelf: 'center' },
  summaryBar: { borderRadius: 22, padding: 16, marginBottom: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryTitle: { fontSize: 16, fontWeight: '800' },
  summaryCopy: { marginTop: 4, fontSize: 12, fontWeight: '600' },
  summaryLink: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
  summaryLinkText: { fontSize: 12, fontWeight: '900' },
  sectionTitle: { fontSize: 20, fontWeight: '900', marginBottom: 15, marginLeft: 5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 15 },
  xpInsightGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  insightCard: { flex: 1, borderRadius: 20, padding: 16, elevation: 3 },
  insightTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  insightValue: { fontSize: 20, fontWeight: '900', marginTop: 8 },
  insightDetail: { fontSize: 12, lineHeight: 18, marginTop: 6 },
  badgeScroll: { paddingBottom: 10 },
  emptyBadgeState: { padding: 18, borderRadius: 20, marginBottom: 10 },
  badgeWrapper: { alignItems: 'center', marginRight: 18, width: 92 },
  badgeCircle: { width: 72, height: 72, borderRadius: 36, padding: 3, elevation: 8 },
  badgeInnerCircle: { flex: 1, borderRadius: 33, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' },
  badgeImage: { width: '100%', height: '100%' },
  badgeLabel: { fontSize: 10, fontWeight: 'bold', marginTop: 8, textAlign: 'center' },
  badgeXp: { marginTop: 4, fontSize: 10, fontWeight: '800', color: '#FF7A18' },
  historyList: { marginBottom: 14 },
  historyCard: { flexDirection: 'row', borderRadius: 20, padding: 14, marginBottom: 10, elevation: 3 },
  historyValueBox: { marginRight: 12, justifyContent: 'center' },
  historyValue: { fontWeight: '900', fontSize: 13, minWidth: 72 },
  historyCopy: { flex: 1 },
  historyTitle: { fontSize: 14, fontWeight: '800' },
  historyDesc: { fontSize: 12, marginTop: 4 },
  historyMeta: { fontSize: 11, marginTop: 6 },
  missionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 22, marginBottom: 12, elevation: 4 },
  missionIconBox: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  missionTitle: { fontSize: 16, fontWeight: 'bold' },
  missionDesc: { fontSize: 12, marginBottom: 8 },
  miniBarBG: { width: '100%', height: 6, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 3, overflow: 'hidden' },
  miniBarFill: { height: '100%', borderRadius: 3 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 35, paddingBottom: 30 },
  logoutText: { color: '#EF4444', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
  loaderArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
