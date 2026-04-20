import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppSync, useTheme } from '../_layout';
import api, { clearSession, isUnauthorizedError } from '../../api';
import {
  type AttendanceStats,
  type BasicUser,
  formatAttendanceDate,
  getFullName,
  getInitials,
  roleLabel,
  toLocalIsoDate,
  toAttendancePercentage,
} from '../../lib/desbravadores';

type AttendanceMember = BasicUser & {
  present: boolean;
  statusLabel: string;
  justification?: string;
};

type AttendanceReportItem = {
  id: number;
  name: string;
  status: string;
  avatar?: string | null;
};

type AttendanceExistence = {
  exists: boolean;
  pending: boolean;
};

export default function ChamadaScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { refreshVersion, isRefreshing, triggerRefresh } = useAppSync();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [role, setRole] = useState<string>('DESBRAVADOR');
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [members, setMembers] = useState<AttendanceMember[]>([]);
  const [attendanceExists, setAttendanceExists] = useState(false);
  const [attendancePending, setAttendancePending] = useState(false);

  const attendanceDate = useMemo(() => toLocalIsoDate(new Date()), []);

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    accent: '#6b8e23',
    border: isDarkMode ? '#334155' : '#E2E8F0',
  };

  const isScout = role === 'DESBRAVADOR';
  const isMonitor = role === 'MONITOR';
  const isDirector = role === 'DIRETOR';

  const mergeReportIntoMembers = (rawMembers: BasicUser[], reportItems: AttendanceReportItem[] = []) => {
    const reportById = new Map(reportItems.map((item) => [item.id, item]));

    return rawMembers.map((member) => {
      const report = reportById.get(member.id);
      const status = report?.status || 'AUSENTE';
      const justification = status.startsWith('JUSTIFICADO:') ? status.replace('JUSTIFICADO:', '').trim() : undefined;

      return {
        ...member,
        present: status === 'PRESENTE',
        statusLabel: status,
        justification,
      };
    });
  };

  const loadAttendance = async () => {
    try {
      setLoading(true);

      const profileResponse = await api.get<BasicUser>('/api/profile/me');
      const currentRole = profileResponse.data?.role || 'DESBRAVADOR';

      setRole(currentRole);

      if (currentRole === 'DESBRAVADOR') {
        const statsResponse = await api.get<AttendanceStats>('/api/chamada/my-stats');
        setStats(statsResponse.data);
        setMembers([]);
        setAttendanceExists(false);
        setAttendancePending(false);
        return;
      }

      const [membersResponse, existenceResponse] = await Promise.all([
        api.get<BasicUser[]>('/api/chamada/my-group-members'),
        api.get<AttendanceExistence>('/api/chamada/check-existence', {
          params: { date: attendanceDate },
        }),
      ]);

      const exists = Boolean(existenceResponse.data?.exists);
      const pending = Boolean(existenceResponse.data?.pending);
      let mappedMembers = mergeReportIntoMembers(membersResponse.data || []);

      if (exists) {
        const reportResponse = await api.get<AttendanceReportItem[]>('/api/chamada/report', {
          params: { date: attendanceDate },
        });
        mappedMembers = mergeReportIntoMembers(membersResponse.data || [], reportResponse.data || []);
      }

      setStats(null);
      setMembers(mappedMembers);
      setAttendanceExists(exists);
      setAttendancePending(pending);
    } catch (error) {
      if (isUnauthorizedError(error)) {
        await clearSession();
        router.replace('/');
        return;
      }

      console.log('Erro ao carregar chamada:', error);
      Alert.alert('Erro', 'Nao foi possivel carregar os dados de chamada.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAttendance();
  }, [router, attendanceDate, refreshVersion]);

  const togglePresenca = (id: number) => {
    if (!isMonitor || attendancePending) {
      return;
    }

    setMembers((prev) =>
      prev.map((member) =>
        member.id === id
          ? {
              ...member,
              present: !member.present,
              statusLabel: !member.present ? 'PRESENTE' : 'AUSENTE',
              justification: undefined,
            }
          : member
      )
    );
  };

  const handleSubmit = async () => {
    if (!isMonitor) {
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post(
        attendanceExists ? '/api/chamada/request-correction' : '/api/chamada/submit',
        {
          date: attendanceDate,
          presentUserIds: members.filter((member) => member.present).map((member) => member.id),
          justifications: members.reduce<Record<number, string>>((acc, member) => {
            if (!member.present && member.justification) {
              acc[member.id] = member.justification;
            }
            return acc;
          }, {}),
        }
      );

      Alert.alert(
        attendanceExists ? 'Correcao enviada' : 'Chamada registrada',
        response.data?.message || 'Operacao concluida com sucesso.'
      );

      await loadAttendance();
    } catch (error: any) {
      if (isUnauthorizedError(error)) {
        await clearSession();
        router.replace('/');
        return;
      }

      const message = error?.response?.data?.message || 'Nao foi possivel salvar a chamada.';
      Alert.alert('Erro', message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderMember = ({ item }: { item: AttendanceMember }) => {
    const indicatorColor = item.present ? theme.accent : theme.subText;

    return (
      <TouchableOpacity
        style={[styles.memberCard, { backgroundColor: theme.card }]}
        onPress={() => togglePresenca(item.id)}
        activeOpacity={isMonitor && !attendancePending ? 0.7 : 1}
      >
        <View style={styles.memberInfo}>
          <View style={[styles.avatarCircle, { backgroundColor: `${theme.accent}20` }]}>
            <Text style={{ color: theme.accent, fontWeight: 'bold' }}>{getInitials(item)}</Text>
          </View>
          <View style={styles.memberTexts}>
            <Text style={[styles.memberName, { color: theme.text }]}>{getFullName(item)}</Text>
            <Text style={[styles.memberSub, { color: theme.subText }]}>
              {item.justification ? `Justificado: ${item.justification}` : roleLabel(item.role)}
            </Text>
          </View>
        </View>

        {isMonitor ? (
          <Ionicons
            name={item.present ? 'checkbox' : 'square-outline'}
            size={28}
            color={item.present ? theme.accent : theme.subText}
          />
        ) : (
          <View style={[styles.statusPill, { backgroundColor: `${indicatorColor}20` }]}>
            <Text style={[styles.statusPillText, { color: indicatorColor }]}>{item.statusLabel}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const helperText = isScout
    ? 'Seus registros de presenca estao sincronizados com o DesbravadoresTeste.'
    : isMonitor
      ? attendancePending
        ? 'Ja existe uma solicitacao de correcao em analise para hoje.'
        : attendanceExists
          ? 'A chamada de hoje ja foi registrada. Novo envio abrira uma correcao.'
          : 'Marque quem compareceu a reuniao de hoje.'
      : 'Consulta somente leitura. O monitor registra ou corrige a chamada.';

  const buttonLabel = attendancePending
    ? 'CORRECAO EM ANALISE'
    : attendanceExists
      ? 'SOLICITAR CORRECAO'
      : 'SALVAR PRESENCAS';

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <LinearGradient colors={[theme.accent, '#0F172A']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CHAMADA DA UNIDADE</Text>
      </LinearGradient>

      <View style={styles.infoSection}>
        <Text style={[styles.dateText, { color: theme.text }]}>{formatAttendanceDate(attendanceDate)}</Text>
        <Text style={[styles.subText, { color: theme.subText }]}>{helperText}</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : isScout ? (
        <ScrollView
          style={styles.statsWrapper}
          contentContainerStyle={styles.statsScrollContent}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={triggerRefresh} tintColor={theme.accent} />}
        >
          <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.statsLabel, { color: theme.subText }]}>PRESENCA GERAL</Text>
            <Text style={[styles.statsValue, { color: theme.accent }]}>{toAttendancePercentage(stats?.percentage)}%</Text>
            <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.max(8, Math.min(100, Number(toAttendancePercentage(stats?.percentage))))}%` },
                ]}
              />
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={[styles.smallStatCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.smallStatValue, { color: theme.text }]}>{stats?.myPresence || 0}</Text>
              <Text style={[styles.smallStatLabel, { color: theme.subText }]}>Presencas</Text>
            </View>
            <View style={[styles.smallStatCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.smallStatValue, { color: theme.text }]}>{stats?.totalClasses || 0}</Text>
              <Text style={[styles.smallStatLabel, { color: theme.subText }]}>Reunioes</Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        <>
          <FlatList
            data={members}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={triggerRefresh} tintColor={theme.accent} />}
            renderItem={renderMember}
            ListEmptyComponent={
              <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>Nenhum membro para esta chamada</Text>
                <Text style={[styles.emptyText, { color: theme.subText }]}>
                  O grupo ainda nao possui desbravadores vinculados para registrar presenca.
                </Text>
              </View>
            }
          />

          <TouchableOpacity
            style={[
              styles.footerBtn,
              (!isMonitor || attendancePending || members.length === 0 || submitting) && styles.footerBtnDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!isMonitor || attendancePending || members.length === 0 || submitting}
          >
            <LinearGradient colors={['#6b8e23', '#4a6318']} style={styles.gradientBtn}>
              {submitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Text style={styles.btnText}>{isDirector ? 'CONSULTA DO DIRETOR' : buttonLabel}</Text>
                  {!isDirector && (
                    <Ionicons name="cloud-upload-outline" size={20} color="white" style={{ marginLeft: 10 }} />
                  )}
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    height: 120,
    paddingTop: 45,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12, marginRight: 15 },
  headerTitle: { color: 'white', fontSize: 16, fontWeight: '900', letterSpacing: 1.5 },
  infoSection: { padding: 25 },
  dateText: { fontSize: 22, fontWeight: 'bold' },
  subText: { fontSize: 14, marginTop: 5 },
  statsWrapper: { flex: 1, paddingHorizontal: 20 },
  statsScrollContent: { paddingBottom: 40 },
  statsCard: { borderRadius: 24, padding: 22, elevation: 4, marginBottom: 16 },
  statsLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  statsValue: { fontSize: 36, fontWeight: '900', marginTop: 8, marginBottom: 14 },
  progressTrack: { height: 12, borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#6b8e23' },
  statsGrid: { flexDirection: 'row', gap: 14 },
  smallStatCard: { flex: 1, borderRadius: 20, padding: 20, elevation: 3 },
  smallStatValue: { fontSize: 24, fontWeight: '900' },
  smallStatLabel: { marginTop: 8, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  list: { paddingHorizontal: 20, paddingBottom: 100, flexGrow: 1 },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    elevation: 3,
  },
  memberInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  memberTexts: { flex: 1 },
  avatarCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  memberName: { fontSize: 16, fontWeight: '600' },
  memberSub: { fontSize: 12, marginTop: 4 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, maxWidth: 120 },
  statusPillText: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  footerBtn: { position: 'absolute', bottom: 30, left: 20, right: 20, borderRadius: 20, overflow: 'hidden', elevation: 8 },
  footerBtnDisabled: { opacity: 0.7 },
  gradientBtn: { padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  emptyState: { padding: 22, borderRadius: 22, alignItems: 'center', marginTop: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginBottom: 8 },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
