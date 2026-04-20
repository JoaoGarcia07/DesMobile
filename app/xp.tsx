import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { clearSession, isUnauthorizedError } from '../api';
import { createStudentTheme } from '../constants/tokens';
import { formatDateTime, formatXpAmount, normalizeXpSource, translateXpSource, type XpHistoryItem, type XpSummary } from '../lib/desbravadores';
import { dispatchStudentNotifications } from '../lib/notifications';
import { readCachedOrFetchStudentBundle, syncStudentBundle } from '../lib/student-cache';
import { calculateLevelProgress } from '../lib/student-events';
import { useAppSync, useTheme } from './_layout';

type XpFilter = 'ALL' | 'ACHIEVEMENT_GRANTED' | 'ACHIEVEMENT_REVOKED' | 'ADMIN_ADJUSTMENT';

const FILTERS: { id: XpFilter; label: string }[] = [
  { id: 'ALL', label: 'Tudo' },
  { id: 'ACHIEVEMENT_GRANTED', label: 'Conquistas' },
  { id: 'ACHIEVEMENT_REVOKED', label: 'Revogadas' },
  { id: 'ADMIN_ADJUSTMENT', label: 'Ajustes' },
];

export default function XpScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { refreshVersion, triggerRefresh, isRefreshing } = useAppSync();
  const [loading, setLoading] = useState(true);
  const [xpSummary, setXpSummary] = useState<XpSummary | null>(null);
  const [filter, setFilter] = useState<XpFilter>('ALL');

  const theme = createStudentTheme(isDarkMode);

  useEffect(() => {
    let active = true;

    const loadXp = async () => {
      try {
        const cachedBundle = await readCachedOrFetchStudentBundle({ notify: dispatchStudentNotifications });
        if (active) {
          setXpSummary(cachedBundle?.xpSummary || null);
          setLoading(false);
        }

        const freshBundle = await syncStudentBundle({ notify: dispatchStudentNotifications });
        if (active) {
          setXpSummary(freshBundle?.xpSummary || null);
        }
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

    loadXp();

    return () => {
      active = false;
    };
  }, [refreshVersion, router]);

  const filteredHistory = useMemo(() => {
    const history = xpSummary?.history || [];
    if (filter === 'ALL') {
      return history;
    }
    return history.filter((item) => normalizeXpSource(item.sourceType) === filter);
  }, [filter, xpSummary?.history]);

  const levelProgress = calculateLevelProgress(xpSummary?.currentXp, xpSummary?.xpForNextLevel);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <LinearGradient colors={[theme.accent, '#0F172A']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EXTRATO DE XP</Text>
      </LinearGradient>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={triggerRefresh} tintColor={theme.accent} />}
          ListHeaderComponent={
            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
              <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
                <View style={styles.summaryTop}>
                  <View>
                    <Text style={[styles.summaryKicker, { color: theme.subText }]}>TOTAL ACUMULADO</Text>
                    <Text style={[styles.summaryValue, { color: theme.text }]}>{xpSummary?.totalXp || 0} XP</Text>
                  </View>
                  <TouchableOpacity style={[styles.summaryBadge, { backgroundColor: `${theme.accent}18` }]}>
                    <Text style={[styles.summaryBadgeText, { color: theme.accent }]}>Nivel {xpSummary?.level || 1}</Text>
                  </TouchableOpacity>
                </View>
                <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
                  <View style={[styles.progressFill, { width: `${Math.max(levelProgress, 4)}%`, backgroundColor: theme.accent }]} />
                </View>
                <View style={styles.progressMeta}>
                  <Text style={[styles.progressMetaText, { color: theme.subText }]}>
                    {xpSummary?.currentXp || 0} / {xpSummary?.xpForNextLevel || 100} XP no nivel
                  </Text>
                  <Text style={[styles.progressMetaText, { color: theme.subText }]}>
                    {xpSummary?.xpToNextLevel || 0} restantes
                  </Text>
                </View>
              </View>

              <View style={styles.cardsRow}>
                <View style={[styles.metricCard, { backgroundColor: theme.card }]}>
                  <Text style={[styles.metricLabel, { color: theme.subText }]}>Conquistas</Text>
                  <Text style={[styles.metricValue, { color: theme.text }]}>{xpSummary?.achievementXp || 0} XP</Text>
                </View>
                <View style={[styles.metricCard, { backgroundColor: theme.card }]}>
                  <Text style={[styles.metricLabel, { color: theme.subText }]}>Ajustes</Text>
                  <Text style={[styles.metricValue, { color: theme.text }]}>{xpSummary?.manualXp || 0} XP</Text>
                </View>
              </View>

              <View style={styles.filterRow}>
                {FILTERS.map((item) => {
                  const active = item.id === filter;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.filterChip, { backgroundColor: active ? theme.accent : theme.card }]}
                      onPress={() => setFilter(item.id)}
                    >
                      <Text style={[styles.filterChipText, { color: active ? 'white' : theme.text }]}>{item.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          }
          renderItem={({ item }) => <HistoryCard item={item} theme={theme} />}
          contentContainerStyle={styles.historyList}
          ListEmptyComponent={
            <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>Nenhum evento para este filtro</Text>
              <Text style={[styles.emptyText, { color: theme.subText }]}>Quando o sistema liberar conquistas ou ajustar XP, o extrato completo aparece aqui.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

function HistoryCard({ item, theme }: { item: XpHistoryItem; theme: ReturnType<typeof createStudentTheme> }) {
  return (
    <View style={[styles.historyCard, { backgroundColor: theme.card }]}>
      <View style={[styles.historyAmountPill, { backgroundColor: item.amount >= 0 ? `${theme.accent}18` : '#FEE2E2' }]}>
        <Text style={[styles.historyAmount, { color: item.amount >= 0 ? theme.accent : theme.danger }]}>{formatXpAmount(item.amount)}</Text>
      </View>
      <View style={styles.historyCopy}>
        <Text style={[styles.historyReason, { color: theme.text }]}>{item.reason}</Text>
        <Text style={[styles.historySource, { color: theme.subText }]}>
          {translateXpSource(item.sourceType)}
          {item.referenceLabel ? ` • ${item.referenceLabel}` : ''}
        </Text>
        <Text style={[styles.historyMeta, { color: theme.subText }]}>
          Saldo {item.balanceAfter} XP • {formatDateTime(item.createdAt)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { height: 120, paddingTop: 45, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12, marginRight: 15 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  contentContainer: { paddingBottom: 8 },
  summaryCard: { borderRadius: 24, padding: 18, elevation: 3 },
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  summaryKicker: { fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  summaryValue: { fontSize: 28, fontWeight: '900', marginTop: 6 },
  summaryBadge: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
  summaryBadgeText: { fontSize: 12, fontWeight: '900' },
  progressTrack: { height: 12, borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  progressMeta: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  progressMetaText: { fontSize: 11, fontWeight: '700' },
  cardsRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  metricCard: { flex: 1, borderRadius: 20, padding: 16 },
  metricLabel: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  metricValue: { marginTop: 8, fontSize: 22, fontWeight: '900' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 18 },
  filterChip: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
  filterChipText: { fontSize: 12, fontWeight: '900' },
  historyList: { paddingHorizontal: 20, paddingBottom: 28 },
  historyCard: { borderRadius: 20, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  historyAmountPill: { borderRadius: 16, paddingHorizontal: 10, paddingVertical: 8, marginRight: 12 },
  historyAmount: { fontSize: 12, fontWeight: '900' },
  historyCopy: { flex: 1 },
  historyReason: { fontSize: 15, fontWeight: '800' },
  historySource: { marginTop: 4, fontSize: 12, fontWeight: '600' },
  historyMeta: { marginTop: 6, fontSize: 11, fontWeight: '600' },
  emptyState: { marginHorizontal: 20, marginTop: 12, borderRadius: 22, padding: 20, alignItems: 'center' },
  emptyTitle: { fontSize: 17, fontWeight: '800', marginBottom: 8 },
  emptyText: { textAlign: 'center', fontSize: 14, lineHeight: 20 },
});
