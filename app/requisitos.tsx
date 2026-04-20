import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { clearSession, isUnauthorizedError } from '../api';
import { createStudentTheme } from '../constants/tokens';
import { resolveBackendIconName, type RequirementProgressItem } from '../lib/desbravadores';
import { dispatchStudentNotifications } from '../lib/notifications';
import { readCachedOrFetchStudentBundle, syncStudentBundle, type StudentBundle } from '../lib/student-cache';
import { useAppSync, useTheme } from './_layout';

function resolveIconSize(size?: number | null, fallback = 18) {
  const parsed = Number(size);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.max(16, Math.min(parsed, 48));
}

export default function RequisitosScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { refreshVersion, isRefreshing, triggerRefresh } = useAppSync();
  const [loading, setLoading] = useState(true);
  const [bundle, setBundle] = useState<StudentBundle | null>(null);

  const theme = createStudentTheme(isDarkMode);

  useEffect(() => {
    let active = true;

    const loadRequirements = async () => {
      try {
        const cachedBundle = await readCachedOrFetchStudentBundle({ notify: dispatchStudentNotifications });

        if (active) {
          setBundle(cachedBundle);
          setLoading(false);
        }

        const freshBundle = await syncStudentBundle({ notify: dispatchStudentNotifications });
        if (active) {
          setBundle(freshBundle);
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

    loadRequirements();

    return () => {
      active = false;
    };
  }, [refreshVersion, router]);

  const progress = bundle?.requirementsProgress || null;
  const progressValue = Math.max(0, Math.min(100, progress?.completionPercentage || 0));

  const renderRequirement = ({ item }: { item: RequirementProgressItem }) => {
    const iconName = resolveBackendIconName(item.iconName, 'list');
    const iconSize = resolveIconSize(item.iconSize);

    return (
      <TouchableOpacity style={[styles.itemCard, { backgroundColor: theme.card }]} activeOpacity={0.85}>
        <View style={styles.itemContent}>
          <View style={[styles.checkCircle, { backgroundColor: item.completed ? theme.accent : 'transparent', borderColor: theme.accent }]}>
            {item.completed && <Ionicons name="checkmark-sharp" size={16} color="white" />}
          </View>

          <View style={[styles.iconBox, { backgroundColor: `${theme.accent}12` }]}>
            {item.iconImageUrlResolved ? (
              <Image source={{ uri: item.iconImageUrlResolved }} style={{ width: iconSize, height: iconSize, borderRadius: 8 }} resizeMode="contain" />
            ) : (
              <Ionicons name={iconName} size={iconSize} color={theme.accent} />
            )}
          </View>

          <View style={styles.itemTexts}>
            <Text
              style={[
                styles.itemTitle,
                {
                  color: theme.text,
                  textDecorationLine: item.completed ? 'line-through' : 'none',
                  opacity: item.completed ? 0.65 : 1,
                },
              ]}
            >
              {item.title}
            </Text>
            <Text style={[styles.itemCategory, { color: theme.subText }]}>
              {item.category} • {item.classLevel}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={theme.subText} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <LinearGradient colors={[theme.accent, '#0F172A']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>REQUISITOS</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={[styles.progressCard, { backgroundColor: theme.card }]}>
          <View style={styles.progressInfo}>
            <View>
              <Text style={[styles.progressLabel, { color: theme.text }]}>{progress?.classLevel || 'Sem classe definida'}</Text>
              <Text style={[styles.progressSub, { color: theme.subText }]}>Faltam {progress?.remainingRequirements || 0} item(ns)</Text>
            </View>
            <Text style={[styles.progressValue, { color: theme.accent }]}>{progressValue}%</Text>
          </View>
          <View style={[styles.progressBarBase, { backgroundColor: theme.border }]}>
            <View style={[styles.progressBarFill, { width: `${progressValue}%`, backgroundColor: theme.accent }]} />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Lista de atividades</Text>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.accent} />
          </View>
        ) : (
          <FlatList
            data={progress?.items || []}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={triggerRefresh} tintColor={theme.accent} />}
            renderItem={renderRequirement}
            ListEmptyComponent={
              <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>Nenhum requisito encontrado</Text>
                <Text style={[styles.emptyText, { color: theme.subText }]}>
                  Os requisitos cadastrados e validados no DesbravadoresTeste aparecerao aqui.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { height: 120, paddingTop: 15, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12, marginRight: 15 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  content: { flex: 1, padding: 20 },
  progressCard: { padding: 22, borderRadius: 25, marginBottom: 30, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, marginTop: -40 },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  progressLabel: { fontSize: 18, fontWeight: 'bold' },
  progressSub: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  progressValue: { fontSize: 22, fontWeight: '900' },
  progressBarBase: { height: 10, borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 5 },
  sectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 15, marginLeft: 5, textTransform: 'uppercase', letterSpacing: 1 },
  list: { paddingBottom: 20, flexGrow: 1 },
  itemCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, borderRadius: 22, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  itemContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  checkCircle: { width: 28, height: 28, borderRadius: 10, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  iconBox: { width: 42, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12, overflow: 'hidden' },
  itemTexts: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: 'bold', lineHeight: 20 },
  itemCategory: { fontSize: 12, fontWeight: '700', marginTop: 4 },
  emptyState: { padding: 22, borderRadius: 22, alignItems: 'center', marginTop: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginBottom: 8 },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
