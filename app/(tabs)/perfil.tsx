import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useAppSync, useTheme } from '../_layout'; 
import api, { clearSession, isUnauthorizedError, resolveAssetUrl } from '../../api';

export default function PerfilScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { refreshVersion, isRefreshing, triggerRefresh } = useAppSync();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [stats, setStats] = useState({
    specialties: 0,
    requirements: 0,
    groupName: 'Sem unidade',
  });

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    accent: '#6b8e23'
  };

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const [profileResponse, requirementResponse, specialtyResponse, groupResponse] = await Promise.all([
          api.get('/api/profile/me'),
          api.get('/api/profile/me/requirements-progress'),
          api.get('/api/profile/me/specialties-progress'),
          api.get('/api/groups/me').catch((error) => {
            if (error?.response?.status === 404) {
              return { data: null };
            }

            throw error;
          }),
        ]);

        if (!active) {
          return;
        }

        const payload = profileResponse.data;
        setProfile(payload);
        setAvatarUrl(await resolveAssetUrl(payload?.avatar));
        setStats({
          specialties: specialtyResponse.data?.completedSpecialties || 0,
          requirements: requirementResponse.data?.completedRequirements || 0,
          groupName: groupResponse.data?.group?.name || payload?.group?.name || 'Sem unidade',
        });
      } catch (error) {
        if (isUnauthorizedError(error)) {
          await clearSession();
          router.replace('/');
          return;
        }

        console.log('Erro ao carregar perfil:', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [router, refreshVersion]);

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

  const fullName = [profile?.name, profile?.surname].filter(Boolean).join(' ') || profile?.username || 'Desbravador';
  const achievements = profile?.achievements?.length || 0;
  const xp = profile?.xp || 0;
  const level = profile?.level || 1;
  const progressPercent = Math.min(100, Math.max(12, ((xp % 1000) / 1000) * 100 || 12));
  const avatarSource = avatarUrl
    ? { uri: avatarUrl }
    : { uri: `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(profile?.username || 'desbravador')}` };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={triggerRefresh} tintColor={theme.accent} />}
    >
      <LinearGradient colors={['#6b8e23', '#0F172A']} style={styles.headerGradient}>
        <View style={styles.avatarWrapper}>
          <Image 
            source={avatarSource} 
            style={styles.profileImage} 
          />
          <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.levelBadge}>
            <Text style={styles.levelText}>LVL {level}</Text>
          </LinearGradient>
        </View>
        
        <Text style={styles.userName}>{fullName}</Text>
        <Text style={styles.userRole}>{profile?.role || 'DESBRAVADOR'} • {stats.groupName}</Text>
        
        <View style={styles.xpContainer}>
          <View style={styles.xpBarBackground}>
            <View style={[styles.xpBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <View style={styles.xpInfo}>
            <Text style={styles.xpText}>{xp} XP</Text>
            <Text style={styles.xpText}>Próximo nível</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={[styles.statsRow, { backgroundColor: theme.card }]}>
          <StatBox value={String(stats.specialties)} label="Especialid." theme={theme} />
          <View style={styles.divider} />
          <StatBox value={String(stats.requirements)} label="Req. Feitos" theme={theme} />
          <View style={styles.divider} />
          <StatBox value={String(achievements)} label="Medalhas" theme={theme} />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Medalhas de Conquista</Text>
        {achievements === 0 ? (
          <View style={[styles.emptyBadgeState, { backgroundColor: theme.card }]}>
            <Text style={{ color: theme.subText }}>Nenhuma medalha liberada ainda.</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScroll}>
            {profile?.achievements?.map((achievement: any, index: number) => (
              <ProfessionalBadge
                key={achievement.id || index}
                icon="ribbon"
                colors={badgeColors[index % badgeColors.length]}
                label={achievement.name || `Medalha ${index + 1}`}
              />
            ))}
          </ScrollView>
        )}

        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>Resumo da Jornada</Text>
            <Text style={{ color: theme.accent, fontWeight: 'bold' }}>{xp} XP</Text>
        </View>
        
        <MissionItem 
            title="Especialidades concluídas" 
            desc={`${stats.specialties} especialidade(s) já foram fechadas.`} 
            progress={Math.min(1, stats.specialties / 10 || 0)} 
            icon="book" 
            theme={theme} 
            completed={stats.specialties > 0}
        />
        <MissionItem 
            title="Requisitos concluídos" 
            desc={`${stats.requirements} requisito(s) confirmados pelo sistema.`} 
            progress={Math.min(1, stats.requirements / 10 || 0)} 
            icon="infinite" 
            theme={theme} 
            completed={stats.requirements > 0}
        />
        <MissionItem 
            title="Medalhas desbloqueadas" 
            desc={`${achievements} conquista(s) registradas no perfil.`} 
            progress={achievements > 0 ? 1 : 0.1} 
            icon="walk" 
            theme={theme} 
            completed={achievements > 0}
        />
        <MissionItem 
            title="Cargo na unidade" 
            desc={profile?.unitRole || 'Sem cargo definido no momento.'} 
            progress={profile?.unitRole ? 1 : 0.1} 
            icon="shirt" 
            theme={theme}
            completed={Boolean(profile?.unitRole)}
        />

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Encerrar Sessão</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const badgeColors = [
  ['#FF416C', '#FF4B2B'],
  ['#00b09b', '#96c93d'],
  ['#f8ad42', '#d47e00'],
  ['#4facfe', '#00f2fe'],
  ['#667eea', '#764ba2'],
];

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
  userRole: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '700', marginTop: 6 },
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
  emptyBadgeState: { padding: 18, borderRadius: 20, marginBottom: 10 },
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
  logoutText: { color: '#EF4444', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
  loaderArea: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
